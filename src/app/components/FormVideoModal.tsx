import { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle2, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormVideoModalProps {
  exerciseName: string;
  onClose: () => void;
}

export function FormVideoModal({ exerciseName, onClose }: FormVideoModalProps) {
  const [currentCue, setCurrentCue] = useState(0);

  // Key coaching cues for the exercise
  const coachingCues = [
    { icon: Target, text: 'Full range of motion from start to finish', color: 'text-blue-400' },
    { icon: Zap, text: 'Controlled eccentric, explosive concentric', color: 'text-green-400' },
    { icon: CheckCircle2, text: 'Maintain core tension throughout', color: 'text-purple-400' },
  ];

  // Cycle through cues automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCue((prev) => (prev + 1) % coachingCues.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [coachingCues.length]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-gradient-to-b from-[#252932] to-[#1a1d23] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{exerciseName}</h3>
                <p className="text-xs text-white/50">Proper form demonstration</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/70" />
            </motion.button>
          </div>

          {/* Video Placeholder with Animated Key Cues */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 overflow-hidden">
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Animated skeleton figure */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-32 h-48"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Simple stick figure representation */}
                <svg
                  viewBox="0 0 100 150"
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Head */}
                  <circle cx="50" cy="20" r="12" className="text-blue-400/40" />
                  
                  {/* Body */}
                  <motion.line
                    x1="50"
                    y1="32"
                    x2="50"
                    y2="80"
                    className="text-blue-400/60"
                    animate={{
                      y2: [80, 75, 80],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  {/* Arms */}
                  <motion.line
                    x1="50"
                    y1="45"
                    x2="25"
                    y2="65"
                    className="text-blue-400/60"
                    animate={{
                      y1: [45, 42, 45],
                      y2: [65, 60, 65],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.line
                    x1="50"
                    y1="45"
                    x2="75"
                    y2="65"
                    className="text-blue-400/60"
                    animate={{
                      y1: [45, 42, 45],
                      y2: [65, 60, 65],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  {/* Legs */}
                  <motion.line
                    x1="50"
                    y1="80"
                    x2="35"
                    y2="130"
                    className="text-blue-400/60"
                    animate={{
                      y1: [80, 75, 80],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.line
                    x1="50"
                    y1="80"
                    x2="65"
                    y2="130"
                    className="text-blue-400/60"
                    animate={{
                      y1: [80, 75, 80],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </svg>
              </motion.div>
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center cursor-not-allowed"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <PlayCircle className="w-10 h-10 text-white/60" />
              </motion.div>
            </div>

            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm"
              >
                <span className="text-xs font-bold text-blue-300">Video Coming Soon</span>
              </motion.div>
            </div>
          </div>

          {/* Key Coaching Cues */}
          <div className="px-6 py-6 space-y-4">
            <h4 className="text-sm font-bold text-white/90">Key Form Cues</h4>
            
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {coachingCues.map((cue, idx) => {
                  const Icon = cue.icon;
                  const isActive = idx === currentCue;
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0.4, x: 0 }}
                      animate={{
                        opacity: isActive ? 1 : 0.4,
                        x: isActive ? 4 : 0,
                        scale: isActive ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-white/[0.08] border-white/20'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cue.color}`} />
                      <span className="text-sm text-white/85 leading-relaxed">{cue.text}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {coachingCues.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentCue ? 'w-6 bg-blue-400' : 'w-1.5 bg-white/20'
                  }`}
                  animate={{
                    backgroundColor: idx === currentCue ? 'rgba(96, 165, 250, 1)' : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer Message */}
          <div className="px-6 pb-6">
            <div className="px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs text-white/60 text-center leading-relaxed">
                Professional form videos with step-by-step breakdowns will be available in a future update. 
                Follow along with these key cues in the meantime.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
