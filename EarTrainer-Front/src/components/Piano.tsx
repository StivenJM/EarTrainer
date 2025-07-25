import React, { useState, useEffect, useRef } from 'react';
import { Note, AudioContextRef } from '../types';
import { playNote, ensureAudioContext } from '../utils/audio';

interface PianoProps {
  availableNotes: Note[];
  onNoteClick: (note: Note) => void;
  audioContextRef: React.MutableRefObject<AudioContextRef>;
  disabled?: boolean;
  showLabels?: boolean; // New prop to control label visibility
}

const Piano: React.FC<PianoProps> = ({ 
  availableNotes, 
  onNoteClick, 
  audioContextRef,
  disabled = false,
  showLabels = true // Default to showing labels
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<Note>>(new Set());
  const pressTimeoutRef = useRef<{ [key in Note]?: NodeJS.Timeout }>({});

  const noteNames: { [key in Note]: string } = {
    'C': 'Do',
    'D': 'Re',
    'E': 'Mi',
    'F': 'Fa',
    'G': 'Sol',
    'A': 'La',
    'B': 'Si'
  };

  const allNotes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // Black keys positions (sharps/flats) - these are decorative only
  const blackKeyPositions = [
    { after: 'C', name: 'C#' }, // Between C and D
    { after: 'D', name: 'D#' }, // Between D and E
    // No black key between E and F
    { after: 'F', name: 'F#' }, // Between F and G
    { after: 'G', name: 'G#' }, // Between G and A
    { after: 'A', name: 'A#' }, // Between A and B
    // No black key between B and C
  ];

  const handleKeyPress = (note: Note) => {
    if (disabled || !availableNotes.includes(note)) return;

    // Asegurarse de que el AudioContext esté inicializado antes de reproducir
    ensureAudioContext(audioContextRef.current);

    // Visual feedback
    setPressedKeys(prev => new Set(prev).add(note));
    
    // Clear any existing timeout for this key
    if (pressTimeoutRef.current[note]) {
      clearTimeout(pressTimeoutRef.current[note]);
    }
    
    // Set timeout to release key
    pressTimeoutRef.current[note] = setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 200);

    // Play sound
    playNote(audioContextRef.current, note, 0.3);
    
    // Trigger game logic
    onNoteClick(note);
  };

  // Handle Arduino input for visual feedback
  useEffect(() => {
    const handleArduinoData = (event: any) => {
      const { pin } = event.detail;
      const pinToNote: { [key: number]: Note } = {
        2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'A', 8: 'B'
      };
      
      const note = pinToNote[pin];
      if (note && availableNotes.includes(note)) {
        // Visual feedback for Arduino input
        setPressedKeys(prev => new Set(prev).add(note));
        
        if (pressTimeoutRef.current[note]) {
          clearTimeout(pressTimeoutRef.current[note]);
        }
        
        pressTimeoutRef.current[note] = setTimeout(() => {
          setPressedKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(note);
            return newSet;
          });
        }, 200);
      }
    };

    window.addEventListener('arduinoData', handleArduinoData);
    return () => {
      window.removeEventListener('arduinoData', handleArduinoData);
      // Clear all timeouts
      Object.values(pressTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [availableNotes]);

  const getWhiteKeyStyle = (note: Note) => {
    const isPressed = pressedKeys.has(note);
    const isAvailable = availableNotes.includes(note);
    const isDisabled = disabled || !isAvailable;

    let baseClasses = "relative transition-all duration-300 transform select-none ";
    
    if (isDisabled) {
      baseClasses += "opacity-30 cursor-not-allowed grayscale ";
    } else {
      baseClasses += "cursor-pointer hover:scale-105 ";
    }

    // White key styling
    baseClasses += `
      bg-gradient-to-b from-white via-yellow-50 to-pink-50 
      border-3 border-purple-300 
      rounded-b-2xl 
      shadow-xl 
      hover:shadow-2xl
      active:shadow-lg
      flex flex-col items-center justify-end
      font-bold text-purple-700
      min-h-[120px] md:min-h-[160px]
      px-2 py-3
      z-10
    `;

    if (isPressed && !isDisabled) {
      baseClasses += `


        shadow-lg
      `;
    } else if (!isDisabled) {
      baseClasses += "hover:bg-gradient-to-b hover:from-yellow-100 hover:to-pink-200 hover:border-purple-400 ";
    }

    return baseClasses;
  };

  const getBlackKeyStyle = () => {
    return `
      absolute 
      bg-gradient-to-b from-purple-800 via-purple-900 to-black
      border-2 border-purple-600
      rounded-b-xl
      shadow-2xl
      w-8 md:w-10
      h-16 md:h-20
      -translate-x-1/2
      z-20
      top-0
      cursor-default
      transition-all duration-300
    `;
  };

  const keyWidth = availableNotes.length <= 3 ? 80 : 
                  availableNotes.length <= 4 ? 70 : 60;

  return (
    <div className="flex justify-center items-end bg-gradient-to-b from-purple-800 via-indigo-800 to-purple-900 p-8 rounded-3xl shadow-2xl border-4 border-purple-600 relative overflow-hidden">
      {/* Efectos de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-pulse"></div>
      
      <div className="flex gap-1 relative">
        {allNotes.map((note, index) => {
          const isAvailable = availableNotes.includes(note);
          const isPressed = pressedKeys.has(note);
          const blackKeyAfter = blackKeyPositions.find(bk => bk.after === note);
          
          return (
            <div key={note} className="relative">
              {/* White Key */}
              <div
                className={getWhiteKeyStyle(note)}
                onClick={() => handleKeyPress(note)}
                style={{ width: `${keyWidth}px` }}
              >
                {/* Key highlight when pressed */}
                {isPressed && isAvailable && (

                    <div className="absolute inset-0 bg-white opacity-30 rounded-b-2xl"></div>

                )}
                
                {/* Note name - only show if showLabels is true */}
                {showLabels && (
                  <div className="relative z-10 text-center">
                    <div className={`text-xl md:text-2xl font-black ${
                      isAvailable ? 'text-purple-800' : 'text-gray-400'
                    }`}>
                      {noteNames[note]}
                    </div>
                    <div className={`text-sm md:text-base font-bold ${
                      isAvailable ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {note}
                    </div>
                  </div>
                )}

                {/* Availability indicator */}
                {isAvailable && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg">
                      <div className="absolute inset-0 bg-green-300 rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Black Key (decorative only) */}
              {blackKeyAfter && (
                <div
                  className={getBlackKeyStyle()}
                  style={{ 
                    right: `-${keyWidth/2 + 2}px`,
                  }}
                  title={`${blackKeyAfter.name} (decorativa)`}
                >
                  {/* Subtle highlight on black key */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-purple-400 rounded-lg opacity-40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Piano brand/label */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">

      </div>

      {/* Piano reflection effect */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-purple-900 to-transparent opacity-50 rounded-b-3xl" />
      
      {/* Sparkle effects */}
      <div className="absolute top-4 left-4 text-yellow-300 text-lg animate-pulse">✨</div>
      <div className="absolute top-6 right-6 text-pink-300 text-sm animate-bounce">⭐</div>
      <div className="absolute bottom-8 left-8 text-blue-300 text-base animate-wiggle">🌟</div>
      <div className="absolute bottom-6 right-4 text-green-300 text-lg animate-pulse delay-100">💫</div>
    </div>
  );
};

export default Piano;