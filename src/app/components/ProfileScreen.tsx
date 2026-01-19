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

            {/* Line graph */}
            <Card className="p-5 bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-white/70 font-medium mb-1">Weekly Average</p>
                  <p className="font-black text-white">{weeklyAverage}</p>
                </div>
                <BarChart3 className="w-5 h-5 text-blue-400" />
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

            {/* Workout history list */}
            <div className="space-y-2">
              {mockHistory.map((day, i) => (
                <Card
                  key={i}
                  className="p-4 bg-card/50 border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                      <p className="font-black text-white">{day.grade}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{day.date}</p>
                      <p className="text-xs text-white/70 font-medium">{day.exercises} exercises</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white">{day.score}</p>
                    <p className="text-xs text-white/70 font-medium">score</p>
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

            <Card className="p-5 bg-gradient-to-br from-orange-600/20 to-red-600/10 border-orange-500/40 mt-6">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Weekly Challenge
              </h4>
              <p className="text-sm text-white/80 mb-3">
                First to hit 95+ score wins!
              </p>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '87%' }} />
              </div>
              <p className="text-xs text-white/70 mt-2 font-medium">87/95 - Keep pushing!</p>
            </Card>

            <div className="space-y-2">
              {mockFriends.map((friend, i) => (
                <Card
                  key={friend.id}
                  className={`p-4 flex items-center justify-between ${
                    friend.name === 'You'
                      ? 'bg-gradient-to-br from-blue-600/30 to-blue-500/20 border-blue-500/50'
                      : 'bg-card/50 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        i === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        i === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                        'bg-gradient-to-br from-blue-600 to-blue-700'
                      }`}>
                        <div className="text-white">
                          {getAvatarIcon(friend.avatar)}
                        </div>
                      </div>
                      {i < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-black">{i + 1}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{friend.name}</p>
                      <p className="text-xs text-white/70 font-medium">Avg: {friend.weeklyAverage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white">{friend.todayScore}</p>
                    <p className="text-xs text-white/70 font-medium">today</p>
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
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/40 text-center">
                <Dumbbell className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                <p className="text-2xl font-black text-white mb-1">{totalWorkouts}</p>
                <p className="text-xs text-white/70 font-medium">Workouts</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-orange-600/20 to-orange-500/10 border-orange-500/40 text-center">
                <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                <p className="text-2xl font-black text-white mb-1">{dayStreak}</p>
                <p className="text-xs text-white/70 font-medium">Day Streak</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-600/20 to-green-500/10 border-green-500/40 text-center">
                <Star className="w-6 h-6 mx-auto mb-1 text-green-400" />
                <p className="text-2xl font-black text-white mb-1">{avgScore}</p>
                <p className="text-xs text-white/70 font-medium">Avg Score</p>
              </Card>
            </div>

            {/* Personal Bests */}
            <Card className="p-5 bg-card/50 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-white">Personal Bests</h4>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Pull-ups', value: '15', icon: Dumbbell },
                  { name: 'Push-ups', value: '50', icon: Zap },
                  { name: 'Plank', value: '3:00', icon: Flame },
                ].map((record, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <record.icon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white/80 font-medium">{record.name}</span>
                    </div>
                    <span className="font-bold text-white">{record.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => setShowGoals(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 border-none justify-between"
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
                className="w-full justify-between border-white/20"
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
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setShowProfileEdit(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center cursor-pointer"
          >
            <div className="text-white">
              {getAvatarIcon(profileAvatar)}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white">{profileName}</h2>
            <p className="text-xs text-white/70 font-medium">Tap to edit profile</p>
          </div>
        </div>
        <Button
          onClick={onOpenSettings}
          variant="ghost"
          size="sm"
          className="text-white/80"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'history', label: 'History', icon: BarChart3 },
          { id: 'friends', label: 'Friends', icon: Users },
          { id: 'muscles', label: 'Muscles', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
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
