import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

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
        {/* Lightning Icon with swoosh animation - Forcheck Logo */}
        <div
          className={`relative w-24 h-24 flex items-center justify-center transition-all duration-500 ${
            phase === 'entering'
              ? 'animate-in zoom-in-50 slide-in-from-left-10 duration-300'
              : 'animate-out zoom-out-110 slide-out-to-right-10 duration-300'
          }`}
        >
          {/* Glow trail effect */}
          <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-full" />
          
          {/* Lightning bolt icon */}
          <Zap 
            className="w-16 h-16 text-blue-500 fill-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]" 
            strokeWidth={2}
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