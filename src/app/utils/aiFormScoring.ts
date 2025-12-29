/**
 * Mock AI form analysis
 * In production, this would analyze the video using computer vision
 * For now, we simulate realistic scoring based on exercise difficulty
 */

export interface FormAnalysisResult {
  score: number; // 0-100
  sets: number; // Detected number of sets
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const exerciseDifficulty: Record<string, 'easy' | 'medium' | 'hard'> = {
  // Pull exercises
  'Pull-ups': 'hard',
  'Chin-ups': 'hard',
  'Muscle-ups': 'hard',
  'Front Lever Pulls': 'hard',
  'Archer Pull-ups': 'hard',
  'Typewriter Pull-ups': 'hard',
  'One-Arm Pull-up Negatives': 'hard',
  'Inverted Rows': 'medium',
  'Australian Pull-ups': 'medium',
  'Negative Pull-ups': 'medium',
  
  // Push exercises
  'Push-ups': 'medium',
  'Diamond Push-ups': 'medium',
  'Archer Push-ups': 'hard',
  'Pike Push-ups': 'medium',
  'Handstand Push-ups': 'hard',
  'Pseudo Planche Push-ups': 'hard',
  'Decline Push-ups': 'medium',
  'Dips': 'medium',
  'Ring Dips': 'hard',
  
  // Leg exercises
  'Pistol Squats': 'hard',
  'Bulgarian Split Squats': 'medium',
  'Jump Squats': 'medium',
  'Sissy Squats': 'hard',
  'Nordic Curls': 'hard',
  'Single-Leg Deadlifts': 'medium',
  'Calf Raises': 'easy',
  
  // Core exercises
  'L-sit': 'hard',
  'Dragon Flags': 'hard',
  'Hanging Leg Raises': 'hard',
  'Ab Wheel Rollouts': 'medium',
  'Plank': 'easy',
  'Hollow Body Hold': 'medium',
};

const feedbackTemplates = {
  excellent: [
    'Perfect form! Your technique is on point.',
    'Outstanding execution! Keep it up!',
    'Flawless! You\'ve mastered this movement.',
    'Exceptional form! Elite-level performance.',
  ],
  good: [
    'Great form! Minor adjustments could help.',
    'Solid execution! Nearly perfect.',
    'Good technique! Very impressive.',
    'Strong performance! Almost there.',
  ],
  decent: [
    'Decent form! Room for improvement.',
    'Not bad! Focus on the details.',
    'Fair execution! Keep practicing.',
    'Acceptable form! You can do better.',
  ],
  poor: [
    'Form needs work! Review the basics.',
    'Subpar execution! Focus on technique.',
    'Weak form! Slow down and focus.',
    'Poor technique! Practice makes perfect.',
  ],
};

const strengthFeedback = [
  'Full range of motion',
  'Controlled tempo',
  'Good muscle engagement',
  'Stable core throughout',
  'Proper breathing pattern',
  'Consistent form across reps',
  'Good shoulder positioning',
  'Strong lockout at top',
  'Smooth movement pattern',
  'Excellent mind-muscle connection',
];

const improvementFeedback = [
  'Increase range of motion',
  'Control the negative phase',
  'Engage your core more',
  'Slow down the tempo',
  'Focus on full extension',
  'Keep elbows tucked',
  'Straighten your legs',
  'Avoid momentum',
  'Maintain neutral spine',
  'Keep shoulders retracted',
];

/**
 * Simulate AI form analysis of workout video
 * Returns a score and detailed feedback
 */
export function analyzeWorkoutForm(exerciseName: string, videoBlob?: Blob): FormAnalysisResult {
  // Get exercise difficulty (default to medium)
  const difficulty = exerciseDifficulty[exerciseName] || 'medium';
  
  // Base score ranges by difficulty
  const scoreRanges = {
    easy: { min: 70, max: 100 },
    medium: { min: 50, max: 90 },
    hard: { min: 40, max: 80 },
  };
  
  const range = scoreRanges[difficulty];
  
  // Generate semi-random score (weighted towards good performance)
  // 60% chance of upper half, 40% chance of lower half
  const isGoodPerformance = Math.random() > 0.4;
  const min = isGoodPerformance ? (range.min + range.max) / 2 : range.min;
  const max = isGoodPerformance ? range.max : (range.min + range.max) / 2;
  const score = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Select feedback based on score
  let feedbackCategory: keyof typeof feedbackTemplates;
  if (score >= 90) feedbackCategory = 'excellent';
  else if (score >= 70) feedbackCategory = 'good';
  else if (score >= 50) feedbackCategory = 'decent';
  else feedbackCategory = 'poor';
  
  const feedbackList = feedbackTemplates[feedbackCategory];
  const feedback = feedbackList[Math.floor(Math.random() * feedbackList.length)];
  
  // Select 2-3 random strengths
  const strengthCount = 2 + Math.floor(Math.random() * 2);
  const strengths = shuffleArray(strengthFeedback).slice(0, strengthCount);
  
  // Select 1-2 random improvements (more for lower scores)
  const improvementCount = score >= 70 ? 1 : 2;
  const improvements = shuffleArray(improvementFeedback).slice(0, improvementCount);
  
  // Simulate detected number of sets
  const sets = Math.floor(Math.random() * 5) + 1;
  
  return {
    score,
    sets,
    feedback,
    strengths,
    improvements,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}