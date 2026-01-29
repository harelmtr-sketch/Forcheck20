import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadArchives, removeArchive, type ArchiveEntry } from '../utils/archiveStorage';

export function AnalyzeScreen() {
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);

  const hydrate = useCallback(async () => {
    const saved = await loadArchives();
    setArchives(saved);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate])
  );

  const handleDelete = async (id: string) => {
    const updated = await removeArchive(id);
    setArchives(updated);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f1117' }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 }}>Archive</Text>

      {archives.length === 0 && (
        <Text style={{ color: '#94a3b8' }}>No archived workouts yet.</Text>
      )}

      {archives.map((entry) => (
        <View key={entry.id} style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{entry.date}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>{entry.exercises.length} exercises • {entry.meals.length} meals</Text>
            </View>
            <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 20 }}>{entry.totalScore}</Text>
          </View>

          {entry.exercises.map((exercise, index) => (
            <View key={`${entry.id}-exercise-${index}`} style={{ marginBottom: 6 }}>
              <Text style={{ color: '#e2e8f0' }}>{exercise.name} • {exercise.sets}x{exercise.reps}</Text>
            </View>
          ))}

          {entry.meals.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Meals</Text>
              {entry.meals.map((meal, index) => (
                <Text key={`${entry.id}-meal-${index}`} style={{ color: '#cbd5f5' }}>
                  {meal.name} • {meal.calories} kcal • {meal.protein}g
                </Text>
              ))}
            </View>
          )}

          <Pressable
            onPress={() => handleDelete(entry.id)}
            style={{ marginTop: 12, alignSelf: 'flex-start', backgroundColor: 'rgba(239,68,68,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Text style={{ color: '#fecaca', fontWeight: '600' }}>Delete</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
