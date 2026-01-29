import { loadJson, saveJson } from './storage';
import type { ExerciseEntry, MealEntry } from './workoutStorage';

export interface ArchiveEntry {
  id: string;
  date: string;
  totalScore: number;
  exercises: ExerciseEntry[];
  meals: MealEntry[];
}

const ARCHIVE_KEY = 'kinetic_archives';

export async function loadArchives(): Promise<ArchiveEntry[]> {
  const saved = await loadJson<ArchiveEntry[]>(ARCHIVE_KEY);
  return saved ?? [];
}

export async function saveArchives(entries: ArchiveEntry[]): Promise<void> {
  await saveJson(ARCHIVE_KEY, entries);
}

export async function addArchive(entry: ArchiveEntry): Promise<ArchiveEntry[]> {
  const existing = await loadArchives();
  const updated = [entry, ...existing];
  await saveArchives(updated);
  return updated;
}

export async function removeArchive(id: string): Promise<ArchiveEntry[]> {
  const existing = await loadArchives();
  const updated = existing.filter((entry) => entry.id !== id);
  await saveArchives(updated);
  return updated;
}
