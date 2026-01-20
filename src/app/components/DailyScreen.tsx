import { useState, useEffect } from 'react';
import { Plus, X, Search, ChevronLeft, Target, Award, ChevronRight, Archive, Save, Camera, Apple, Trash2, Info, Play, Edit2, RotateCcw, Share2, Flame, Dumbbell, Trophy, Zap, Utensils, Activity, Star, Crown, TrendingUp, Anchor, Shield, ArrowUp, Rocket, Bolt, Layers, HeartPulse, CircleDot, User, Skull, Wind } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { exerciseDatabase, workoutTemplates } from '../data/exerciseDatabase-clean';
import { calculateWorkoutScore, getWorkoutScoreFeedback } from '../utils/workoutScoring';
import { calculateDietScore, calculateDailyScore } from '../utils/dailyScoring';
import type { Exercise, Meal, MuscleStatus, ArchivedWorkout, CustomTemplate } from '../App';
import type { ExerciseData, WorkoutTemplate } from '../data/exerciseDatabase-clean';
import { mockFriendsDatabase, type FriendData, type FriendStory } from '../data/mockFriendsData';
import { DailyBreakdownStory } from './DailyBreakdownStory';
import { getScoreColor, getScoreGlow, getScoreBgColor, getScoreBorderColor, getScoreShadowColor } from '../utils/scoreColors';

interface DailyScreenProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  muscleStatus: MuscleStatus[];
  setMuscleStatus: React.Dispatch<React.SetStateAction<MuscleStatus[]>>;
  onRecordExercise: (exerciseIndex: number) => void;
}

type View = 'main' | 'exercise-picker' | 'templates' | 'score-picker' | 'meal-form';

interface SavedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
}

// Icon mapper for workout templates
const getTemplateIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    'Zap': Zap,
    'Play': Play,
    'Crown': Crown,
    'Target': Target,
    'TrendingUp': TrendingUp,
    'Dumbbell': Dumbbell,
    'Anchor': Anchor,
    'Award': Award,
    'Shield': Shield,
    'Flame': Flame,
    'ArrowUp': ArrowUp,
    'Rocket': Rocket,
    'Bolt': Bolt,
    'Layers': Layers,
    'Activity': Activity,
    'HeartPulse': HeartPulse,
    'CircleDot': CircleDot,
    'User': User,
    'Skull': Skull,
    'Wind': Wind
  };
  const IconComponent = icons[iconName] || Dumbbell;
  return IconComponent;
};

export function DailyScreen({ 
  exercises, 
  setExercises, 
  meals, 
  setMeals,
  muscleStatus,
  setMuscleStatus,
  onRecordExercise
}: DailyScreenProps) {
  const [currentView, setCurrentView] = useState<View>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [archivedWorkouts, setArchivedWorkouts] = useState<ArchivedWorkout[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [showProgressPicPrompt, setShowProgressPicPrompt] = useState(false);
  const [showCustomTemplatePrompt, setShowCustomTemplatePrompt] = useState(false);
  const [customTemplateName, setCustomTemplateName] = useState('');
  const [activeTemplateName, setActiveTemplateName] = useState<string | null>(null); // Track active template name
  const [progressPicPreview, setProgressPicPreview] = useState<string | null>(null);
  const [showFormVideo, setShowFormVideo] = useState(false);
  const [selectedFormExercise, setSelectedFormExercise] = useState<ExerciseData | null>(null);
  const [showCustomizeExercise, setShowCustomizeExercise] = useState(false);
  const [pendingExercise, setPendingExercise] = useState<ExerciseData | null>(null);
  const [customSets, setCustomSets] = useState(3);
  const [customReps, setCustomReps] = useState(12);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  // Friends and Story state
  const [friends, setFriends] = useState<FriendData[]>(mockFriendsDatabase);
  const [viewingStory, setViewingStory] = useState<FriendStory | null>(null);
  const [viewingOwnStory, setViewingOwnStory] = useState(false);
  
  // Meal form state
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [showSavedMeals, setShowSavedMeals] = useState(false);

  // Calculate total calories and protein from meals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const calorieGoal = 2400;
  const proteinGoal = 180;

  // Check if user has workout or meals
  const hasWorkout = exercises.length > 0;
  const hasMeals = meals.length > 0;

  // Calculate workout score
  const workoutScoreData = calculateWorkoutScore(exercises, muscleStatus);
  const workoutFeedback = getWorkoutScoreFeedback(
    workoutScoreData.score, 
    workoutScoreData.cCoefficient,
    workoutScoreData.musclesHitCount,
    workoutScoreData.readyMusclesCount
  );

  // Calculate diet score
  const dietScoreData = calculateDietScore(totalCalories, totalProtein, calorieGoal, proteinGoal);

  // Calculate total daily score
  const dailyScoreData = calculateDailyScore(
    workoutScoreData.score, 
    dietScoreData.score,
    totalCalories,
    totalProtein,
    calorieGoal,
    proteinGoal,
    hasWorkout
  );

  // Load saved meals from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('forcheck-saved-meals');
    if (saved) {
      try {
        setSavedMeals(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved meals:', e);
      }
    }
  }, []);

  // Save to localStorage whenever savedMeals changes
  useEffect(() => {
    localStorage.setItem('forcheck-saved-meals', JSON.stringify(savedMeals));
  }, [savedMeals]);

  const handleTemplateStart = (template: WorkoutTemplate) => {
    // Add ALL exercises from template immediately with null scores
    const newExercises = template.exercises
      .map(id => exerciseDatabase.find(ex => ex.id === id))
      .filter(Boolean)
      .map(ex => ({
        name: ex!.name,
        sets: ex!.baseSets,
        reps: ex!.baseReps,
        score: null,
        timestamp: new Date().toISOString(),
        fromTemplate: true // Mark as from template
      })) as Exercise[];

    setExercises([...exercises, ...newExercises]);
    setActiveTemplateName(template.name); // Track the template name
    
    // Update muscle status for all muscles that will be trained
    const musclesBeingTrained = new Set<string>();
    
    template.exercises.forEach(exerciseId => {
      const exerciseData = exerciseDatabase.find(ex => ex.id === exerciseId);
      if (exerciseData) {
        exerciseData.primaryMuscles.forEach(muscle => musclesBeingTrained.add(muscle));
        exerciseData.secondaryMuscles.forEach(muscle => musclesBeingTrained.add(muscle));
      }
    });
    
    // Mark muscles as being trained (set status to 'sore' and lastTrained to 'Today')
    setMuscleStatus(prev => prev.map(muscle => {
      if (musclesBeingTrained.has(muscle.key)) {
        return {
          ...muscle,
          status: 'sore' as const,
          lastTrained: 'Today'
        };
      }
      return muscle;
    }));
    
    setCurrentView('main');
  };

  const handleExerciseAdd = (exerciseData: ExerciseData) => {
    // Show customize modal first
    setPendingExercise(exerciseData);
    setCustomSets(exerciseData.baseSets);
    setCustomReps(exerciseData.baseReps);
    setShowCustomizeExercise(true);
  };

  const handleConfirmExercise = () => {
    if (!pendingExercise) return;

    if (editingExerciseIndex !== null) {
      // Editing existing exercise
      const updatedExercises = exercises.map((ex, i) => 
        i === editingExerciseIndex 
          ? { ...ex, sets: customSets, reps: customReps }
          : ex
      );
      setExercises(updatedExercises);
      setEditingExerciseIndex(null);
    } else {
      // Adding new exercise
      const newExercise: Exercise = {
        name: pendingExercise.name,
        sets: customSets,
        reps: customReps,
        score: null,
        timestamp: new Date().toISOString(),
        fromTemplate: false // Mark as custom
      };
      setExercises([...exercises, newExercise]);
      setCurrentView('main');
    }
    
    setShowCustomizeExercise(false);
    setPendingExercise(null);
  };

  const handleEditExercise = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent rating from triggering
    const exercise = exercises[index];
    const exerciseData = exerciseDatabase.find(ex => ex.name === exercise.name);
    
    if (exerciseData) {
      setPendingExercise(exerciseData);
      setCustomSets(exercise.sets);
      setCustomReps(exercise.reps);
      setEditingExerciseIndex(index);
      setShowCustomizeExercise(true);
    }
  };

  const handleRateExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setCurrentView('score-picker');
  };

  const handleScoreSelect = (score: number) => {
    if (selectedExerciseIndex === null) return;

    const updatedExercises = exercises.map((ex, i) => 
      i === selectedExerciseIndex ? { ...ex, score } : ex
    );

    setExercises(updatedExercises);

    // Update muscle status for this exercise
    const exercise = exercises[selectedExerciseIndex];
    const exerciseData = exerciseDatabase.find(ex => ex.name === exercise.name);
    
    if (exerciseData) {
      const affectedMuscles = [...exerciseData.primaryMuscles, ...exerciseData.secondaryMuscles];
      setMuscleStatus(prev => prev.map(muscle => {
        if (affectedMuscles.includes(muscle.key)) {
          return {
            ...muscle,
            status: 'sore' as const,
            lastTrained: 'Today',
            setsToday: muscle.setsToday + exercise.sets
          };
        }
        return muscle;
      }));
    }

    setSelectedExerciseIndex(null);
    setCurrentView('main');
  };

  const handleResetWorkout = () => {
    setShowResetConfirmation(true);
  };

  const confirmResetWorkout = () => {
    setExercises([]);
    setActiveTemplateName(null);
    setShowResetConfirmation(false);
  };

  const handleArchiveWorkout = (withPic: boolean = false) => {
    if (withPic) {
      setShowProgressPicPrompt(true);
    } else {
      archiveCurrentWorkout();
    }
  };

  const archiveCurrentWorkout = (progressPic?: string) => {
    const archived: ArchivedWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [...exercises],
      totalScore: workoutScoreData.score,
      cCoefficient: workoutScoreData.cCoefficient,
      progressPic
    };
    
    setArchivedWorkouts([archived, ...archivedWorkouts]);
    setExercises([]);
    setMeals([]);
    setShowProgressPicPrompt(false);
    setProgressPicPreview(null);
  };

  const handleSaveAsTemplate = () => {
    if (exercises.length === 0) return;
    
    setShowCustomTemplatePrompt(true);
  };

  const confirmSaveTemplate = () => {
    if (!customTemplateName.trim()) return;

    const newTemplate: CustomTemplate = {
      id: Date.now().toString(),
      name: customTemplateName,
      exercises: [...exercises],
      createdAt: new Date().toISOString()
    };

    setCustomTemplates([...customTemplates, newTemplate]);
    setShowCustomTemplatePrompt(false);
    setCustomTemplateName('');
  };

  const handleProgressPicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProgressPicPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleRemoveMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleDeleteCustomTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent template from being selected
    if (confirm('Delete this custom template?')) {
      setCustomTemplates(customTemplates.filter(t => t.id !== templateId));
    }
  };

  const handleViewExerciseForm = (exerciseName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent rating from triggering
    const exerciseData = exerciseDatabase.find(ex => ex.name === exerciseName);
    if (exerciseData) {
      setSelectedFormExercise(exerciseData);
      setShowFormVideo(true);
    }
  };

  const handleAddMeal = () => {
    if (!mealName || !mealCalories || !mealProtein) return;

    const calories = parseInt(mealCalories);
    const protein = parseInt(mealProtein);

    const newMeal: Meal = {
      name: mealName,
      calories,
      protein,
      score: 85
    };

    setMeals([...meals, newMeal]);
    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setCurrentView('main');
  };

  const handleSaveMealForFuture = () => {
    if (!mealName || !mealCalories || !mealProtein) return;

    const calories = parseInt(mealCalories);
    const protein = parseInt(mealProtein);

    const savedMeal: SavedMeal = {
      id: Date.now().toString(),
      name: mealName,
      calories,
      protein
    };

    // Check if meal with same name already exists
    const exists = savedMeals.some(m => m.name.toLowerCase() === mealName.toLowerCase());
    if (exists) {
      alert('A meal with this name already exists!');
      return;
    }

    setSavedMeals([...savedMeals, savedMeal]);
    alert(`✅ "${mealName}" saved for future use!`);
  };

  const handleLoadSavedMeal = (meal: SavedMeal) => {
    setMealName(meal.name);
    setMealCalories(meal.calories.toString());
    setMealProtein(meal.protein.toString());
    setShowSavedMeals(false);
    setCurrentView('meal-form'); // Open the meal form so user can see the loaded data
  };

  const handleDeleteSavedMeal = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this saved meal?')) {
      setSavedMeals(savedMeals.filter(m => m.id !== mealId));
    }
  };

  const handleQuickAddSavedMeal = (meal: SavedMeal) => {
    const newMeal: Meal = {
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      score: 85
    };
    setMeals([...meals, newMeal]);
    setShowSavedMeals(false);
  };

  // Friends and Story handlers
  const handleViewFriendStory = (friend: FriendData) => {
    if (friend.currentStory) {
      setViewingStory(friend.currentStory);
      // Mark story as viewed
      setFriends(friends.map(f => 
        f.id === friend.id ? { ...f, storyViewed: true } : f
      ));
    }
  };

  const handleViewOwnStory = () => {
    // Generate user's own daily breakdown story
    const ownStory: FriendStory = {
      id: 'own-story',
      userId: 'me',
      userName: 'You',
      userAvatar: '🔥',
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      dailyScore: dailyScoreData.score,
      workoutScore: workoutScoreData.score,
      dietScore: dietScoreData.score,
      exercises: exercises,
      meals: meals,
      isViewed: false,
      isPublic: true,
    };
    setViewingStory(ownStory);
    setViewingOwnStory(true);
  };

  const handleCloseStory = () => {
    setViewingStory(null);
    setViewingOwnStory(false);
  };

  const filteredExercises = exerciseDatabase.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs', label: 'Legs' },
    { id: 'core', label: 'Core' },
    { id: 'full-body', label: 'Full' },
  ];

  // SCORE PICKER VIEW
  if (currentView === 'score-picker' && selectedExerciseIndex !== null) {
    const exercise = exercises[selectedExerciseIndex];
    const exerciseData = exerciseDatabase.find(ex => ex.name === exercise.name);

    // Generate scores from 0-100 in increments of 10
    const scoreValues = Array.from({ length: 11 }, (_, i) => i * 10);
    
    // Score color system for Rate Your Form screen
    const getScoreTextColor = (score: number) => {
      if (score >= 90) return 'text-green-500';
      if (score >= 80) return 'text-green-400';
      if (score >= 70) return 'text-yellow-400';
      if (score >= 60) return 'text-orange-400';
      if (score >= 50) return 'text-orange-500';
      return 'text-red-500';
    };

    const getScoreBorderColor = (score: number) => {
      if (score >= 90) return 'border-green-500/70';
      if (score >= 80) return 'border-green-400/70';
      if (score >= 70) return 'border-yellow-400/70';
      if (score >= 60) return 'border-orange-400/70';
      if (score >= 50) return 'border-orange-500/70';
      return 'border-red-500/70';
    };

    // Base background for all rows (always visible)
    const getScoreBaseBg = (score: number) => {
      if (score >= 90) return 'bg-green-500/8';
      if (score >= 80) return 'bg-green-400/8';
      if (score >= 70) return 'bg-yellow-400/8';
      if (score >= 60) return 'bg-orange-400/8';
      if (score >= 50) return 'bg-orange-500/8';
      return 'bg-red-500/8';
    };

    // Selected background (stronger)
    const getScoreSelectedBg = (score: number) => {
      if (score >= 90) return 'bg-green-500/20';
      if (score >= 80) return 'bg-green-400/20';
      if (score >= 70) return 'bg-yellow-400/18';
      if (score >= 60) return 'bg-orange-400/18';
      if (score >= 50) return 'bg-orange-500/18';
      return 'bg-red-500/20';
    };

    const getScoreGlowColor = (score: number) => {
      if (score >= 90) return 'shadow-xl shadow-green-500/30';
      if (score >= 80) return 'shadow-xl shadow-green-400/30';
      if (score >= 70) return 'shadow-xl shadow-yellow-400/30';
      if (score >= 60) return 'shadow-xl shadow-orange-400/30';
      if (score >= 50) return 'shadow-xl shadow-orange-500/30';
      return 'shadow-xl shadow-red-500/30';
    };

    const getScoreLabel = (score: number) => {
      if (score >= 95) return 'Elite';
      if (score >= 90) return 'Excellent';
      if (score >= 80) return 'Great';
      if (score >= 70) return 'Good';
      if (score >= 60) return 'Fair';
      if (score >= 40) return 'Needs Work';
      return 'Poor';
    };

    return (
      <div className="flex flex-col h-full relative overflow-hidden">
        {/* Consistent background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d23] via-[#1a1d23] to-[#1a1d23]" />
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-transparent to-blue-950/5 animate-pulse-slow"
            style={{ animationDuration: '16s' }}
          />
        </div>

        <div className="px-6 py-6 border-b border-border/50 backdrop-blur-sm relative z-10">
          <button 
            onClick={() => {
              setSelectedExerciseIndex(null);
              setCurrentView('main');
            }}
            className="p-2 hover:bg-[#2a2e38]/50 rounded-lg transition-all duration-200 mb-4 -ml-2 active:scale-95 hover:shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center mb-2">
            <div className="mb-3 flex justify-center">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/40">
                <Dumbbell className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h2 className="font-bold mb-1">{exercise.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto relative z-10">
          <h3 className="font-bold text-center mb-2">Rate Your Form</h3>
          <p className="text-sm text-white/60 text-center mb-6">How did your form feel for this exercise?</p>
          
          {/* Score Feedback */}
          {exercise.score !== undefined && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${getScoreBorderColor(exercise.score)} ${getScoreSelectedBg(exercise.score)} ${getScoreGlowColor(exercise.score)} animate-in fade-in slide-in-from-top-2 duration-300`}>
              <div className="text-center">
                <div className={`text-sm font-bold mb-1 ${getScoreTextColor(exercise.score)}`}>
                  {getScoreLabel(exercise.score)}
                </div>
                <p className="text-xs text-white/70">
                  {exercise.score >= 80 ? 'Excellent work! Keep it up.' : 
                   exercise.score >= 60 ? 'Good effort. Focus on form next time.' : 
                   'Room to improve. Watch technique videos.'}
                </p>
              </div>
            </div>
          )}
          
          {/* Score List */}
          <div className="space-y-2">
            {scoreValues.map((score, index) => {
              const isSelected = exercise.score === score;
              const showDivider = score === 10 || score === 30 || score === 50;
              
              return (
                <div key={score}>
                  {showDivider && index > 0 && (
                    <div className="py-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
                    </div>
                  )}
                  <button
                    onClick={() => handleScoreSelect(score)}
                    className={`w-full p-5 rounded-xl transition-all duration-300 ${
                      isSelected 
                        ? `${getScoreSelectedBg(score)} ${getScoreBorderColor(score)} border-2 ${getScoreGlowColor(score)} scale-[1.02]`
                        : `${getScoreBaseBg(score)} border border-gray-800/50 hover:border-gray-700/70 hover:scale-[1.01] ${!isSelected && exercise.score !== undefined ? 'opacity-60' : ''}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`text-base font-bold transition-all duration-300 ${
                        isSelected ? 'text-white' : 'text-white/90'
                      }`}>
                        {getScoreLabel(score)}
                      </div>
                      <div className={`text-3xl font-black transition-all duration-300 ${getScoreTextColor(score)} ${
                        isSelected ? 'drop-shadow-[0_0_12px_currentColor]' : ''
                      }`}>
                        {score}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATES VIEW
  if (currentView === 'templates') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="font-bold">Workout Templates</h2>
              <p className="text-sm text-muted-foreground font-medium">
                {workoutTemplates.length} programs + {customTemplates.length} custom
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
          {customTemplates.length > 0 && (
            <>
              <h3 className="font-bold text-sm text-blue-400">Your Templates</h3>
              {customTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className="p-5 bg-card border-border cursor-pointer hover:bg-gray-800 transition-all relative"
                >
                  <div 
                    onClick={() => {
                      const exercisesToAdd = template.exercises.map(ex => ({
                        ...ex,
                        score: null,
                        timestamp: new Date().toISOString()
                      }));
                      setExercises([...exercises, ...exercisesToAdd]);
                      setCurrentView('main');
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <div>
                        <h4 className="font-bold text-white mb-1">{template.name}</h4>
                        <p className="text-sm text-muted-foreground font-medium">
                          {template.exercises.length} exercises • Custom
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <button
                    onClick={(e) => handleDeleteCustomTemplate(template.id, e)}
                    className="absolute top-3 right-12 p-2 rounded-full hover:bg-red-500/20 transition-colors"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </Card>
              ))}
              <h3 className="font-bold text-sm text-blue-400 mt-6">Pre-Made Templates</h3>
            </>
          )}

          {workoutTemplates.map((template) => {
            const TemplateIcon = getTemplateIcon(template.icon);
            return (
              <Card 
                key={template.id}
                onClick={() => handleTemplateStart(template)}
                className={`p-5 bg-gradient-to-br ${template.gradient} border-${template.color}-500/40 cursor-pointer hover:scale-[1.01] transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-${template.color}-500/20 rounded-lg border border-${template.color}-500/40`}>
                    <TemplateIcon className={`w-8 h-8 text-${template.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-white/70 font-medium mb-2">
                      {template.description}
                    </p>
                    <p className="text-xs text-white/60 font-semibold">
                      {template.exercises.length} exercises • {template.duration} min
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/40" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // EXERCISE PICKER VIEW
  if (currentView === 'exercise-picker') {
    return (
      <>
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => setCurrentView('main')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h2 className="font-bold">Choose Exercise</h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {exerciseDatabase.length} exercises available
                </p>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-card text-muted-foreground border border-border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-6 py-4 overflow-y-auto space-y-3">
            {filteredExercises.map((exercise) => (
              <Card 
                key={exercise.id}
                onClick={() => handleExerciseAdd(exercise)}
                className="p-4 bg-card border-border hover:bg-gray-800 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      {exercise.baseSets} sets × {exercise.baseReps} reps
                    </p>
                  </div>
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Customize Exercise Modal - Must be here for exercise picker */}
        {showCustomizeExercise && pendingExercise && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-[100]">
            <Card className="p-0 max-w-sm w-full bg-card border-border overflow-hidden">
              {/* Header */}
              <div className="p-5 bg-gray-900 border-b border-border">
                <h3 className="font-bold text-white">{pendingExercise.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{editingExerciseIndex !== null ? 'Edit your workout' : 'Customize your workout'}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Sets Picker */}
                <div>
                  <label className="text-sm font-bold text-white mb-2 block">Sets</label>
                  <select
                    value={customSets}
                    onChange={(e) => setCustomSets(parseInt(e.target.value))}
                    className="w-full px-4 py-3.5 bg-gray-900 border border-border rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer appearance-none"
                    style={{ 
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em'
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num} className="bg-gray-900 text-white py-2">
                        {num} {num === 1 ? 'set' : 'sets'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reps Picker */}
                <div>
                  <label className="text-sm font-bold text-white mb-2 block">Reps</label>
                  <select
                    value={customReps}
                    onChange={(e) => setCustomReps(parseInt(e.target.value))}
                    className="w-full px-4 py-3.5 bg-gray-900 border border-border rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer appearance-none"
                    style={{ 
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25em 1.25em'
                    }}
                  >
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num} className="bg-gray-900 text-white py-2">
                        {num} {num === 1 ? 'rep' : 'reps'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <p className="text-xs text-muted-foreground text-center mb-1">Your workout:</p>
                  <p className="text-center font-bold text-white">
                    {customSets} × {customReps} = <span className="text-blue-400">{customSets * customReps} total reps</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex gap-3">
                <Button
                  onClick={() => {
                    setShowCustomizeExercise(false);
                    setPendingExercise(null);
                    setEditingExerciseIndex(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmExercise}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {editingExerciseIndex !== null ? 'Update' : 'Add Exercise'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </>
    );
  }

  // MAIN VIEW
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Animated background gradient - very subtle, slow loop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-transparent to-blue-950/5 animate-pulse-slow"
          style={{ animationDuration: '16s' }}
        />
        {/* Additional subtle blue glow orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-blue-400/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="px-6 py-6 relative z-10 border-b border-border/50 backdrop-blur-sm">
        {/* Subtle "Today" indicator line */}
        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="mb-1 font-bold">Today's Progress</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak with subtle pulse animation */}
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-red-950/50 to-orange-950/30 border border-red-500/40 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 animate-pulse-very-slow"
              style={{ animationDuration: '4s' }}
            >
              <Flame className="w-6 h-6 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.7)]" />
              <div className="flex flex-col items-start">
                <div className="text-2xl font-black text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">7</div>
                <div className="text-xs text-red-300/80 font-medium -mt-1">days</div>
              </div>
            </div>
            {hasWorkout && (
              <button
                onClick={handleResetWorkout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                title="Reset workout"
              >
                <RotateCcw className="w-5 h-5 text-red-400 hover:drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6 relative z-10">
        {/* Daily Score with green-to-red system */}
        {(hasWorkout || hasMeals) && (
          <div 
            className="relative animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: '50ms' }}
          >
            {/* Ambient glow behind card */}
            <div className={`absolute inset-0 blur-2xl opacity-20 rounded-3xl -z-10 ${getScoreBgColor(dailyScoreData.score)}`} />
            
            <Card className="relative p-8 bg-gradient-to-br from-[#252932]/90 via-[#252932]/80 to-[#252932]/90 border border-white/10 overflow-hidden shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
              <div className="relative text-center">
                <p className="text-sm text-gray-400 font-semibold mb-4 tracking-wider uppercase">Daily Score</p>
                <div className={`text-6xl font-black transition-all duration-500 ${getScoreColor(dailyScoreData.score)} ${getScoreGlow(dailyScoreData.score)}`}>
                  {dailyScoreData.score}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Workout Section */}
        {!hasWorkout ? (
          <div 
            className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 relative"
            style={{ animationDelay: '100ms' }}
          >
            {/* Ambient blue rim light behind header */}
            <div className="absolute -inset-x-2 -top-2 h-8 bg-blue-500/5 blur-xl -z-10" />
            
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-400" />
              Start Workout
            </h3>
            <Card 
              onClick={() => setCurrentView('templates')}
              className="group p-6 bg-gradient-to-br from-card to-[#252932]/50 border border-blue-500/20 cursor-pointer hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-2 text-lg">Templates</h4>
                  <p className="text-sm text-muted-foreground">Browse and Choose a recommended workout then film your sets and get feedback</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                  <Dumbbell className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                </div>
              </div>
            </Card>
            <Card 
              onClick={() => setCurrentView('exercise-picker')}
              className="group p-6 bg-gradient-to-br from-card to-[#252932]/50 border border-blue-500/20 cursor-pointer hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-2 text-lg">Custom</h4>
                  <p className="text-sm text-muted-foreground">Create your own workout then film your sets and get feedback</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div 
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 relative"
          >
            {/* Ambient blue rim light behind workout section */}
            <div className="absolute -inset-4 bg-blue-500/5 blur-2xl -z-10 rounded-3xl" />
            
            {/* Workout Header with Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-lg border border-blue-500/50 shadow-lg shadow-blue-500/20">
                  <Dumbbell className="w-5 h-5 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">Workout</h3>
                  {activeTemplateName && (
                    <span className="text-sm text-muted-foreground font-medium">• {activeTemplateName}</span>
                  )}
                </div>
                {/* Blue Plus Button with glow */}
                <button
                  onClick={() => setCurrentView('exercise-picker')}
                  className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Add exercise"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                </button>
              </div>
              {workoutScoreData.score > 0 && (
                <div className={`text-5xl font-black transition-all duration-500 ${getScoreColor(workoutScoreData.score)} ${getScoreGlow(workoutScoreData.score)}`}>
                  {workoutScoreData.score}
                </div>
              )}
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              {[...exercises].reverse().map((exercise, reverseIndex) => {
                const index = exercises.length - 1 - reverseIndex; // Get original index
                const isRated = exercise.score !== null && exercise.score !== undefined;
                
                return (
                  <Card 
                    key={index} 
                    onClick={() => !isRated && handleRateExercise(index)}
                    className={`group p-4 bg-gradient-to-br from-card to-gray-900/50 border border-border/50 ${!isRated ? 'cursor-pointer hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10' : 'shadow-md'} transition-all duration-300 relative`}
                  >
                    {/* Header with name */}
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="font-bold text-lg text-white">
                            {exercise.name}
                          </h4>
                          {/* Timestamp next to name */}
                          {exercise.timestamp && (
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(exercise.timestamp).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEditExercise(index, e)}
                          className="p-2.5 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/40 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Edit sets/reps"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={(e) => handleViewExerciseForm(exercise.name, e)}
                          className="p-2.5 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/40 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Watch form video"
                        >
                          <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                        </button>
                      </div>
                    </div>

                    {/* Record Now Button - always visible with enhanced styling */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordExercise(index);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 mb-3 rounded-lg bg-gradient-to-r from-red-950/50 to-red-900/30 border border-red-500/40 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Camera className="w-4 h-4 text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]" />
                      <span className="text-sm font-bold text-red-400">Record Now</span>
                    </button>

                    {isRated ? (
                      <div className="space-y-3">
                        {/* Score Display with green-to-red system */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Score:</span>
                          <div className={`text-4xl font-black ${getScoreColor(exercise.score!)} ${getScoreGlow(exercise.score!)}`}>
                            {exercise.score}
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExercise(index);
                          }}
                          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Remove Exercise
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-xs font-semibold text-blue-400">Tap to rate form</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveAsTemplate}
                variant="outline"
                className="flex-1 text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        )}

        {/* Meal Section */}
        {!hasMeals ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Utensils className="w-5 h-5 text-blue-400" />
              Track Nutrition
            </h3>
            <Card 
              onClick={() => setCurrentView('meal-form')}
              className="group p-6 bg-gradient-to-br from-card to-gray-900/50 border border-blue-500/20 cursor-pointer hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-2 text-lg">Add Meals</h4>
                  <p className="text-sm text-muted-foreground">Track your nutrition</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                  <Utensils className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold">
                <div className="p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg border border-orange-500/30 shadow-md shadow-orange-500/20">
                  <Apple className="w-5 h-5 text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]" />
                </div>
                <span className="text-orange-400">Nutrition</span>
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSavedMeals(true)}
                  size="sm"
                  variant="outline"
                  className="text-xs px-3"
                  title="Browse saved meals"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Saved
                </Button>
                <Button
                  onClick={() => setCurrentView('meal-form')}
                  size="sm"
                  className="bg-gradient-to-r from-orange-600/30 to-pink-600/20 border-orange-500/50 hover:shadow-[0_0_10px_rgba(251,146,60,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Nutrition Progress Bars with enhanced depth */}
            <Card className="p-5 bg-gradient-to-br from-[#252932]/90 to-[#1a1d23]/70 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <div className="space-y-4">
                {/* Calories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-lg border border-orange-500/30">
                        <Flame className="w-5 h-5 text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]" />
                      </div>
                      <p className="text-sm font-bold text-white">Calories</p>
                    </div>
                    <p className="font-bold text-white">
                      <span className={totalCalories >= calorieGoal * 0.9 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-blue-400'}>
                        {totalCalories}
                      </span>
                      <span className="text-muted-foreground"> / {calorieGoal}</span>
                    </p>
                  </div>
                  <div className="h-2.5 bg-gray-800/80 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Protein */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30">
                        <Zap className="w-5 h-5 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
                      </div>
                      <p className="text-sm font-bold text-white">Protein</p>
                    </div>
                    <p className="font-bold text-white">
                      <span className={totalProtein >= proteinGoal * 0.9 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-blue-400'}>
                        {totalProtein}g
                      </span>
                      <span className="text-muted-foreground"> / {proteinGoal}g</span>
                    </p>
                  </div>
                  <div className="h-2.5 bg-gray-800/80 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      style={{ width: `${Math.min((totalProtein / proteinGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Meal List */}
            <div className="space-y-2">
              {meals.map((meal, index) => (
                <Card key={index} className="group p-3 bg-gradient-to-br from-card to-gray-900/50 border border-border/50 hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30 shadow-md shadow-blue-500/10">
                      <Apple className="w-6 h-6 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{meal.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {meal.calories} cal • {meal.protein}g protein
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMeal(index)}
                      className="p-1.5 hover:bg-red-500/20 rounded transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Friends Section with enhanced depth */}
        {(hasWorkout || hasMeals) && (
          <div className="mt-8 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Card className="border border-blue-500/20 overflow-hidden shadow-2xl shadow-blue-500/10 bg-gradient-to-br from-[#252932]/90 to-[#1a1d23]/70">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-blue-950/20 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-lg border border-blue-500/50 shadow-lg shadow-blue-500/20">
                      <Trophy className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Friends</h3>
                      <p className="text-xs text-muted-foreground">See who's crushing it today</p>
                    </div>
                  </div>
                  <button
                    onClick={handleViewOwnStory}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/50 hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-blue-400">Share</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stories Row with enhanced animations */}
              <div className="px-5 py-5 flex gap-4 overflow-x-auto scrollbar-hide">
                {friends.map((friend, idx) => (
                  <button
                    key={friend.id}
                    onClick={() => handleViewFriendStory(friend)}
                    disabled={!friend.hasStory}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 ${
                      !friend.hasStory ? 'opacity-40' : 'hover:scale-110 cursor-pointer'
                    } transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Story Ring with glow */}
                    <div className="relative">
                      <div className={`relative ${ 
                        friend.hasStory 
                          ? !friend.storyViewed 
                            ? 'p-[3px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/40' 
                            : 'p-[3px] bg-gray-600 rounded-full'
                          : 'p-[3px] bg-gray-800 rounded-full'
                      }`}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#252932] to-[#1a1d23] flex items-center justify-center text-2xl border-[3px] border-background shadow-inner">
                          {friend.avatar}
                        </div>
                        {friend.hasStory && !friend.storyViewed && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background shadow-lg shadow-blue-500/50 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Name & Score */}
                    <div className="text-center max-w-[70px]">
                      <p className="text-xs font-bold text-white truncate mb-0.5">
                        {friend.name}
                      </p>
                      <div className={`text-xs font-black px-2 py-0.5 rounded-full border shadow-md ${getScoreBgColor(friend.todayScore)} ${getScoreColor(friend.todayScore)} ${getScoreBorderColor(friend.todayScore)} ${getScoreShadowColor(friend.todayScore)}`}>
                        {friend.todayScore}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Podium-style Leaderboard with enhanced depth */}
              <div className="px-5 pb-5">
                <div className="bg-gradient-to-br from-[#252932] to-[#1a1d23] rounded-2xl p-4 border border-blue-500/20 shadow-xl shadow-blue-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-lg border border-yellow-500/30">
                      <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Today's Top 3</h4>
                  </div>
                  <div className="flex gap-2">
                    {friends
                      .sort((a, b) => b.todayScore - a.todayScore)
                      .slice(0, 3)
                      .map((friend, index) => (
                        <div
                          key={friend.id}
                          className={`relative flex-1 rounded-xl p-3 border transition-all duration-300 hover:scale-105 ${ 
                            index === 0 ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-500/20' :
                            index === 1 ? 'bg-gradient-to-br from-[#2a2e38]/50 to-[#252932]/50 border-white/20 shadow-md' :
                            'bg-gradient-to-br from-card to-[#252932]/50 border-border/50 shadow-sm'
                          }`}
                        >
                          {/* Zap for first place with animation */}
                          {index === 0 && (
                            <div className="absolute top-1 right-1 animate-pulse">
                              <Zap className="w-4 h-4 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)] fill-blue-400" />
                            </div>
                          )}
                          
                          <div className="flex flex-col items-center gap-2">
                            <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                              index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/40' :
                              index === 1 ? 'bg-gradient-to-br from-[#3a3e48] to-[#2a2e38] text-white shadow-[#3a3e48]/40' :
                              'bg-gradient-to-br from-[#2a2e38] to-[#252932] text-white shadow-[#2a2e38]/40'
                            }`}>
                              {index === 0 ? '👑' : index + 1}
                            </div>
                            <div className="text-xl">{friend.avatar}</div>
                            <p className="text-xs font-bold text-white truncate max-w-full">{friend.name}</p>
                            <div className={`text-lg font-black ${getScoreColor(friend.todayScore)} ${getScoreGlow(friend.todayScore)}`}>
                              {friend.todayScore}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Progress Pic Modal */}
      {showProgressPicPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-6 max-w-sm w-full bg-card">
            <h3 className="font-bold mb-4">Add Progress Pic</h3>
            {progressPicPreview ? (
              <div className="mb-4">
                <img src={progressPicPreview} alt="Preview" className="w-full rounded-lg" />
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Upload a photo</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProgressPicUpload}
              className="mb-4 text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => archiveCurrentWorkout(progressPicPreview || undefined)}
                className="flex-1 bg-green-600/30 border-green-500/50"
              >
                Archive
              </Button>
              <Button
                onClick={() => {
                  setShowProgressPicPrompt(false);
                  setProgressPicPreview(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Meal Form Modal */}
      {currentView === 'meal-form' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-6 max-w-sm w-full bg-card">
            <h3 className="font-bold mb-4">Add Meal</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Meal Name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <input
                type="number"
                placeholder="Calories"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={mealProtein}
                onChange={(e) => setMealProtein(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
            
            {/* Saved Meals Button */}
            <button
              onClick={() => setShowSavedMeals(true)}
              className="w-full mt-3 py-2.5 px-4 bg-blue-600/40 hover:bg-blue-600/50 border border-blue-500/50 rounded-lg text-sm font-medium text-blue-200 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2"
            >
              <Apple className="w-4 h-4" />
              Browse Saved Meals ({savedMeals.length})
            </button>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddMeal}
                className="flex-1 bg-green-600/60 hover:bg-green-600/70 border-green-500/60 text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
              <Button
                onClick={handleSaveMealForFuture}
                className="flex-1 bg-purple-600/60 hover:bg-purple-600/70 border-purple-500/60 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save for Future
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => setCurrentView('main')}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Form Video Modal */}
      {showFormVideo && selectedFormExercise && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <Card className="p-0 max-w-md w-full bg-gradient-to-br from-[#252932] to-[#1a1d23] border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-white/10">
              <h3 className="font-bold text-white">{selectedFormExercise.name}</h3>
              <p className="text-xs text-gray-400 mt-1">Proper Form Tutorial</p>
            </div>

            {/* Mock Video Player */}
            <div className="relative aspect-video bg-black">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-600/30 border-4 border-blue-500 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                  <p className="text-white font-bold">Form Tutorial Video</p>
                  <p className="text-xs text-slate-300 mt-1">(Demo placeholder)</p>
                </div>
              </div>
              {/* Video Controls UI */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-center gap-2">
                  <div className="w-full h-1 bg-white/20 rounded-full">
                    <div className="w-0 h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Info */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                  <p className="text-sm font-bold text-white">Target Muscles</p>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  <span className="text-blue-300">Primary:</span> {selectedFormExercise.primaryMuscles.join(', ')}
                </p>
                <p className="text-xs text-slate-400 pl-7 mt-1">
                  <span className="text-purple-300">Secondary:</span> {selectedFormExercise.secondaryMuscles.join(', ')}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                  <p className="text-sm font-bold text-white">Recommended Volume</p>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  {selectedFormExercise.baseSets} sets × {selectedFormExercise.baseReps} reps
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📊</span>
                  <p className="text-sm font-bold text-white">Difficulty</p>
                </div>
                <p className="text-xs text-slate-400 pl-7 capitalize">
                  {selectedFormExercise.difficulty}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-4 pt-0">
              <Button
                onClick={() => setShowFormVideo(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 border-slate-600"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Customize Exercise Modal - Must be outside view checks to always render */}
      {showCustomizeExercise && pendingExercise && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-[100]">
          <Card className="p-0 max-w-sm w-full bg-gradient-to-br from-[#252932] to-[#1a1d23] border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-white/10">
              <h3 className="font-bold text-white">{pendingExercise.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{editingExerciseIndex !== null ? 'Edit your workout' : 'Customize your workout'}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Sets Picker */}
              <div>
                <label className="text-sm font-bold text-white mb-2 block">Sets</label>
                <select
                  value={customSets}
                  onChange={(e) => setCustomSets(parseInt(e.target.value))}
                  className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-600 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer appearance-none"
                  style={{ 
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25em 1.25em'
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num} className="bg-slate-800 text-white py-2">
                      {num} {num === 1 ? 'set' : 'sets'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reps Picker */}
              <div>
                <label className="text-sm font-bold text-white mb-2 block">Reps</label>
                <select
                  value={customReps}
                  onChange={(e) => setCustomReps(parseInt(e.target.value))}
                  className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-600 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer appearance-none"
                  style={{ 
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25em 1.25em'
                  }}
                >
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num} className="bg-slate-800 text-white py-2">
                      {num} {num === 1 ? 'rep' : 'reps'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-xl border border-green-500/30">
                <p className="text-xs text-slate-400 text-center mb-1">Your workout:</p>
                <p className="text-center font-bold text-white">
                  {customSets} × {customReps} = <span className="text-green-400">{customSets * customReps} total reps</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 flex gap-3">
              <Button
                onClick={() => {
                  setShowCustomizeExercise(false);
                  setPendingExercise(null);
                  setEditingExerciseIndex(null);
                }}
                variant="outline"
                className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmExercise}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-green-500 shadow-lg shadow-green-500/20"
              >
                {editingExerciseIndex !== null ? 'Update' : 'Add Exercise'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Template Prompt Modal */}
      {showCustomTemplatePrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-6 max-w-sm w-full bg-card">
            <h3 className="font-bold mb-4">Save Template</h3>
            <input
              type="text"
              placeholder="Template Name"
              value={customTemplateName}
              onChange={(e) => setCustomTemplateName(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={confirmSaveTemplate}
                className="flex-1 bg-green-600/30 border-green-500/50"
              >
                Save Template
              </Button>
              <Button
                onClick={() => setShowCustomTemplatePrompt(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Reset Workout Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-6 max-w-sm w-full bg-card border-red-500/30">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Reset Workout?</h3>
              <p className="text-sm text-muted-foreground">
                This will clear all exercises from your current workout. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={confirmResetWorkout}
                className="flex-1 bg-red-600/30 border-red-500/50 hover:bg-red-600/50"
              >
                Reset
              </Button>
              <Button
                onClick={() => setShowResetConfirmation(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Saved Meals Modal */}
      {showSavedMeals && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-0 max-w-md w-full bg-card max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold">Saved Meals</h3>
                <p className="text-xs text-muted-foreground mt-1">{savedMeals.length} saved</p>
              </div>
              <button
                onClick={() => setShowSavedMeals(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Saved Meals List */}
            <div className="flex-1 overflow-y-auto p-4">
              {savedMeals.length === 0 ? (
                <div className="text-center py-12">
                  <Apple className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium mb-2">No saved meals yet</p>
                  <p className="text-xs text-muted-foreground/70">
                    Save your favorite meals for quick access
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedMeals.map(meal => (
                    <div
                      key={meal.id}
                      className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-border/50 rounded-lg hover:border-blue-500/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{meal.name}</h4>
                          <div className="flex gap-4 mt-2">
                            <div className="text-xs">
                              <span className="text-muted-foreground">Calories:</span>{' '}
                              <span className="font-bold text-orange-400">{meal.calories}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Protein:</span>{' '}
                              <span className="font-bold text-blue-400">{meal.protein}g</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSavedMeal(meal.id, e)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadSavedMeal(meal)}
                          className="flex-1 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300 transition-colors"
                        >
                          Load to Form
                        </button>
                        <button
                          onClick={() => handleQuickAddSavedMeal(meal)}
                          className="flex-1 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-xs font-medium text-green-300 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Quick Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button
                onClick={() => setShowSavedMeals(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Daily Breakdown Story Modal */}
      {viewingStory && (
        <DailyBreakdownStory
          story={viewingStory}
          onClose={handleCloseStory}
          isOwnStory={viewingOwnStory}
        />
      )}
    </div>
  );
}