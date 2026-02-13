import * as FileSystem from 'expo-file-system';
import type { SelectedExercise } from './cameraSelection';

export type AnalyzeResponse = {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  sets?: number;
};

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://tonyhqanguyen-push-up-analyzer.hf.space';

export async function uploadAndAnalyze(videoUri: string, exercise: SelectedExercise): Promise<AnalyzeResponse> {
  const info = await FileSystem.getInfoAsync(videoUri);
  if (!info.exists) {
    throw new Error('Video file not found on device.');
  }

  const form = new FormData();
  form.append('video', {
    uri: videoUri,
    type: 'video/mp4',
    name: `workout-${Date.now()}.mp4`
  } as never);
  form.append('exerciseName', exercise.name);
  form.append('sets', String(exercise.sets));
  form.append('reps', String(exercise.reps));

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: form
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Upload failed with status ${response.status}`);
  }

  const json = await response.json();
  return {
    score: Number(json.score ?? 0),
    feedback: json.feedback ?? 'Analysis complete.',
    strengths: Array.isArray(json.strengths) ? json.strengths : [],
    improvements: Array.isArray(json.improvements) ? json.improvements : [],
    sets: Number(json.sets ?? exercise.sets)
  };
}
