import { useState, useEffect } from 'react';
import { CheckCircle2, PlayCircle, AlertCircle, X, Activity, Check, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import type { FormAnalysisResult } from '../utils/aiFormScoring';
import { getScoreColor, getScoreGlow } from '../utils/scoreColors';
import { FormVideoModal } from './FormVideoModal';

interface AnalysisResultSheetProps {
  result: FormAnalysisResult & { exerciseName: string };
  onClose: () => void;
  onRetry?: () => void;
  onSave?: (score: number) => void;
}

export function AnalysisResultSheet({
  result,
  onClose,
  onRetry,
  onSave,
}: AnalysisResultSheetProps) {
  const { exerciseName, score: initialScore, sets: reps, feedback, strengths, improvements } = result;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedReps, setAnimatedReps] = useState(0);
  const [showRingPulse, setShowRingPulse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);
  const [currentScore, setCurrentScore] = useState(initialScore); // Active score that persists
  const [showVideoModal, setShowVideoModal] = useState(false);

  const isValidResult = reps > 0 && initialScore > 0;
  
  // currentScore is the single source of truth
  const displayScore = currentScore;

  // Get status label with clearer progression
  const getStatusLabel = (s: number) => {
    if (s >= 95) return 'Perfect';
    if (s >= 90) return 'Excellent';
    if (s >= 85) return 'Great';
    if (s >= 75) return 'Good';
    if (s >= 65) return 'Fair';
    if (s >= 50) return 'Needs Work';
    return 'Poor';
  };

  // Get ring color based on score
  const getRingColor = (s: number) => {
    if (s >= 90) return 'stroke-green-500';
    if (s >= 80) return 'stroke-green-500';
    if (s >= 70) return 'stroke-yellow-400';
    if (s >= 60) return 'stroke-orange-400';
    return 'stroke-red-500';
  };

  const getGlowColor = (s: number) => {
    if (s >= 90) return 'rgba(34, 197, 94, 0.5)';
    if (s >= 80) return 'rgba(34, 197, 94, 0.4)';
    if (s >= 70) return 'rgba(250, 204, 21, 0.4)';
    if (s >= 60) return 'rgba(251, 146, 60, 0.4)';
    return 'rgba(239, 68, 68, 0.4)';
  };

  const getBadgeBg = (s: number) => {
    if (s >= 80) return 'bg-green-500/20 border-green-500/60';
    if (s >= 70) return 'bg-yellow-500/20 border-yellow-500/60';
    if (s >= 60) return 'bg-orange-500/20 border-orange-500/60';
    return 'bg-red-500/20 border-red-500/60';
  };

  const ringColor = getRingColor(displayScore);
  const glowColor = getGlowColor(displayScore);
  const badgeBg = getBadgeBg(displayScore);
  const status = getStatusLabel(displayScore);

  // Generate dynamic feedback based on current score
  const getReactiveFeedback = (s: number): string => {
    if (s >= 90) {
      return 'Explosive power output with excellent eccentric control. Strong time under tension hitting all major muscle groups.';
    } else if (s >= 75) {
      return 'Solid mechanical advantage maintained. Good muscle activation pattern with steady tempo throughout the set.';
    } else if (s >= 60) {
      return 'Moderate intensity detected. Work on increasing range of motion and time under tension for better hypertrophy stimulus.';
    } else if (s >= 40) {
      return 'Limited depth and muscle engagement. Focus on deliberate eccentric lowering and full contraction at peak position.';
    } else {
      return 'Minimal effective range detected. Prioritize control over speed—slow down the descent and feel the muscle working.';
    }
  };

  // Use reactive feedback that updates with score changes
  const reactiveFeedback = getReactiveFeedback(displayScore);

  // Staged animation sequence
  useEffect(() => {
    if (!isValidResult) {
      setShowFeedback(true);
      setShowButton(true);
      return;
    }
    
    // Instant update when score changes (for Test Mode responsiveness)
    setAnimatedScore(displayScore);
    setShowRingPulse(true);
    setIsSettled(true);
    setShowFeedback(true);
    setShowButton(true);
  }, [displayScore, isValidResult]);

  // Reps count-up animation (synced with score)
  useEffect(() => {
    if (!isValidResult) return;
    
    const duration = 1000;
    const steps = 60;
    const increment = reps / steps;
    const interval = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= reps) {
        setAnimatedReps(reps);
        clearInterval(timer);
      } else {
        setAnimatedReps(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [reps, isValidResult]);

  // Calculate SVG circle progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  return (
    <>
      <AnimatePresence>
        {!showVideoModal && (
          <motion.div
            key="result-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md bg-gradient-to-b from-[#252932] to-[#1a1d23] rounded-3xl border border-white/10 shadow-2xl"
            >
              {/* A) HEADER ROW */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-sm font-semibold text-white truncate max-w-[200px] block">
                      {exerciseName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Test Mode Toggle */}
                  <motion.button
                    onClick={() => setShowTestMode(!showTestMode)}
                    whileTap={{ scale: 0.92, opacity: 0.7 }}
                    className={`w-9 h-9 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center ${
                      showTestMode ? 'bg-yellow-500/20 text-yellow-400' : 'text-white/40'
                    }`}
                    aria-label="Test Mode"
                    title="Test Mode (for UI/animation testing)"
                  >
                    <FlaskConical className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    whileTap={{ scale: 0.92, opacity: 0.7 }}
                    className="w-11 h-11 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center -mr-2"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </motion.button>
                </div>
              </div>

              {/* Test Mode Slider */}
              <AnimatePresence>
                {showTestMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-yellow-500/20 bg-yellow-500/5"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="w-3.5 h-3.5 text-yellow-400/70" />
                        <span className="text-xs font-bold text-yellow-400/90 uppercase tracking-wide">
                          Test Mode — Will be removed in production
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentScore}
                          onChange={(e) => setCurrentScore(Number(e.target.value))}
                          className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <span className="text-sm font-bold text-yellow-400 w-10 text-right">{currentScore}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content - scrollable with hidden scrollbar */}
              <div className="px-6 py-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {isValidResult ? (
                  <div className="space-y-8">
                    {/* B) HERO METRICS - Circular Score with Reps Badge */}
                    <div className="flex flex-col items-center justify-center">
                      {/* Circular Score Ring Container */}
                      <div className="relative flex-shrink-0">
                        {/* Circular Glow Layer */}
                        <motion.div
                          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: showRingPulse ? 1 : 0,
                          }}
                          transition={{ 
                            duration: 0.4, 
                            ease: [0.4, 0, 0.2, 1] 
                          }}
                          style={{
                            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                            filter: 'blur(16px)',
                          }}
                        />
                        
                        {/* SVG Ring */}
                        <motion.svg
                          className="w-44 h-44 -rotate-90 relative z-10"
                          viewBox="0 0 120 120"
                          animate={
                            isSettled 
                              ? { scale: 1 } 
                              : showRingPulse 
                              ? { scale: [1, 1.04, 1] } 
                              : {}
                          }
                          transition={
                            isSettled
                              ? { 
                                  type: "spring", 
                                  stiffness: 300, 
                                  damping: 20,
                                  duration: 0.6 
                                }
                              : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
                          }
                        >
                          {/* Background ring */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-white/5"
                          />
                          {/* Progress ring */}
                          <motion.circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference - progress }}
                            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                            className={ringColor}
                          />
                        </motion.svg>
                        
                        {/* Score + Status in center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                              scale: isSettled ? 1 : showRingPulse ? [1, 1.05, 1] : 1, 
                              opacity: 1 
                            }}
                            transition={
                              isSettled
                                ? { 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 20,
                                    duration: 0.6 
                                  }
                                : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                            }
                            className="text-6xl font-black text-white leading-none mb-0.5"
                          >
                            {animatedScore}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="text-xs text-white/20 font-medium mb-3"
                          >
                            /100
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                            className={`text-xs font-bold ${getScoreColor(displayScore)}`}
                          >
                            {status}
                          </motion.div>
                        </div>
                        
                        {/* Reps Badge - positioned outward from ring edge */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute bottom-0 right-0 z-20"
                          style={{ transform: 'translate(28%, 28%)' }}
                        >
                          <div 
                            className={`relative w-16 h-16 rounded-full border-2 ${badgeBg} flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300`}
                            style={{
                              background: `radial-gradient(circle, ${glowColor.replace('0.4', '0.15')} 0%, ${glowColor.replace('0.4', '0.05')} 100%)`,
                            }}
                          >
                            {/* Subtle ring glow */}
                            <div 
                              className="absolute inset-0 rounded-full transition-all duration-300"
                              style={{
                                boxShadow: `0 0 14px ${glowColor}`,
                              }}
                            />
                            <div className="relative flex flex-col items-center justify-center px-2">
                              <span className="text-lg font-black text-white leading-none">{animatedReps}</span>
                              <span className="text-[9px] font-bold text-white/50 uppercase tracking-wide mt-0.5">reps</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* C) SUMMARY LINE */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={showFeedback ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="text-center px-4"
                    >
                      <p className="text-base font-medium text-white/80 leading-relaxed">
                        {reactiveFeedback}
                      </p>
                    </motion.div>

                    {/* D) FEEDBACK SECTIONS */}
                    <div className="space-y-6">
                      {/* What you did well */}
                      {strengths.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={showFeedback ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2 px-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400/70" />
                            <h4 className="text-sm font-bold text-white/90">What you did well</h4>
                          </div>
                          <div className="space-y-2">
                            {strengths.slice(0, 2).map((strength, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={showFeedback ? { opacity: 1, x: 0 } : {}}
                                transition={{ 
                                  duration: 0.35, 
                                  delay: 0.25 + idx * 0.1, 
                                  ease: [0.4, 0, 0.2, 1] 
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors cursor-default"
                              >
                                <Check className="w-4 h-4 text-green-400/70 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/85 leading-relaxed">{strength}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Watch Proper Form */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={showFeedback ? { opacity: 1, y: 0 } : {}}
                        transition={{ 
                          duration: 0.4, 
                          delay: strengths.length > 0 ? 0.25 + strengths.slice(0, 2).length * 0.1 : 0.15,
                          ease: [0.4, 0, 0.2, 1] 
                        }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 px-1">
                          <PlayCircle className="w-4 h-4 text-blue-400/70" />
                          <h4 className="text-sm font-bold text-white/90">Watch Proper Form</h4>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            // TODO: Link to technique video for this exercise
                            console.log('Opening technique video for:', exerciseName);
                            setShowVideoModal(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/15 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <PlayCircle className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-bold text-white/90">See how it's done</div>
                            <div className="text-xs text-white/50">Learn the key cues for {exerciseName}</div>
                          </div>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  // NO DETECTION STATE
                  <div className="space-y-6 py-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-400/80" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">No valid reps detected</h3>
                        <p className="text-sm text-white/50">Try these tips for better results:</p>
                      </div>
                    </motion.div>

                    <div className="space-y-2">
                      {[
                        'Keep full body in frame',
                        'Try better lighting',
                        'Use a side angle',
                      ].map((tip, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.35, 
                            delay: 0.2 + idx * 0.1, 
                            ease: [0.4, 0, 0.2, 1] 
                          }}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10"
                        >
                          <AlertCircle className="w-4 h-4 text-red-400/60 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/85 leading-relaxed">{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* E) PRIMARY ACTION */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={showButton ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="px-6 pb-6"
              >
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => {
                      if (onSave && isValidResult) {
                        onSave(displayScore);
                      }
                      onClose();
                    }}
                    className="w-full h-12 bg-white hover:bg-white/90 text-black font-bold shadow-lg transition-all"
                  >
                    Done
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Form Video Modal */}
        {showVideoModal && (
          <FormVideoModal
            exerciseName={exerciseName}
            onClose={() => setShowVideoModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}