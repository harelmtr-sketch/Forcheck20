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
  {
    id: 'push-day',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps workout',
    category: 'push',
    exercises: ['push-up', 'diamond-push-up', 'pike-push-up', 'plank'],
    duration: 30,
    difficulty: 'intermediate',
    gradient: 'from-blue-600/20 to-blue-500/10',
    color: 'blue',
    emoji: '💪'
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    description: 'Back, biceps, and rear delts workout',
    category: 'pull',
    exercises: ['pull-up', 'chin-up', 'inverted-row', 'archer-pull-up', 'leg-raises'],
    duration: 35,
    difficulty: 'intermediate',
    gradient: 'from-green-600/20 to-green-500/10',
    color: 'green',
    emoji: '🏋️'
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    description: 'Quads, glutes, hamstrings, and calves',
    category: 'legs',
    exercises: ['squat', 'lunge', 'jump-squat', 'pistol-squat', 'calf-raise'],
    duration: 40,
    difficulty: 'intermediate',
    gradient: 'from-orange-600/20 to-orange-500/10',
    color: 'orange',
    emoji: '🦵'
  },
  {
    id: 'full-body',
    name: 'Full Body',
    description: 'Complete body workout',
    category: 'full-body',
    exercises: ['burpees', 'push-up', 'pull-up', 'squat', 'plank'],
    duration: 45,
    difficulty: 'intermediate',
    gradient: 'from-yellow-600/20 to-yellow-500/10',
    color: 'yellow',
    emoji: '🔥'
  },
  {
    id: 'beginner-push',
    name: 'Beginner Push',
    description: 'Start your push journey',
    category: 'push',
    exercises: ['push-up', 'pike-push-up', 'plank'],
    duration: 20,
    difficulty: 'beginner',
    gradient: 'from-cyan-600/20 to-cyan-500/10',
    color: 'cyan',
    emoji: '🌟'
  },
  {
    id: 'beginner-pull',
    name: 'Beginner Pull',
    description: 'Start your pull journey',
    category: 'pull',
    exercises: ['inverted-row', 'chin-up', 'leg-raises'],
    duration: 20,
    difficulty: 'beginner',
    gradient: 'from-teal-600/20 to-teal-500/10',
    color: 'teal',
    emoji: '⭐'
  },
  {
    id: 'advanced-beast',
    name: 'Beast Mode',
    description: 'Advanced athletes only',
    category: 'full-body',
    exercises: ['muscle-up', 'handstand-push-up', 'pistol-squat', 'archer-pull-up', 'dragon-flag'],
    duration: 50,
    difficulty: 'advanced',
    gradient: 'from-red-600/20 to-purple-600/10',
    color: 'red',
    emoji: '👹'
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    description: 'Intense core workout',
    category: 'full-body',
    exercises: ['plank', 'leg-raises', 'crunches', 'side-plank', 'mountain-climber'],
    duration: 25,
    difficulty: 'intermediate',
    gradient: 'from-purple-600/20 to-pink-500/10',
    color: 'purple',
    emoji: '💥'
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