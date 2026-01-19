import { useState, useEffect } from 'react';
import { Camera, BarChart3, User } from 'lucide-react';
import { CameraScreen } from './components/CameraScreen';
import { DailyScreen } from './components/DailyScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { loadWorkoutFromStorage, saveWorkoutToStorage } from './utils/workoutStorage';
import { loadSettings, updateSetting, type AppSettings } from './utils/settingsStore';

type Tab = 'camera' | 'daily' | 'profile';
type View = Tab | 'settings';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  score: number | null; // null means not yet rated
  timestamp?: string; // When it was added
  fromTemplate?: boolean; // Track if from a template workout
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  score: number;
}

export interface ArchivedWorkout {
  id: string;
  date: string;
  exercises: Exercise[];
  totalScore: number;
  cCoefficient: number;
  progressPic?: string; // Base64 image
}

export interface CustomTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  todayScore: number;
  weeklyAverage: number;
}

export interface MuscleStatus {
  name: string;
  key: string;
  status: 'ready' | 'sore' | 'recovering';
  lastTrained: string;
  setsToday: number; // Track volume today
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('camera');
  const [currentView, setCurrentView] = useState<View>('camera');
  
  // Settings state - loaded from localStorage, persisted on every change
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  
  // Lift exercises state up to App level so it persists across tab changes
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Lift meals state up to App level so it persists across tab changes
  const [meals, setMeals] = useState<Meal[]>([]);

  // Track muscle soreness status
  const [muscleStatus, setMuscleStatus] = useState<MuscleStatus[]>([
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
    { name: 'Calves', key: 'calves', status: 'ready', lastTrained: 'Never', setsToday: 0 },
  ]);

  // Track specific exercise to record from Daily tab
  const [exerciseToRecord, setExerciseToRecord] = useState<number | null>(null);

  const tabs = [
    { id: 'daily' as Tab, label: 'Daily', icon: BarChart3 },
    { id: 'camera' as Tab, label: 'Camera', icon: Camera },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentView(tab);
  };

  const handleOpenSettings = () => {
    setCurrentView('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentView(activeTab);
  };

  const handleRecordExercise = (exerciseIndex: number) => {
    setExerciseToRecord(exerciseIndex);
    setActiveTab('camera');
    setCurrentView('camera');
  };

  const renderScreen = () => {
    switch (currentView) {
      case 'camera':
        return <CameraScreen exercises={exercises} setExercises={setExercises} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} exerciseToRecord={exerciseToRecord} onRecordingComplete={() => setExerciseToRecord(null)} />;
      case 'daily':
        return <DailyScreen exercises={exercises} setExercises={setExercises} meals={meals} setMeals={setMeals} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} onRecordExercise={handleRecordExercise} />;
      case 'profile':
        return <ProfileScreen onOpenSettings={handleOpenSettings} exercises={exercises} muscleStatus={muscleStatus} />;
      case 'settings':
        return <SettingsScreen 
          onBack={handleBackFromSettings} 
          settings={settings}
          onSettingChange={(key, value) => {
            setSettings(prev => updateSetting(key, value, prev));
          }}
        />;
      default:
        return <DailyScreen exercises={exercises} setExercises={setExercises} meals={meals} setMeals={setMeals} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} onRecordExercise={handleRecordExercise} />;
    }
  };

  // Load workout from storage on mount
  useEffect(() => {
    const saved = loadWorkoutFromStorage();
    if (saved) {
      setExercises(saved.exercises);
      setMeals(saved.meals);
      setMuscleStatus(saved.muscleStatus);
    }
  }, []);

  // Save workout to storage whenever it changes
  useEffect(() => {
    saveWorkoutToStorage(exercises, meals, muscleStatus);
  }, [exercises, meals, muscleStatus]);

  return (
    <div className={`h-screen w-full ${currentView === 'camera' ? '' : 'max-w-md mx-auto'} text-foreground flex flex-col overflow-hidden ${settings.darkMode ? 'dark' : ''}`}>
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black -z-10" />
      
      {/* Main Content Area */}
      <div className={`flex-1 overflow-hidden relative ${currentView === 'camera' ? 'bg-black' : 'bg-black'}`}>
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      {currentView !== 'settings' && (
        <div className={`border-t border-border/50 bg-black/90 backdrop-blur-sm ${currentView === 'camera' ? 'absolute bottom-0 left-0 right-0 z-50' : ''}`}>
          <nav className="flex items-center justify-around px-4 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  <span className={`text-xs font-semibold ${isActive ? '' : 'font-medium'}`}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}