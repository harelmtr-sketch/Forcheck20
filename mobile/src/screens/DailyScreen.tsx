import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadWorkoutSession, saveWorkoutSession, todayKey, type ExerciseEntry, type MealEntry } from '../utils/workoutStorage';

export function DailyScreen() {
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState('3');
  const [exerciseReps, setExerciseReps] = useState('10');
  const [exerciseScore, setExerciseScore] = useState('');

  const hydrate = useCallback(async () => {
    const saved = await loadWorkoutSession();
    setExercises(saved.exercises);
    setMeals(saved.meals);
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
    saveWorkoutSession({ date: todayKey(), exercises, meals });
  }, [exercises, meals]);

  const dailyScore = useMemo(() => {
    const scores = exercises.map((ex) => ex.score).filter((score): score is number => score !== null);
    if (!scores.length) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [exercises]);

  const handleAddExercise = () => {
    if (!exerciseName.trim()) return;
    const scoreValue = exerciseScore ? Number(exerciseScore) : null;

    setExercises((prev) => [
      {
        name: exerciseName.trim(),
        sets: Number(exerciseSets) || 3,
        reps: Number(exerciseReps) || 10,
        score: Number.isFinite(scoreValue) ? scoreValue : null,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);

    setExerciseName('');
    setExerciseSets('3');
    setExerciseReps('10');
    setExerciseScore('');
    setShowExerciseForm(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1d23', paddingHorizontal: 20, paddingTop: 20 }}>
      <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 20, marginBottom: 20 }}>
        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Today</Text>
        <Text style={{ color: '#f8fafc', fontSize: 26, fontWeight: '700', marginTop: 6 }}>
          Daily Score {dailyScore}
        </Text>
        <Text style={{ color: '#94a3b8', marginTop: 6 }}>Log exercises and meals to keep your day on track.</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700' }}>Exercises</Text>
        <Pressable
          onPress={() => setShowExerciseForm(true)}
          style={{ backgroundColor: '#3b82f6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
        >
          <Text style={{ color: '#f8fafc', fontWeight: '600' }}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        ListEmptyComponent={
          <Text style={{ color: '#94a3b8' }}>No exercises logged yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#252932',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)'
          }}>
            <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ color: '#94a3b8', marginTop: 4 }}>
              {item.sets} sets • {item.reps} reps
            </Text>
            <Text style={{ color: '#cbd5f5', marginTop: 6 }}>Score: {item.score ?? '—'}</Text>
          </View>
        )}
      />

      {showExerciseForm && (
        <View style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(10,13,18,0.9)',
          justifyContent: 'center',
          padding: 24
        }}>
          <View style={{ backgroundColor: '#1a1d23', borderRadius: 20, padding: 20 }}>
            <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Log Exercise</Text>
            <TextInput
              placeholder="Exercise name"
              placeholderTextColor="#64748b"
              value={exerciseName}
              onChangeText={setExerciseName}
              style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 10 }}
            />
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder="Sets"
                placeholderTextColor="#64748b"
                value={exerciseSets}
                onChangeText={setExerciseSets}
                keyboardType="numeric"
                style={{ flex: 1, backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginRight: 8 }}
              />
              <TextInput
                placeholder="Reps"
                placeholderTextColor="#64748b"
                value={exerciseReps}
                onChangeText={setExerciseReps}
                keyboardType="numeric"
                style={{ flex: 1, backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12 }}
              />
            </View>
            <TextInput
              placeholder="Score (0-100)"
              placeholderTextColor="#64748b"
              value={exerciseScore}
              onChangeText={setExerciseScore}
              keyboardType="numeric"
              style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginTop: 10 }}
            />

            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Pressable
                onPress={() => setShowExerciseForm(false)}
                style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, marginRight: 8 }}
              >
                <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAddExercise}
                style={{ flex: 1, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 10 }}
              >
                <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
