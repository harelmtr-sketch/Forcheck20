import { loadJson, saveJson } from './storage';

export type SelectedExercise = {
  name: string;
  sets: number;
  reps: number;
};

const CAMERA_SELECTION_KEY = 'kinetic_selected_exercise';

export async function loadSelectedExercise(): Promise<SelectedExercise | null> {
  return (await loadJson<SelectedExercise>(CAMERA_SELECTION_KEY)) ?? null;
}

export async function saveSelectedExercise(exercise: SelectedExercise): Promise<void> {
  await saveJson(CAMERA_SELECTION_KEY, exercise);
}

export async function clearSelectedExercise(): Promise<void> {
  await saveJson(CAMERA_SELECTION_KEY, null);
}
