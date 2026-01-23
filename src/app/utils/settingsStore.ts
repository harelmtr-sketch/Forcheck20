// Centralized settings store with localStorage persistence

export interface AppSettings {
  // Appearance
  darkMode: boolean;
  
  // Workout Preferences
  clearOnTemplate: boolean;
  autoSaveWorkouts: boolean;
  showFormScore: boolean;
  scoreDisplayMode: 'letter' | 'number' | 'both';
  
  // Notifications
  workoutReminders: boolean;
  formTips: boolean;
  friendActivity: boolean;
  achievements: boolean;
  
  // Privacy & Friends
  profileVisibility: 'public' | 'friends' | 'private';
  workoutSharing: boolean;
  leaderboard: boolean;
  
  // AI Preferences
  aiCoaching: boolean;
  aiRecommendations: boolean;
  aiDifficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Accessibility
  hapticFeedback: boolean;
};

const STORAGE_KEY = 'kinetic_settings';

const DEFAULT_SETTINGS: AppSettings = {
  // Appearance
  darkMode: true,
  
  // Workout Preferences
  clearOnTemplate: false,
  autoSaveWorkouts: true,
  showFormScore: true,
  scoreDisplayMode: 'both',
  
  // Notifications
  workoutReminders: true,
  formTips: true,
  friendActivity: true,
  achievements: true,
  
  // Privacy & Friends
  profileVisibility: 'public',
  workoutSharing: true,
  leaderboard: true,
  
  // AI Preferences
  aiCoaching: true,
  aiRecommendations: true,
  aiDifficulty: 'intermediate',
  
  // Accessibility
  hapticFeedback: true,
};

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
  currentSettings: AppSettings
): AppSettings {
  const newSettings = { ...currentSettings, [key]: value };
  saveSettings(newSettings);
  return newSettings;
}