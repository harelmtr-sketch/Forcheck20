import { useEffect, useState } from 'react';
import imgLightning from "figma:asset/5555c2b30f1483d03dcc626d83175209bc7b27f4.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash for 2.5 seconds then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Complete transition after fade out
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-[#1a1d23] z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse" />
      </div>

      {/* Logo content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Lightning Icon */}
        <div className="relative w-40 h-40 flex items-center justify-center animate-in zoom-in-90 duration-1000">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-3xl opacity-60 animate-pulse" />
          
          {/* Icon container with blue filter */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imgLightning}
              alt="Forcheck"
              className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse"
              style={{
                filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(200deg) brightness(101%) contrast(97%)',
                imageRendering: 'crisp-edges',
                transform: 'scale(1.2)',
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Forcheck</h1>
          <p className="text-gray-400 text-sm tracking-wider uppercase font-medium">Fitness Tracking</p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 animate-in fade-in duration-1000 delay-500">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}