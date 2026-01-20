import { useEffect, useState } from 'react';
import imgLightning from "figma:asset/5555c2b30f1483d03dcc626d83175209bc7b27f4.png";

interface LoginSwooshProps {
  onComplete: () => void;
}

export function LoginSwoosh({ onComplete }: LoginSwooshProps) {
  const [phase, setPhase] = useState<'entering' | 'exiting'>('entering');

  useEffect(() => {
    // Quick swoosh in and out
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-[#1a1d23] z-50 flex items-center justify-center transition-all duration-300 ${
        phase === 'entering' 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-110'
      }`}
    >
      {/* Fast swoosh effect */}
      <div className="relative">
        {/* Lightning Icon with swoosh animation */}
        <div
          className={`relative w-24 h-24 flex items-center justify-center transition-all duration-500 ${
            phase === 'entering'
              ? 'animate-in zoom-in-50 slide-in-from-left-10 duration-300'
              : 'animate-out zoom-out-110 slide-out-to-right-10 duration-300'
          }`}
        >
          {/* Glow trail effect */}
          <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-full" />
          
          {/* Icon */}
          <img
            src={imgLightning}
            alt="Forcheck"
            className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"
            style={{
              filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(200deg) brightness(101%) contrast(97%)',
              imageRendering: 'crisp-edges',
            }}
          />
        </div>

        {/* Motion trail lines */}
        <div className={`absolute top-1/2 -left-20 w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-300 ${
          phase === 'entering' ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
}
