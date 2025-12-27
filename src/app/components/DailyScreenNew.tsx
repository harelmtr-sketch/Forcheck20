import { useState } from 'react';
import { Plus, X, Search, ChevronLeft, Target, Award, ChevronRight, Archive, Save, Camera, Apple } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { exerciseDatabase, workoutTemplates } from '../data/exerciseDatabase';
import { calculateWorkoutScore, getWorkoutScoreFeedback } from '../utils/workoutScoring';
import { calculateDietScore, calculateDailyScore } from '../utils/dailyScoring';
import type { Exercise, Meal, MuscleStatus, ArchivedWorkout, CustomTemplate } from '../App';
import type { ExerciseData, WorkoutTemplate } from '../data/exerciseDatabase';

interface DailyScreenProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  muscleStatus: MuscleStatus[];
  setMuscleStatus: React.Dispatch<React.SetStateAction<MuscleStatus[]>>;
}

type View = 'main' | 'exercise-picker' | 'templates' | 'score-picker' | 'meal-form';

export function DailyScreen({ 
  exercises, 
  setExercises, 
  meals, 
  setMeals,
  muscleStatus,
  setMuscleStatus
}: DailyScreenProps) {
  const [currentView, setCurrentView] = useState<View>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [archivedWorkouts, setArchivedWorkouts] = useState<ArchivedWorkout[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [showProgressPicPrompt, setShowProgressPicPrompt] = useState(false);
  const [progressPicPreview, setProgressPicPreview] = useState<string | null>(null);
  
  // Meal form state
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');

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
        timestamp: new Date().toISOString()
      })) as Exercise[];

    setExercises([...exercises, ...newExercises]);
    setCurrentView('main');
  };

  const handleExerciseAdd = (exerciseData: ExerciseData) => {
    // Add exercise with null score
    const newExercise: Exercise = {
      name: exerciseData.name,
      sets: exerciseData.baseSets,
      reps: exerciseData.baseReps,
      score: null,
      timestamp: new Date().toISOString()
    };

    setExercises([...exercises, newExercise]);
    setCurrentView('main');
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
    
    const templateName = prompt('Enter template name:');
    if (!templateName) return;

    const newTemplate: CustomTemplate = {
      id: Date.now().toString(),
      name: templateName,
      exercises: [...exercises],
      createdAt: new Date().toISOString()
    };

    setCustomTemplates([...customTemplates, newTemplate]);
    alert(`Template "${templateName}" saved!`);
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

    const scoreOptions = [
      { range: '95-100', value: 97, label: 'Perfect Form', color: 'from-green-600 to-emerald-500', emoji: '🏆' },
      { range: '85-94', value: 90, label: 'Excellent', color: 'from-green-500 to-green-400', emoji: '✨' },
      { range: '75-84', value: 80, label: 'Good', color: 'from-yellow-500 to-yellow-400', emoji: '👍' },
      { range: '60-74', value: 70, label: 'Decent', color: 'from-orange-500 to-orange-400', emoji: '💡' },
      { range: '0-59', value: 50, label: 'Needs Work', color: 'from-red-500 to-red-400', emoji: '🎯' },
    ];

    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-6 border-b border-border/50">
          <button 
            onClick={() => {
              setSelectedExerciseIndex(null);
              setCurrentView('main');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors mb-4 -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center mb-2">
            <div className="text-5xl mb-3">{exerciseData?.emoji || '💪'}</div>
            <h2 className="font-bold mb-1">{exercise.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
          <h3 className="font-bold text-center mb-4">How was your form?</h3>
          {scoreOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleScoreSelect(option.value)}
              className={`w-full p-5 rounded-xl bg-gradient-to-r ${option.color} hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-2xl mb-1">{option.emoji}</p>
                  <p className="font-bold text-white text-lg">{option.label}</p>
                  <p className="text-sm text-white/80 font-medium">{option.range} points</p>
                </div>
                <div className="text-3xl font-black text-white drop-shadow-lg">
                  {option.value}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // TEMPLATES VIEW
  if (currentView === 'templates') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              <h3 className="font-bold text-sm text-purple-400">Your Templates</h3>
              {customTemplates.map((template) => (
                <Card 
                  key={template.id}
                  onClick={() => {
                    const exercisesToAdd = template.exercises.map(ex => ({
                      ...ex,
                      score: null,
                      timestamp: new Date().toISOString()
                    }));
                    setExercises([...exercises, ...exercisesToAdd]);
                    setCurrentView('main');
                  }}
                  className="p-5 bg-gradient-to-br from-purple-600/25 to-pink-600/15 border-purple-500/40 cursor-pointer hover:scale-[1.02] transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white mb-1">⭐ {template.name}</h4>
                      <p className="text-sm text-white/70 font-medium">
                        {template.exercises.length} exercises • Custom
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/60" />
                  </div>
                </Card>
              ))}
              <h3 className="font-bold text-sm text-blue-400 mt-6">Pre-Made Templates</h3>
            </>
          )}

          {workoutTemplates.map((template) => (
            <Card 
              key={template.id}
              onClick={() => handleTemplateStart(template)}
              className={`p-5 bg-gradient-to-br ${template.gradient} border-${template.color}-500/40 cursor-pointer hover:scale-[1.02] transition-all shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{template.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-white/80 font-medium mb-2">
                    {template.description}
                  </p>
                  <p className="text-xs text-white/70 font-semibold">
                    {template.exercises.length} exercises • {template.duration} min
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-white/60" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // EXERCISE PICKER VIEW
  if (currentView === 'exercise-picker') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              className="w-full pl-10 pr-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary text-muted-foreground'
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
              className="p-4 bg-card border-border hover:bg-white/5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{exercise.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    {exercise.baseSets} sets × {exercise.baseReps} reps
                  </p>
                </div>
                <Plus className="w-6 h-6 text-white/60" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // MAIN VIEW
  return (
    <div className="flex flex-col h-full">
      {/* Header with Archive Button */}
      <div className="px-6 py-6 relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="mb-1 font-bold">Today's Progress</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          {hasWorkout && (
            <button
              onClick={() => handleArchiveWorkout(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Archive workout"
            >
              <Archive className="w-5 h-5 text-purple-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6">
        {/* Daily Score */}
        {(hasWorkout || hasMeals) && (
          <Card className={`p-4 border transition-all ${
            dailyScoreData.score >= 90 
              ? 'bg-gradient-to-br from-indigo-600/25 to-purple-600/20 border-indigo-400/50 shadow-[0_0_25px_rgba(99,102,241,0.3)]'
              : dailyScoreData.score >= 80
              ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/15 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
              : 'bg-gradient-to-br from-indigo-600/15 to-purple-600/10 border-indigo-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-white">Daily Score</h3>
                </div>
                <p className="text-sm text-white/70">{dailyScoreData.feedback.message}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-1">
                  {dailyScoreData.grade}
                </div>
                <div className="text-xl font-bold text-white/90">
                  {dailyScoreData.score}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Workout Section */}
        {!hasWorkout ? (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Start Workout</h3>
            <Card 
              onClick={() => setCurrentView('templates')}
              className="p-5 bg-gradient-to-br from-blue-600/20 to-purple-600/15 border-blue-400/40 cursor-pointer hover:scale-[1.02] transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white mb-1">Templates</h4>
                  <p className="text-sm text-white/70">Browse {workoutTemplates.length + customTemplates.length} workouts</p>
                </div>
                <div className="text-4xl">🏋️</div>
              </div>
            </Card>
            <Card 
              onClick={() => setCurrentView('exercise-picker')}
              className="p-5 bg-gradient-to-br from-green-600/20 to-emerald-600/15 border-green-500/40 cursor-pointer hover:scale-[1.02] transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white mb-1">Custom</h4>
                  <p className="text-sm text-white/70">Pick individual exercises</p>
                </div>
                <div className="text-4xl">💪</div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold">
                <Target className="w-5 h-5 text-blue-400" />
                Workout ({exercises.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAsTemplate}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  title="Save as template"
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => setShowProgressPicPrompt(true)}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  title="Add progress pic"
                >
                  <Camera className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => setCurrentView('exercise-picker')}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600/30 to-purple-600/20 border-blue-500/50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Workout Score */}
            {workoutScoreData.score > 0 && (
              <Card className={`p-4 border transition-all ${
                workoutScoreData.score >= 90
                  ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/15 border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                  : workoutScoreData.score >= 80
                  ? 'bg-gradient-to-br from-green-600/15 to-emerald-600/10 border-green-500/30'
                  : workoutScoreData.score >= 70
                  ? 'bg-gradient-to-br from-yellow-600/15 to-orange-600/10 border-yellow-500/30'
                  : 'bg-gradient-to-br from-orange-600/15 to-red-600/10 border-orange-500/25'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-bold ${workoutFeedback.color}`}>
                    {workoutFeedback.emoji} {workoutFeedback.message}
                  </p>
                  <p className={`text-3xl font-black ${
                    workoutScoreData.score >= 90 ? 'text-green-400' :
                    workoutScoreData.score >= 80 ? 'text-green-400' :
                    workoutScoreData.score >= 70 ? 'text-yellow-400' :
                    'text-orange-400'
                  }`}>
                    {workoutScoreData.score}
                  </p>
                </div>
              </Card>
            )}

            {/* Exercise List */}
            <div className="space-y-2">
              {exercises.map((exercise, index) => {
                const exerciseData = exerciseDatabase.find(ex => ex.name === exercise.name);
                const isRated = exercise.score !== null && exercise.score !== undefined;
                
                return (
                  <Card 
                    key={index} 
                    onClick={() => !isRated && handleRateExercise(index)}
                    className={`p-3 ${isRated ? 'bg-card' : 'bg-gradient-to-r from-purple-600/20 to-blue-600/10'} border-border ${!isRated ? 'cursor-pointer hover:bg-purple-600/25' : ''} transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{exerciseData?.emoji || '💪'}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{exercise.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} × {exercise.reps}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRated ? (
                          <p className={`text-lg font-bold ${
                            exercise.score! >= 90 ? 'text-green-400' : 
                            exercise.score! >= 80 ? 'text-yellow-400' : 
                            'text-orange-400'
                          }`}>
                            {exercise.score}
                          </p>
                        ) : (
                          <div className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded text-xs font-semibold text-purple-300">
                            Tap to rate
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExercise(index);
                          }}
                          className="p-1 hover:bg-destructive/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Meal Section */}
        {!hasMeals ? (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Track Nutrition</h3>
            <Card 
              onClick={() => setCurrentView('meal-form')}
              className="p-5 bg-gradient-to-br from-orange-600/20 to-pink-600/15 border-orange-400/40 cursor-pointer hover:scale-[1.02] transition-all hover:shadow-[0_0_15px_rgba(251,146,60,0.3)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white mb-1">Add Meals</h4>
                  <p className="text-sm text-white/70">Track your nutrition</p>
                </div>
                <div className="text-4xl">🍽️</div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold">
                <Apple className="w-5 h-5 text-orange-400" />
                Nutrition
              </h3>
              <Button
                onClick={() => setCurrentView('meal-form')}
                size="sm"
                className="bg-gradient-to-r from-orange-600/30 to-pink-600/20 border-orange-500/50 hover:shadow-[0_0_10px_rgba(251,146,60,0.3)]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Nutrition Progress Bars */}
            <Card className="p-4 bg-gradient-to-br from-orange-600/15 to-pink-600/10 border-orange-500/30">
              <div className="space-y-4">
                {/* Calories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <p className="text-sm font-bold text-white">Calories</p>
                    </div>
                    <p className="font-bold text-white">
                      <span className={totalCalories >= calorieGoal * 0.9 ? 'text-green-400' : 'text-orange-300'}>
                        {totalCalories}
                      </span>
                      <span className="text-white/50"> / {calorieGoal}</span>
                    </p>
                  </div>
                  <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                      style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Protein */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💪</span>
                      <p className="text-sm font-bold text-white">Protein</p>
                    </div>
                    <p className="font-bold text-white">
                      <span className={totalProtein >= proteinGoal * 0.9 ? 'text-green-400' : 'text-pink-300'}>
                        {totalProtein}g
                      </span>
                      <span className="text-white/50"> / {proteinGoal}g</span>
                    </p>
                  </div>
                  <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                      style={{ width: `${Math.min((totalProtein / proteinGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Meal List */}
            <div className="space-y-2">
              {meals.map((meal, index) => (
                <Card key={index} className="p-3 bg-gradient-to-r from-card to-orange-950/10 border-border hover:border-orange-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🍲</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{meal.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {meal.calories} cal • {meal.protein}g protein
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMeal(index)}
                      className="p-1.5 hover:bg-destructive/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
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
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddMeal}
                className="flex-1 bg-green-600/30 border-green-500/50"
              >
                Add Meal
              </Button>
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
    </div>
  );
}
