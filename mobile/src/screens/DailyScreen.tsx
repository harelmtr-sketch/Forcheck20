import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, FlatList, Modal, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { addArchive } from '../utils/archiveStorage';
import { loadJson, saveJson } from '../utils/storage';
import { exerciseDatabase, workoutTemplates, type ExerciseData, type WorkoutTemplate } from '../data/exerciseDatabase';
import { calculateWorkoutScore, getWorkoutScoreFeedback } from '../utils/workoutScoring';
import { calculateDietScore, calculateDailyScore } from '../utils/dailyScoring';
import { defaultMuscleStatus, loadWorkoutSession, saveWorkoutSession, todayKey, type ExerciseEntry, type MealEntry, type MuscleStatus } from '../utils/workoutStorage';
import type { RootStackParamList } from '../navigation/RootNavigator';

type ViewMode = 'main' | 'exercise-picker' | 'templates' | 'score-picker' | 'meal-form';

type SavedMeal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
};

type CustomTemplate = {
  id: string;
  name: string;
  exercises: ExerciseEntry[];
  createdAt: string;
};

type SettingsState = {
  darkMode: boolean;
  notifications: boolean;
  soundEffects: boolean;
  calorieGoal: string;
  proteinGoal: string;
};

const SAVED_MEALS_KEY = 'kinetic-saved-meals';
const CUSTOM_TEMPLATES_KEY = 'kinetic-custom-templates';
const SETTINGS_KEY = 'kinetic_settings';

export function DailyScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentView, setCurrentView] = useState<ViewMode>('main');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [muscleStatus, setMuscleStatus] = useState<MuscleStatus[]>(defaultMuscleStatus());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [pendingExercise, setPendingExercise] = useState<ExerciseData | null>(null);
  const [customSets, setCustomSets] = useState('3');
  const [customReps, setCustomReps] = useState('12');
  const [scoreInput, setScoreInput] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [showTemplateSave, setShowTemplateSave] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [calorieGoal, setCalorieGoal] = useState(2400);
  const [proteinGoal, setProteinGoal] = useState(180);

  const hydrate = useCallback(async () => {
    const saved = await loadWorkoutSession();
    setExercises(saved.exercises);
    setMeals(saved.meals);
    setMuscleStatus(saved.muscleStatus);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate])
  );

  useEffect(() => {
    saveWorkoutSession({ date: todayKey(), exercises, meals, muscleStatus });
  }, [exercises, meals, muscleStatus]);

  useEffect(() => {
    const loadSavedMeals = async () => {
      const saved = await loadJson<SavedMeal[]>(SAVED_MEALS_KEY);
      setSavedMeals(saved ?? []);
      const templates = await loadJson<CustomTemplate[]>(CUSTOM_TEMPLATES_KEY);
      setCustomTemplates(templates ?? []);
      const settings = await loadJson<SettingsState>(SETTINGS_KEY);
      if (settings) {
        setCalorieGoal(Number(settings.calorieGoal) || 2400);
        setProteinGoal(Number(settings.proteinGoal) || 180);
      }
    };
    loadSavedMeals();
  }, []);

  useEffect(() => {
    saveJson(SAVED_MEALS_KEY, savedMeals);
  }, [savedMeals]);

  useEffect(() => {
    saveJson(CUSTOM_TEMPLATES_KEY, customTemplates);
  }, [customTemplates]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const hasWorkout = exercises.length > 0;

  const workoutScoreData = useMemo(() => calculateWorkoutScore(exercises, muscleStatus), [exercises, muscleStatus]);
  const workoutFeedback = useMemo(() => getWorkoutScoreFeedback(
    workoutScoreData.score,
    workoutScoreData.cCoefficient,
    workoutScoreData.musclesHitCount,
    workoutScoreData.readyMusclesCount
  ), [workoutScoreData]);
  const dietScoreData = useMemo(() => calculateDietScore(totalCalories, totalProtein, calorieGoal, proteinGoal), [totalCalories, totalProtein, calorieGoal, proteinGoal]);
  const dailyScoreData = useMemo(() => calculateDailyScore(
    workoutScoreData.score,
    dietScoreData.score,
    totalCalories,
    totalProtein,
    calorieGoal,
    proteinGoal,
    hasWorkout
  ), [workoutScoreData.score, dietScoreData.score, totalCalories, totalProtein, calorieGoal, proteinGoal, hasWorkout]);

  const filteredExercises = useMemo(() => {
    return exerciseDatabase.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleTemplateStart = (template: WorkoutTemplate | CustomTemplate) => {
    const newExercises = template.exercises.map((exercise: any) => {
      if ('name' in exercise) {
        return exercise as ExerciseEntry;
      }
      const exerciseData = exerciseDatabase.find((ex) => ex.id === exercise);
      if (!exerciseData) return null;
      return {
        name: exerciseData.name,
        sets: exerciseData.baseSets,
        reps: exerciseData.baseReps,
        score: null,
        timestamp: new Date().toISOString(),
        fromTemplate: true
      } satisfies ExerciseEntry;
    }).filter(Boolean) as ExerciseEntry[];

    setExercises((prev) => [...prev, ...newExercises]);
    const musclesBeingTrained = new Set<string>();
    newExercises.forEach((exercise) => {
      const exerciseData = exerciseDatabase.find((ex) => ex.name === exercise.name);
      if (exerciseData) {
        exerciseData.primaryMuscles.forEach((muscle) => musclesBeingTrained.add(muscle));
        exerciseData.secondaryMuscles.forEach((muscle) => musclesBeingTrained.add(muscle));
      }
    });
    setMuscleStatus((prev) => prev.map((muscle) => {
      if (musclesBeingTrained.has(muscle.key)) {
        return {
          ...muscle,
          status: 'sore',
          lastTrained: 'Today',
          setsToday: muscle.setsToday + 1
        };
      }
      return muscle;
    }));
    setCurrentView('main');
  };

  const handleExerciseAdd = (exerciseData: ExerciseData) => {
    setPendingExercise(exerciseData);
    setCustomSets(String(exerciseData.baseSets));
    setCustomReps(String(exerciseData.baseReps));
  };

  const handleConfirmExercise = () => {
    if (!pendingExercise) return;
    const newExercise: ExerciseEntry = {
      name: pendingExercise.name,
      sets: Number(customSets) || pendingExercise.baseSets,
      reps: Number(customReps) || pendingExercise.baseReps,
      score: null,
      timestamp: new Date().toISOString(),
      fromTemplate: false
    };
    setExercises((prev) => [...prev, newExercise]);
    setMuscleStatus((prev) => prev.map((muscle) => {
      const hits = pendingExercise.primaryMuscles.concat(pendingExercise.secondaryMuscles);
      if (hits.includes(muscle.key)) {
        return {
          ...muscle,
          status: 'sore',
          lastTrained: 'Today',
          setsToday: muscle.setsToday + 1
        };
      }
      return muscle;
    }));
    setPendingExercise(null);
    setCurrentView('main');
  };

  const handleRateExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setScoreInput(exercises[index]?.score?.toString() ?? '');
    setCurrentView('score-picker');
  };

  const handleScoreSelect = () => {
    if (selectedExerciseIndex === null) return;
    const score = Number(scoreInput);
    if (!Number.isFinite(score)) return;
    setExercises((prev) => prev.map((exercise, i) => (
      i === selectedExerciseIndex ? { ...exercise, score } : exercise
    )));
    setSelectedExerciseIndex(null);
    setCurrentView('main');
  };

  const handleAddMeal = () => {
    if (!mealName.trim()) return;
    const entry: MealEntry = {
      name: mealName.trim(),
      calories: Number(mealCalories) || 0,
      protein: Number(mealProtein) || 0,
      timestamp: new Date().toISOString()
    };
    setMeals((prev) => [entry, ...prev]);
    setSavedMeals((prev) => {
      if (prev.some((meal) => meal.name.toLowerCase() === entry.name.toLowerCase())) {
        return prev;
      }
      return [
        { id: `meal-${Date.now()}`, name: entry.name, calories: entry.calories, protein: entry.protein },
        ...prev
      ];
    });
    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setCurrentView('main');
  };

  const handleArchiveDay = async () => {
    if (!exercises.length && !meals.length) return;
    await addArchive({
      id: `${todayKey()}-${Date.now()}`,
      date: todayKey(),
      totalScore: dailyScoreData.score,
      exercises,
      meals
    });
    setExercises([]);
    setMeals([]);
    setCurrentView('main');
    navigation.navigate('Analyze');
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    const newTemplate: CustomTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName.trim(),
      exercises,
      createdAt: new Date().toISOString()
    };
    setCustomTemplates((prev) => [newTemplate, ...prev]);
    setTemplateName('');
    setShowTemplateSave(false);
  };

  if (currentView === 'exercise-picker') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Pressable onPress={() => setCurrentView('main')}>
            <Text style={{ color: '#94a3b8' }}>Back</Text>
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Add Exercise</Text>
          <View style={{ width: 40 }} />
        </View>
        <TextInput
          placeholder="Search exercises"
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {['all', 'push', 'pull', 'legs', 'core', 'full-body'].map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category ? '#2563eb' : '#1f2937',
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>{category.toUpperCase()}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleExerciseAdd(item)}
              style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}
            >
              <Text style={{ color: '#f8fafc', fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                {item.category} • {item.difficulty} • {item.baseSets}x{item.baseReps}
              </Text>
            </Pressable>
          )}
        />

        <Modal visible={!!pendingExercise} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(10,13,18,0.9)', justifyContent: 'center', padding: 24 }}>
            <View style={{ backgroundColor: '#1a1d23', borderRadius: 20, padding: 20 }}>
              <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
                Customize {pendingExercise?.name}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  placeholder="Sets"
                  placeholderTextColor="#64748b"
                  value={customSets}
                  onChangeText={setCustomSets}
                  keyboardType="numeric"
                  style={{ flex: 1, backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginRight: 8 }}
                />
                <TextInput
                  placeholder="Reps"
                  placeholderTextColor="#64748b"
                  value={customReps}
                  onChangeText={setCustomReps}
                  keyboardType="numeric"
                  style={{ flex: 1, backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12 }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <Pressable
                  onPress={() => setPendingExercise(null)}
                  style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, marginRight: 8 }}
                >
                  <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmExercise}
                  style={{ flex: 1, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 10 }}
                >
                  <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (currentView === 'templates') {
    const templates = [...workoutTemplates, ...customTemplates];
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Pressable onPress={() => setCurrentView('main')}>
            <Text style={{ color: '#94a3b8' }}>Back</Text>
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Templates</Text>
          <View style={{ width: 40 }} />
        </View>
        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleTemplateStart(item)}
              style={{ backgroundColor: '#252932', borderRadius: 16, padding: 16, marginBottom: 12 }}
            >
              <Text style={{ color: '#f8fafc', fontWeight: '700' }}>{item.name}</Text>
              <Text style={{ color: '#94a3b8', marginTop: 4 }}>{item.exercises.length} exercises</Text>
            </Pressable>
          )}
        />
      </View>
    );
  }

  if (currentView === 'score-picker') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', padding: 24, justifyContent: 'center' }}>
        <Text style={{ color: '#f8fafc', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Score Exercise</Text>
        <TextInput
          placeholder="Score (0-100)"
          placeholderTextColor="#64748b"
          value={scoreInput}
          onChangeText={setScoreInput}
          keyboardType="numeric"
          style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 }}
        />
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            onPress={() => setCurrentView('main')}
            style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, marginRight: 8 }}
          >
            <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleScoreSelect}
            style={{ flex: 1, backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 10 }}
          >
            <Text style={{ color: '#0f1117', textAlign: 'center', fontWeight: '700' }}>Save</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (currentView === 'meal-form') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', padding: 24, justifyContent: 'center' }}>
        <Text style={{ color: '#f8fafc', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Log Meal</Text>
        <TextInput
          placeholder="Meal name"
          placeholderTextColor="#64748b"
          value={mealName}
          onChangeText={setMealName}
          style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 10 }}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="Calories"
            placeholderTextColor="#64748b"
            value={mealCalories}
            onChangeText={setMealCalories}
            keyboardType="numeric"
            style={{ flex: 1, backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginRight: 8 }}
          />
          <TextInput
            placeholder="Protein (g)"
            placeholderTextColor="#64748b"
            value={mealProtein}
            onChangeText={setMealProtein}
            keyboardType="numeric"
            style={{ flex: 1, backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12 }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {savedMeals.map((meal) => (
            <Pressable
              key={meal.id}
              onPress={() => {
                setMealName(meal.name);
                setMealCalories(String(meal.calories));
                setMealProtein(String(meal.protein));
              }}
              style={{ backgroundColor: '#1f2937', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}
            >
              <Text style={{ color: '#f8fafc', fontWeight: '600' }}>{meal.name}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 10 }}>{meal.calories} kcal</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Pressable
            onPress={() => setCurrentView('main')}
            style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, marginRight: 8 }}
          >
            <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleAddMeal}
            style={{ flex: 1, backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 10 }}
          >
            <Text style={{ color: '#0f1117', textAlign: 'center', fontWeight: '700' }}>Save</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1d23' }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Today</Text>
        <Text style={{ color: '#f8fafc', fontSize: 26, fontWeight: '700', marginTop: 6 }}>Daily Score {dailyScoreData.score}</Text>
        <Text style={{ color: '#94a3b8', marginTop: 6 }}>{dailyScoreData.feedback.message}</Text>
        <Pressable
          onPress={handleArchiveDay}
          style={{ marginTop: 16, alignSelf: 'flex-start', backgroundColor: '#1f2937', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
        >
          <Text style={{ color: '#f8fafc', fontWeight: '600' }}>Archive Day</Text>
        </Pressable>
      </View>

      <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Workout Score</Text>
        <Text style={{ color: '#fbbf24', fontSize: 24, fontWeight: '800', marginTop: 4 }}>{workoutScoreData.score}</Text>
        <Text style={{ color: '#94a3b8', marginTop: 6 }}>{workoutFeedback.detail}</Text>
      </View>

      <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Diet Score</Text>
        <Text style={{ color: '#22c55e', fontSize: 24, fontWeight: '800', marginTop: 4 }}>{dietScoreData.score}</Text>
        <Text style={{ color: '#94a3b8', marginTop: 6 }}>{dietScoreData.feedback.message}</Text>
        <Text style={{ color: '#94a3b8', marginTop: 4 }}>{totalCalories} / {calorieGoal} kcal • {totalProtein}g / {proteinGoal}g protein</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700' }}>Exercises</Text>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            onPress={() => setCurrentView('templates')}
            style={{ backgroundColor: '#1f2937', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}
          >
            <Text style={{ color: '#f8fafc', fontWeight: '600' }}>Templates</Text>
          </Pressable>
          <Pressable
            onPress={() => setCurrentView('exercise-picker')}
            style={{ backgroundColor: '#3b82f6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
          >
            <Text style={{ color: '#f8fafc', fontWeight: '600' }}>Add</Text>
          </Pressable>
        </View>
      </View>

      {exercises.length === 0 && (
        <Text style={{ color: '#94a3b8', marginBottom: 12 }}>No exercises logged yet.</Text>
      )}
      {exercises.map((exercise, index) => (
        <Pressable
          key={`${exercise.name}-${index}`}
          onPress={() => handleRateExercise(index)}
          style={{ backgroundColor: '#252932', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '600' }}>{exercise.name}</Text>
              <Text style={{ color: '#94a3b8', marginTop: 4 }}>{exercise.sets} sets • {exercise.reps} reps</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 16 }}>{exercise.score ?? '—'}</Text>
              <Text style={{ color: '#64748b', fontSize: 10 }}>Tap to score</Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Camera' as never)}
            style={{ marginTop: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(59,130,246,0.2)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}
          >
            <Text style={{ color: '#93c5fd', fontWeight: '600' }}>Record</Text>
          </Pressable>
        </Pressable>
      ))}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 }}>
        <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700' }}>Meals</Text>
        <Pressable
          onPress={() => setCurrentView('meal-form')}
          style={{ backgroundColor: '#22c55e', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
        >
          <Text style={{ color: '#0f1117', fontWeight: '700' }}>Add</Text>
        </Pressable>
      </View>

      {meals.length === 0 && (
        <Text style={{ color: '#94a3b8' }}>No meals logged yet.</Text>
      )}
      {meals.map((meal, index) => (
        <View key={`${meal.name}-${index}`} style={{ backgroundColor: '#252932', borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '600' }}>{meal.name}</Text>
          <Text style={{ color: '#94a3b8', marginTop: 4 }}>{meal.calories} kcal • {meal.protein}g protein</Text>
        </View>
      ))}

      <Pressable
        onPress={() => setShowTemplateSave(true)}
        style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#1f2937', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}
      >
        <Text style={{ color: '#f8fafc', fontWeight: '600' }}>Save as Template</Text>
      </Pressable>

      <Modal visible={showTemplateSave} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(10,13,18,0.9)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#1a1d23', borderRadius: 20, padding: 20 }}>
            <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Name your template</Text>
            <TextInput
              placeholder="Template name"
              placeholderTextColor="#64748b"
              value={templateName}
              onChangeText={setTemplateName}
              style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => setShowTemplateSave(false)}
                style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, marginRight: 8 }}
              >
                <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveTemplate}
                style={{ flex: 1, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 10 }}
              >
                <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
