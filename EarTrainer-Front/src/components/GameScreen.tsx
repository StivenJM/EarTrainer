import React, { useState, useEffect, useRef } from 'react';
import { Music, Check, X, LogOut, RotateCcw, Volume2 } from 'lucide-react';
import Piano from './Piano';
import OwlCharacter from './OwlCharacter';
import { Note, AudioContextRef } from '../types';
import { playScale, playNote, playTriad, stopAllAudio } from '../utils/audio';

interface GameScreenProps {
  playerName: string;
  difficulty: string;
  arduinoPort: any | null;
  onEndGame: (score: number, totalQuestions: number) => void;
  onExitGame: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ 
  playerName, 
  difficulty, 
  arduinoPort, 
  onEndGame, 
  onExitGame 
}) => {
  const [score, setScore] = useState(0);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [status, setStatus] = useState<'initial' | 'playing' | 'guessing' | 'feedback'>('initial');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [round, setRound] = useState(1);
  const totalRounds = difficulty === 'easy' ? 5 : 10;
  const [message, setMessage] = useState('');
  const [availableNotes, setAvailableNotes] = useState<Note[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [usedNotes, setUsedNotes] = useState<Note[]>([]); // Track used notes to avoid repetition
  const [owlMood, setOwlMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging'>('happy');
  const [owlMessage, setOwlMessage] = useState('');
  const audioContextRef = useRef<AudioContextRef>({ 
    audioContext: null, 
    oscillator: null,
    gainNode: null 
  });
  
  // Store cleanup functions for audio sequences
  const audioCleanupRef = useRef<(() => void) | null>(null);

  const allNotes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const noteNames: { [key in Note]: string } = {
    'C': 'Do',
    'D': 'Re',
    'E': 'Mi',
    'F': 'Fa',
    'G': 'Sol',
    'A': 'La',
    'B': 'Si'
  };

  // Arduino pin to note mapping
  const pinToNote: { [key: number]: Note } = {
    2: 'C',  // Do
    3: 'D',  // Re
    4: 'E',  // Mi
    5: 'F',  // Fa
    6: 'G',  // Sol
    7: 'A',  // La
    8: 'B'   // Si
  };

  // Get available notes based on difficulty
  const getAvailableNotes = (difficulty: string): Note[] => {
    switch (difficulty) {
      case 'easy':
        return ['C', 'E', 'G']; // Do, Mi, Sol (triada)
      case 'medium':
        return ['C', 'E', 'F', 'G']; // Do, Mi, Fa, Sol
      case 'hard':
        return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Todas las notas
      default:
        return ['C', 'E', 'G'];
    }
  };

  const initializeAudioContext = () => {
    if (!audioContextRef.current.audioContext) {
      audioContextRef.current.audioContext = new AudioContext();
      audioContextRef.current.gainNode = audioContextRef.current.audioContext.createGain();
      audioContextRef.current.gainNode.gain.value = 0.5;
      audioContextRef.current.gainNode.connect(audioContextRef.current.audioContext.destination);
    }
  };

  const initializeGame = () => {
    // Initialize Audio Context
    initializeAudioContext();
    
    // Set available notes based on difficulty
    const notes = getAvailableNotes(difficulty);
    setAvailableNotes(notes);
    
    setStatus('playing');
    
    if (difficulty === 'easy') {
      setMessage('Escuchando la tríada de Do Mayor (Do-Mi-Sol)...');
      setOwlMessage(`¡Empezamos el juego! Nivel: ${getDifficultyDescription()}. ¡Tú puedes hacerlo!`);
      audioCleanupRef.current = playTriad(audioContextRef.current, () => {
        selectRandomNote(notes);
      });
    } else {
      setMessage('Escuchando la escala de Do Mayor...');
      // Play full scale
      audioCleanupRef.current = playScale(audioContextRef.current, () => {
        selectRandomNote(notes);
      });
    }
  };

  const selectRandomNote = (notes: Note[]) => {
    let availableForSelection = [...notes];
    
    setOwlMood('thinking');
    setOwlMessage('Mmm... ¿qué nota será esta vez? ¡Escucha con atención!');
    
    // If we've used all notes, reset the used notes array
    if (usedNotes.length >= notes.length) {
      setUsedNotes([]);
    } else {
      // Remove already used notes from selection
      availableForSelection = notes.filter(note => !usedNotes.includes(note));
    }
    
    // If no notes available (shouldn't happen), use all notes
    if (availableForSelection.length === 0) {
      availableForSelection = [...notes];
      setUsedNotes([]);
    }
    
    const randomIndex = Math.floor(Math.random() * availableForSelection.length);
    const note = availableForSelection[randomIndex];
    
    // Add this note to used notes
    setUsedNotes(prev => [...prev, note]);
    
    setCurrentNote(note);
    setStatus('guessing');
    setMessage(`¿Qué nota acabo de tocar? ¡Tú puedes!`);
    
    setOwlMood('encouraging');
    setOwlMessage('¡Escucha bien! Ahora haz clic en la tecla que crees que es la correcta.');

    // Play the random note
    playNote(audioContextRef.current, note, 1);
  };

  const handleNoteGuess = (guessedNote: Note) => {
    if (status !== 'guessing') return;
    
    if (guessedNote === currentNote) {
      setFeedback('correct');
      setOwlMood('celebrating');
      setScore(prevScore => prevScore + 1);
      setMessage(`¡Excelente! Era ${noteNames[currentNote!]}`);
      setOwlMessage(`¡Fantástico! Reconociste la nota ${noteNames[currentNote!]}. ¡Sigue así, pequeño músico!`);
    } else {
      setFeedback('incorrect');
      setOwlMood('encouraging');
      setMessage(`¡Casi! Era ${noteNames[currentNote!]}, tú elegiste ${noteNames[guessedNote]}`);
      setOwlMessage(`No te preocupes, los errores nos ayudan a aprender. ¡La próxima vez lo harás mejor!`);
    }

    setStatus('feedback');
    
    // After feedback, go to next round or end game
    setTimeout(() => {
      if (round >= totalRounds) {
      } else {
        setRound(round + 1);
        setFeedback(null);
        setOwlMood('excited');
        setStatus('initial');
        setMessage('¡Prepárate para la siguiente nota!');
        setOwlMessage('¡Vamos por la siguiente! Cada vez lo haces mejor.');
        setTimeout(() => initializeGame(), 1500);
      }
    }, 2500);
  };

  const replayCurrentNote = () => {
    if (currentNote && status === 'guessing') {
      setOwlMood('happy');
      setOwlMessage('¡Buena idea! Escucha otra vez la nota.');
      playNote(audioContextRef.current, currentNote, 1);
    }
  };

  const replayScale = () => {
    if (status === 'guessing') {
      setOwlMood('thinking');
      setMessage('Reproduciendo de nuevo...');
      setOwlMessage('Te voy a tocar la escala otra vez para que recuerdes los sonidos.');
      if (difficulty === 'easy') {
        audioCleanupRef.current = playTriad(audioContextRef.current, () => {
          setMessage('¿Qué nota acabo de tocar?');
        });
      } else {
        audioCleanupRef.current = playScale(audioContextRef.current, () => {
          setMessage('¿Qué nota acabo de tocar?');
          setOwlMood('encouraging');
          setOwlMessage('¡Ahora escucha bien la nota que voy a tocar!');
        });
      }
    }
  };

  const endGame = () => {
    // Stop any playing audio when game ends
    stopAllAudio();
    if (audioCleanupRef.current) {
      audioCleanupRef.current();
    }
    onEndGame(score, totalRounds);
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    // Stop all audio immediately when confirming exit
    stopAllAudio();
    if (audioCleanupRef.current) {
      audioCleanupRef.current();
    }
    onExitGame();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  // Handle Arduino input with audio feedback
  useEffect(() => {
    const handleArduinoData = (event: any) => {
      const { pin } = event.detail;
      const note = pinToNote[pin];
      
      if (note) {
        // Always play the note sound when Arduino button is pressed
        playNote(audioContextRef.current, note, 0.3);
        
        // Only process as guess if we're in guessing state and note is available
        if (status === 'guessing' && availableNotes.includes(note)) {
          handleNoteGuess(note);
        }
      }
    };

    if (arduinoPort) {
      window.addEventListener('arduinoData', handleArduinoData);
    }

    return () => {
      window.removeEventListener('arduinoData', handleArduinoData);
    };
  }, [status, currentNote, score, round, arduinoPort, availableNotes]);

  useEffect(() => {
    // Start the first round after a delay
    setOwlMood('excited');
    setOwlMessage(`🎮 ¡Empezamos el juego! Nivel: ${getDifficultyDescription()}. ¡Tú puedes hacerlo!`);
    const timer = setTimeout(() => {
      initializeGame();
    }, 2000);
    return () => {
      clearTimeout(timer);
      // Clean up audio when component unmounts
      stopAllAudio();
      if (audioCleanupRef.current) {
        audioCleanupRef.current();
      }
    };
  }, []);

  useEffect(() => {
    if (status === 'feedback' && round >= totalRounds) {
      endGame();
    }
  }, [score, round, status]);

  const getDifficultyDescription = () => {
    switch (difficulty) {
      case 'easy':
        return 'Tríada (Do-Mi-Sol)';
      case 'medium':
        return 'Escala parcial (Do-Mi-Fa-Sol)';
      case 'hard':
        return 'Escala completa (Do-Re-Mi-Fa-Sol-La-Si)';
      default:
        return 'Fácil';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 animate-fadeIn bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 relative overflow-hidden">
      {/* Decoraciones de fondo animadas */}


      {/* Búho guía */}
      <OwlCharacter
        mood={owlMood}
        message={owlMessage}
        isVisible={true}
      />

      <div className="w-full max-w-5xl bg-gradient-to-br from-white via-yellow-50 to-pink-50 rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-rainbow relative">
        <style jsx>{`
          .border-rainbow {
            border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd) 1;
          }
        `}</style>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {playerName}
            </h2>
            <p className="text-purple-700 font-semibold text-lg">{getDifficultyDescription()}</p>
            {arduinoPort && (
              <p className="text-sm text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full mt-2">
                Arduino conectado
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl border-2 border-purple-300">
              <p className="text-xl font-bold text-purple-700">Ronda: {round}/{totalRounds}</p>
              <p className="text-xl font-bold text-green-600">Puntos: {score}</p>
            </div>
            <button
              onClick={handleExitClick}
              className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center mb-8 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-3xl border-2 border-blue-200">
          <div className="mt-4 text-center">
            <div className="text-6xl mb-4">
              {status === 'playing' && '🎼'}
              {status === 'guessing' && '🤔'}
              {status === 'feedback' && feedback === 'correct' && '🎉'}
              {status === 'feedback' && feedback === 'incorrect' && '💪'}
              {status === 'initial' && '🎵'}
            </div>
            <p className="text-2xl font-bold text-purple-800 mb-6">{message}</p>
            
            {status === 'guessing' && (
              <div className="space-y-4">
                <div className="flex gap-4 justify-center flex-wrap">
                  <button 
                    onClick={replayCurrentNote}
                    className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <Volume2 size={20} />
                    Repetir nota
                  </button>
                  <button 
                    onClick={replayScale}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    {difficulty === 'easy' ? 'Repetir tríada' : 'Repetir escala'}
                  </button>
                </div>
                {arduinoPort && (
                  <div className="text-lg text-green-700 space-y-2 bg-green-100 p-4 rounded-2xl border-2 border-green-300">
                    <p className="font-bold text-green-800">¡Arduino activado!</p>
                    <p className="font-semibold">Usa los botones físicos o haz clic en el piano</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Piano Interface */}
        <div className="mb-6">
          <Piano
            availableNotes={availableNotes}
            onNoteClick={handleNoteGuess}
            audioContextRef={audioContextRef}
            disabled={status !== 'guessing'}
            showLabels={difficulty !== 'hard'} // Hide labels in hard difficulty
          />
        </div>
        
        {/* Instructions */}
        {status === 'guessing' && (
          <div className="text-center text-lg text-purple-700 bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-yellow-300">
            <p className="font-bold mb-3 text-xl">¿Cómo jugar?</p>
            <p className="font-semibold">Haz clic en las teclas del piano para elegir la nota que escuchaste</p>
            {availableNotes.length < 7 && (
              <p className="text-green-600 mt-3 font-bold">
                Solo las teclas con punto verde están disponibles
              </p>
            )}
            {difficulty === 'hard' && (
              <p className="text-red-600 mt-3 font-bold text-lg">
                ¡Modo experto! Las etiquetas están ocultas
              </p>
            )}
          </div>
        )}
        
        {feedback && (
          <div className={`mt-6 p-6 rounded-2xl flex items-center justify-center border-2 ${
            feedback === 'correct' 
              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300' 
              : 'bg-gradient-to-r from-orange-100 to-yellow-200 text-orange-800 border-orange-300'
          }`}>
            {feedback === 'correct' ? (
              <>
                <div className="text-4xl mr-4">🎉</div>
                <Check className="mr-2" size={24} />
              </>
            ) : (
              <>
                <div className="text-4xl mr-4">💪</div>
                <X className="mr-2" size={24} />
              </>
            )}
            <span className="font-bold text-xl">
              {feedback === 'correct' ? '¡Fantástico! ¡Lo lograste!' : '¡Sigue intentando! ¡Tú puedes!'}
            </span>
          </div>
        )}


      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-yellow-50 to-pink-50 rounded-3xl p-8 max-w-sm mx-4 border-4 border-rainbow">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">¿Salir del juego?</h3>
              <p className="text-purple-600 text-lg font-semibold">Se perderá el progreso actual del juego.</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={confirmExit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Sí, salir
              </button>
              <button
                onClick={cancelExit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Seguir jugando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;