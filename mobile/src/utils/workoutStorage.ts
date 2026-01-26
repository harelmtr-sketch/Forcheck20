import { loadJson, saveJson } from './storage';

export interface ExerciseEntry {
  name: string;
  sets: number;
  reps: number;
  score: number | null;
  timestamp?: string;
  fromTemplate?: boolean;
}

export interface MealEntry {
  name: string;
  calories: number;
  protein: number;
  timestamp?: string;
}

export interface MuscleStatus {
  name: string;
  key: string;
  status: 'ready' | 'sore' | 'recovering';
  lastTrained: string;
  setsToday: number;
}

export interface WorkoutSession {
  date: string;
  exercises: ExerciseEntry[];
  meals: MealEntry[];
  muscleStatus: MuscleStatus[];
}

const STORAGE_KEY = 'kinetic_current_workout';

export function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export async function loadWorkoutSession(): Promise<WorkoutSession> {
  const saved = await loadJson<WorkoutSession>(STORAGE_KEY);
  if (!saved || saved.date !== todayKey()) {
    const fresh = {
      date: todayKey(),
      exercises: [],
      meals: [],
      muscleStatus: defaultMuscleStatus()
    };
    await saveJson(STORAGE_KEY, fresh);
    return fresh;
  }
  return {
    ...saved,
    muscleStatus: saved.muscleStatus?.length ? saved.muscleStatus : defaultMuscleStatus()
  };
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

export function defaultMuscleStatus(): MuscleStatus[] {
  return [
    { name: 'Chest', key: 'chest', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Back', key: 'back', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Front Delts', key: 'front-delts', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Side Delts', key: 'side-delts', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Rear Delts', key: 'rear-delts', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Triceps', key: 'triceps', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Biceps', key: 'biceps', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Core', key: 'core', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Forearms', key: 'forearms', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Traps', key: 'traps', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Quads', key: 'quads', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Hamstrings', key: 'hamstrings', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Glutes', key: 'glutes', status: 'ready', lastTrained: 'Never', setsToday: 0 },
    { name: 'Calves', key: 'calves', status: 'ready', lastTrained: 'Never', setsToday: 0 }
  ];
}
