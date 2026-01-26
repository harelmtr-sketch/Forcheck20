import { loadJson, saveJson } from './storage';

export interface ExerciseEntry {
  name: string;
  sets: number;
  reps: number;
  score: number | null;
  timestamp?: string;
}

export interface MealEntry {
  name: string;
  calories: number;
  protein: number;
  score: number;
}

export interface WorkoutSession {
  date: string;
  exercises: ExerciseEntry[];
  meals: MealEntry[];
}

const STORAGE_KEY = 'kinetic_current_workout';

export function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export async function loadWorkoutSession(): Promise<WorkoutSession> {
  const saved = await loadJson<WorkoutSession>(STORAGE_KEY);
  if (!saved || saved.date !== todayKey()) {
    const fresh = { date: todayKey(), exercises: [], meals: [] };
    await saveJson(STORAGE_KEY, fresh);
    return fresh;
  }
  return saved;
}

export async function saveWorkoutSession(session: WorkoutSession): Promise<void> {
  await saveJson(STORAGE_KEY, session);
}

export function upsertExercise(
  exercises: ExerciseEntry[],
  entry: ExerciseEntry
): ExerciseEntry[] {
  const index = exercises.findIndex((item) => item.name === entry.name);
  if (index === -1) {
    return [entry, ...exercises];
  }
  const updated = [...exercises];
  updated[index] = entry;
  return updated;
}
