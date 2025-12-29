import { useState, useEffect } from 'react';
import { Camera, BarChart3, User } from 'lucide-react';
import { CameraScreen } from './components/CameraScreen';
import { DailyScreen } from './components/DailyScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { loadWorkoutFromStorage, saveWorkoutToStorage } from './utils/workoutStorage';

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
  const [darkMode, setDarkMode] = useState(true);
  
  // Settings state - lifted to persist across tabs
  const [clearOnTemplate, setClearOnTemplate] = useState(false);
  const [autoSaveWorkouts, setAutoSaveWorkouts] = useState(true);
  const [showFormScore, setShowFormScore] = useState(true);
  const [scoreDisplayMode, setScoreDisplayMode] = useState<'letter' | 'number' | 'both'>('both');
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [formTips, setFormTips] = useState(true);
  const [friendActivity, setFriendActivity] = useState(false);
  const [achievements, setAchievements] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('friends');
  const [workoutSharing, setWorkoutSharing] = useState(false);
  const [leaderboard, setLeaderboard] = useState(true);
  const [aiCoaching, setAiCoaching] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState('moderate');
  const [hapticFeedback, setHapticFeedback] = useState(true);
  
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

  const renderScreen = () => {
    switch (currentView) {
      case 'camera':
        return <CameraScreen exercises={exercises} setExercises={setExercises} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} />;
      case 'daily':
        return <DailyScreen exercises={exercises} setExercises={setExercises} meals={meals} setMeals={setMeals} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} />;
      case 'profile':
        return <ProfileScreen onOpenSettings={handleOpenSettings} exercises={exercises} muscleStatus={muscleStatus} />;
      case 'settings':
        return <SettingsScreen 
          onBack={handleBackFromSettings} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          clearOnTemplate={clearOnTemplate}
          setClearOnTemplate={setClearOnTemplate}
          autoSaveWorkouts={autoSaveWorkouts}
          setAutoSaveWorkouts={setAutoSaveWorkouts}
          showFormScore={showFormScore}
          setShowFormScore={setShowFormScore}
          scoreDisplayMode={scoreDisplayMode}
          setScoreDisplayMode={setScoreDisplayMode}
          workoutReminders={workoutReminders}
          setWorkoutReminders={setWorkoutReminders}
          formTips={formTips}
          setFormTips={setFormTips}
          friendActivity={friendActivity}
          setFriendActivity={setFriendActivity}
          achievements={achievements}
          setAchievements={setAchievements}
          profileVisibility={profileVisibility}
          setProfileVisibility={setProfileVisibility}
          workoutSharing={workoutSharing}
          setWorkoutSharing={setWorkoutSharing}
          leaderboard={leaderboard}
          setLeaderboard={setLeaderboard}
          aiCoaching={aiCoaching}
          setAiCoaching={setAiCoaching}
          aiRecommendations={aiRecommendations}
          setAiRecommendations={setAiRecommendations}
          aiDifficulty={aiDifficulty}
          setAiDifficulty={setAiDifficulty}
          hapticFeedback={hapticFeedback}
          setHapticFeedback={setHapticFeedback}
        />;
      default:
        return <DailyScreen exercises={exercises} setExercises={setExercises} meals={meals} setMeals={setMeals} muscleStatus={muscleStatus} setMuscleStatus={setMuscleStatus} />;
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
    <div className={`h-screen w-full max-w-md mx-auto text-foreground flex flex-col overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950 -z-10" />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-background/95">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      {currentView !== 'settings' && (
        <div className="border-t border-border bg-background">
          <nav className="flex items-center justify-around px-4 py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-xs font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}