import { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, AlertCircle, X, Activity } from 'lucide-react';
import { Button } from './ui/button';
import type { FormAnalysisResult } from '../utils/aiFormScoring';

interface AnalysisResultSheetProps {
  result: FormAnalysisResult & { exerciseName: string };
  onClose: () => void;
  onRetry?: () => void;
}

export function AnalysisResultSheet({
  result,
  onClose,
  onRetry,
}: AnalysisResultSheetProps) {
  const { exerciseName, score, sets: reps, feedback, strengths, improvements } = result;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedReps, setAnimatedReps] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const isValidResult = reps > 0 && score > 0;

  // Get status label (single source of truth for grade)
  const getStatusLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 80) return 'Great';
    if (s >= 70) return 'Good';
    if (s >= 60) return 'Decent';
    return 'Needs Work';
  };

  // Consistent accent color (blue-only system)
  const getAccentColors = (s: number) => {
    if (s >= 90) return {
      ring: 'stroke-blue-500',
      ringGlow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
      text: 'text-blue-400',
    };
    if (s >= 80) return {
      ring: 'stroke-blue-400',
      ringGlow: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]',
      text: 'text-blue-300',
    };
    if (s >= 70) return {
      ring: 'stroke-blue-300',
      ringGlow: 'drop-shadow-[0_0_4px_rgba(147,197,253,0.3)]',
      text: 'text-blue-200',
    };
    return {
      ring: 'stroke-slate-400',
      ringGlow: '',
      text: 'text-slate-300',
    };
  };

  const colors = getAccentColors(score);
  const status = getStatusLabel(score);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Score count-up animation
  useEffect(() => {
    if (!isValidResult) return;
    
    const duration = 600;
    const steps = 30;
    const increment = score / steps;
    const interval = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [score, isValidResult]);

  // Reps count-up animation
  useEffect(() => {
    if (!isValidResult) return;
    
    const duration = 350;
    const steps = 20;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-white/10 shadow-2xl transition-all duration-220 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
        }`}
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
          <button
            onClick={onClose}
            className="w-11 h-11 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center -mr-2"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {isValidResult ? (
            <div className="space-y-8">
              {/* B) HERO METRICS */}
              <div className="flex items-center justify-center gap-6">
                {/* Circular Score Ring */}
                <div className="relative flex-shrink-0">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
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
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - progress}
                      className={`${colors.ring} ${colors.ringGlow} transition-all duration-600 ease-out`}
                    />
                  </svg>
                  {/* Score + Grade in center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-black text-white leading-none mb-0.5">
                      {animatedScore}
                    </div>
                    <div className="text-base text-white/30 font-bold mb-1.5">/100</div>
                    <div className={`text-xs font-bold ${colors.text}`}>
                      {status}
                    </div>
                  </div>
                </div>

                {/* Reps Stats Column */}
                <div className="flex flex-col gap-2">
                  <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs font-semibold text-white/50 mb-1.5">Reps</div>
                    <div className="text-4xl font-black text-white leading-none">
                      {animatedReps}
                    </div>
                  </div>
                </div>
              </div>

              {/* C) SUMMARY LINE */}
              <div className="text-center px-4">
                <p className="text-base font-medium text-white/80 leading-relaxed">
                  {feedback}
                </p>
              </div>

              {/* D) FEEDBACK SECTIONS */}
              <div className="space-y-6">
                {/* What you did well */}
                {strengths.length > 0 && (
                  <div
                    className="space-y-3"
                    style={{
                      opacity: showContent ? 1 : 0,
                      transform: showContent ? 'translateY(0)' : 'translateY(6px)',
                      transition: 'all 300ms ease-out 100ms',
                    }}
                  >
                    <div className="flex items-center gap-2 px-1">
                      <CheckCircle2 className="w-4 h-4 text-white/60" />
                      <h4 className="text-sm font-bold text-white/90">What you did well</h4>
                    </div>
                    <div className="space-y-2">
                      {strengths.slice(0, 2).map((strength, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                          style={{
                            opacity: showContent ? 1 : 0,
                            transform: showContent ? 'translateY(0)' : 'translateY(6px)',
                            transitionDelay: `${190 + idx * 90}ms`,
                            transition: 'all 300ms ease-out',
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                          <span className="text-sm text-white/85 leading-relaxed">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fix next */}
                <div
                  className="space-y-3"
                  style={{
                    opacity: showContent ? 1 : 0,
                    transform: showContent ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'all 300ms ease-out 200ms',
                  }}
                >
                  <div className="flex items-center gap-2 px-1">
                    <TrendingUp className="w-4 h-4 text-white/60" />
                    <h4 className="text-sm font-bold text-white/90">Fix next</h4>
                  </div>
                  <div className="space-y-2">
                    {improvements.length > 0 ? (
                      improvements.slice(0, 3).map((improvement, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                          style={{
                            opacity: showContent ? 1 : 0,
                            transform: showContent ? 'translateY(0)' : 'translateY(6px)',
                            transitionDelay: `${290 + idx * 90}ms`,
                            transition: 'all 300ms ease-out',
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                          <span className="text-sm text-white/85 leading-relaxed">{improvement}</span>
                        </div>
                      ))
                    ) : (
                      <div
                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                        style={{
                          opacity: showContent ? 1 : 0,
                          transform: showContent ? 'translateY(0)' : 'translateY(6px)',
                          transitionDelay: '290ms',
                          transition: 'all 300ms ease-out',
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                        <span className="text-sm text-white/60 leading-relaxed italic">
                          Nothing major detected. Keep consistency.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // NO DETECTION STATE
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-orange-400/80" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">No valid reps detected</h3>
                  <p className="text-sm text-white/50">Try these tips for better results:</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  'Keep full body in frame',
                  'Try better lighting',
                  'Use a side angle',
                ].map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                    style={{
                      opacity: showContent ? 1 : 0,
                      transform: showContent ? 'translateY(0)' : 'translateY(6px)',
                      transitionDelay: `${idx * 90}ms`,
                      transition: 'all 300ms ease-out',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400/60 mt-2 flex-shrink-0" />
                    <span className="text-sm text-white/85 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* E) PRIMARY ACTION */}
        <div className="px-6 pb-6">
          <Button
            onClick={onClose}
            className="w-full h-12 bg-white hover:bg-white/90 text-black font-bold shadow-lg transition-all"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}