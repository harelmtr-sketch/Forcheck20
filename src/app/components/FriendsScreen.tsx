import { useState } from 'react';
import { MessageCircle, Heart, MessageSquare, Bookmark, Share2, TrendingUp, Trophy, Zap, Users } from 'lucide-react';
import { getScoreColor } from '@/app/utils/scoreColors';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  exercise: string;
  videoThumb: string;
  timestamp: string;
}

interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  streakDays: number;
  exercise: string;
  score: number;
  aiCaption: string;
  videoThumb: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  isBoosted: boolean;
  timestamp: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  weeklyScore: number;
  streak: number;
}

export const FriendsScreen = () => {
  const [activeSection, setActiveSection] = useState<'feed' | 'leaderboard'>('feed');
  
  // Mock data - Stories
  const [stories] = useState<Story[]>([
    {
      id: 's1',
      userId: 'u1',
      userName: 'Alex Chen',
      userAvatar: '😊',
      score: 92,
      exercise: 'Push-ups',
      videoThumb: '',
      timestamp: '2h ago'
    },
    {
      id: 's2',
      userId: 'u2',
      userName: 'Sarah Kim',
      userAvatar: '😎',
      score: 88,
      exercise: 'Pull-ups',
      videoThumb: '',
      timestamp: '4h ago'
    },
    {
      id: 's3',
      userId: 'u3',
      userName: 'Mike Ross',
      userAvatar: '🔥',
      score: 85,
      exercise: 'Squats',
      videoThumb: '',
      timestamp: '6h ago'
    },
    {
      id: 's4',
      userId: 'u4',
      userName: 'Emma Stone',
      userAvatar: '💪',
      score: 78,
      exercise: 'Dips',
      videoThumb: '',
      timestamp: '8h ago'
    },
    {
      id: 's5',
      userId: 'u5',
      userName: 'James Lee',
      userAvatar: '⚡',
      score: 95,
      exercise: 'Muscle-ups',
      videoThumb: '',
      timestamp: '10h ago'
    }
  ]);

  // Mock data - Feed
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 'p1',
      userId: 'u1',
      userName: 'Alex Chen',
      userAvatar: '😊',
      streakDays: 7,
      exercise: 'Diamond Push-ups',
      score: 92,
      aiCaption: 'Perfect form! Elbows stayed tight throughout the movement. Great core stability.',
      videoThumb: '',
      likes: 24,
      comments: 5,
      isLiked: false,
      isSaved: false,
      isBoosted: true,
      timestamp: '2 hours ago'
    },
    {
      id: 'p2',
      userId: 'u2',
      userName: 'Sarah Kim',
      userAvatar: '😎',
      streakDays: 12,
      exercise: 'Archer Pull-ups',
      score: 88,
      aiCaption: 'Strong pull! Try slowing down the eccentric phase for even better results.',
      videoThumb: '',
      likes: 31,
      comments: 8,
      isLiked: true,
      isSaved: false,
      isBoosted: false,
      timestamp: '4 hours ago'
    },
    {
      id: 'p3',
      userId: 'u5',
      userName: 'James Lee',
      userAvatar: '⚡',
      streakDays: 21,
      exercise: 'Muscle-up',
      score: 95,
      aiCaption: 'Explosive power! Transition was clean and controlled. Elite level execution.',
      videoThumb: '',
      likes: 52,
      comments: 12,
      isLiked: false,
      isSaved: true,
      isBoosted: true,
      timestamp: '6 hours ago'
    },
    {
      id: 'p4',
      userId: 'u3',
      userName: 'Mike Ross',
      userAvatar: '🔥',
      streakDays: 5,
      exercise: 'Pistol Squats',
      score: 85,
      aiCaption: 'Good depth and balance. Focus on keeping knee aligned over toes.',
      videoThumb: '',
      likes: 18,
      comments: 3,
      isLiked: false,
      isSaved: false,
      isBoosted: false,
      timestamp: '8 hours ago'
    }
  ]);

  // Mock data - Leaderboard
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, userId: 'u5', userName: 'James Lee', userAvatar: '⚡', weeklyScore: 95, streak: 21 },
    { rank: 2, userId: 'u1', userName: 'Alex Chen', userAvatar: '😊', weeklyScore: 92, streak: 7 },
    { rank: 3, userId: 'u2', userName: 'Sarah Kim', userAvatar: '😎', weeklyScore: 88, streak: 12 },
    { rank: 4, userId: 'u3', userName: 'Mike Ross', userAvatar: '🔥', weeklyScore: 85, streak: 5 },
    { rank: 5, userId: 'u4', userName: 'Emma Stone', userAvatar: '💪', weeklyScore: 78, streak: 3 }
  ]);

  const handleLike = (postId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleSave = (postId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0f1117] via-[#1a1d23] to-[#0a0d12] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Friends</h1>
              <p className="text-xs text-gray-400 font-medium">See who's crushing it</p>
            </div>
          </div>
          <button className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center transition-all active:scale-95 hover:bg-blue-500/30">
            <MessageCircle className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* Section Toggle */}
        <div className="flex gap-2 bg-[#252932]/80 backdrop-blur-xl rounded-xl p-1">
          <button
            onClick={() => setActiveSection('feed')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
              activeSection === 'feed'
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveSection('leaderboard')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
              activeSection === 'leaderboard'
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeSection === 'feed' ? (
        <div className="flex-1 overflow-y-auto">
          {/* Stories Section */}
          <div className="px-6 py-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Recent Stories</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {stories.map((story) => (
                <button
                  key={story.id}
                  className="flex flex-col items-center gap-2 flex-shrink-0 transition-all active:scale-95"
                >
                  <div className="relative">
                    {/* Score-colored ring */}
                    <div 
                      className="w-20 h-20 rounded-full p-[3px]"
                      style={{
                        background: `linear-gradient(135deg, ${
                          story.score >= 85 ? '#10b981, #059669' : 
                          story.score >= 70 ? '#f59e0b, #d97706' : 
                          '#ef4444, #dc2626'
                        })`
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-[#1a1d23] flex items-center justify-center border-2 border-[#0a0d12]">
                        <div className="text-3xl">{story.userAvatar}</div>
                      </div>
                    </div>
                    {/* Active indicator */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-[#0a0d12] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white truncate max-w-[80px]">
                      {story.userName.split(' ')[0]}
                    </p>
                    <p className={`text-[10px] font-bold ${getScoreColor(story.score)}`}>
                      {story.score}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feed */}
          <div className="px-6 py-4 space-y-6">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                className={`bg-gradient-to-br from-[#252932] to-[#1a1d23] rounded-2xl overflow-hidden border ${
                  post.isBoosted 
                    ? 'border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                    : 'border-white/[0.08]'
                }`}
              >
                {/* Boosted Label */}
                {post.isBoosted && (
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/20 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Featured</span>
                  </div>
                )}

                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg">
                      {post.userAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{post.userName}</h3>
                        {post.streakDays >= 7 && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-500/20 rounded-full border border-orange-400/30">
                            <div className="w-3 h-3 text-[10px] flex items-center justify-center">🔥</div>
                            <span className="text-[10px] font-bold text-orange-400">{post.streakDays}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-medium">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center transition-all active:scale-95 hover:bg-blue-500/20">
                    <Share2 className="w-4 h-4 text-blue-400" />
                  </button>
                </div>

                {/* Video/Image Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-y border-white/[0.08] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-3">🎥</div>
                    <p className="text-sm font-bold text-white">{post.exercise}</p>
                  </div>
                  
                  {/* Score Badge */}
                  <div className="absolute top-4 right-4">
                    <div 
                      className={`px-4 py-2 rounded-xl backdrop-blur-xl border-2 shadow-2xl ${
                        post.score >= 85 
                          ? 'bg-green-600/90 border-green-400/50 shadow-green-500/50' 
                          : post.score >= 70 
                            ? 'bg-yellow-600/90 border-yellow-400/50 shadow-yellow-500/50' 
                            : 'bg-red-600/90 border-red-400/50 shadow-red-500/50'
                      }`}
                    >
                      <div className={`text-2xl font-black text-white`}>
                        {post.score}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Caption */}
                <div className="px-4 py-3 border-b border-white/[0.08]">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-blue-400 font-semibold">AI Analysis: </span>
                    {post.aiCaption}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          post.isLiked
                            ? 'fill-red-500 text-red-500 scale-110'
                            : 'text-gray-400 hover:text-red-400'
                        }`}
                      />
                      <span className={`text-sm font-semibold ${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                        {post.likes}
                      </span>
                    </button>

                    <button className="flex items-center gap-2 transition-all active:scale-95 hover:scale-105">
                      <MessageSquare className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
                      <span className="text-sm font-semibold text-gray-400">{post.comments}</span>
                    </button>

                    <button
                      onClick={() => handleSave(post.id)}
                      className="transition-all active:scale-95"
                    >
                      <Bookmark
                        className={`w-5 h-5 transition-all ${
                          post.isSaved
                            ? 'fill-blue-500 text-blue-500 scale-110'
                            : 'text-gray-400 hover:text-blue-400'
                        }`}
                      />
                    </button>
                  </div>

                  <button className="px-4 py-2 bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-lg transition-all active:scale-95 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    Try This
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Leaderboard View */
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`p-4 rounded-2xl border transition-all ${
                  entry.rank <= 3
                    ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-gradient-to-br from-[#252932] to-[#1a1d23] border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-10 flex-shrink-0">
                    {entry.rank <= 3 ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#1a1d23] border border-white/[0.08] flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-400">{entry.rank}</span>
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                    {entry.userAvatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm mb-1 truncate">{entry.userName}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">Score:</span>
                        <span className={`text-xs font-bold ${getScoreColor(entry.weeklyScore)}`}>
                          {entry.weeklyScore}
                        </span>
                      </div>
                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">🔥</span>
                          <span className="text-xs font-bold text-orange-400">{entry.streak}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medal for top 3 */}
                  {entry.rank === 1 && <div className="text-2xl">🥇</div>}
                  {entry.rank === 2 && <div className="text-2xl">🥈</div>}
                  {entry.rank === 3 && <div className="text-2xl">🥉</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Reset Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
            <p className="text-xs text-center text-blue-300 font-medium">
              Leaderboard resets every Monday at 12:00 AM
            </p>
          </div>
        </div>
      )}
    </div>
  );
};