import type { Exercise, Meal, MuscleStatus } from '../App';

export interface WorkoutSession {
  exercises: Exercise[];
  meals: Meal[];
  muscleStatus: MuscleStatus[];
  date: string;
}

const STORAGE_KEY = 'forcheck_current_workout';

export const saveWorkoutToStorage = (exercises: Exercise[], meals: Meal[], muscleStatus: MuscleStatus[]) => {
  const session: WorkoutSession = {
    exercises,
    meals,
    muscleStatus,
    date: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save workout to storage:', error);
  }
};

export const loadWorkoutFromStorage = (): WorkoutSession | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const session: WorkoutSession = JSON.parse(stored);
    
    // Check if it's from today
    const storedDate = new Date(session.date);
    const today = new Date();
    
    if (
      storedDate.getDate() === today.getDate() &&
      storedDate.getMonth() === today.getMonth() &&
      storedDate.getFullYear() === today.getFullYear()
    ) {
      return session;
    }
    
    // Clear old data
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Failed to load workout from storage:', error);
    return null;
  }
};

export const clearWorkoutStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear workout storage:', error);
  }
};
