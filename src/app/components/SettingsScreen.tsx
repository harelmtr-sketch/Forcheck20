import { useState } from 'react';
import { ChevronLeft, Bell, Shield, Zap, Users, Moon, Globe, HelpCircle, LogOut, ChevronRight, Info, Heart, Mail, Twitter, Instagram, Github } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface SettingsScreenProps {
  onBack: () => void;
}

type SettingsView = 'main' | 'about' | 'support';

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [clearOnTemplate, setClearOnTemplate] = useState(false);
  const [autoSaveWorkouts, setAutoSaveWorkouts] = useState(true);
  const [showFormScore, setShowFormScore] = useState(true);
  const [scoreDisplayMode, setScoreDisplayMode] = useState<'letter' | 'number' | 'both'>('both');
  const [darkMode, setDarkMode] = useState(true);
  
  // Notifications
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [formTips, setFormTips] = useState(true);
  const [friendActivity, setFriendActivity] = useState(false);
  const [achievements, setAchievements] = useState(true);
  
  // Privacy
  const [profileVisibility, setProfileVisibility] = useState('friends');
  const [workoutSharing, setWorkoutSharing] = useState(false);
  const [leaderboard, setLeaderboard] = useState(true);
  
  // AI
  const [aiCoaching, setAiCoaching] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState('moderate');
  
  // App
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // ABOUT VIEW
  if (currentView === 'about') {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="font-bold">About Forcheck</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Meet the team
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6">
          {/* App Info */}
          <Card className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/15 border-indigo-500/40">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl shadow-purple-500/30">
                <span className="text-4xl">💪</span>
              </div>
              <h2 className="font-bold text-white text-2xl mb-2">Forcheck</h2>
              <p className="text-sm text-purple-200 font-medium">
                AI-Powered Calisthenics Form Analysis
              </p>
              <p className="text-xs text-purple-300 mt-2">Version 1.0.0</p>
            </div>
            <p className="text-sm text-white/80 text-center leading-relaxed">
              Forcheck uses advanced computer vision to analyze your workout form in real-time, providing instant feedback and personalized coaching to maximize your gains while minimizing injury risk.
            </p>
          </Card>

          {/* Developers */}
          <div>
            <h3 className="font-bold text-white mb-4">Built by Athletes, for Athletes</h3>
            
            <Card className="p-5 bg-card border-border mb-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                  👨‍💻
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">Harel Meltser</h4>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Co-Founder & Lead Developer
                  </p>
                  <p className="text-xs text-white/70">
                    Calisthenics athlete and software engineer passionate about combining fitness with technology.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-card border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                  👨‍💻
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">Gibor Bashari</h4>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Co-Founder & AI Engineer
                  </p>
                  <p className="text-xs text-white/70">
                    Machine learning expert and fitness enthusiast dedicated to perfecting form analysis algorithms.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Mission */}
          <Card className="p-5 bg-gradient-to-br from-green-600/15 to-emerald-600/10 border-green-500/30">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Our Mission
            </h4>
            <p className="text-sm text-white/80 leading-relaxed">
              To democratize access to professional-grade form coaching, helping athletes of all levels train smarter, prevent injuries, and achieve their fitness goals through the power of AI.
            </p>
          </Card>

          {/* Legal */}
          <div className="space-y-2">
            <button className="w-full text-left p-4 bg-card border border-border rounded-lg hover:bg-white/5 transition-colors">
              <p className="text-sm font-semibold text-white">Privacy Policy</p>
            </button>
            <button className="w-full text-left p-4 bg-card border border-border rounded-lg hover:bg-white/5 transition-colors">
              <p className="text-sm font-semibold text-white">Terms of Service</p>
            </button>
            <button className="w-full text-left p-4 bg-card border border-border rounded-lg hover:bg-white/5 transition-colors">
              <p className="text-sm font-semibold text-white">Licenses</p>
            </button>
          </div>

          <div className="text-center pt-4 pb-2">
            <p className="text-xs text-muted-foreground">© 2024 Forcheck. All rights reserved.</p>
            <p className="text-xs text-muted-foreground mt-1">Made with ❤️ by Meltser & Gibor</p>
          </div>
        </div>
      </div>
    );
  }

  // SUPPORT VIEW
  if (currentView === 'support') {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-r from-pink-600/10 to-rose-600/10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="font-bold">Support Us</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Help us grow
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6">
          {/* Support Card */}
          <Card className="p-6 bg-gradient-to-br from-pink-600/20 to-rose-600/15 border-pink-500/40">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="font-bold text-white text-xl mb-2">Love Forcheck?</h3>
              <p className="text-sm text-pink-100 leading-relaxed">
                Your support helps us improve the app, add new features, and keep our servers running. Every contribution makes a difference!
              </p>
            </div>
          </Card>

          {/* Ways to Support */}
          <div>
            <h3 className="font-bold text-white mb-4">Ways to Support</h3>
            
            <div className="space-y-3">
              <Card className="p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/15 border-blue-500/30">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  Rate & Review
                </h4>
                <p className="text-sm text-blue-100 mb-3">
                  Leave a 5-star review on the App Store to help others discover Forcheck
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Leave a Review
                </Button>
              </Card>

              <Card className="p-5 bg-gradient-to-r from-purple-600/20 to-pink-600/15 border-purple-500/30">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">📢</span>
                  Spread the Word
                </h4>
                <p className="text-sm text-purple-100 mb-3">
                  Share Forcheck with your workout buddies and on social media
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Share App
                </Button>
              </Card>

              <Card className="p-5 bg-gradient-to-r from-green-600/20 to-emerald-600/15 border-green-500/30">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">☕</span>
                  Buy Us a Coffee
                </h4>
                <p className="text-sm text-green-100 mb-3">
                  Support development with a one-time contribution
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Donate
                </Button>
              </Card>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-white mb-4">Follow Us</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Card 
                onClick={() => window.open('https://twitter.com/forcheck', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Twitter className="w-8 h-8 text-blue-400" />
                  <p className="text-sm font-semibold text-white">Twitter</p>
                  <p className="text-xs text-muted-foreground">@forcheck</p>
                </div>
              </Card>

              <Card 
                onClick={() => window.open('https://instagram.com/forcheck', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Instagram className="w-8 h-8 text-pink-400" />
                  <p className="text-sm font-semibold text-white">Instagram</p>
                  <p className="text-xs text-muted-foreground">@forcheck</p>
                </div>
              </Card>

              <Card 
                onClick={() => window.open('https://github.com/forcheck', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Github className="w-8 h-8 text-gray-300" />
                  <p className="text-sm font-semibold text-white">GitHub</p>
                  <p className="text-xs text-muted-foreground">@forcheck</p>
                </div>
              </Card>

              <Card 
                onClick={() => window.open('mailto:support@forcheck.app', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-8 h-8 text-green-400" />
                  <p className="text-sm font-semibold text-white">Email</p>
                  <p className="text-xs text-muted-foreground">support@</p>
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-4 bg-blue-600/10 border border-blue-500/30">
            <p className="text-sm text-blue-300 text-center font-medium">
              💙 Thank you for being part of the Forcheck community!
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // MAIN SETTINGS VIEW
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Customize your experience
            </p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6">
        {/* Workout Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white">Workout Preferences</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Clear on Template Select</h4>
                  <p className="text-xs text-muted-foreground font-medium">Remove custom exercises when choosing a template</p>
                </div>
                <button
                  onClick={() => setClearOnTemplate(!clearOnTemplate)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    clearOnTemplate
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30'
                      : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${
                      clearOnTemplate ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Auto-Save Workouts</h4>
                  <p className="text-xs text-muted-foreground font-medium">Automatically save custom workouts for later</p>
                </div>
                <button
                  onClick={() => setAutoSaveWorkouts(!autoSaveWorkouts)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    autoSaveWorkouts
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30'
                      : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${
                      autoSaveWorkouts ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Show Form Scores</h4>
                  <p className="text-xs text-muted-foreground font-medium">Display real-time form scores during workouts</p>
                </div>
                <button
                  onClick={() => setShowFormScore(!showFormScore)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    showFormScore
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30'
                      : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${
                      showFormScore ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex-1 mb-3">
                <h4 className="font-bold text-white text-sm mb-1">Score Display Mode</h4>
                <p className="text-xs text-muted-foreground font-medium">Choose how to display form scores</p>
              </div>
              <div className="flex gap-2">
                {['letter', 'number', 'both'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setScoreDisplayMode(option)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      scoreDisplayMode === option
                        ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/20 text-white border border-purple-500/50 shadow-lg'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Notifications</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Workout Reminders</h4>
                  <p className="text-xs text-muted-foreground font-medium">Daily notifications to stay on track</p>
                </div>
                <button
                  onClick={() => setWorkoutReminders(!workoutReminders)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    workoutReminders ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${workoutReminders ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Form Tips</h4>
                  <p className="text-xs text-muted-foreground font-medium">Get AI-powered form suggestions</p>
                </div>
                <button
                  onClick={() => setFormTips(!formTips)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    formTips ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${formTips ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Friend Activity</h4>
                  <p className="text-xs text-muted-foreground font-medium">See when friends complete workouts</p>
                </div>
                <button
                  onClick={() => setFriendActivity(!friendActivity)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    friendActivity ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${friendActivity ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Achievement Alerts</h4>
                  <p className="text-xs text-muted-foreground font-medium">Celebrate your milestones</p>
                </div>
                <button
                  onClick={() => setAchievements(!achievements)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    achievements ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${achievements ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Privacy & Friends */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white">Privacy & Friends</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex-1 mb-3">
                <h4 className="font-bold text-white text-sm mb-1">Profile Visibility</h4>
                <p className="text-xs text-muted-foreground font-medium">Who can see your profile</p>
              </div>
              <div className="flex gap-2">
                {['public', 'friends', 'private'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setProfileVisibility(option)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      profileVisibility === option
                        ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/20 text-white border border-purple-500/50 shadow-lg'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Workout Sharing</h4>
                  <p className="text-xs text-muted-foreground font-medium">Auto-share workouts with friends</p>
                </div>
                <button
                  onClick={() => setWorkoutSharing(!workoutSharing)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    workoutSharing ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${workoutSharing ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Show on Leaderboard</h4>
                  <p className="text-xs text-muted-foreground font-medium">Appear in friend rankings</p>
                </div>
                <button
                  onClick={() => setLeaderboard(!leaderboard)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    leaderboard ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${leaderboard ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white">AI Preferences</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">AI Coaching</h4>
                  <p className="text-xs text-muted-foreground font-medium">Real-time form analysis</p>
                </div>
                <button
                  onClick={() => setAiCoaching(!aiCoaching)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    aiCoaching ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${aiCoaching ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Smart Recommendations</h4>
                  <p className="text-xs text-muted-foreground font-medium">Personalized workout suggestions</p>
                </div>
                <button
                  onClick={() => setAiRecommendations(!aiRecommendations)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    aiRecommendations ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${aiRecommendations ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex-1 mb-3">
                <h4 className="font-bold text-white text-sm mb-1">AI Difficulty</h4>
                <p className="text-xs text-muted-foreground font-medium">Exercise difficulty adjustment</p>
              </div>
              <div className="flex gap-2">
                {['conservative', 'moderate', 'aggressive'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setAiDifficulty(option)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      aiDifficulty === option
                        ? 'bg-gradient-to-r from-orange-600/30 to-orange-500/20 text-white border border-orange-500/50 shadow-lg'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* App Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white">App Settings</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground font-medium">Toggle dark/light theme</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-500 shadow-lg shadow-purple-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${darkMode ? 'left-6' : 'left-1'}`}>
                    <Moon className="w-3 h-3 text-gray-600" />
                  </div>
                </button>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Haptic Feedback</h4>
                  <p className="text-xs text-muted-foreground font-medium">Vibration on interactions</p>
                </div>
                <button
                  onClick={() => setHapticFeedback(!hapticFeedback)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    hapticFeedback ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${hapticFeedback ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* More */}
        <div>
          <h3 className="font-bold text-white mb-4">More</h3>
          <div className="space-y-2">
            <Card 
              onClick={() => setCurrentView('about')}
              className="p-4 bg-card border-border hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">About Forcheck</h4>
                    <p className="text-xs text-muted-foreground font-medium">Meet the developers</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>

            <Card 
              onClick={() => setCurrentView('support')}
              className="p-4 bg-card border-border hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Support Us</h4>
                    <p className="text-xs text-muted-foreground font-medium">Help us grow and improve</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>

            <Card 
              onClick={() => alert('Opening Help Center...')}
              className="p-4 bg-card border-border hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Help & Support</h4>
                    <p className="text-xs text-muted-foreground font-medium">FAQs and contact us</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>

        {/* Logout Button */}
        <Card className="p-4 bg-gradient-to-r from-red-600/20 to-pink-600/10 border-red-500/40">
          <button
            onClick={() => alert('Logout functionality would be implemented here')}
            className="flex items-center gap-3 w-full"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <div className="flex-1 text-left">
              <h4 className="font-bold text-white text-sm">Log Out</h4>
              <p className="text-xs text-red-300 font-medium">Sign out of your account</p>
            </div>
          </button>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground font-medium">Forcheck v1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}