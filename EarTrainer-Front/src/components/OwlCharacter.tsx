import React, { useState, useEffect } from 'react';

interface OwlCharacterProps {
  mood: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging';
  message: string;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const OwlCharacter: React.FC<OwlCharacterProps> = ({ 
  mood, 
  message, 
  isVisible, 
  onAnimationComplete 
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFlapping, setIsFlapping] = useState(false);

  useEffect(() => {
    // Parpadeo aleatorio
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 2000);

    // Aleteo ocasional
    const flapInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsFlapping(true);
        setTimeout(() => setIsFlapping(false), 600);
      }
    }, 3000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(flapInterval);
    };
  }, []);

  const getOwlColor = () => {
    switch (mood) {
      case 'happy': return 'from-orange-300 to-orange-500';
      case 'excited': return 'from-yellow-300 to-orange-400';
      case 'thinking': return 'from-purple-300 to-purple-500';
      case 'celebrating': return 'from-green-300 to-green-500';
      case 'encouraging': return 'from-blue-300 to-blue-500';
      default: return 'from-orange-300 to-orange-500';
    }
  };

  const getEyeExpression = () => {
    if (isBlinking) return 'h-1';
    switch (mood) {
      case 'excited': return 'h-4 animate-pulse';
      case 'thinking': return 'h-3';
      case 'celebrating': return 'h-5';
      default: return 'h-4';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      {/* Globo de diálogo */}
      <div className="relative mb-4 mr-8">
        <div className="bg-white rounded-2xl p-4 shadow-lg border-4 border-yellow-300 max-w-xs">
          <p className="text-purple-800 font-bold text-sm leading-relaxed">
            {message}
          </p>
          {/* Flecha del globo */}
          <div className="absolute bottom-0 right-8 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-300"></div>
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white absolute -top-1 left-1"></div>
          </div>
        </div>
      </div>

      {/* Búho animado */}
      <div className={`relative transition-transform duration-300 ${
        mood === 'celebrating' ? 'animate-bounce' : ''
      } ${isFlapping ? 'animate-pulse' : ''}`}>
        {/* Cuerpo del búho */}
        <div className={`w-24 h-32 bg-gradient-to-b ${getOwlColor()} rounded-full relative shadow-lg`}>
          
          {/* Alas */}
          <div className={`absolute -left-2 top-8 w-8 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full transform -rotate-12 transition-transform duration-300 ${
            isFlapping ? 'rotate-45' : ''
          }`}></div>
          <div className={`absolute -right-2 top-8 w-8 h-12 bg-gradient-to-bl from-orange-400 to-orange-600 rounded-full transform rotate-12 transition-transform duration-300 ${
            isFlapping ? '-rotate-45' : ''
          }`}></div>

          {/* Cara */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full">
            
            {/* Ojos */}
            <div className="absolute top-3 left-2 w-5 h-5 bg-white rounded-full shadow-inner">
              <div className={`w-3 ${getEyeExpression()} bg-black rounded-full mx-auto mt-1 transition-all duration-200`}></div>
            </div>
            <div className="absolute top-3 right-2 w-5 h-5 bg-white rounded-full shadow-inner">
              <div className={`w-3 ${getEyeExpression()} bg-black rounded-full mx-auto mt-1 transition-all duration-200`}></div>
            </div>

            {/* Pico */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-4 border-l-transparent border-r-transparent border-t-yellow-500"></div>
          </div>

          {/* Plumas en la cabeza */}
          <div className="absolute -top-2 left-4 w-3 h-6 bg-gradient-to-t from-orange-500 to-orange-300 rounded-full transform -rotate-12"></div>
          <div className="absolute -top-2 right-4 w-3 h-6 bg-gradient-to-t from-orange-500 to-orange-300 rounded-full transform rotate-12"></div>

          {/* Patas */}
          <div className="absolute -bottom-2 left-6 w-2 h-4 bg-yellow-600 rounded-full"></div>
          <div className="absolute -bottom-2 right-6 w-2 h-4 bg-yellow-600 rounded-full"></div>

          {/* Efectos especiales según el mood */}
          {mood === 'celebrating' && (
            <>
              <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl animate-bounce">⭐</div>
              <div className="absolute -top-2 -right-4 text-pink-400 text-xl animate-bounce delay-100">✨</div>
              <div className="absolute -bottom-2 -left-2 text-green-400 text-lg animate-bounce delay-200">🎵</div>
            </>
          )}

          {mood === 'thinking' && (
            <div className="absolute -top-6 right-2 text-purple-500 text-xl animate-pulse">💭</div>
          )}
        </div>

        {/* Sombra */}
        
      </div>
    </div>
  );
};

export default OwlCharacter;