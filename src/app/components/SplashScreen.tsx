import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2; // Increment by 2% every 50ms = 2.5 seconds total
      });
    }, 50);

    // Start fade out at 2.2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    // Complete transition after fade out
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2700);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Mobile container with max-width */}
      <div className={`w-full max-w-md h-screen bg-gradient-to-br from-[#1a1d23] via-[#1d2128] to-[#1a1d23] flex items-center justify-center relative transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Animated background grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Background glow that pulses */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse" />
        </div>

        {/* Logo content */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Lightning Icon with electric effect */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer glow rings */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '150ms' }} />
            
            {/* Lightning bolt with gradient and glow */}
            <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-90 duration-700">
              {/* Background lightning (blur effect) */}
              <Zap 
                className="absolute w-32 h-32 text-blue-400 fill-blue-400 blur-sm opacity-70" 
                strokeWidth={2.5}
              />
              {/* Main lightning bolt with gradient */}
              <Zap 
                className="relative w-32 h-32 drop-shadow-[0_0_30px_rgba(59,130,246,0.9)]" 
                strokeWidth={2.5}
                style={{
                  fill: 'url(#lightning-gradient)',
                  stroke: 'url(#lightning-gradient)',
                }}
              />
              
              {/* SVG gradient definition */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Electric sparks effect */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
              <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '300ms' }} />
              <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '600ms' }} />
            </div>
          </div>

          {/* Text */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Kinetic</h1>
            <p className="text-gray-400 text-sm tracking-wider uppercase font-medium">Power Your Performance</p>
          </div>

          {/* Progress bar - filling up animation */}
          <div className="w-64 mt-4 animate-in fade-in duration-700 delay-300">
            <div className="relative h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
              
              {/* Progress fill with gradient */}
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full transition-all duration-100 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shine effect on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
            
            {/* Progress percentage */}
            <div className="text-center mt-2">
              <span className="text-blue-400 text-xs font-semibold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Add keyframes for shimmer animation */}
        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}