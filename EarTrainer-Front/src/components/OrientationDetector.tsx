import React, { useEffect, useState } from 'react';

const OrientationDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <>
      {children}
      {!isLandscape && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 z-50 flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
          <div className="text-6xl mb-6 animate-bounce">📱↔️</div>
          <h2 className="text-3xl font-bold text-purple-800 mb-4">¡Gira tu dispositivo!</h2>
          <p className="text-xl text-purple-700 mb-6">
            Para una mejor experiencia, por favor gira tu dispositivo a modo horizontal.
          </p>
        </div>
      )}
    </>
  );
};

export default OrientationDetector;