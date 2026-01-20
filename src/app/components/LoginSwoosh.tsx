import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface LoginSwooshProps {
  onComplete: () => void;
}

export function LoginSwoosh({ onComplete }: LoginSwooshProps) {
  const [phase, setPhase] = useState<'entering' | 'exiting'>('entering');

  useEffect(() => {
    // Faster and smoother swoosh timing
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Mobile container with max-width */}
      <div className={`w-full max-w-md h-screen bg-gradient-to-br from-[#1a1d23]/95 via-[#1d2128]/95 to-[#1a1d23]/95 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
        phase === 'entering' 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}>
        {/* Fast swoosh effect with multiple lightning trails */}
        <div className="relative">
          {/* Main Lightning Icon with swoosh animation */}
          <div
            className={`relative w-28 h-28 flex items-center justify-center transition-all ease-out ${
              phase === 'entering'
                ? 'duration-300 animate-in zoom-in-75 slide-in-from-left-20'
                : 'duration-300 animate-out zoom-out-125 slide-out-to-right-20 blur-sm'
            }`}
          >
            {/* Dynamic glow trail */}
            <div className={`absolute inset-0 bg-blue-500/50 blur-3xl rounded-full transition-all duration-300 ${
              phase === 'entering' ? 'scale-100' : 'scale-150'
            }`} />
            
            {/* Lightning bolt - main */}
            <div className="relative">
              <Zap 
                className="absolute w-20 h-20 text-blue-400 fill-blue-400 blur-md opacity-60" 
                strokeWidth={2.5}
              />
              <Zap 
                className="relative w-20 h-20 drop-shadow-[0_0_25px_rgba(59,130,246,1)]" 
                strokeWidth={2.5}
                style={{
                  fill: 'url(#swoosh-gradient)',
                  stroke: 'url(#swoosh-gradient)',
                }}
              />
            </div>

            {/* SVG gradient definition */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="swoosh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Motion trail lines - multiple for speed effect */}
          <div className={`absolute top-1/2 -translate-y-1/2 -left-32 flex flex-col gap-2 transition-all duration-300 ${
            phase === 'entering' ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
            <div className="w-44 h-0.5 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent rounded-full" />
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent rounded-full" />
          </div>

          {/* Particle effects */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            phase === 'entering' ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-1/4 -right-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute bottom-1/3 -right-12 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '100ms' }} />
            <div className="absolute top-1/2 -right-6 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}