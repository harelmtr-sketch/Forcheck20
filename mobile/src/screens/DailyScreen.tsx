import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView, StyleSheet, FlatList, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { GlowScoreNumber } from '../components/GlowScoreNumber';
import { StreakBadge } from '../components/StreakBadge';
import { ExercisePickerModal } from '../components/ExercisePickerModal';
import { WorkoutHeader } from '../components/WorkoutHeader';
import { AddMealsButton } from '../components/AddMealsButton';
import { SaveTemplateButton } from '../components/SaveTemplateButton';
import { ScreenShell } from '../components/ScreenShell';
import { TemplateCard } from '../components/TemplateCard';
import { exerciseMenuColors as C } from '../theme/exerciseMenuColors';
import { addArchive } from '../utils/archiveStorage';
import { loadJson, saveJson } from '../utils/storage';
import { exerciseDatabase, workoutTemplates, type ExerciseData, type WorkoutTemplate } from '../data/exerciseDatabase';
import { calculateWorkoutScore } from '../utils/workoutScoring';
import { calculateDietScore, calculateDailyScore } from '../utils/dailyScoring';
import { defaultMuscleStatus, loadWorkoutSession, saveWorkoutSession, todayKey, type ExerciseEntry, type MealEntry, type MuscleStatus } from '../utils/workoutStorage';
import { saveSelectedExercise } from '../utils/cameraSelection';
import type { DailyStackParamList } from '../navigation/DailyStack';

type ViewMode = 'main' | 'exercise-picker' | 'templates' | 'meal-form';

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

const COLORS = {
  backgroundTop: '#000000',
  backgroundMid: '#0a0a0a',
  backgroundBottom: '#000000',
  card: 'rgba(37,41,50,0.9)',
  cardSecondary: 'rgba(31,35,44,0.85)',
  border: 'rgba(255,255,255,0.1)',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textSubtle: '#64748b',
  accentBlue: '#60a5fa',
  accentBlueMuted: 'rgba(59,130,246,0.18)',
  accentRed: '#f87171',
  accentRedMuted: 'rgba(239,68,68,0.2)'
};

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24
};

const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const horizontalPadding = SCREEN_WIDTH < 375 ? 20 : 24;
const headerTitleSize = SCREEN_WIDTH < 375 ? 26 : 28;
const startCardTitleSize = SCREEN_WIDTH < 375 ? 18 : 19;

const getScoreColor = (score: number) => {
  if (score >= 90) return '#22c55e';
  if (score >= 80) return '#4ade80';
  if (score >= 70) return '#facc15';
  if (score >= 60) return '#fb923c';
  if (score >= 50) return '#f97316';
  return '#f87171';
};

export function DailyScreen() {
  const navigation = useNavigation<StackNavigationProp<DailyStackParamList>>();
  const [currentView, setCurrentView] = useState<ViewMode>('main');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [muscleStatus, setMuscleStatus] = useState<MuscleStatus[]>(defaultMuscleStatus());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pendingExercise, setPendingExercise] = useState<ExerciseData | null>(null);
  const [customSets, setCustomSets] = useState('3');
  const [customReps, setCustomReps] = useState('12');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [showTemplateSave, setShowTemplateSave] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [calorieGoal, setCalorieGoal] = useState(2400);
  const [proteinGoal, setProteinGoal] = useState(180);
  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), []);
  const hasActivity = exercises.length > 0 || meals.length > 0;

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

  const workoutScoreData = useMemo(() => {
    try {
      return calculateWorkoutScore(exercises, muscleStatus);
    } catch {
      return { score: 0, cCoefficient: 1, musclesHitCount: 0, readyMusclesCount: 0 };
    }
  }, [exercises, muscleStatus]);
  const dietScoreData = useMemo(() => {
    try {
      return calculateDietScore(totalCalories, totalProtein, calorieGoal, proteinGoal);
    } catch {
      return { score: 0, feedback: { message: '' } };
    }
  }, [totalCalories, totalProtein, calorieGoal, proteinGoal]);
  const dailyScoreData = useMemo(() => {
    try {
      return calculateDailyScore(
        workoutScoreData?.score ?? 0,
        dietScoreData?.score ?? 0,
        totalCalories,
        totalProtein,
        calorieGoal,
        proteinGoal,
        hasWorkout
      );
    } catch {
      return { score: 0, feedback: { message: '' } };
    }
  }, [workoutScoreData?.score, dietScoreData?.score, totalCalories, totalProtein, calorieGoal, proteinGoal, hasWorkout]);

  const workoutScoreColor = getScoreColor(workoutScoreData?.score ?? 0);
  const dietScoreColor = getScoreColor(dietScoreData?.score ?? 0);

  const filteredExercises = useMemo(() => {
    return exerciseDatabase.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleTemplateStart = (template: WorkoutTemplate | CustomTemplate) => {
    const newExercises = template.exercises.map((exercise: any) => {
      if (exercise && typeof exercise === 'object' && 'name' in exercise) {
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


  const openCameraForExercise = async (exercise: ExerciseEntry) => {
    await saveSelectedExercise({ name: exercise.name, sets: exercise.sets, reps: exercise.reps });
    navigation.navigate('Camera' as never);
  };

  const handleRateExercise = (index: number) => {
    const target = exercises[index];
    if (!target) return;
    navigation.navigate('RateForm', {
      index,
      name: target.name,
      sets: target.sets,
      reps: target.reps,
      score: typeof target.score === 'number' ? target.score : null
    });
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

  const handleResetDay = () => {
    if (!exercises.length && !meals.length) return;
    setExercises([]);
    setMeals([]);
    setMuscleStatus(defaultMuscleStatus());
    setCurrentView('main');
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

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const renderTemplates = () => {
    const templates = [...workoutTemplates, ...customTemplates];
    return (
      <ScreenShell>
        <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: C.white }}>Workout Templates</Text>
          <Text style={{ fontSize: 16, color: C.gray400, marginTop: 6 }}>
            {templates.length} programs • {customTemplates.length} custom
          </Text>
        </View>
        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TemplateCard
              title={item.name}
              subtitle={`${item.exercises.length} exercises • 35 min`}
              onPress={() => handleTemplateStart(item)}
            />
          )}
        />
      </ScreenShell>
    );
  };

  const renderMealForm = () => (
    <View style={styles.overlayContent}>
      <View style={styles.overlayHeader}>
        <Pressable onPress={() => setCurrentView('main')} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={22} color={COLORS.accentBlue} />
        </Pressable>
        <View>
          <Text style={styles.overlayTitle}>Log Meal</Text>
          <Text style={styles.overlaySubtitle}>Track your nutrition</Text>
        </View>
      </View>
      <TextInput
        placeholder="Meal name"
        placeholderTextColor={COLORS.textSubtle}
        value={mealName}
        onChangeText={setMealName}
        style={styles.formInput}
      />
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="Calories"
          placeholderTextColor={COLORS.textSubtle}
          value={mealCalories}
          onChangeText={setMealCalories}
          keyboardType="numeric"
          style={[styles.formInput, { marginRight: 8 }]}
        />
        <TextInput
          placeholder="Protein (g)"
          placeholderTextColor={COLORS.textSubtle}
          value={mealProtein}
          onChangeText={setMealProtein}
          keyboardType="numeric"
          style={styles.formInput}
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
            style={styles.savedMealPill}
          >
            <Text style={styles.savedMealName}>{meal.name}</Text>
            <Text style={styles.savedMealMeta}>{meal.calories} kcal</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Pressable onPress={() => setCurrentView('main')} style={[styles.modalButton, styles.modalGhost]}>
          <Text style={styles.modalGhostText}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleAddMeal} style={[styles.modalButton, styles.modalPrimary]}>
          <Text style={styles.modalPrimaryText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[COLORS.backgroundTop, COLORS.backgroundMid, COLORS.backgroundBottom]} style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.centered}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Today's Progress</Text>
            <Text style={styles.headerSubtitle}>{todayLabel}</Text>
          </View>
          <View style={styles.headerActions}>
            <StreakBadge days={7} />
            {hasWorkout && (
              <Pressable onPress={handleResetDay} style={styles.resetButton}>
                <MaterialCommunityIcons name="rotate-right" size={18} color={COLORS.accentRed} />
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.headerDivider} />

        {hasActivity && (
          <View style={styles.dailyScoreShell}>
            <LinearGradient colors={['#252932', '#20252e', '#252932']} style={styles.dailyScoreCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardShine}
                pointerEvents="none"
              />
              <Text style={styles.dailyScoreLabel}>DAILY SCORE</Text>
              <GlowScoreNumber value={dailyScoreData.score} />
            </LinearGradient>
          </View>
        )}

        {!hasWorkout ? (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderIconGlow}>
                <MaterialCommunityIcons name="dumbbell" size={22} color="#60A5FA" />
              </View>
              <Text style={styles.sectionTitle}>Start Workout</Text>
            </View>
            <Pressable onPress={() => setCurrentView('templates')} style={styles.startCard}>
              <LinearGradient
                colors={['#1E232D', 'rgba(30, 35, 45, 0.95)', 'rgba(26, 29, 36, 0.9)', 'rgba(22, 24, 30, 0.85)', '#16181E']}
                locations={[0, 0.25, 0.5, 0.75, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startCardGradient}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardCopy}>
                    <Text style={styles.startCardTitle}>Templates</Text>
                    <Text style={styles.startCardDescription}>Browse and choose a recommended workout then film your sets and get feedback</Text>
                  </View>
                  <View style={styles.iconBadgeGlow}>
                    <View style={styles.iconBadge}>
                      <LinearGradient colors={['rgba(59, 130, 246, 0.25)', 'rgba(37, 99, 235, 0.15)']} style={styles.iconBadgeGradient}>
                        <View style={styles.iconBadgeRim} />
                        <View style={styles.iconInnerGlow}>
                          <MaterialCommunityIcons name="dumbbell" size={28} color="#60A5FA" />
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => setCurrentView('exercise-picker')} style={styles.startCard}>
              <LinearGradient
                colors={['#1E232D', 'rgba(30, 35, 45, 0.95)', 'rgba(26, 29, 36, 0.9)', 'rgba(22, 24, 30, 0.85)', '#16181E']}
                locations={[0, 0.25, 0.5, 0.75, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startCardGradient}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardCopy}>
                    <Text style={styles.startCardTitle}>Custom</Text>
                    <Text style={styles.startCardDescription}>Create your own workout then film your sets and get feedback</Text>
                  </View>
                  <View style={styles.iconBadgeGlow}>
                    <View style={styles.iconBadge}>
                      <LinearGradient colors={['rgba(59, 130, 246, 0.25)', 'rgba(37, 99, 235, 0.15)']} style={styles.iconBadgeGradient}>
                        <View style={styles.iconBadgeRim} />
                        <View style={styles.iconInnerGlow}>
                          <MaterialCommunityIcons name="flash" size={28} color="#60A5FA" />
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.workoutGlowWrap}>
              <LinearGradient
                colors={['rgba(23,37,84,0.08)', 'rgba(0,0,0,0.0)', 'transparent']}
                style={styles.workoutGlow}
                pointerEvents="none"
              />
            </View>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <WorkoutHeader onAddPress={() => setCurrentView('exercise-picker')} />
              </View>
              {workoutScoreData.score > 0 && (
                <Text style={[styles.sectionScore, { color: workoutScoreColor }]}>{workoutScoreData.score}</Text>
              )}
            </View>
            {exercises.map((exercise, index) => {
              const timeLabel = new Date(exercise.timestamp ?? Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              const isRated = typeof exercise.score === 'number';
              const exerciseScoreColor = getScoreColor(exercise.score ?? 0);
              return (
                <Pressable
                  key={`${exercise.name}-${index}`}
                  onPress={() => (!isRated ? handleRateExercise(index) : undefined)}
                  style={{ marginBottom: 12 }}
                >
                  <LinearGradient colors={['#20252e', '#1c2129', '#20252e']} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <View>
                        <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '700' }}>{exercise.name}</Text>
                        <Text style={{ color: '#94a3b8', marginTop: 6 }}>{exercise.sets} sets × {exercise.reps} reps</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#64748b', fontSize: 12 }}>{timeLabel}</Text>
                        {isRated && (
                          <Text style={{ color: exerciseScoreColor, fontWeight: '800', fontSize: 16, marginTop: 6 }}>{exercise.score}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.actionRow}>
                      <Pressable onPress={() => openCameraForExercise(exercise)} style={styles.iconButton}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color="#93c5fd" />
                      </Pressable>
                      <Pressable onPress={() => openCameraForExercise(exercise)} style={styles.iconButton}>
                        <MaterialCommunityIcons name="play" size={18} color="#93c5fd" />
                      </Pressable>
                      <Pressable onPress={() => handleRemoveExercise(index)} style={styles.iconButton}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color="#fca5a5" />
                      </Pressable>
                    </View>
                    <Pressable onPress={() => openCameraForExercise(exercise)} style={{ marginTop: 16 }}>
                      <LinearGradient
                        colors={['rgba(239,68,68,0.35)', 'rgba(239,68,68,0.15)']}
                        style={styles.recordButton}
                      >
                        <View style={styles.recordRow}>
                          <MaterialCommunityIcons name="camera" size={16} color="#fca5a5" />
                          <Text style={styles.recordText}>Record Now</Text>
                        </View>
                      </LinearGradient>
                    </Pressable>
                    {!isRated && (
                      <Text style={styles.tapToRate}>Tap to rate form</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              );
            })}
          </>
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderIconGlow}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={22} color="#60A5FA" />
          </View>
          <Text style={styles.sectionTitle}>{meals.length === 0 ? 'Track Nutrition' : 'Nutrition'}</Text>
        </View>

        {meals.length === 0 ? (
          <AddMealsButton onPress={() => setCurrentView('meal-form')} />
        ) : (
          <View style={styles.primaryCard}>
            <View style={styles.cardRow}>
              <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Diet Score</Text>
              <Text style={{ color: dietScoreColor, fontSize: 22, fontWeight: '800' }}>{dietScoreData.score}</Text>
            </View>
            <Text style={{ color: '#94a3b8', marginTop: 8 }}>{dietScoreData.feedback.message}</Text>
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Calories {totalCalories} / {calorieGoal}</Text>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: '#1a1f27', overflow: 'hidden' }}>
                <View style={{ height: 8, borderRadius: 4, width: `${Math.min(100, (totalCalories / calorieGoal) * 100)}%`, backgroundColor: '#60a5fa' }} />
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Protein {totalProtein}g / {proteinGoal}g</Text>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: '#1a1f27', overflow: 'hidden' }}>
                <View style={{ height: 8, borderRadius: 4, width: `${Math.min(100, (totalProtein / proteinGoal) * 100)}%`, backgroundColor: '#34d399' }} />
              </View>
            </View>
            <Pressable onPress={() => setCurrentView('meal-form')} style={styles.secondaryButton}>
              <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Add Meal</Text>
            </Pressable>
          </View>
        )}

        <SaveTemplateButton
          onSaveTemplate={() => setShowTemplateSave(true)}
          onArchiveDay={handleArchiveDay}
        />
      </View>

      <ExercisePickerModal
        visible={currentView === 'exercise-picker'}
        exercises={filteredExercises}
        totalCount={exerciseDatabase.length}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onSelectExercise={handleExerciseAdd}
        onClose={() => setCurrentView('main')}
      />

      <Modal visible={!!pendingExercise} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Customize {pendingExercise?.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder="Sets"
                placeholderTextColor={COLORS.textSubtle}
                value={customSets}
                onChangeText={setCustomSets}
                keyboardType="numeric"
                style={[styles.modalInput, { marginRight: 8 }]}
              />
              <TextInput
                placeholder="Reps"
                placeholderTextColor={COLORS.textSubtle}
                value={customReps}
                onChangeText={setCustomReps}
                keyboardType="numeric"
                style={styles.modalInput}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Pressable onPress={() => setPendingExercise(null)} style={[styles.modalButton, styles.modalGhost]}>
                <Text style={styles.modalGhostText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirmExercise} style={[styles.modalButton, styles.modalPrimary]}>
                <Text style={styles.modalPrimaryText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
      {(currentView === 'templates' || currentView === 'meal-form') && (
        <Animated.View
          key={currentView}
          entering={SlideInUp.duration(280)}
          exiting={SlideOutDown.duration(260)}
          style={[styles.overlay, currentView === 'templates' && styles.overlayTransparent]}
        >
          {currentView === 'templates' && renderTemplates()}
          {currentView === 'meal-form' && renderMealForm()}
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundTop
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 100
  },
  centered: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 448,
    paddingHorizontal: horizontalPadding,
    paddingTop: Platform.OS === 'ios' ? 60 : 56
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 24
  },
  headerCopy: {
    flex: 1,
    marginRight: 16
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dailyScoreShell: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: 24
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(59,130,246,0.2)',
    marginVertical: 16
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: headerTitleSize,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 4
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20
  },
  resetButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.4)',
    backgroundColor: 'rgba(127,29,29,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: 'rgba(248,113,113,0.6)',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  dailyScoreCard: {
    borderRadius: 20,
    padding: 26,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  cardShine: {
    ...StyleSheet.absoluteFillObject
  },
  dailyScoreLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 28
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  workoutGlowWrap: {
    position: 'relative'
  },
  workoutGlow: {
    position: 'absolute',
    top: -12,
    left: -18,
    right: -18,
    height: 140,
    borderRadius: 24,
    opacity: 0.8
  },
  sectionHeaderIconGlow: {
    marginRight: 10,
    shadowColor: 'rgba(96, 165, 250, 0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.3
  },
  sectionScore: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 4
  },
  primaryCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#1f232c',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)'
  },
  startCard: {
    marginHorizontal: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  startCardGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    minHeight: 104
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardCopy: {
    flex: 1,
    paddingRight: 16
  },
  startCardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: startCardTitleSize,
    lineHeight: 24,
    letterSpacing: -0.4,
    marginBottom: 8
  },
  startCardDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1
  },
  iconBadgeGlow: {
    width: 56,
    height: 56,
    borderRadius: 19,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  iconBadgeGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBadgeRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.15)',
    borderRadius: 13
  },
  iconInnerGlow: {
    shadowColor: 'rgba(96, 165, 250, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6
  },
  exerciseCard: {
    borderRadius: 18,
    padding: 22,
    minHeight: 236,
    backgroundColor: '#1f232c',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)'
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentBlueMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  recordButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.45)',
    shadowColor: 'rgba(239,68,68,0.5)',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recordText: {
    color: '#fecaca',
    fontWeight: '700',
    marginLeft: 6
  },
  tapToRate: {
    color: COLORS.accentBlue,
    textAlign: 'center',
    marginTop: 14,
    fontSize: 12,
    fontWeight: '600'
  },
  scoreRow: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scoreRowLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  scoreRowValue: {
    fontSize: 22,
    fontWeight: '800'
  },
  secondaryButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,10,16,0.98)',
    bottom: 70
  },
  overlayTransparent: {
    backgroundColor: 'transparent'
  },
  overlayContent: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 60
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentBlueMuted,
    marginRight: 12
  },
  overlayTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700'
  },
  overlaySubtitle: {
    color: COLORS.textMuted,
    marginTop: 4
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252932',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    marginLeft: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,13,18,0.9)',
    justifyContent: 'center',
    padding: 24
  },
  modalCard: {
    backgroundColor: '#1a1d23',
    borderRadius: 20,
    padding: 20
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  modalInput: {
    flex: 1,
    backgroundColor: '#252932',
    color: COLORS.text,
    borderRadius: 12,
    padding: 12
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  modalGhost: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: 8
  },
  modalPrimary: {
    backgroundColor: '#3b82f6'
  },
  modalGhostText: {
    color: COLORS.text,
    fontWeight: '600'
  },
  modalPrimaryText: {
    color: COLORS.text,
    fontWeight: '600'
  },
  scorePickerHeader: {
    alignItems: 'center',
    marginBottom: 16
  },
  scorePickerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.accentBlueMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  scorePickerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700'
  },
  scorePickerMeta: {
    color: COLORS.textMuted,
    marginTop: 4
  },
  feedbackCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1
  },
  feedbackTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4
  },
  feedbackMessage: {
    color: COLORS.text,
    opacity: 0.7,
    textAlign: 'center'
  },
  formInput: {
    backgroundColor: '#252932',
    color: COLORS.text,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  savedMealPill: {
    backgroundColor: '#1f2937',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8
  },
  savedMealName: {
    color: COLORS.text,
    fontWeight: '600'
  },
  savedMealMeta: {
    color: COLORS.textMuted,
    fontSize: 10
  }
});
