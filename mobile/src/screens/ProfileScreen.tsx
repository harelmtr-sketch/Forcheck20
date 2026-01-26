import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { loadWorkoutSession, type MuscleStatus } from '../utils/workoutStorage';
import { HumanBodyModel } from '../components/HumanBodyModel';
import type { RootStackParamList } from '../navigation/RootNavigator';

type TabKey = 'overview' | 'history' | 'friends' | 'muscles';

const mockHistory = [
  { date: 'Dec 27', score: 87, exercises: 5, grade: 'B+' },
  { date: 'Dec 26', score: 92, exercises: 6, grade: 'A' },
  { date: 'Dec 25', score: 85, exercises: 4, grade: 'B' },
  { date: 'Dec 24', score: 90, exercises: 5, grade: 'A-' },
  { date: 'Dec 23', score: 88, exercises: 5, grade: 'B+' }
];

const mockFriends = [
  { id: '1', name: 'Alex Chen', avatar: '😊', todayScore: 92, weeklyAverage: 88 },
  { id: '2', name: 'Sarah Kim', avatar: '⭐', todayScore: 88, weeklyAverage: 85 },
  { id: '3', name: 'You', avatar: '🔥', todayScore: 87, weeklyAverage: 83 },
  { id: '4', name: 'Mike Ross', avatar: '🏋️', todayScore: 85, weeklyAverage: 82 },
  { id: '5', name: 'Emma Stone', avatar: '🏆', todayScore: 82, weeklyAverage: 80 }
];

const statusColors: Record<MuscleStatus['status'], string> = {
  ready: '#22c55e',
  recovering: '#eab308',
  sore: '#ef4444'
};

const statusLabels: Record<MuscleStatus['status'], 'Recovered' | 'Active' | 'Sore'> = {
  ready: 'Recovered',
  recovering: 'Active',
  sore: 'Sore'
};

export function ProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [dailyScore, setDailyScore] = useState(0);
  const [workoutsToday, setWorkoutsToday] = useState(0);
  const [muscleStatus, setMuscleStatus] = useState<MuscleStatus[]>([]);

  const hydrate = useCallback(async () => {
    const session = await loadWorkoutSession();
    const scores = session.exercises.map((exercise) => exercise.score).filter((score): score is number => score !== null);
    setDailyScore(scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0);
    setWorkoutsToday(session.exercises.length);
    setMuscleStatus(session.muscleStatus ?? []);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useFocusEffect(
    useCallback(() => {
      hydrate();
    }, [hydrate])
  );

  const weeklyAverage = useMemo(() => {
    const total = mockHistory.reduce((sum, day) => sum + day.score, 0);
    return Math.round(total / mockHistory.length);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1117' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Your Profile</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Track your progress and recovery</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(59,130,246,0.2)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: '#60a5fa', fontSize: 18 }}>⚙️</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 16, backgroundColor: 'rgba(37,41,50,0.8)', borderRadius: 16, padding: 4 }}>
          {(['overview', 'history', 'friends', 'muscles'] as TabKey[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: activeTab === tab ? '#2563eb' : 'transparent',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: activeTab === tab ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: '700' }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {activeTab === 'overview' && (
          <View>
            <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>Today</Text>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 }}>{dailyScore}</Text>
              <Text style={{ color: '#94a3b8', marginTop: 6 }}>{workoutsToday} exercises logged</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1, backgroundColor: '#1f2937', borderRadius: 16, padding: 14 }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Weekly Avg</Text>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 }}>{weeklyAverage}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#1f2937', borderRadius: 16, padding: 14 }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Streak</Text>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 }}>7 days</Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16 }}>
              <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 12 }}>Achievements</Text>
              {['Consistency Streak', 'Perfect Form', 'Power Builder'].map((label) => (
                <View key={label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ marginRight: 8 }}>🏅</Text>
                  <Text style={{ color: '#e2e8f0' }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View>
            <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 12 }}>Workout History</Text>
            {mockHistory.map((day) => (
              <View key={day.date} style={{ backgroundColor: '#252932', borderRadius: 18, padding: 16, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>{day.date}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>{day.exercises} exercises</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 18 }}>{day.score}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>{day.grade}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'friends' && (
          <View>
            <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 12 }}>Leaderboard</Text>
            {mockFriends.map((friend) => (
              <View key={friend.id} style={{ backgroundColor: '#252932', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 20 }}>{friend.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{friend.name}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>Avg {friend.weeklyAverage}</Text>
                </View>
                <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 18 }}>{friend.todayScore}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'muscles' && (
          <View>
            <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 12 }}>Muscle Status</Text>
            <View style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16, marginBottom: 16 }}>
              <HumanBodyModel muscleStatus={muscleStatus.map((muscle) => ({
                name: muscle.name,
                status: statusLabels[muscle.status],
                color: statusColors[muscle.status]
              }))} />
            </View>
            {muscleStatus.map((muscle) => (
              <View key={muscle.name} style={{ backgroundColor: '#252932', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{muscle.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: statusColors[muscle.status], marginRight: 8 }} />
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>{muscle.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
