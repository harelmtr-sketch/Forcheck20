import { useState } from 'react';
import {
  Settings,
  Trophy,
  Users,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Image,
  Plus,
  Edit2,
  Target,
  Zap,
  Flame,
  Award,
  Crown,
  Rocket,
  Star,
  Gem,
  Activity,
  Dumbbell,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { HumanBodyModel } from "./HumanBodyModel";
import type { Exercise, MuscleStatus, Friend } from '../App';
import { getScoreColor, getScoreGlow, getScoreBgColor, getScoreBorderColor, getScoreShadowColor } from '../utils/scoreColors';

interface ProfileScreenProps {
  onOpenSettings: () => void;
  exercises: Exercise[];
  muscleStatus: MuscleStatus[];
}

type Tab = 'overview' | 'history' | 'friends' | 'muscles';

// Icon component mapping
const getAvatarIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    'activity': Activity,
    'star': Star,
    'flame': Flame,
    'dumbbell': Dumbbell,
    'trophy': Trophy,
    'crown': Crown,
    'target': Target,
    'rocket': Rocket,
    'gem': Gem,
    'zap': Zap,
  };
  const IconComponent = icons[iconName] || Flame;
  return <IconComponent className="w-5 h-5" />;
};

// Mock data for friends leaderboard
const mockFriends: Friend[] = [
  { id: '1', name: 'Alex Chen', avatar: 'activity', todayScore: 92, weeklyAverage: 88 },
  { id: '2', name: 'Sarah Kim', avatar: 'star', todayScore: 88, weeklyAverage: 85 },
  { id: '3', name: 'You', avatar: 'flame', todayScore: 87, weeklyAverage: 83 },
  { id: '4', name: 'Mike Ross', avatar: 'dumbbell', todayScore: 85, weeklyAverage: 82 },
  { id: '5', name: 'Emma Stone', avatar: 'trophy', todayScore: 82, weeklyAverage: 80 },
];

// Mock workout history data
const mockHistory = [
  { date: 'Dec 27', score: 87, exercises: 5, grade: 'B+' },
  { date: 'Dec 26', score: 92, exercises: 6, grade: 'A' },
  { date: 'Dec 25', score: 85, exercises: 4, grade: 'B' },
  { date: 'Dec 24', score: 90, exercises: 5, grade: 'A-' },
  { date: 'Dec 23', score: 88, exercises: 5, grade: 'B+' },
  { date: 'Dec 22', score: 91, exercises: 6, grade: 'A' },
  { date: 'Dec 21', score: 86, exercises: 4, grade: 'B' },
];

export function ProfileScreen({
  onOpenSettings,
  exercises,
  muscleStatus,
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileName, setProfileName] = useState('Your Profile');
  const [profileAvatar, setProfileAvatar] = useState('flame');
  const [showGoals, setShowGoals] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(2400);
  const [proteinGoal, setProteinGoal] = useState(180);
  const [workoutGoal, setWorkoutGoal] = useState(5);

  // Calculate stats
  const totalWorkouts = 28;
  const dayStreak = 7;
  const avgScore = exercises.length > 0
    ? Math.round(exercises.reduce((sum, ex) => sum + ex.score, 0) / exercises.length)
    : 88;

  const weeklyAverage = Math.round(mockHistory.reduce((sum, h) => sum + h.score, 0) / mockHistory.length);

  const avatarOptions = ['flame', 'dumbbell', 'zap', 'trophy', 'crown', 'target', 'rocket', 'star', 'gem', 'activity'];

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Workout History</h3>
              <p className="text-sm text-muted-foreground font-medium">Last 7 days</p>
            </div>

            {/* Line graph with enhanced styling */}
            <Card className="p-5 bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-blue-500/30 shadow-xl shadow-blue-500/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Weekly Average</p>
                  <p className={`text-3xl font-black ${getScoreColor(weeklyAverage)} ${getScoreGlow(weeklyAverage)}`}>{weeklyAverage}</p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <BarChart3 className="w-5 h-5 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
                </div>
              </div>

              <div className="relative h-32 flex items-end justify-between gap-2">
                {mockHistory.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all"
                        style={{ height: `${(day.score / 100) * 120}px` }}
                      />
                    </div>
                    <p className="text-xs text-white/50 font-medium">{day.date.split(' ')[1]}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Workout history list with score colors */}
            <div className="space-y-2">
              {mockHistory.map((day, i) => (
                <Card
                  key={i}
                  className="group p-4 bg-gradient-to-br from-card to-gray-900/50 border border-border/50 flex items-center justify-between hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreBgColor(day.score)} border ${getScoreBorderColor(day.score)} flex items-center justify-center shadow-md ${getScoreShadowColor(day.score)}`}>
                      <p className={`font-black ${getScoreColor(day.score)}`}>{day.grade}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{day.date}</p>
                      <p className="text-xs text-muted-foreground font-medium">{day.exercises} exercises</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${getScoreColor(day.score)} ${getScoreGlow(day.score)}`}>{day.score}</p>
                    <p className="text-xs text-muted-foreground font-medium">score</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'friends':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Leaderboard</h3>
              <p className="text-sm text-muted-foreground font-medium">Today</p>
            </div>

            <Card className="p-5 bg-gradient-to-br from-orange-600/20 to-red-600/10 border border-orange-500/40 mt-6 shadow-lg shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <Trophy className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                </div>
                Weekly Challenge
              </h4>
              <p className="text-sm text-white/80 mb-3">
                First to hit 95+ score wins!
              </p>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all duration-500" style={{ width: '87%' }} />
              </div>
              <p className="text-xs text-orange-300 mt-2 font-medium">87/95 - Keep pushing!</p>
            </Card>

            <div className="space-y-2">
              {mockFriends.map((friend, i) => (
                <Card
                  key={friend.id}
                  className={`group p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] ${
                    friend.name === 'You'
                      ? 'bg-gradient-to-br from-blue-600/30 to-blue-500/20 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-gradient-to-br from-card to-gray-900/50 border border-border/50 hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        i === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/40' :
                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-400/40' :
                        i === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 shadow-orange-600/40' :
                        'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-600/40'
                      }`}>
                        <div className="text-white drop-shadow-md">
                          {getAvatarIcon(friend.avatar)}
                        </div>
                      </div>
                      {i < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-md">
                          <span className="text-xs font-black text-white">{i + 1}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{friend.name}</p>
                      <p className={`text-xs font-medium ${getScoreColor(friend.weeklyAverage)}`}>Avg: {friend.weeklyAverage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${getScoreColor(friend.todayScore)} ${getScoreGlow(friend.todayScore)}`}>{friend.todayScore}</p>
                    <p className="text-xs text-muted-foreground font-medium">today</p>
                  </div>
                </Card>
              ))}
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 border-none">
              <Plus className="w-4 h-4 mr-2" />
              Add Friends
            </Button>
          </div>
        );

      case 'muscles':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Muscle Status</h3>
              <p className="text-sm text-muted-foreground font-medium">Recovery tracker</p>
            </div>

            <Card className="p-5 bg-gradient-to-br from-purple-600/20 to-purple-500/10 border-purple-500/40">
              <HumanBodyModel muscleStatus={muscleStatus} />
              <div className="mt-4 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white/80">Recovered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-white/80">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-white/80">Sore</span>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              {muscleStatus.map((muscle, i) => (
                <Card key={i} className="p-4 bg-card/50 border-white/10 flex items-center justify-between">
                  <p className="font-bold text-white">{muscle.name}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      muscle.status === 'recovered' ? 'bg-green-500' :
                      muscle.status === 'active' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <p className="text-sm text-white/70 font-medium capitalize">{muscle.status}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid with enhanced depth */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/40 text-center shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <div className="p-2 bg-blue-500/20 rounded-lg inline-flex mb-2 border border-blue-500/30">
                  <Dumbbell className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                </div>
                <p className="text-2xl font-black text-white mb-1">{totalWorkouts}</p>
                <p className="text-xs text-muted-foreground font-medium">Workouts</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-600/20 to-orange-600/10 border border-red-500/40 text-center shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105">
                <div className="p-2 bg-red-500/20 rounded-lg inline-flex mb-2 border border-red-500/30">
                  <Flame className="w-6 h-6 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]" />
                </div>
                <p className="text-2xl font-black text-red-400 mb-1 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]">{dayStreak}</p>
                <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
              </Card>
              <Card className={`p-4 bg-gradient-to-br ${getScoreBgColor(avgScore)} border ${getScoreBorderColor(avgScore)} text-center shadow-lg ${getScoreShadowColor(avgScore)} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <div className={`p-2 ${getScoreBgColor(avgScore)} rounded-lg inline-flex mb-2 border ${getScoreBorderColor(avgScore)}`}>
                  <Star className={`w-6 h-6 ${getScoreColor(avgScore)} drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]`} />
                </div>
                <p className={`text-2xl font-black mb-1 ${getScoreColor(avgScore)} ${getScoreGlow(avgScore)}`}>{avgScore}</p>
                <p className="text-xs text-muted-foreground font-medium">Avg Score</p>
              </Card>
            </div>

            {/* Personal Bests with enhanced styling */}
            <Card className="p-5 bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-gray-800/50 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  </div>
                  Personal Bests
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Pull-ups', value: '15', icon: Dumbbell },
                  { name: 'Push-ups', value: '50', icon: Zap },
                  { name: 'Plank', value: '3:00', icon: Flame },
                ].map((record, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <record.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-white/80 font-medium">{record.name}</span>
                    </div>
                    <span className="font-bold text-blue-400">{record.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions with enhanced styling */}
            <div className="space-y-2">
              <Button
                onClick={() => setShowGoals(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 border-none justify-between shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Set Goals
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={onOpenSettings}
                variant="outline"
                className="w-full justify-between border border-border/50 hover:border-blue-500/40 hover:bg-gray-800/50 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Enhanced background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/15 via-transparent to-transparent z-0" />
      
      {/* Header with depth */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setShowProfileEdit(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-blue-400/30"
          >
            <div className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {getAvatarIcon(profileAvatar)}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">{ profileName}</h2>
            <p className="text-xs text-muted-foreground font-medium">Tap to edit profile</p>
          </div>
        </div>
        <Button
          onClick={onOpenSettings}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-white hover:bg-gray-800/50 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs with enhanced styling */}
      <div className="relative z-10 flex border-b border-border/50 bg-black/20 backdrop-blur-sm">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'history', label: 'History', icon: BarChart3 },
          { id: 'friends', label: 'Friends', icon: Users },
          { id: 'muscles', label: 'Muscles', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 shadow-[0_-2px_8px_rgba(59,130,246,0.3)]'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content with enhanced scrolling */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6 bg-gradient-to-br from-card to-card/80 border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Edit Profile</h3>
              <Button
                onClick={() => setShowProfileEdit(false)}
                variant="ghost"
                size="sm"
                className="text-white/80"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Avatar</label>
                <div className="grid grid-cols-5 gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setProfileAvatar(avatar)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        profileAvatar === avatar
                          ? 'bg-gradient-to-br from-blue-600 to-blue-500 scale-110'
                          : 'bg-secondary/60 hover:bg-secondary/80'
                      }`}
                    >
                      <div className="text-white">
                        {getAvatarIcon(avatar)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => setShowProfileEdit(false)}
                className="flex-1 bg-green-600/30 border-green-500/50"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowProfileEdit(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Goals Modal */}
      {showGoals && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6 bg-gradient-to-br from-card to-card/80 border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Set Your Goals</h3>
              <Button
                onClick={() => setShowGoals(false)}
                variant="ghost"
                size="sm"
                className="text-white/80"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Workouts per Week
                </label>
                <input
                  type="number"
                  value={workoutGoal}
                  onChange={(e) => setWorkoutGoal(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Daily Protein Goal (g)
                </label>
                <input
                  type="number"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => setShowGoals(false)}
                className="flex-1 bg-green-600/30 border-green-500/50"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowGoals(false)}
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
