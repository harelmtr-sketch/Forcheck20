import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { loadWorkoutSession, saveWorkoutSession } from '../utils/workoutStorage';
import type { DailyStackParamList } from '../navigation/DailyStack';

type RateFormRoute = RouteProp<DailyStackParamList, 'RateForm'>;

const getScoreColor = (score: number) => {
  if (score >= 90) return '#22c55e';
  if (score >= 80) return '#4ade80';
  if (score >= 70) return '#facc15';
  if (score >= 60) return '#fb923c';
  if (score >= 50) return '#f97316';
  return '#f87171';
};

const getScoreLabel = (score: number) => {
  if (score >= 90) return 'Elite';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Great';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
};

const getFeedback = (score: number) => {
  if (score >= 90) return { title: 'Elite', message: 'Explosive power and control. Keep it up.' };
  if (score >= 80) return { title: 'Excellent', message: 'Strong form and tempo. Stay consistent.' };
  if (score >= 70) return { title: 'Great', message: 'Solid mechanics. Aim for smoother reps.' };
  if (score >= 60) return { title: 'Good', message: 'Decent control. Focus on depth and range.' };
  if (score >= 50) return { title: 'Fair', message: 'Work on stability and pacing.' };
  return { title: 'Needs Work', message: 'Focus on control and range of motion.' };
};

export function RateFormScreen() {
  const navigation = useNavigation<StackNavigationProp<DailyStackParamList>>();
  const route = useRoute<RateFormRoute>();
  const { index, name, sets, reps, score } = route.params;
  const [selectedScore, setSelectedScore] = useState<number>(score ?? 0);
  const scoreOptions = useMemo(() => Array.from({ length: 11 }, (_, i) => i * 10), []);
  const feedback = getFeedback(selectedScore);
  const feedbackColor = getScoreColor(selectedScore);

  const handlePick = async (nextScore: number) => {
    setSelectedScore(nextScore);
    const session = await loadWorkoutSession();
    const nextExercises = session.exercises.map((exercise, idx) => (
      idx === index ? { ...exercise, score: nextScore } : exercise
    ));
    await saveWorkoutSession({ ...session, exercises: nextExercises });
    setTimeout(() => {
      navigation.goBack();
    }, 350);
  };

  return (
    <LinearGradient colors={['#000000', '#0a0a0a', '#000000']} style={styles.screen}>
      <LinearGradient
        colors={['rgba(23,37,84,0.1)', 'rgba(0,0,0,0)', 'rgba(23,37,84,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGlow}
        pointerEvents="none"
      />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={22} color="#93c5fd" />
        </Pressable>
        <View>
          <Text style={styles.title}>Rate Your Form</Text>
          <Text style={styles.subtitle}>{name} • {sets} sets × {reps} reps</Text>
        </View>
      </View>
      <View style={styles.hero}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons name="dumbbell" size={26} color="#93c5fd" />
        </View>
        <Text style={styles.exerciseName}>{name}</Text>
        <Text style={styles.exerciseMeta}>{sets} sets × {reps} reps</Text>
      </View>
      <View style={[styles.feedbackCard, { borderColor: feedbackColor, backgroundColor: `${feedbackColor}22` }]}>
        <Text style={[styles.feedbackTitle, { color: feedbackColor }]}>{feedback.title}</Text>
        <Text style={styles.feedbackMessage}>{feedback.message}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scoreList}>
        {scoreOptions.map((scoreOption) => {
          const color = getScoreColor(scoreOption);
          const isActive = scoreOption === selectedScore;
          return (
            <Pressable
              key={`score-${scoreOption}`}
              onPress={() => handlePick(scoreOption)}
              style={[
                styles.scoreRow,
                { borderColor: isActive ? color : 'rgba(255,255,255,0.08)', backgroundColor: isActive ? `${color}22` : '#1f232c' }
              ]}
            >
              <Text style={[styles.scoreLabel, { color: isActive ? '#f8fafc' : '#94a3b8' }]}>{getScoreLabel(scoreOption)}</Text>
              <Text style={[styles.scoreValue, { color }]}>{scoreOption}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 24
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.2)',
    marginRight: 12
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700'
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 4
  },
  hero: {
    alignItems: 'center',
    marginTop: 18
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  exerciseName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700'
  },
  exerciseMeta: {
    color: '#94a3b8',
    marginTop: 4
  },
  feedbackCard: {
    marginHorizontal: 22,
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1
  },
  feedbackTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4
  },
  feedbackMessage: {
    color: '#f8fafc',
    opacity: 0.7,
    textAlign: 'center'
  },
  scoreList: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 140
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
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800'
  }
});
