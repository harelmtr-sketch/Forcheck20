import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import type { FormAnalysisResult } from '../utils/aiFormScoring';

interface AnalysisResultSheetProps {
  result: FormAnalysisResult & { exerciseName: string };
  onClose: () => void;
  onRetry?: () => void;
  onSave?: (score: number) => void;
}

export function AnalysisResultSheet({
  result,
  onClose,
  onSave,
}: AnalysisResultSheetProps) {
  const { exerciseName, score: initialScore, sets: reps, strengths, improvements } = result;
  
  const [showScore, setShowScore] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Motion values for smooth animation
  const scoreMotionValue = useMotionValue(0);
  const [displayedScore, setDisplayedScore] = useState(0);

  // Transform for perfectly synced ring animation
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const ringProgress = useTransform(scoreMotionValue, [0, 100], [circumference, 0]);

  // Get score descriptor
  const getScoreLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 80) return 'Great';
    if (s >= 70) return 'Good';
    if (s >= 60) return 'Decent';
    if (s >= 50) return 'Fair';
    return 'Poor';
  };

  // Get ring gradient color based on score
  const getRingColor = (s: number) => {
    if (s >= 85) return '#22c55e'; // green
    if (s >= 75) return '#84cc16'; // lime
    if (s >= 65) return '#eab308'; // yellow
    if (s >= 50) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Get glow color with higher opacity for LED effect
  const getGlowColor = (s: number) => {
    const baseColor = getRingColor(s);
    return baseColor;
  };

  const scoreLabel = getScoreLabel(initialScore);
  const ringColor = getRingColor(initialScore);
  const glowColor = getGlowColor(initialScore);

  // Animation sequence
  useEffect(() => {
    // Reset
    scoreMotionValue.set(0);
    setDisplayedScore(0);
    setShowScore(false);
    setShowContent(false);
    setGlowIntensity(0);

    // Start after brief delay
    setTimeout(() => {
      // Animate the ring from 0 to score
      const scoreAnimation = animate(scoreMotionValue, initialScore, {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1], // Smooth ease
        onUpdate: (latest) => {
          setDisplayedScore(Math.floor(latest));
          // Increase glow as ring fills
          setGlowIntensity(latest / 100);
          
          // Show score number earlier - when ring is ~75% complete
          if (latest >= initialScore * 0.75 && !showScore) {
            setShowScore(true);
          }
        },
        onComplete: () => {
          setDisplayedScore(initialScore);
          setGlowIntensity(1);
          setShowScore(true);
          // Show rest of content
          setTimeout(() => setShowContent(true), 400);
        }
      });

      return () => {
        scoreAnimation.stop();
      };
    }, 300);
  }, [initialScore, scoreMotionValue]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-0"
        style={{ 
          background: '#000000',
        }}
      >
        {/* iPhone Screen Container */}
        <div className="w-full h-full max-w-[448px] mx-auto relative overflow-hidden" style={{ aspectRatio: '9/16' }}>
          {/* Dark gradient background */}
          <div 
            className="absolute inset-0 rounded-[32px] overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, #1a2332 0%, #0f1419 100%)',
            }}
          >
            {/* Vignette overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
              }}
            />

            {/* Radial glow behind score circle */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: glowIntensity * 0.4,
                scale: 1 + (glowIntensity * 0.15),
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '420px',
                height: '420px',
                background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
                filter: 'blur(60px)',
              }}
            />

            {/* Fine grain texture overlay */}
            <div 
              className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              }}
            />

            {/* Content within safe area */}
            <div className="absolute inset-0 pt-safe pb-safe">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative flex flex-col"
              >
                {/* Close button */}
                <div className="absolute top-6 right-6 z-20">
                  <motion.button
                    onClick={() => {
                      if (onSave) {
                        onSave(initialScore);
                      }
                      onClose();
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-xl border border-white/10 flex items-center justify-center transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </motion.button>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col px-8 py-8 overflow-y-auto">
                  {/* Exercise name - Hero Title */}
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-12"
                  >
                    <h1 
                      className="text-3xl font-bold text-white tracking-tight leading-tight"
                      style={{
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {exerciseName}
                    </h1>
                  </motion.div>

                  {/* Hero: Circular Score */}
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative">
                      {/* Outer shadow for depth */}
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          filter: 'blur(24px)',
                          opacity: glowIntensity * 0.6,
                          background: `radial-gradient(circle, ${glowColor}60 0%, transparent 70%)`,
                        }}
                      />

                      {/* SVG Ring with LED glow */}
                      <div className="relative">
                        <svg
                          className="w-64 h-64 -rotate-90"
                          viewBox="0 0 152 152"
                          style={{
                            filter: `drop-shadow(0 0 ${glowIntensity * 12}px ${glowColor}80)`,
                          }}
                        >
                          {/* Background ring */}
                          <circle
                            cx="76"
                            cy="76"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-white/[0.05]"
                          />
                          {/* Progress ring with gradient */}
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={ringColor} stopOpacity="1" />
                              <stop offset="100%" stopColor={ringColor} stopOpacity="0.7" />
                            </linearGradient>
                          </defs>
                          <motion.circle
                            cx="76"
                            cy="76"
                            r={radius}
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            style={{ strokeDashoffset: ringProgress }}
                          />
                        </svg>

                        {/* Inner glow (LED effect) */}
                        <motion.div
                          className="absolute inset-6 rounded-full pointer-events-none"
                          animate={{
                            opacity: glowIntensity * 0.25,
                          }}
                          transition={{ duration: 0.8 }}
                          style={{
                            background: `radial-gradient(circle, ${glowColor}30 0%, transparent 65%)`,
                            filter: 'blur(20px)',
                          }}
                        />

                        {/* Score content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={showScore ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col items-center"
                          >
                            {/* Large score number */}
                            <div 
                              className="text-8xl font-black text-white tracking-tighter leading-none"
                              style={{
                                fontFeatureSettings: '"tnum"',
                                textShadow: `0 2px 12px ${glowColor}40`,
                              }}
                            >
                              {displayedScore}
                            </div>
                            {/* Descriptor */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={showScore ? { opacity: 1 } : {}}
                              transition={{ delay: 0.2, duration: 0.4 }}
                              className="mt-3"
                            >
                              <span 
                                className="text-base font-medium tracking-wide"
                                style={{ color: ringColor }}
                              >
                                {scoreLabel}
                              </span>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Reps - Integrated pill badge attached to circle */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={showScore ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6"
                    >
                      <div 
                        className="px-6 py-2.5 rounded-full border backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${ringColor}15 0%, ${ringColor}08 100%)`,
                          borderColor: `${ringColor}40`,
                          boxShadow: `0 4px 16px ${ringColor}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                        }}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white tracking-tight">{reps}</span>
                          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">reps</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Feedback sections in cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={showContent ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    {/* What you did well */}
                    {strengths && strengths.length > 0 && (
                      <div 
                        className="rounded-2xl p-5 border"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%)',
                          borderColor: 'rgba(34, 197, 94, 0.2)',
                          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <h3 className="text-xs font-bold text-green-400/90 uppercase tracking-wider mb-3">
                          What you did well
                        </h3>
                        <div className="space-y-2.5">
                          {strengths.slice(0, 3).map((strength, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -8 }}
                              animate={showContent ? { opacity: 1, x: 0 } : {}}
                              transition={{
                                duration: 0.4,
                                delay: 0.2 + idx * 0.06,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              className="flex items-start gap-3"
                            >
                              {/* LED-style indicator */}
                              <div 
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{
                                  backgroundColor: '#22c55e',
                                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                                }}
                              />
                              <span className="text-[15px] text-white/80 leading-relaxed font-normal">
                                {strength}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Things to improve */}
                    {improvements && improvements.length > 0 && (
                      <div 
                        className="rounded-2xl p-5 border"
                        style={{
                          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(234, 179, 8, 0.03) 100%)',
                          borderColor: 'rgba(234, 179, 8, 0.2)',
                          boxShadow: '0 4px 16px rgba(234, 179, 8, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <h3 className="text-xs font-bold text-yellow-400/90 uppercase tracking-wider mb-3">
                          Things to improve
                        </h3>
                        <div className="space-y-2.5">
                          {improvements.slice(0, 3).map((improvement, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -8 }}
                              animate={showContent ? { opacity: 1, x: 0 } : {}}
                              transition={{
                                duration: 0.4,
                                delay: 0.35 + idx * 0.06,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              className="flex items-start gap-3"
                            >
                              {/* LED-style indicator */}
                              <div 
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{
                                  backgroundColor: '#eab308',
                                  boxShadow: '0 0 8px rgba(234, 179, 8, 0.6)',
                                }}
                              />
                              <span className="text-[15px] text-white/80 leading-relaxed font-normal">
                                {improvement}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
