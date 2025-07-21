import React, { useState } from 'react';
import { X, ArrowRight, Volume2, Star } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "¡Hola pequeño músico! 🎵",
      content: "Soy Hooty y te voy a enseñar a reconocer las notas musicales. ¡Será súper divertido!",
      image: "",
      action: "¡Empecemos!"
    },
    {
      title: "¿Qué son las notas musicales? 🎼",
      content: "Las notas son como los colores de la música. Cada una tiene un sonido diferente: Do, Re, Mi, Fa, Sol, La, Si",
      image: "🌈",
      action: "¡Genial!"
    },
    {
      title: "Escucha con atención 👂",
      content: "Primero voy a tocar una escala completa para que conozcas todos los sonidos. ¡Pon mucha atención!",
      image: "🎹",
      action: "¡Estoy listo!"
    },
    {
      title: "Ahora tú juegas 🎮",
      content: "Te voy a tocar UNA nota y tú tienes que adivinar cuál es haciendo clic en el piano. ¡No te preocupes si te equivocas!",
      image: "🎯",
      action: "¡A jugar!"
    },
    {
      title: "Consejos de Hooty 💡",
      content: "• Escucha bien antes de elegir\n• Si no estás seguro, puedes repetir la nota\n• ¡Cada error te ayuda a aprender!",
      image: "🏆",
      action: "¡Entendido!"
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 rounded-3xl shadow-2xl max-w-md w-full border-4 border-rainbow">
        <style jsx>{`
          .border-rainbow {
            border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd) 1;
          }
        `}</style>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-purple-200">
          <div className="flex items-center space-x-2">
            <div className="text-3xl animate-bounce">{step.image}</div>
            <h2 className="text-xl font-bold text-purple-800">Tutorial Musical</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-pulse">{step.image}</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">{step.title}</h3>
            <p className="text-purple-700 text-lg leading-relaxed whitespace-pre-line">
              {step.content}
            </p>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-purple-500 scale-125'
                    : index < currentStep
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300 hover:scale-105'
              }`}
            >
              ← Anterior
            </button>

            <div className="flex items-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="text-yellow-400 animate-pulse" size={16} />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>{step.action}</span>
              {currentStep < tutorialSteps.length - 1 ? (
                <ArrowRight size={18} />
              ) : (
                <Star size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Fun decorations */}
        <div className="absolute -top-2 -left-2 text-2xl animate-spin-slow">🎵</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎶</div>
        <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">⭐</div>
        <div className="absolute -bottom-2 -right-2 text-2xl animate-wiggle">🌟</div>
      </div>
    </div>
  );
};

export default TutorialModal;