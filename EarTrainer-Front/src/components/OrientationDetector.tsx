import React, { useState, useEffect } from 'react';

interface OrientationDetectorProps {
  children: React.ReactNode;
}

const OrientationDetector: React.FC<OrientationDetectorProps> = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(true);

  // Función para verificar la orientación
  const checkOrientation = () => {
    if (window.matchMedia) {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setIsLandscape(!isPortrait);
    } else {
      // Fallback para navegadores que no soportan matchMedia
      setIsLandscape(window.innerWidth > window.innerHeight);
    }
  };

  useEffect(() => {
    // Verificar orientación inicial
    checkOrientation();

    // Agregar event listener para cambios de orientación
    const handleOrientationChange = () => {
      checkOrientation();
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Limpiar event listeners
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  if (!isLandscape) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-6 animate-bounce">📱↔️</div>
        <h2 className="text-3xl font-bold text-purple-800 mb-4">¡Gira tu dispositivo!</h2>
        <p className="text-xl text-purple-700 mb-6">
          Para una mejor experiencia, por favor gira tu dispositivo a modo horizontal.
        </p>
        <div className="w-32 h-32 border-4 border-purple-600 rounded-lg p-2 animate-pulse">
          <div className="w-full h-full bg-purple-400 rounded flex items-center justify-center">
            <div className="transform rotate-90 text-white text-4xl">↻</div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OrientationDetector;