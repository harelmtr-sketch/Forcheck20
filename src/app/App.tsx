import { useState, useEffect, useMemo, useCallback } from 'react';
import { Camera, BarChart3, User, Users } from 'lucide-react';
import { CameraScreen } from './components/CameraScreen';
import { DailyScreen } from './components/DailyScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LoginScreen } from './components/LoginScreen';
import { SplashScreen } from './components/SplashScreen';
import { LoginSwoosh } from './components/LoginSwoosh';
import { ScreenTransition } from './components/ScreenTransition';
import { loadWorkoutFromStorage, saveWorkoutToStorage } from './utils/workoutStorage';
import { loadSettings, updateSetting, type AppSettings } from './utils/settingsStore';
import { loadAuthState, login, logout, type AuthState } from './utils/auth';

type Tab = 'camera' | 'daily' | 'friends' | 'profile';
type View = Tab | 'settings';

// Animation direction for page transitions
type AnimationDirection = 'left' | 'right' | 'none';

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
  // Initial splash - only show once when app first loads
  const [showInitialSplash, setShowInitialSplash] = useState(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('kinetic_splash_shown');
    return splashShown !== 'true';
  });
  const [showLoginSwoosh, setShowLoginSwoosh] = useState(false);
  
  // Authentication state
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState());
  
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
    { id: 'friends' as Tab, label: 'Friends', icon: Users },
    { id: 'camera' as Tab, label: 'Camera', icon: Camera },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setCurrentView(tab);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setCurrentView('settings');
  }, []);

  const handleBackFromSettings = useCallback(() => {
    setCurrentView(activeTab);
  }, [activeTab]);

  const handleRecordExercise = useCallback((exerciseIndex: number) => {
    setExerciseToRecord(exerciseIndex);
    setActiveTab('camera');
    setCurrentView('camera');
  }, []);

  const handleLogin = useCallback((email: string) => {
    const newAuthState = login(email);
    setAuthState(newAuthState);
    // Show login swoosh after login
    setShowLoginSwoosh(true);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowInitialSplash(false);
    sessionStorage.setItem('kinetic_splash_shown', 'true');
  }, []);

  const handleLoginSwooshComplete = useCallback(() => {
    setShowLoginSwoosh(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setAuthState({ isAuthenticated: false });
  }, []);

  const renderScreen = () => {
    switch (currentView) {
      case 'camera':
        return <CameraScreen exercises={exercises} setExercises={setExercises} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} exerciseToRecord={exerciseToRecord} onRecordingComplete={() => setExerciseToRecord(null)} />;
      case 'daily':
        return <DailyScreen exercises={exercises} setExercises={setExercises} meals={meals} setMeals={setMeals} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} onRecordExercise={handleRecordExercise} />;
      case 'friends':
        return <FriendsScreen />;
      case 'profile':
        return <ProfileScreen onOpenSettings={handleOpenSettings} exercises={exercises} muscleStatus={muscleStatus} />;
      case 'settings':
        return <SettingsScreen 
          onBack={handleBackFromSettings} 
          settings={settings}
          onSettingChange={(key, value) => {
            setSettings(prev => updateSetting(key, value, prev));
          }}
          onLogout={handleLogout}
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

  // Show login screen if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        {/* Show initial splash on first load */}
        {showInitialSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </>
    );
  }

  return (
    <div className={`h-screen w-full max-w-md mx-auto text-foreground flex flex-col overflow-hidden ${settings.darkMode ? 'dark' : ''}`}>
      {/* Background with more lively gray */}
      <div className="absolute inset-0 bg-[#1a1d23] -z-10" />
      
      {/* Main Content Area */}
      <div className={`flex-1 overflow-hidden relative bg-[#1a1d23]`}>
        <ScreenTransition transitionKey={currentView}>
          {renderScreen()}
        </ScreenTransition>
      </div>

      {/* Bottom Navigation */}
      {currentView !== 'settings' && (
        <div className={`border-t border-white/[0.08] bg-[#1d2128]/95 backdrop-blur-xl`}>
          <nav className="flex items-center justify-around px-1 py-3 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-2xl transition-all duration-300 ease-out active:scale-95 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {/* Active indicator background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl transition-all duration-300 ease-out" />
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className={`relative transition-all duration-300 ease-out ${isActive ? 'scale-110' : ''}`}>
                    <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'stroke-[2]'}`} />
                  </div>
                  
                  {/* Label */}
                  <span className={`relative text-[10px] transition-all duration-300 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {tab.label}
                  </span>
                  
                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
      {/* Login Swoosh */}
      {showLoginSwoosh && <LoginSwoosh onComplete={handleLoginSwooshComplete} />}
    </div>
  );
}