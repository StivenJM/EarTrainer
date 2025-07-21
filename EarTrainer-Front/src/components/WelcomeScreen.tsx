import React, { useState } from 'react';
import { Music, Trophy, Play, BookOpen } from 'lucide-react';
import ArduinoConnect from './ArduinoConnect';
import TutorialModal from './TutorialModal';
import OwlCharacter from './OwlCharacter';

interface WelcomeScreenProps {
  onStartGame: (name: string, difficulty: string, arduinoPort: any | null) => void;
  onShowHighScores: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame, onShowHighScores }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [error, setError] = useState('');
  const [arduinoPort, setArduinoPort] = useState<any | null>(null);
  const [isArduinoConnected, setIsArduinoConnected] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOwl, setShowOwl] = useState(true);

  const handleArduinoConnection = (isConnected: boolean, port: any | null) => {
    setIsArduinoConnected(isConnected);
    setArduinoPort(port);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, introduce tu nombre');
      return;
    }
    onStartGame(name, difficulty, arduinoPort);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setShowOwl(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fadeIn bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

      </div>

      {/* Búho de bienvenida */}
      <OwlCharacter
        mood="happy"
        message="¡Hola pequeño músico! Soy Hooty y te voy a ayudar a aprender música. ¿Estás listo para la aventura?"
        isVisible={showOwl}
      />

      <div className="w-full max-w-md bg-gradient-to-br from-white via-yellow-50 to-pink-50 rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 hover:shadow-3xl border-4 border-rainbow relative">
        <style jsx>{`
          .border-rainbow {
            border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd) 1;
          }
          .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="text-8xl animate-bounce">🎵</div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Music size={16} className="text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          EarTrainer
        </h1>
        <p className="text-center text-purple-700 mb-8 text-xl font-semibold">
          ¡Aprende las notas musicales jugando!
        </p>
        
        <ArduinoConnect onConnectionChange={handleArduinoConnection} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-bold text-purple-700 mb-2">
              ¿Cómo te llamas?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Escribe tu nombre aquí"
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 text-lg font-semibold bg-white"
            />
            {error && <p className="mt-2 text-sm text-red-600 font-semibold">⚠️ {error}</p>}
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-lg font-bold text-purple-700 mb-2">
              Elige tu nivel
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 text-lg font-semibold bg-white"
            >
              <option value="easy">Fácil (3 notas)</option>
              <option value="medium">Medio (4 notas)</option>
              <option value="hard">Difícil (7 notas)</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowTutorial(true)}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
            >
              <BookOpen size={24} />
              <span>¡Enséñame a jugar!</span>
            </button>
            
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
            >
              <Play size={24} />
              <span>¡Empezar a jugar!</span>
            </button>
            
            <button
              type="button"
              onClick={onShowHighScores}
              className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
            >
              <Trophy size={24} />
              <span>Mejores jugadores</span>
            </button>
          </div>
        </form>
        
        {isArduinoConnected && (
          <div className="mt-6 text-center text-lg text-green-600 font-bold bg-green-100 p-3 rounded-xl border-2 border-green-300">
            ¡Arduino conectado! Puedes usar los botones físicos
          </div>
        )}

      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
};

export default WelcomeScreen;