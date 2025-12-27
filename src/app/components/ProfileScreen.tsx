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

// Mock data for friends leaderboard
const mockFriends: Friend[] = [
  { id: '1', name: 'Alex Chen', avatar: '🧑', todayScore: 92, weeklyAverage: 88 },
  { id: '2', name: 'Sarah Kim', avatar: '👩', todayScore: 88, weeklyAverage: 85 },
  { id: '3', name: 'You', avatar: '🔥', todayScore: 87, weeklyAverage: 83 },
  { id: '4', name: 'Mike Ross', avatar: '🧔', todayScore: 85, weeklyAverage: 82 },
  { id: '5', name: 'Emma Stone', avatar: '👱\u200d♀️', todayScore: 82, weeklyAverage: 80 },
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
  const [profileAvatar, setProfileAvatar] = useState('🔥');
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

  const avatarOptions = ['🔥', '💪', '⚡', '🏆', '👑', '🎯', '🚀', '⭐', '💎', '🦁'];

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Workout History</h3>
              <p className="text-sm text-muted-foreground font-medium">Last 7 days</p>
            </div>

            {/* Chart */}
            <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/15 border-blue-500/40">
              <h4 className="font-bold text-white mb-4">Score Trend</h4>
              <div className="flex items-end justify-between h-32 gap-2">
                {mockHistory.slice().reverse().map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-white/10 rounded-t-lg relative" style={{ height: `${day.score}%` }}>
                      <div className={`absolute inset-0 rounded-t-lg ${
                        day.score >= 90 ? 'bg-green-500' :
                        day.score >= 80 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`} />
                    </div>
                    <p className="text-[10px] text-white/70 font-semibold">{day.date.split(' ')[1]}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* History List */}
            <div className="space-y-2">
              {mockHistory.map((day, index) => (
                <Card key={index} className="p-4 bg-card border-border hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{day.date}</h4>
                      <p className="text-sm text-muted-foreground">{day.exercises} exercises</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white mb-1">{day.grade}</div>
                      <p className={`text-sm font-bold ${
                        day.score >= 90 ? 'text-green-400' :
                        day.score >= 80 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {day.score}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Progress Pics */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Progress Photos</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-purple-600/20 to-blue-600/10 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'friends':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Leaderboard</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Friend
              </Button>
            </div>

            {/* Leaderboard */}
            <div className="space-y-2">
              {mockFriends.map((friend, index) => {
                const isYou = friend.name === 'You';
                return (
                  <Card 
                    key={friend.id} 
                    className={`p-4 transition-all ${
                      isYou 
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 border-purple-500/50 shadow-lg' 
                        : 'bg-card border-border hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500/30 text-yellow-400 border-2 border-yellow-500/50' :
                        index === 1 ? 'bg-gray-400/30 text-gray-300 border-2 border-gray-400/50' :
                        index === 2 ? 'bg-orange-500/30 text-orange-400 border-2 border-orange-500/50' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-3xl">{friend.avatar}</div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${isYou ? 'text-white' : 'text-white'}`}>
                          {friend.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Avg: {friend.weeklyAverage}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-black ${
                          friend.todayScore >= 90 ? 'text-green-400' :
                          friend.todayScore >= 80 ? 'text-yellow-400' :
                          'text-orange-400'
                        }`}>
                          {friend.todayScore}
                        </p>
                        <p className="text-xs text-white/60">today</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Weekly Challenge */}
            <Card className="p-5 bg-gradient-to-br from-orange-600/20 to-red-600/10 border-orange-500/40 mt-6">
              <h4 className="font-bold text-white mb-2">🏆 Weekly Challenge</h4>
              <p className="text-sm text-white/80 mb-3">
                Complete 5 workouts with 85+ score
              </p>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all"
                  style={{ width: '60%' }}
                />
              </div>
              <p className="text-xs text-white/60 mt-2">3/5 completed</p>
            </Card>
          </div>
        );

      case 'muscles':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Muscle Status</h3>
            <HumanBodyModel muscleStatus={muscleStatus} />
            
            <div className="space-y-2 mt-6">
              {muscleStatus.map((muscle) => (
                <Card key={muscle.key} className="p-3 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{muscle.name}</h4>
                      <p className="text-xs text-muted-foreground">{muscle.lastTrained}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        muscle.status === 'ready' 
                          ? 'bg-green-500/20 text-green-400' 
                          : muscle.status === 'sore'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {muscle.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default: // overview
        return (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/40 text-center">
                <p className="text-3xl mb-1">🏋️</p>
                <p className="text-2xl font-black text-white mb-1">{totalWorkouts}</p>
                <p className="text-xs text-blue-200 font-semibold">Workouts</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-orange-600/20 to-orange-500/10 border-orange-500/40 text-center">
                <p className="text-3xl mb-1">🔥</p>
                <p className="text-2xl font-black text-white mb-1">{dayStreak}</p>
                <p className="text-xs text-orange-200 font-semibold">Day Streak</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-600/20 to-green-500/10 border-green-500/40 text-center">
                <p className="text-3xl mb-1">⭐</p>
                <p className="text-2xl font-black text-white mb-1">{avgScore}</p>
                <p className="text-xs text-green-200 font-semibold">Avg Score</p>
              </Card>
            </div>

            {/* Goals & Profile Actions */}
            <div className="space-y-3">
              <Card 
                onClick={() => setShowGoals(true)}
                className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/10 border-purple-500/30 cursor-pointer hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-bold text-white">Goals & Targets</h4>
                      <p className="text-xs text-muted-foreground">{workoutGoal}/week workouts • {proteinGoal}g protein</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>

              <Card 
                onClick={() => setShowProfileEdit(true)}
                className="p-4 bg-card border-border cursor-pointer hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="font-bold text-white">Edit Profile</h4>
                      <p className="text-xs text-muted-foreground">Change avatar & name</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            </div>

            {/* Personal Bests */}
            <div className="pt-4">
              <h3 className="font-bold text-lg mb-3">Personal Bests</h3>
              <div className="space-y-2">
                {[
                  { name: 'Pull-ups', value: '15', emoji: '🏋️' },
                  { name: 'Push-ups', value: '50', emoji: '💪' },
                  { name: 'Plank', value: '3:00', emoji: '🔥' },
                ].map((record, i) => (
                  <Card key={i} className="p-3 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{record.emoji}</span>
                        <p className="font-bold text-white text-sm">{record.name}</p>
                      </div>
                      <p className="text-xl font-black text-white">{record.value}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-8 relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/20 border-2 border-purple-500/50 flex items-center justify-center text-3xl">
                {profileAvatar}
              </div>
              <div>
                <h1 className="font-bold">{profileName}</h1>
                <p className="text-sm text-muted-foreground font-medium">Track your progress</p>
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-border/50 overflow-x-auto">
        <div className="flex gap-2">
          {[
            { id: 'overview' as Tab, label: 'Overview', icon: Trophy },
            { id: 'history' as Tab, label: 'History', icon: BarChart3 },
            { id: 'friends' as Tab, label: 'Friends', icon: Users },
            { id: 'muscles' as Tab, label: 'Muscles', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-6 max-w-sm w-full bg-card">
            <h3 className="font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Choose Avatar</label>
                <div className="grid grid-cols-5 gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setProfileAvatar(avatar)}
                      className={`text-3xl p-3 rounded-lg transition-all ${
                        profileAvatar === avatar 
                          ? 'bg-purple-600/30 border-2 border-purple-500/50 scale-110' 
                          : 'bg-secondary hover:bg-white/10'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Profile Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/80 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40"
                />
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <Card className="p-6 max-w-sm w-full bg-card">
            <h3 className="font-bold mb-4">Your Goals</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                  <span className="text-xl">🏋️</span>
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
                  <span className="text-xl">🔥</span>
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
                  <span className="text-xl">💪</span>
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