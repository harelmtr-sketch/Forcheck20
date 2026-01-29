import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { DailyBreakdownStory } from '../components/DailyBreakdownStory';

type Story = {
  id: string;
  userName: string;
  userAvatar: string;
  score: number;
  exercise: string;
  timestamp: string;
};

type FeedPost = {
  id: string;
  userName: string;
  userAvatar: string;
  streakDays: number;
  exercise: string;
  score: number;
  aiCaption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: string;
};

type LeaderboardEntry = {
  rank: number;
  userName: string;
  userAvatar: string;
  weeklyScore: number;
  streak: number;
};

const storiesData: Story[] = [
  { id: 's1', userName: 'Alex Chen', userAvatar: '😊', score: 92, exercise: 'Push-ups', timestamp: '2h ago' },
  { id: 's2', userName: 'Sarah Kim', userAvatar: '😎', score: 88, exercise: 'Pull-ups', timestamp: '4h ago' },
  { id: 's3', userName: 'Mike Ross', userAvatar: '🔥', score: 85, exercise: 'Squats', timestamp: '6h ago' },
  { id: 's4', userName: 'Emma Stone', userAvatar: '💪', score: 78, exercise: 'Dips', timestamp: '8h ago' },
  { id: 's5', userName: 'James Lee', userAvatar: '⚡', score: 95, exercise: 'Muscle-ups', timestamp: '10h ago' }
];

const initialFeed: FeedPost[] = [
  {
    id: 'p1',
    userName: 'Alex Chen',
    userAvatar: '😊',
    streakDays: 7,
    exercise: 'Diamond Push-ups',
    score: 92,
    aiCaption: 'Perfect form! Elbows stayed tight throughout the movement. Great core stability.',
    likes: 24,
    comments: 5,
    isLiked: false,
    isSaved: false,
    timestamp: '2 hours ago'
  },
  {
    id: 'p2',
    userName: 'Sarah Kim',
    userAvatar: '😎',
    streakDays: 12,
    exercise: 'Archer Pull-ups',
    score: 88,
    aiCaption: 'Strong pull! Try slowing down the eccentric phase for even better results.',
    likes: 31,
    comments: 8,
    isLiked: true,
    isSaved: false,
    timestamp: '4 hours ago'
  },
  {
    id: 'p3',
    userName: 'James Lee',
    userAvatar: '⚡',
    streakDays: 21,
    exercise: 'Muscle-up',
    score: 95,
    aiCaption: 'Explosive power! Transition was clean and controlled. Elite level execution.',
    likes: 52,
    comments: 12,
    isLiked: false,
    isSaved: true,
    timestamp: '6 hours ago'
  },
  {
    id: 'p4',
    userName: 'Mike Ross',
    userAvatar: '🔥',
    streakDays: 5,
    exercise: 'Pistol Squats',
    score: 85,
    aiCaption: 'Good depth and balance. Focus on keeping knee aligned over toes.',
    likes: 18,
    comments: 3,
    isLiked: false,
    isSaved: false,
    timestamp: '8 hours ago'
  }
];

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, userName: 'James Lee', userAvatar: '⚡', weeklyScore: 95, streak: 21 },
  { rank: 2, userName: 'Alex Chen', userAvatar: '😊', weeklyScore: 92, streak: 7 },
  { rank: 3, userName: 'Sarah Kim', userAvatar: '😎', weeklyScore: 88, streak: 12 },
  { rank: 4, userName: 'Mike Ross', userAvatar: '🔥', weeklyScore: 85, streak: 5 },
  { rank: 5, userName: 'Emma Stone', userAvatar: '💪', weeklyScore: 78, streak: 3 }
];

export function FriendsScreen() {
  const [activeSection, setActiveSection] = useState<'feed' | 'leaderboard'>('feed');
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(initialFeed);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showStory, setShowStory] = useState(false);

  const headerSubtitle = useMemo(() => (
    activeSection === 'feed' ? "See who's crushing it" : 'Weekly leaderboard'
  ), [activeSection]);

  const handleLike = (postId: string) => {
    setFeedPosts((prev) => prev.map((post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1
      };
    }));
  };

  const handleSave = (postId: string) => {
    setFeedPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1117' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>👥</Text>
            </View>
            <View>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Friends</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{headerSubtitle}</Text>
            </View>
          </View>
          <Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(59,130,246,0.2)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#60a5fa', fontSize: 18 }}>💬</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 16, backgroundColor: 'rgba(37,41,50,0.8)', borderRadius: 16, padding: 4 }}>
          <Pressable
            onPress={() => setActiveSection('feed')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeSection === 'feed' ? '#2563eb' : 'transparent',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: activeSection === 'feed' ? '#fff' : '#94a3b8', fontWeight: '700', fontSize: 12 }}>Feed</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveSection('leaderboard')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeSection === 'leaderboard' ? '#2563eb' : 'transparent',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: activeSection === 'leaderboard' ? '#fff' : '#94a3b8', fontWeight: '700', fontSize: 12 }}>Leaderboard</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {activeSection === 'feed' ? (
          <View>
            <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
              <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 8 }}>⚡ Recent Stories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {storiesData.map((story) => (
                  <Pressable
                    key={story.id}
                    onPress={() => {
                      setActiveStory(story);
                      setShowStory(true);
                    }}
                    style={{ marginRight: 16, alignItems: 'center' }}
                  >
                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#1d4ed8', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24 }}>{story.userAvatar}</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 12, marginTop: 8 }}>{story.userName.split(' ')[0]}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 10 }}>{story.score} • {story.exercise}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
              {feedPosts.map((post) => (
                <View key={post.id} style={{ backgroundColor: '#252932', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ fontSize: 20 }}>{post.userAvatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>{post.userName}</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 12 }}>{post.exercise} • {post.timestamp}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 16 }}>{post.score}</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 10 }}>{post.streakDays} day streak</Text>
                    </View>
                  </View>

                  <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>{post.aiCaption}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Pressable onPress={() => handleLike(post.id)} style={{ marginRight: 16 }}>
                        <Text style={{ color: post.isLiked ? '#ef4444' : '#94a3b8' }}>{post.isLiked ? '❤️' : '🤍'} {post.likes}</Text>
                      </Pressable>
                      <Text style={{ color: '#94a3b8' }}>💬 {post.comments}</Text>
                    </View>
                    <Pressable onPress={() => handleSave(post.id)}>
                      <Text style={{ color: post.isSaved ? '#60a5fa' : '#94a3b8' }}>{post.isSaved ? '🔖 Saved' : '🔖 Save'}</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
            {leaderboardData.map((entry) => (
              <View key={entry.userName} style={{ backgroundColor: '#252932', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 18 }}>{entry.userAvatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{entry.rank}. {entry.userName}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>{entry.streak} day streak</Text>
                </View>
                <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 18 }}>{entry.weeklyScore}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <DailyBreakdownStory
        visible={showStory}
        story={activeStory ? {
          userName: activeStory.userName,
          score: activeStory.score,
          exercise: activeStory.exercise,
          timestamp: activeStory.timestamp
        } : null}
        onClose={() => setShowStory(false)}
      />
    </View>
  );
}
