import type { Meal } from '../App';

/**
 * Calculate diet score based on how close user is to their goals
 */
export function calculateDietScore(
  totalCalories: number,
  totalProtein: number,
  calorieGoal: number = 2400,
  proteinGoal: number = 180
): {
  score: number;
  calorieScore: number;
  proteinScore: number;
  feedback: { message: string; color: string; emoji: string };
} {
  // Calculate calorie score (0-100)
  // Perfect if within 5% of goal, decrease as deviation increases
  const calorieRatio = totalCalories / calorieGoal;
  let calorieScore = 0;
  
  if (calorieRatio >= 0.95 && calorieRatio <= 1.05) {
    calorieScore = 100;
  } else if (calorieRatio >= 0.85 && calorieRatio <= 1.15) {
    calorieScore = 85;
  } else if (calorieRatio >= 0.75 && calorieRatio <= 1.25) {
    calorieScore = 70;
  } else if (calorieRatio >= 0.65 && calorieRatio <= 1.35) {
    calorieScore = 55;
  } else if (calorieRatio >= 0.50 && calorieRatio <= 1.50) {
    calorieScore = 40;
  } else {
    calorieScore = 20;
  }

  // Calculate protein score (0-100)
  const proteinRatio = totalProtein / proteinGoal;
  let proteinScore = 0;
  
  if (proteinRatio >= 0.95 && proteinRatio <= 1.10) {
    proteinScore = 100;
  } else if (proteinRatio >= 0.85 && proteinRatio <= 1.20) {
    proteinScore = 85;
  } else if (proteinRatio >= 0.75 && proteinRatio <= 1.30) {
    proteinScore = 70;
  } else if (proteinRatio >= 0.65) {
    proteinScore = 55;
  } else if (proteinRatio >= 0.50) {
    proteinScore = 40;
  } else {
    proteinScore = 20;
  }

  // Overall diet score (weighted average: 60% protein, 40% calories)
  const score = Math.round(proteinScore * 0.6 + calorieScore * 0.4);

  // Get feedback
  let feedback;
  if (score >= 95) {
    feedback = {
      message: "Perfect nutrition day!",
      color: "text-green-400",
      emoji: "🏆"
    };
  } else if (score >= 85) {
    feedback = {
      message: "Excellent macro balance",
      color: "text-green-400",
      emoji: "✨"
    };
  } else if (score >= 75) {
    feedback = {
      message: "Good nutrition tracking",
      color: "text-yellow-400",
      emoji: "👍"
    };
  } else if (score >= 60) {
    feedback = {
      message: "Protein goal needs attention",
      color: "text-orange-400",
      emoji: "💡"
    };
  } else {
    feedback = {
      message: "Track more meals for accuracy",
      color: "text-blue-400",
      emoji: "📊"
    };
  }

  return {
    score,
    calorieScore,
    proteinScore,
    feedback
  };
}

/**
 * Calculate total daily score combining workout and diet
 */
export function calculateDailyScore(
  workoutScore: number,
  dietScore: number,
  totalCalories: number,
  totalProtein: number,
  calorieGoal: number,
  proteinGoal: number,
  hasWorkout: boolean
): {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  feedback: { message: string; color: string; emoji: string };
  suggestions: Array<{
    message: string;
    action: 'add-protein' | 'add-calories' | 'reduce-calories' | 'add-workout' | 'improve-form';
    priority: number;
  }>;
} {
  // Weighted average: 60% workout, 40% diet
  const score = Math.round(workoutScore * 0.6 + dietScore * 0.4);

  // Determine grade
  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 95) grade = 'S';
  else if (score >= 85) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 65) grade = 'C';
  else if (score >= 50) grade = 'D';
  else grade = 'F';

  // Generate dynamic suggestions with priority
  const suggestions: Array<{
    message: string;
    action: 'add-protein' | 'add-calories' | 'reduce-calories' | 'add-workout' | 'improve-form';
    priority: number;
  }> = [];
  
  if (score < 95) {
    // Check if no workout at all (highest priority)
    if (!hasWorkout) {
      suggestions.push({
        message: 'Start a workout to boost your score',
        action: 'add-workout',
        priority: 10
      });
    }
    
    // Check protein (high priority if very low)
    if (totalProtein < proteinGoal * 0.7) {
      const proteinNeeded = Math.round(proteinGoal - totalProtein);
      suggestions.push({
        message: `Add ${proteinNeeded}g protein to hit your goal`,
        action: 'add-protein',
        priority: 8
      });
    } else if (totalProtein < proteinGoal * 0.9) {
      const proteinNeeded = Math.round(proteinGoal - totalProtein);
      suggestions.push({
        message: `${proteinNeeded}g more protein needed`,
        action: 'add-protein',
        priority: 6
      });
    }
    
    // Check calories
    if (totalCalories < calorieGoal * 0.75) {
      const caloriesNeeded = Math.round(calorieGoal - totalCalories);
      suggestions.push({
        message: `Add ${caloriesNeeded} calories today`,
        action: 'add-calories',
        priority: 5
      });
    } else if (totalCalories < calorieGoal * 0.9) {
      const caloriesNeeded = Math.round(calorieGoal - totalCalories);
      suggestions.push({
        message: `${caloriesNeeded} calories below target`,
        action: 'add-calories',
        priority: 4
      });
    } else if (totalCalories > calorieGoal * 1.20) {
      const caloriesOver = Math.round(totalCalories - calorieGoal);
      suggestions.push({
        message: `${caloriesOver} calories over target`,
        action: 'reduce-calories',
        priority: 4
      });
    }
    
    // Check workout score (if they have a workout but it's low)
    if (hasWorkout && workoutScore < 70) {
      suggestions.push({
        message: 'Improve form quality for higher scores',
        action: 'improve-form',
        priority: 7
      });
    } else if (hasWorkout && workoutScore < 85) {
      suggestions.push({
        message: 'Focus on form to reach 85+ workout score',
        action: 'improve-form',
        priority: 5
      });
    }
  }

  // Sort suggestions by priority (highest first)
  suggestions.sort((a, b) => b.priority - a.priority);

  // Get feedback - only show for scores below 95
  let feedback;
  if (score >= 95) {
    feedback = {
      message: "Perfect day!",
      color: "text-green-400",
      emoji: "👑"
    };
  } else if (score >= 85) {
    feedback = {
      message: "Excellent work!",
      color: "text-green-400",
      emoji: "🌟"
    };
  } else {
    // For lower scores, show the first suggestion as the main message
    feedback = {
      message: suggestions[0]?.message || "Log more data to improve score",
      color: score >= 75 ? "text-yellow-400" : score >= 65 ? "text-orange-400" : "text-blue-400",
      emoji: score >= 75 ? "💪" : score >= 65 ? "💡" : "🎯"
    };
  }

  return {
    score,
    grade,
    feedback,
    suggestions
  };
}