import type { Exercise, MuscleStatus } from '../App';
import { exerciseDatabase } from '../data/exerciseDatabase-clean';

/**
 * Calculate the C coefficient based on ready muscles and muscles hit
 * UPDATED: Reward hitting more muscles, don't penalize!
 */
function calculateCCoefficient(readyMusclesCount: number, musclesHitCount: number): number {
  // If no muscles were trained, return 0
  if (musclesHitCount === 0) return 0;
  
  // If all or most ready muscles were hit, that's perfect!
  if (readyMusclesCount === 0) return 1; // No ready muscles tracked, assume perfect
  
  const hitRatio = musclesHitCount / readyMusclesCount;
  
  // Perfect score for hitting 50%+ of available muscles
  if (hitRatio >= 0.5) return 1.0;
  
  // Good score for hitting 40%+
  if (hitRatio >= 0.4) return 0.9;
  
  // Decent for 30%+
  if (hitRatio >= 0.3) return 0.75;
  
  // Below 30% is unbalanced
  if (hitRatio >= 0.2) return 0.5;
  
  // Very unbalanced
  return 0.3;
}

/**
 * Check if an exercise "hits" a muscle group
 * Criteria: score > 50, at least 2 sets, at least 5 reps
 */
function exerciseHitsMuscle(exercise: Exercise): boolean {
  return exercise.score > 50 && exercise.sets >= 2 && exercise.reps >= 5;
}

/**
 * Get all muscles that an exercise targets
 */
function getMusclesFromExercise(exerciseName: string): string[] {
  const exerciseData = exerciseDatabase.find(ex => ex.name === exerciseName);
  if (!exerciseData) return [];
  
  return [...exerciseData.primaryMuscles, ...exerciseData.secondaryMuscles];
}

/**
 * Calculate the overall workout score
 * Formula: 
 *  - Template workout: average exercise score (balance doesn't matter)
 *  - Custom workout: average exercise score × C coefficient (balance matters)
 */
export function calculateWorkoutScore(exercises: Exercise[], muscleStatus: MuscleStatus[]) {
  if (exercises.length === 0) {
    return {
      score: 0,
      avgExerciseScore: 0,
      cCoefficient: 0,
      musclesHitCount: 0,
      readyMusclesCount: 0,
      musclesHit: [],
      isTemplateWorkout: false
    };
  }

  // Safety check for muscleStatus
  if (!muscleStatus || !Array.isArray(muscleStatus)) {
    muscleStatus = [];
  }

  // Filter out exercises that haven't been rated yet
  const ratedExercises = exercises.filter(ex => ex.score !== null && ex.score !== undefined);
  
  // Check if this is a template workout (all exercises are from a template)
  const isTemplateWorkout = exercises.length > 0 && exercises.every(ex => ex.fromTemplate);
  
  if (ratedExercises.length === 0) {
    return {
      score: 0,
      avgExerciseScore: 0,
      cCoefficient: 0,
      musclesHitCount: 0,
      readyMusclesCount: muscleStatus.filter(m => m.status === 'ready').length,
      musclesHit: [],
      isTemplateWorkout
    };
  }

  // Calculate average exercise score (only from rated exercises)
  const avgExerciseScore = Math.round(
    ratedExercises.reduce((sum, ex) => sum + (ex.score || 0), 0) / ratedExercises.length
  );
  
  // Get muscles that were hit (scored well)
  const hitMuscles = getHitMuscles(ratedExercises, muscleStatus);
  const musclesHitCount = hitMuscles.size;
  
  // Count muscles that were trained today
  const trainedMuscles = muscleStatus.filter(m => m.setsToday > 0);
  const readyMusclesCount = trainedMuscles.length > 0 ? trainedMuscles.length : muscleStatus.filter(m => m.status === 'ready').length;
  
  let cCoefficient: number;
  let score: number;
  
  if (isTemplateWorkout) {
    // Template workout: Score = average form (no balance penalty)
    // Templates have predefined muscle targets, so good form = high score
    cCoefficient = 1.0;
    score = avgExerciseScore;
  } else {
    // Custom workout: Score = average form × balance coefficient
    cCoefficient = calculateCCoefficient(readyMusclesCount, musclesHitCount);
    score = Math.abs(Math.round(avgExerciseScore * cCoefficient));
  }
  
  return {
    score,
    avgExerciseScore,
    cCoefficient,
    readyMusclesCount,
    musclesHitCount,
    musclesHit: Array.from(hitMuscles),
    isTemplateWorkout
  };
}

/**
 * Get all muscles that were hit by high-scoring exercises
 */
function getHitMuscles(exercises: Exercise[], muscleStatus: MuscleStatus[]): Set<string> {
  const hitMuscles = new Set<string>();
  
  // Safety check
  if (!muscleStatus || !Array.isArray(muscleStatus)) {
    return hitMuscles;
  }
  
  for (const exercise of exercises) {
    // Check if this exercise qualifies as a "hit" (score > 50, 2+ sets, 5+ reps)
    if (!exerciseHitsMuscle(exercise)) continue;
    
    // Get muscles targeted by this exercise
    const targetedMuscles = getMusclesFromExercise(exercise.name);
    
    // Add all targeted muscles (they were trained today)
    for (const muscle of targetedMuscles) {
      hitMuscles.add(muscle);
    }
  }
  
  return hitMuscles;
}

/**
 * Get performance feedback based on workout score
 */
export function getWorkoutScoreFeedback(score: number, cCoefficient: number, musclesHitCount: number, readyMusclesCount: number): { 
  message: string; 
  color: string; 
  emoji: string;
  detail: string;
  showFireworks: boolean;
} {
  // Check if muscle balance is poor (hit less than 40% of ready muscles and hit at least 1 muscle)
  if (musclesHitCount > 0 && cCoefficient < 0.4 && readyMusclesCount >= 3) {
    return {
      message: "Unbalanced muscle targeting",
      color: "text-orange-400",
      emoji: "⚠️",
      detail: `Hit ${musclesHitCount}/${readyMusclesCount} ready muscles (${Math.round((musclesHitCount/readyMusclesCount) * 100)}%). Try adding exercises for underused muscle groups.`,
      showFireworks: false
    };
  }
  
  // Score-based feedback - remove generic messages, focus on data
  if (score >= 90) {
    return { 
      message: `${score} pts • ${Math.round(cCoefficient * 100)}% balance`, 
      color: 'text-green-400',
      emoji: '🏆',
      detail: `Outstanding form quality across all exercises`,
      showFireworks: true
    };
  } else if (score >= 80) {
    return { 
      message: `${score} pts • ${Math.round(cCoefficient * 100)}% balance`, 
      color: 'text-green-400',
      emoji: '✨',
      detail: `Solid execution with excellent muscle targeting`,
      showFireworks: false
    };
  } else if (score >= 70) {
    return { 
      message: `${score} pts • ${Math.round(cCoefficient * 100)}% balance`, 
      color: 'text-yellow-400',
      emoji: '💪',
      detail: `+${90 - score} pts needed for 90+ score`,
      showFireworks: false
    };
  } else if (score >= 50) {
    return { 
      message: `${score} pts • ${Math.round(cCoefficient * 100)}% balance`, 
      color: 'text-orange-400',
      emoji: '💡',
      detail: `Focus on form quality to increase score`,
      showFireworks: false
    };
  } else {
    return { 
      message: `${score} pts • ${Math.round(cCoefficient * 100)}% balance`, 
      color: 'text-red-400',
      emoji: '🎯',
      detail: `Target ready muscle groups for better results`,
      showFireworks: false
    };
  }
}