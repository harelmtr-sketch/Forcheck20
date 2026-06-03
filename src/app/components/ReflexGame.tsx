import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Zap, Trophy, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ReflexGameProps {
  onClose: () => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  born: number;
  lifespan: number;
}

type Phase = 'idle' | 'playing' | 'gameover';

const COLORS = [
  { ring: '#3b82f6', glow: 'rgba(59,130,246,0.6)', bg: 'rgba(59,130,246,0.25)' },
  { ring: '#a855f7', glow: 'rgba(168,85,247,0.6)', bg: 'rgba(168,85,247,0.25)' },
  { ring: '#22c55e', glow: 'rgba(34,197,94,0.6)', bg: 'rgba(34,197,94,0.25)' },
  { ring: '#f59e0b', glow: 'rgba(245,158,11,0.6)', bg: 'rgba(245,158,11,0.25)' },
  { ring: '#ef4444', glow: 'rgba(239,68,68,0.6)', bg: 'rgba(239,68,68,0.25)' },
];

export function ReflexGame({ onClose }: ReflexGameProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('reflex_best') || '0', 10);
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState(0);
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; pts: number }[]>([]);
  const [misses, setMisses] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const decayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (decayTimer.current) clearInterval(decayTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  }, []);

  const spawnTarget = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const size = Math.random() * 24 + 38; // 38–62px
    const x = Math.random() * (rect.width - size - 16) + 8;
    const y = Math.random() * (rect.height - size - 16) + 8;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const lifespan = Math.random() * 1200 + 1000; // 1.0–2.2s

    setTargets(prev => [
      ...prev,
      { id: nextId.current++, x, y, size, color: JSON.stringify(color), born: Date.now(), lifespan },
    ]);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setScore(0);
    setCombo(0);
    setMisses(0);
    setTimeLeft(30);
    setTargets([]);
    setPopEffects([]);
    setPhase('playing');

    countdownTimer.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearTimers();
          setPhase('gameover');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnTimer.current = setInterval(spawnTarget, 700);

    decayTimer.current = setInterval(() => {
      const now = Date.now();
      setTargets(prev => {
        const expired = prev.filter(t => now - t.born >= t.lifespan);
        if (expired.length > 0) {
          setMisses(m => m + expired.length);
          setCombo(0);
        }
        return prev.filter(t => now - t.born < t.lifespan);
      });
    }, 100);
  }, [clearTimers, spawnTarget]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleTap = useCallback((target: Target, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (phase !== 'playing') return;
    setTargets(prev => prev.filter(t => t.id !== target.id));

    const elapsed = Date.now() - target.born;
    const speedBonus = Math.max(0, Math.floor((target.lifespan - elapsed) / 200));
    setCombo(c => {
      const newCombo = c + 1;
      const comboMultiplier = Math.min(newCombo, 5);
      const pts = (1 + speedBonus) * comboMultiplier;
      setScore(s => {
        const ns = s + pts;
        return ns;
      });
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const cx = target.x + target.size / 2;
      const cy = target.y + target.size / 2;
      setPopEffects(ps => [...ps, { id: Date.now() + Math.random(), x: cx, y: cy, pts }]);
      setTimeout(() => setPopEffects(ps => ps.filter(p => p.id !== ps[ps.length - 1]?.id)), 600);
      return newCombo;
    });
  }, [phase]);

  useEffect(() => {
    if (phase === 'gameover') {
      setScore(s => {
        setBestScore(prev => {
          const nb = Math.max(prev, s);
          localStorage.setItem('reflex_best', String(nb));
          return nb;
        });
        return s;
      });
    }
  }, [phase]);

  const urgencyColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : '#3b82f6';

  return (
    <div className="flex flex-col h-full bg-[#0f1117] select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-10 pb-3">
        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Zap className="w-5 h-5 text-yellow-400" />
          Reflex Tap
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>{bestScore}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-6 pb-3">
        <div className="text-center">
          <div className="text-2xl font-black text-white">{score}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black" style={{ color: urgencyColor }}>{timeLeft}s</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-purple-400">x{Math.min(combo, 5)}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Combo</div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${(timeLeft / 30) * 100}%`,
            background: `linear-gradient(90deg, ${urgencyColor}, ${urgencyColor}aa)`,
            boxShadow: `0 0 8px ${urgencyColor}`,
          }}
        />
      </div>

      {/* Game area */}
      <div
        ref={areaRef}
        className="flex-1 relative mx-3 mb-3 rounded-2xl overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a1d2e 0%, #0d0f17 100%)' }}
      >
        {/* Idle state */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8">
            <div className="text-6xl">⚡</div>
            <div className="text-white text-center">
              <div className="text-xl font-bold mb-1">Tap the targets!</div>
              <div className="text-gray-400 text-sm">Tap fast for combo multipliers. 30 seconds.</div>
            </div>
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              Start Game
            </Button>
          </div>
        )}

        {/* Game over state */}
        {phase === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 z-10">
            <div className="text-5xl">{score >= bestScore ? '🏆' : '🎯'}</div>
            <div className="text-white text-center">
              <div className="text-3xl font-black mb-1">{score}</div>
              {score >= bestScore && score > 0 && (
                <div className="text-yellow-400 font-bold text-sm mb-1">New Best!</div>
              )}
              <div className="text-gray-400 text-sm">Misses: {misses}</div>
            </div>
            <Button onClick={startGame} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <RefreshCw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}

        {/* Targets */}
        {targets.map(target => {
          const color = JSON.parse(target.color);
          const age = Date.now() - target.born;
          const frac = Math.min(age / target.lifespan, 1);
          const opacity = 1 - frac * 0.5;
          const scale = 1 - frac * 0.15;

          return (
            <button
              key={target.id}
              onMouseDown={e => handleTap(target, e)}
              onTouchStart={e => handleTap(target, e)}
              style={{
                position: 'absolute',
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                borderRadius: '50%',
                background: color.bg,
                border: `2.5px solid ${color.ring}`,
                boxShadow: `0 0 ${12 + (1 - frac) * 12}px ${color.glow}`,
                opacity,
                transform: `scale(${scale})`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.1s, transform 0.1s',
              }}
            >
              <div style={{ width: '40%', height: '40%', borderRadius: '50%', background: color.ring, opacity: 0.8 }} />
            </button>
          );
        })}

        {/* Pop effects */}
        {popEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute pointer-events-none text-white font-black text-sm animate-ping"
            style={{ left: effect.x - 12, top: effect.y - 10, zIndex: 20, animationDuration: '0.4s', animationIterationCount: 1 }}
          >
            +{effect.pts}
          </div>
        ))}

        {/* Grid dots background */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
      </div>
    </div>
  );
}
