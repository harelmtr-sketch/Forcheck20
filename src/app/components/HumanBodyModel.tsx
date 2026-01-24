import type { MuscleStatus } from '../App';

interface HumanBodyModelProps {
  muscleStatus: MuscleStatus[];
}

export function HumanBodyModel({ muscleStatus }: HumanBodyModelProps) {
  // Helper to get muscle color
  const getMuscleColor = (muscleKey: string) => {
    if (!muscleStatus || !Array.isArray(muscleStatus)) return 'fill-gray-600/30 stroke-gray-500/50';
    
    const muscle = muscleStatus.find(m => m.key === muscleKey);
    if (!muscle) return 'fill-gray-600/30 stroke-gray-500/50';
    
    if (muscle.status === 'ready') {
      return 'fill-green-500/40 stroke-green-400 animate-pulse';
    } else if (muscle.status === 'sore') {
      return 'fill-red-500/40 stroke-red-400';
    } else {
      return 'fill-yellow-500/40 stroke-yellow-400';
    }
  };

  const getGlowColor = (muscleKey: string) => {
    if (!muscleStatus || !Array.isArray(muscleStatus)) return '';
    
    const muscle = muscleStatus.find(m => m.key === muscleKey);
    if (!muscle) return '';
    
    if (muscle.status === 'ready') {
      return 'drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    } else if (muscle.status === 'sore') {
      return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    } else {
      return 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]';
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Legend */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          <span className="text-xs font-semibold text-green-400">Ready</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
          <span className="text-xs font-semibold text-yellow-400">Recovering</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          <span className="text-xs font-semibold text-red-400">Sore</span>
        </div>
      </div>

      {/* 3D Body SVG */}
      <svg
        viewBox="0 0 400 600"
        className="w-full h-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Body outline */}
        <ellipse cx="200" cy="300" rx="150" ry="250" fill="url(#bodyGlow)" opacity="0.3" />

        {/* HEAD */}
        <ellipse cx="200" cy="60" rx="30" ry="35" className="fill-gray-700/50 stroke-gray-600" strokeWidth="2" />

        {/* NECK */}
        <rect x="190" y="90" width="20" height="25" className="fill-gray-700/50 stroke-gray-600" strokeWidth="1" />

        {/* TRAPS */}
        <path
          d="M 170 105 Q 160 115 165 125 L 180 115 Z"
          className={`${getMuscleColor('traps')} ${getGlowColor('traps')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 230 105 Q 240 115 235 125 L 220 115 Z"
          className={`${getMuscleColor('traps')} ${getGlowColor('traps')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* FRONT DELTS */}
        <ellipse
          cx="150" cy="140" rx="22" ry="28"
          className={`${getMuscleColor('front-delts')} ${getGlowColor('front-delts')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="250" cy="140" rx="22" ry="28"
          className={`${getMuscleColor('front-delts')} ${getGlowColor('front-delts')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* SIDE DELTS */}
        <ellipse
          cx="130" cy="145" rx="15" ry="25"
          className={`${getMuscleColor('side-delts')} ${getGlowColor('side-delts')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="270" cy="145" rx="15" ry="25"
          className={`${getMuscleColor('side-delts')} ${getGlowColor('side-delts')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* CHEST */}
        <path
          d="M 170 130 Q 200 125 230 130 Q 225 170 200 175 Q 175 170 170 130 Z"
          className={`${getMuscleColor('chest')} ${getGlowColor('chest')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* BICEPS */}
        <ellipse
          cx="140" cy="185" rx="12" ry="30"
          className={`${getMuscleColor('biceps')} ${getGlowColor('biceps')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="260" cy="185" rx="12" ry="30"
          className={`${getMuscleColor('biceps')} ${getGlowColor('biceps')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* TRICEPS */}
        <ellipse
          cx="125" cy="185" rx="10" ry="28"
          className={`${getMuscleColor('triceps')} ${getGlowColor('triceps')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="275" cy="185" rx="10" ry="28"
          className={`${getMuscleColor('triceps')} ${getGlowColor('triceps')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* FOREARMS */}
        <ellipse
          cx="135" cy="235" rx="10" ry="25"
          className={`${getMuscleColor('forearms')} ${getGlowColor('forearms')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="265" cy="235" rx="10" ry="25"
          className={`${getMuscleColor('forearms')} ${getGlowColor('forearms')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* CORE/ABS */}
        <rect
          x="175" y="180" width="50" height="80" rx="8"
          className={`${getMuscleColor('core')} ${getGlowColor('core')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* BACK (shown as side lines) */}
        <path
          d="M 165 135 Q 155 180 160 220"
          className={`${getMuscleColor('back')} ${getGlowColor('back')}`}
          strokeWidth="8"
          fill="none"
          filter="url(#glow)"
        />
        <path
          d="M 235 135 Q 245 180 240 220"
          className={`${getMuscleColor('back')} ${getGlowColor('back')}`}
          strokeWidth="8"
          fill="none"
          filter="url(#glow)"
        />

        {/* GLUTES */}
        <ellipse
          cx="185" cy="280" rx="18" ry="20"
          className={`${getMuscleColor('glutes')} ${getGlowColor('glutes')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="215" cy="280" rx="18" ry="20"
          className={`${getMuscleColor('glutes')} ${getGlowColor('glutes')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* QUADS */}
        <ellipse
          cx="175" cy="360" rx="20" ry="60"
          className={`${getMuscleColor('quads')} ${getGlowColor('quads')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="225" cy="360" rx="20" ry="60"
          className={`${getMuscleColor('quads')} ${getGlowColor('quads')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* HAMSTRINGS (shown behind quads) */}
        <ellipse
          cx="170" cy="365" rx="15" ry="55"
          className={`${getMuscleColor('hamstrings')} ${getGlowColor('hamstrings')}`}
          strokeWidth="2"
          filter="url(#glow)"
          opacity="0.7"
        />
        <ellipse
          cx="230" cy="365" rx="15" ry="55"
          className={`${getMuscleColor('hamstrings')} ${getGlowColor('hamstrings')}`}
          strokeWidth="2"
          filter="url(#glow)"
          opacity="0.7"
        />

        {/* CALVES */}
        <ellipse
          cx="175" cy="480" rx="15" ry="40"
          className={`${getMuscleColor('calves')} ${getGlowColor('calves')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <ellipse
          cx="225" cy="480" rx="15" ry="40"
          className={`${getMuscleColor('calves')} ${getGlowColor('calves')}`}
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* REAR DELTS (shown as dots behind shoulders) */}
        <circle
          cx="145" cy="145" r="8"
          className={`${getMuscleColor('rear-delts')} ${getGlowColor('rear-delts')}`}
          strokeWidth="2"
          filter="url(#glow)"
          opacity="0.8"
        />
        <circle
          cx="255" cy="145" r="8"
          className={`${getMuscleColor('rear-delts')} ${getGlowColor('rear-delts')}`}
          strokeWidth="2"
          filter="url(#glow)"
          opacity="0.8"
        />
      </svg>

      {/* Muscle count summary */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
          <p className="text-2xl font-bold text-green-400">
            {muscleStatus?.filter(m => m.status === 'ready').length || 0}
          </p>
          <p className="text-xs text-green-300/80 font-semibold">Ready</p>
        </div>
        <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <p className="text-2xl font-bold text-yellow-400">
            {muscleStatus?.filter(m => m.status === 'recovering').length || 0}
          </p>
          <p className="text-xs text-yellow-300/80 font-semibold">Recovering</p>
        </div>
        <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
          <p className="text-2xl font-bold text-red-400">
            {muscleStatus?.filter(m => m.status === 'sore').length || 0}
          </p>
          <p className="text-xs text-red-300/80 font-semibold">Sore</p>
        </div>
      </div>
    </div>
  );
}