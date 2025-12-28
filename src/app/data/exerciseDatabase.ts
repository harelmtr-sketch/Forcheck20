export interface ExerciseData {
  id: string;
  name: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'full-body';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'bodyweight' | 'weights' | 'resistance-band' | 'none';
  baseReps: number;
  baseSets: number;
  emoji: string;
}

export const exerciseDatabase: ExerciseData[] = [
  // PUSH EXERCISES
  {
    id: 'push-up',
    name: 'Push-ups',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['front-delts', 'core'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '💪'
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-ups',
    category: 'push',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['front-delts'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '💎'
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-ups',
    category: 'push',
    primaryMuscles: ['front-delts', 'triceps'],
    secondaryMuscles: ['chest'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '⛰️'
  },
  {
    id: 'handstand-push-up',
    name: 'Handstand Push-ups',
    category: 'push',
    primaryMuscles: ['front-delts', 'triceps'],
    secondaryMuscles: ['traps', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 8,
    baseSets: 3,
    emoji: '🤸'
  },
  {
    id: 'decline-push-up',
    name: 'Decline Push-ups',
    category: 'push',
    primaryMuscles: ['chest', 'front-delts'],
    secondaryMuscles: ['triceps'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '📐'
  },
  {
    id: 'pseudo-planche-pushup',
    name: 'Pseudo Planche Push-ups',
    category: 'push',
    primaryMuscles: ['front-delts', 'chest'],
    secondaryMuscles: ['triceps', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 6,
    baseSets: 3,
    emoji: '🔥'
  },
  {
    id: 'wide-push-up',
    name: 'Wide Push-ups',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-delts', 'triceps'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '💪'
  },
  {
    id: 'archer-push-up',
    name: 'Archer Push-ups',
    category: 'push',
    primaryMuscles: ['chest', 'front-delts'],
    secondaryMuscles: ['triceps', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 8,
    baseSets: 3,
    emoji: '🏹'
  },
  {
    id: 'one-arm-push-up',
    name: 'One Arm Push-ups',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['front-delts', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 5,
    baseSets: 3,
    emoji: '💪'
  },
  {
    id: 'clap-push-up',
    name: 'Clapping Push-ups',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['front-delts'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 8,
    baseSets: 3,
    emoji: '👏'
  },
  {
    id: 'incline-push-up',
    name: 'Incline Push-ups',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['front-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '📐'
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dips',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'front-delts'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '💪'
  },
  {
    id: 'bench-dip',
    name: 'Bench Dips',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['front-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '💺'
  },

  // PULL EXERCISES
  {
    id: 'pull-up',
    name: 'Pull-ups',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['rear-delts', 'forearms'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '🏋️'
  },
  {
    id: 'chin-up',
    name: 'Chin-ups',
    category: 'pull',
    primaryMuscles: ['biceps', 'back'],
    secondaryMuscles: ['rear-delts'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '💪'
  },
  {
    id: 'inverted-row',
    name: 'Inverted Rows',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['rear-delts', 'traps'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '🚣'
  },
  {
    id: 'archer-pull-up',
    name: 'Archer Pull-ups',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 6,
    baseSets: 3,
    emoji: '🏹'
  },
  {
    id: 'muscle-up',
    name: 'Muscle-ups',
    category: 'pull',
    primaryMuscles: ['back', 'triceps', 'chest'],
    secondaryMuscles: ['biceps', 'front-delts', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 5,
    baseSets: 3,
    emoji: '🔥'
  },
  {
    id: 'wide-pull-up',
    name: 'Wide Grip Pull-ups',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'rear-delts'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 8,
    baseSets: 3,
    emoji: '🏋️'
  },
  {
    id: 'neutral-grip-pull-up',
    name: 'Neutral Grip Pull-ups',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '🏋️'
  },
  {
    id: 'one-arm-pull-up',
    name: 'One Arm Pull-ups',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 3,
    baseSets: 3,
    emoji: '💪'
  },
  {
    id: 'typewriter-pull-up',
    name: 'Typewriter Pull-ups',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'rear-delts'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 6,
    baseSets: 3,
    emoji: '⌨️'
  },
  {
    id: 'australian-pull-up',
    name: 'Australian Pull-ups',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['rear-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '🦘'
  },
  {
    id: 'face-pull',
    name: 'Face Pulls',
    category: 'pull',
    primaryMuscles: ['rear-delts', 'traps'],
    secondaryMuscles: ['back'],
    difficulty: 'beginner',
    equipment: 'resistance-band',
    baseReps: 15,
    baseSets: 3,
    emoji: '😮'
  },
  {
    id: 'scapula-pull-up',
    name: 'Scapula Pull-ups',
    category: 'pull',
    primaryMuscles: ['traps', 'back'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '🏋️'
  },

  // LEG EXERCISES
  {
    id: 'squat',
    name: 'Squats',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 4,
    emoji: '🦵'
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squats',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 8,
    baseSets: 3,
    emoji: '🔫'
  },
  {
    id: 'lunge',
    name: 'Lunges',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '🚶'
  },
  {
    id: 'jump-squat',
    name: 'Jump Squats',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes', 'calves'],
    secondaryMuscles: ['hamstrings'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '🦘'
  },
  {
    id: 'calf-raise',
    name: 'Calf Raises',
    category: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 25,
    baseSets: 3,
    emoji: '📈'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squats',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '🇧🇬'
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunges',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '🚶'
  },
  {
    id: 'sissy-squat',
    name: 'Sissy Squats',
    category: 'legs',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '🦵'
  },
  {
    id: 'nordic-curl',
    name: 'Nordic Curls',
    category: 'legs',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes', 'core'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 6,
    baseSets: 3,
    emoji: '❄️'
  },
  {
    id: 'box-jump',
    name: 'Box Jumps',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes', 'calves'],
    secondaryMuscles: ['hamstrings'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '📦'
  },
  {
    id: 'wall-sit',
    name: 'Wall Sits',
    category: 'legs',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 60, // seconds
    baseSets: 3,
    emoji: '🧱'
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridges',
    category: 'legs',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['core'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '🌉'
  },
  {
    id: 'single-leg-deadlift',
    name: 'Single Leg Deadlifts',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back', 'core'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '🦩'
  },
  {
    id: 'lateral-lunge',
    name: 'Lateral Lunges',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '⬅️'
  },
  {
    id: 'jump-lunge',
    name: 'Jump Lunges',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 16,
    baseSets: 3,
    emoji: '🦘'
  },

  // CORE EXERCISES
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['front-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 60, // seconds
    baseSets: 3,
    emoji: '🏋️'
  },
  {
    id: 'crunches',
    name: 'Crunches',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '📐'
  },
  {
    id: 'leg-raises',
    name: 'Leg Raises',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['quads'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '⬆️'
  },
  {
    id: 'dragon-flag',
    name: 'Dragon Flag',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['back'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 5,
    baseSets: 3,
    emoji: '🐉'
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['side-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 45, // seconds per side
    baseSets: 3,
    emoji: '🔄'
  },
  {
    id: 'russian-twist',
    name: 'Russian Twists',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 30,
    baseSets: 3,
    emoji: '🌀'
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunches',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 30,
    baseSets: 3,
    emoji: '🚴'
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Body Hold',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 45, // seconds
    baseSets: 3,
    emoji: '🌙'
  },
  {
    id: 'v-up',
    name: 'V-Ups',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['quads'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '✌️'
  },
  {
    id: 'windshield-wiper',
    name: 'Windshield Wipers',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['back'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '🚗'
  },
  {
    id: 'ab-wheel',
    name: 'Ab Wheel Rollout',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['back', 'front-delts'],
    difficulty: 'advanced',
    equipment: 'bodyweight',
    baseReps: 10,
    baseSets: 3,
    emoji: '⭕'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '🪲'
  },
  {
    id: 'flutter-kick',
    name: 'Flutter Kicks',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 40,
    baseSets: 3,
    emoji: '🏊'
  },
  {
    id: 'toe-touch',
    name: 'Toe Touches',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '👣'
  },

  // FULL BODY
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'full-body',
    primaryMuscles: ['chest', 'quads', 'core'],
    secondaryMuscles: ['triceps', 'glutes', 'calves'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '🔥'
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    category: 'full-body',
    primaryMuscles: ['core', 'quads'],
    secondaryMuscles: ['chest', 'front-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 30,
    baseSets: 3,
    emoji: '⛰️'
  },
  {
    id: 'bear-crawl',
    name: 'Bear Crawls',
    category: 'full-body',
    primaryMuscles: ['core', 'front-delts'],
    secondaryMuscles: ['quads', 'chest'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '🐻'
  },
  {
    id: 'sprawl',
    name: 'Sprawls',
    category: 'full-body',
    primaryMuscles: ['core', 'chest', 'quads'],
    secondaryMuscles: ['triceps', 'glutes'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 15,
    baseSets: 3,
    emoji: '🤸'
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'full-body',
    primaryMuscles: ['calves', 'core'],
    secondaryMuscles: ['front-delts'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 100,
    baseSets: 3,
    emoji: '🪢'
  },
  {
    id: 'inchworm',
    name: 'Inchworms',
    category: 'full-body',
    primaryMuscles: ['core', 'hamstrings'],
    secondaryMuscles: ['front-delts', 'chest'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 12,
    baseSets: 3,
    emoji: '🐛'
  },
  {
    id: 'star-jump',
    name: 'Star Jumps',
    category: 'full-body',
    primaryMuscles: ['quads', 'calves'],
    secondaryMuscles: ['glutes', 'core'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '⭐'
  },
  {
    id: 'high-knee',
    name: 'High Knees',
    category: 'full-body',
    primaryMuscles: ['quads', 'core'],
    secondaryMuscles: ['calves'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
    baseReps: 40,
    baseSets: 3,
    emoji: '🦵'
  },
  {
    id: 'plank-jack',
    name: 'Plank Jacks',
    category: 'full-body',
    primaryMuscles: ['core', 'front-delts'],
    secondaryMuscles: ['quads'],
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    baseReps: 20,
    baseSets: 3,
    emoji: '🃏'
  },
];

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: 'push' | 'pull' | 'legs' | 'full-body';
  exercises: string[]; // exercise IDs
  duration: number; // estimated minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gradient: string;
  color: string;
  emoji: string;
}

export const workoutTemplates: WorkoutTemplate[] = [
  // PUSH TEMPLATES
  {
    id: 'push-day',
    name: 'Push Power',
    description: 'Chest, shoulders, and triceps',
    category: 'push',
    exercises: ['push-up', 'diamond-push-up', 'pike-push-up', 'tricep-dip', 'decline-push-up'],
    duration: 35,
    difficulty: 'intermediate',
    gradient: 'from-blue-600/20 to-blue-500/10',
    color: 'blue',
    emoji: '💪'
  },
  {
    id: 'beginner-push',
    name: 'Push Starter',
    description: 'Perfect for beginners',
    category: 'push',
    exercises: ['incline-push-up', 'push-up', 'bench-dip', 'pike-push-up'],
    duration: 20,
    difficulty: 'beginner',
    gradient: 'from-cyan-600/20 to-cyan-500/10',
    color: 'cyan',
    emoji: '🌟'
  },
  {
    id: 'advanced-push',
    name: 'Push Elite',
    description: 'Advanced push movements',
    category: 'push',
    exercises: ['handstand-push-up', 'one-arm-push-up', 'archer-push-up', 'pseudo-planche-pushup', 'clap-push-up'],
    duration: 40,
    difficulty: 'advanced',
    gradient: 'from-indigo-600/20 to-blue-600/10',
    color: 'indigo',
    emoji: '🚀'
  },
  {
    id: 'chest-focus',
    name: 'Chest Builder',
    description: 'Maximum chest activation',
    category: 'push',
    exercises: ['wide-push-up', 'decline-push-up', 'push-up', 'archer-push-up', 'clap-push-up'],
    duration: 30,
    difficulty: 'intermediate',
    gradient: 'from-sky-600/20 to-blue-500/10',
    color: 'sky',
    emoji: '💎'
  },
  {
    id: 'shoulder-focus',
    name: 'Shoulder Shred',
    description: 'Build boulder shoulders',
    category: 'push',
    exercises: ['pike-push-up', 'handstand-push-up', 'pseudo-planche-pushup', 'decline-push-up'],
    duration: 30,
    difficulty: 'advanced',
    gradient: 'from-violet-600/20 to-purple-500/10',
    color: 'violet',
    emoji: '🏔️'
  },

  // PULL TEMPLATES
  {
    id: 'pull-day',
    name: 'Pull Power',
    description: 'Back, biceps, and rear delts',
    category: 'pull',
    exercises: ['pull-up', 'chin-up', 'inverted-row', 'wide-pull-up', 'scapula-pull-up'],
    duration: 35,
    difficulty: 'intermediate',
    gradient: 'from-green-600/20 to-green-500/10',
    color: 'green',
    emoji: '🏋️'
  },
  {
    id: 'beginner-pull',
    name: 'Pull Starter',
    description: 'Build pulling strength',
    category: 'pull',
    exercises: ['australian-pull-up', 'inverted-row', 'scapula-pull-up', 'face-pull'],
    duration: 20,
    difficulty: 'beginner',
    gradient: 'from-teal-600/20 to-teal-500/10',
    color: 'teal',
    emoji: '⭐'
  },
  {
    id: 'advanced-pull',
    name: 'Pull Elite',
    description: 'Master pull movements',
    category: 'pull',
    exercises: ['one-arm-pull-up', 'muscle-up', 'archer-pull-up', 'typewriter-pull-up', 'wide-pull-up'],
    duration: 40,
    difficulty: 'advanced',
    gradient: 'from-emerald-600/20 to-green-600/10',
    color: 'emerald',
    emoji: '💪'
  },
  {
    id: 'back-thickness',
    name: 'Back Builder',
    description: 'Thick, wide back',
    category: 'pull',
    exercises: ['wide-pull-up', 'pull-up', 'inverted-row', 'neutral-grip-pull-up', 'face-pull'],
    duration: 35,
    difficulty: 'intermediate',
    gradient: 'from-lime-600/20 to-green-500/10',
    color: 'lime',
    emoji: '🦅'
  },

  // LEG TEMPLATES
  {
    id: 'leg-day',
    name: 'Leg Day',
    description: 'Complete lower body workout',
    category: 'legs',
    exercises: ['squat', 'bulgarian-split-squat', 'nordic-curl', 'glute-bridge', 'calf-raise'],
    duration: 40,
    difficulty: 'intermediate',
    gradient: 'from-orange-600/20 to-orange-500/10',
    color: 'orange',
    emoji: '🦵'
  },
  {
    id: 'beginner-legs',
    name: 'Leg Starter',
    description: 'Build a foundation',
    category: 'legs',
    exercises: ['squat', 'lunge', 'glute-bridge', 'calf-raise', 'wall-sit'],
    duration: 25,
    difficulty: 'beginner',
    gradient: 'from-amber-600/20 to-orange-500/10',
    color: 'amber',
    emoji: '🌱'
  },
  {
    id: 'advanced-legs',
    name: 'Leg Elite',
    description: 'Advanced leg mastery',
    category: 'legs',
    exercises: ['pistol-squat', 'nordic-curl', 'sissy-squat', 'jump-lunge', 'box-jump'],
    duration: 45,
    difficulty: 'advanced',
    gradient: 'from-red-600/20 to-orange-600/10',
    color: 'red',
    emoji: '🔥'
  },
  {
    id: 'quad-focus',
    name: 'Quad Burner',
    description: 'Massive quad development',
    category: 'legs',
    exercises: ['squat', 'pistol-squat', 'sissy-squat', 'jump-squat', 'wall-sit'],
    duration: 35,
    difficulty: 'advanced',
    gradient: 'from-yellow-600/20 to-amber-500/10',
    color: 'yellow',
    emoji: '⚡'
  },
  {
    id: 'glute-hamstring',
    name: 'Posterior Chain',
    description: 'Glutes and hamstrings',
    category: 'legs',
    exercises: ['nordic-curl', 'glute-bridge', 'single-leg-deadlift', 'bulgarian-split-squat', 'jump-lunge'],
    duration: 35,
    difficulty: 'intermediate',
    gradient: 'from-rose-600/20 to-pink-500/10',
    color: 'rose',
    emoji: '🍑'
  },

  // FULL BODY & CONDITIONING
  {
    id: 'full-body',
    name: 'Full Body Blast',
    description: 'Complete workout',
    category: 'full-body',
    exercises: ['burpees', 'push-up', 'pull-up', 'squat', 'plank', 'mountain-climber'],
    duration: 45,
    difficulty: 'intermediate',
    gradient: 'from-purple-600/20 to-pink-600/10',
    color: 'purple',
    emoji: '🔥'
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT Cardio',
    description: 'High intensity fat burn',
    category: 'full-body',
    exercises: ['burpees', 'mountain-climber', 'jump-squat', 'high-knee', 'star-jump', 'plank-jack'],
    duration: 25,
    difficulty: 'intermediate',
    gradient: 'from-fuchsia-600/20 to-pink-500/10',
    color: 'fuchsia',
    emoji: '💥'
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    description: 'Six pack abs',
    category: 'full-body',
    exercises: ['plank', 'leg-raises', 'russian-twist', 'v-up', 'bicycle-crunch', 'hollow-hold'],
    duration: 25,
    difficulty: 'intermediate',
    gradient: 'from-pink-600/20 to-rose-500/10',
    color: 'pink',
    emoji: '💎'
  },
  {
    id: 'beginner-fullbody',
    name: 'Total Body Starter',
    description: 'Perfect for beginners',
    category: 'full-body',
    exercises: ['push-up', 'inverted-row', 'squat', 'plank', 'glute-bridge', 'crunches'],
    duration: 30,
    difficulty: 'beginner',
    gradient: 'from-slate-600/20 to-gray-500/10',
    color: 'slate',
    emoji: '✨'
  },
  {
    id: 'advanced-beast',
    name: 'Beast Mode',
    description: 'Elite athletes only',
    category: 'full-body',
    exercises: ['muscle-up', 'handstand-push-up', 'pistol-squat', 'dragon-flag', 'one-arm-pull-up'],
    duration: 50,
    difficulty: 'advanced',
    gradient: 'from-red-600/20 to-purple-600/10',
    color: 'red',
    emoji: '👹'
  },
  {
    id: 'mobility-recovery',
    name: 'Mobility & Recovery',
    description: 'Active recovery day',
    category: 'full-body',
    exercises: ['inchworm', 'dead-bug', 'glute-bridge', 'side-plank', 'single-leg-deadlift'],
    duration: 20,
    difficulty: 'beginner',
    gradient: 'from-cyan-600/20 to-blue-500/10',
    color: 'cyan',
    emoji: '🧘'
  },
];

// SCORING FORMULA
export interface ScoreFactors {
  formQuality: number; // 0-100: How good is the form
  completionRate: number; // 0-100: Did they complete all reps/sets
  tempo: number; // 0-100: Was the tempo controlled
  rangeOfMotion: number; // 0-100: Full range of motion
  consistency: number; // 0-100: Consistency across sets
}

export function calculateExerciseScore(factors: ScoreFactors): number {
  // Weighted average
  const weights = {
    formQuality: 0.40,     // 40% - Most important
    completionRate: 0.20,  // 20%
    tempo: 0.15,           // 15%
    rangeOfMotion: 0.15,   // 15%
    consistency: 0.10      // 10%
  };

  const score = 
    factors.formQuality * weights.formQuality +
    factors.completionRate * weights.completionRate +
    factors.tempo * weights.tempo +
    factors.rangeOfMotion * weights.rangeOfMotion +
    factors.consistency * weights.consistency;

  return Math.round(score);
}

// Generate a realistic score with some randomness
export function generateRealisticScore(difficulty: 'beginner' | 'intermediate' | 'advanced'): number {
  const baseScores = {
    beginner: { min: 85, max: 98 },
    intermediate: { min: 78, max: 94 },
    advanced: { min: 70, max: 90 }
  };

  const range = baseScores[difficulty];
  const score = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
  return score;
}

// Get performance feedback based on score
export function getScoreFeedback(score: number): { message: string; color: string; emoji: string } {
  if (score >= 95) {
    return { 
      message: "Perfect form! You're crushing it! 🔥", 
      color: 'text-green-400',
      emoji: '🏆'
    };
  } else if (score >= 85) {
    return { 
      message: "Excellent work! Keep it up! 💪", 
      color: 'text-green-400',
      emoji: '✨'
    };
  } else if (score >= 75) {
    return { 
      message: "Good job! Room for improvement.", 
      color: 'text-yellow-400',
      emoji: '👍'
    };
  } else if (score >= 60) {
    return { 
      message: "Decent effort. Focus on form.", 
      color: 'text-orange-400',
      emoji: '💡'
    };
  } else {
    return { 
      message: "Keep practicing. Form needs work.", 
      color: 'text-red-400',
      emoji: '🎯'
    };
  }
}