import { useState, memo } from 'react';
import { 
  ChevronLeft, 
  Bell, 
  Shield, 
  Zap, 
  Moon, 
  ChevronRight, 
  Info, 
  Heart, 
  Mail, 
  Twitter, 
  Instagram, 
  Github,
  Activity,
  Sparkles,
  Eye,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { AppSettings } from '../utils/settingsStore';

interface SettingsScreenProps {
  onBack: () => void;
  settings: AppSettings;
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onLogout?: () => void;
}

type SettingsView = 'main' | 'about' | 'support';

const SettingsScreenComponent = ({ 
  onBack, 
  settings,
  onSettingChange,
  onLogout
}: SettingsScreenProps) => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  
  // Handle notification permission request
  const handleNotificationToggle = async (key: keyof AppSettings, currentValue: boolean) => {
    if (!currentValue && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          onSettingChange(key, true);
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    } else {
      onSettingChange(key, !currentValue);
    }
  };

  // Toggle component
  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        enabled
          ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30'
          : 'bg-gray-700'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${
          enabled ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
  
  // ABOUT VIEW
  if (currentView === 'about') {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-r from-blue-950/30 to-blue-900/20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
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
          <Card className="p-6 bg-gradient-to-br from-blue-950/40 to-blue-900/30 border-blue-500/40">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl shadow-blue-500/30">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-bold text-foreground text-2xl mb-2">Forcheck</h2>
              <p className="text-sm text-blue-300 font-medium">
                AI-Powered Calisthenics Form Analysis
              </p>
              <p className="text-xs text-blue-400 mt-2">Version 1.0.0</p>
            </div>
            <p className="text-sm text-foreground/80 text-center leading-relaxed">
              Forcheck uses advanced computer vision to analyze your workout form in real-time, providing instant feedback and personalized coaching to maximize your gains while minimizing injury risk.
            </p>
          </Card>

          {/* Developers */}
          <div>
            <h3 className="font-bold mb-4">Built by Athletes, for Athletes</h3>
            
            <Card className="p-5 bg-card border-border mb-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">Harel Meltser</h4>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Co-Founder & Lead Developer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calisthenics athlete and software engineer passionate about combining fitness with technology.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-card border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">Gibor Bashari</h4>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Co-Founder & AI Engineer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Machine learning expert and fitness enthusiast dedicated to perfecting form analysis algorithms.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Mission */}
          <Card className="p-5 bg-gradient-to-br from-green-950/40 to-emerald-950/30 border-green-500/30">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-400" />
              Our Mission
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              To democratize access to professional-grade form coaching, helping athletes of all levels train smarter, prevent injuries, and achieve their fitness goals through the power of AI.
            </p>
          </Card>

          {/* Legal */}
          <div className="space-y-2">
            <button className="w-full text-left p-4 bg-card border border-border rounded-lg hover:bg-foreground/5 transition-colors">
              <p className="text-sm font-semibold">Privacy Policy</p>
            </button>
            <button className="w-full text-left p-4 bg-card border border-border rounded-lg hover:bg-foreground/5 transition-colors">
              <p className="text-sm font-semibold">Terms of Service</p>
            </button>
            <button className="w-full text-left p-4 bg-card border border-border rounded-lg hover:bg-foreground/5 transition-colors">
              <p className="text-sm font-semibold">Licenses</p>
            </button>
          </div>

          <div className="text-center pt-4 pb-2">
            <p className="text-xs text-muted-foreground">© 2026 Forcheck. All rights reserved.</p>
            <p className="text-xs text-muted-foreground mt-1">Made with care by Meltser & Gibor</p>
          </div>
        </div>
      </div>
    );
  }

  // SUPPORT VIEW
  if (currentView === 'support') {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-r from-pink-950/30 to-rose-950/20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
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
          <Card className="p-6 bg-gradient-to-br from-pink-950/40 to-rose-950/30 border-pink-500/40">
            <div className="text-center mb-4">
              <div className="mb-4">
                <Heart className="w-16 h-16 text-pink-400 mx-auto" />
              </div>
              <h3 className="font-bold text-xl mb-2">Love Forcheck?</h3>
              <p className="text-sm text-pink-200 leading-relaxed">
                Your support helps us improve the app, add new features, and keep our servers running. Every contribution makes a difference!
              </p>
            </div>
          </Card>

          {/* Ways to Support */}
          <div>
            <h3 className="font-bold mb-4">Ways to Support</h3>
            
            <div className="space-y-3">
              <Card className="p-5 bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border-blue-500/30">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Rate & Review
                </h4>
                <p className="text-sm text-blue-200 mb-3">
                  Leave a 5-star review on the App Store to help others discover Forcheck
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Leave a Review
                </Button>
              </Card>

              <Card className="p-5 bg-gradient-to-r from-purple-950/40 to-pink-950/30 border-purple-500/30">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                  Spread the Word
                </h4>
                <p className="text-sm text-purple-200 mb-3">
                  Share Forcheck with your workout buddies and on social media
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Share App
                </Button>
              </Card>

              <Card className="p-5 bg-gradient-to-r from-green-950/40 to-emerald-950/30 border-green-500/30">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-400" />
                  Buy Us a Coffee
                </h4>
                <p className="text-sm text-green-200 mb-3">
                  Support development with a one-time contribution
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Donate
                </Button>
              </Card>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Card 
                onClick={() => window.open('https://twitter.com/forcheck', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Twitter className="w-8 h-8 text-blue-400" />
                  <p className="text-sm font-semibold">Twitter</p>
                  <p className="text-xs text-muted-foreground">@forcheck</p>
                </div>
              </Card>

              <Card 
                onClick={() => window.open('https://instagram.com/forcheck', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Instagram className="w-8 h-8 text-pink-400" />
                  <p className="text-sm font-semibold">Instagram</p>
                  <p className="text-xs text-muted-foreground">@forcheck</p>
                </div>
              </Card>

              <Card 
                onClick={() => window.open('https://github.com/forcheck', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Github className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                  <p className="text-sm font-semibold">GitHub</p>
                  <p className="text-xs text-muted-foreground">@forcheck</p>
                </div>
              </Card>

              <Card 
                onClick={() => window.open('mailto:support@forcheck.app', '_blank')}
                className="p-4 bg-card border-border cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-8 h-8 text-green-400" />
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-xs text-muted-foreground">support@</p>
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-4 bg-blue-950/30 border border-blue-500/30">
            <p className="text-sm text-blue-400 text-center font-medium">
              Thank you for being part of the Forcheck community!
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
      <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-r from-blue-950/30 to-blue-900/20">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-base">Settings</h1>
            <p className="text-xs text-muted-foreground font-medium">
              Customize your experience
            </p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {/* Appearance */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold">Appearance</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground font-medium">Use dark theme across the app</p>
                </div>
                <Toggle 
                  enabled={settings.darkMode} 
                  onChange={() => onSettingChange('darkMode', !settings.darkMode)} 
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Workout Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold">Workout Preferences</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Clear on Template Select</h4>
                  <p className="text-xs text-muted-foreground font-medium">When selecting a template, remove any custom exercises you've added</p>
                </div>
                <Toggle 
                  enabled={settings.clearOnTemplate} 
                  onChange={() => onSettingChange('clearOnTemplate', !settings.clearOnTemplate)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Auto-Save Workouts</h4>
                  <p className="text-xs text-muted-foreground font-medium">Automatically save completed workouts to history without confirmation</p>
                </div>
                <Toggle 
                  enabled={settings.autoSaveWorkouts} 
                  onChange={() => onSettingChange('autoSaveWorkouts', !settings.autoSaveWorkouts)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Show Form Scores During Recording</h4>
                  <p className="text-xs text-muted-foreground font-medium">Display AI form analysis scores in real-time while recording videos</p>
                </div>
                <Toggle 
                  enabled={settings.showFormScore} 
                  onChange={() => onSettingChange('showFormScore', !settings.showFormScore)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex-1 mb-3">
                <h4 className="font-bold text-sm mb-1">Score Display Mode</h4>
                <p className="text-xs text-muted-foreground font-medium">Choose how workout scores appear: letter grades (A, B, C), numbers (85, 90), or both</p>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'letter' as const, label: 'Letter (A, B)', example: 'A' },
                  { value: 'number' as const, label: 'Number', example: '95' },
                  { value: 'both' as const, label: 'Both', example: 'A 95' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSettingChange('scoreDisplayMode', option.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      settings.scoreDisplayMode === option.value
                        ? 'bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 text-foreground border border-yellow-500/50 shadow-lg'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <div>{option.example}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">Notifications</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Workout Reminders</h4>
                  <p className="text-xs text-muted-foreground font-medium">Daily notifications to stay on track</p>
                </div>
                <Toggle 
                  enabled={settings.workoutReminders} 
                  onChange={() => handleNotificationToggle('workoutReminders', settings.workoutReminders)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Form Tips</h4>
                  <p className="text-xs text-muted-foreground font-medium">Get AI-powered form suggestions</p>
                </div>
                <Toggle 
                  enabled={settings.formTips} 
                  onChange={() => handleNotificationToggle('formTips', settings.formTips)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Friend Activity</h4>
                  <p className="text-xs text-muted-foreground font-medium">See when friends complete workouts</p>
                </div>
                <Toggle 
                  enabled={settings.friendActivity} 
                  onChange={() => handleNotificationToggle('friendActivity', settings.friendActivity)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Achievement Alerts</h4>
                  <p className="text-xs text-muted-foreground font-medium">Celebrate your milestones</p>
                </div>
                <Toggle 
                  enabled={settings.achievements} 
                  onChange={() => handleNotificationToggle('achievements', settings.achievements)} 
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Privacy & Friends */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="font-bold">Privacy & Friends</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex-1 mb-3">
                <h4 className="font-bold text-sm mb-1">Profile Visibility</h4>
                <p className="text-xs text-muted-foreground font-medium">Who can see your profile and workout data</p>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'public' as const, label: 'Public' },
                  { value: 'friends' as const, label: 'Friends' },
                  { value: 'private' as const, label: 'Private' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSettingChange('profileVisibility', option.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      settings.profileVisibility === option.value
                        ? 'bg-gradient-to-r from-red-600/30 to-red-500/20 text-foreground border border-red-500/50 shadow-lg'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Workout Sharing</h4>
                  <p className="text-xs text-muted-foreground font-medium">Auto-share workouts with friends</p>
                </div>
                <Toggle 
                  enabled={settings.workoutSharing} 
                  onChange={() => onSettingChange('workoutSharing', !settings.workoutSharing)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Show on Leaderboard</h4>
                  <p className="text-xs text-muted-foreground font-medium">Appear in friend rankings and competition</p>
                </div>
                <Toggle 
                  enabled={settings.leaderboard} 
                  onChange={() => onSettingChange('leaderboard', !settings.leaderboard)} 
                />
              </div>
            </Card>
          </div>
        </div>

        {/* AI Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold">AI Preferences</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">AI Coaching</h4>
                  <p className="text-xs text-muted-foreground font-medium">Get personalized workout coaching and form tips</p>
                </div>
                <Toggle 
                  enabled={settings.aiCoaching} 
                  onChange={() => onSettingChange('aiCoaching', !settings.aiCoaching)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">AI Recommendations</h4>
                  <p className="text-xs text-muted-foreground font-medium">Suggest exercises and workout templates based on your progress</p>
                </div>
                <Toggle 
                  enabled={settings.aiRecommendations} 
                  onChange={() => onSettingChange('aiRecommendations', !settings.aiRecommendations)} 
                />
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex-1 mb-3">
                <h4 className="font-bold text-sm mb-1">AI Difficulty Level</h4>
                <p className="text-xs text-muted-foreground font-medium">Adjust how challenging AI recommendations should be</p>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'beginner' as const, label: 'Beginner' },
                  { value: 'intermediate' as const, label: 'Intermediate' },
                  { value: 'advanced' as const, label: 'Advanced' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSettingChange('aiDifficulty', option.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      settings.aiDifficulty === option.value
                        ? 'bg-gradient-to-r from-cyan-600/30 to-cyan-500/20 text-foreground border border-cyan-500/50 shadow-lg'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-green-400" />
            <h3 className="font-bold">Accessibility</h3>
          </div>

          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Haptic Feedback</h4>
                  <p className="text-xs text-muted-foreground font-medium">Vibrate on button presses and interactions</p>
                </div>
                <Toggle 
                  enabled={settings.hapticFeedback} 
                  onChange={() => onSettingChange('hapticFeedback', !settings.hapticFeedback)} 
                />
              </div>
            </Card>
          </div>
        </div>

        {/* About & Support */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold">About & Support</h3>
          </div>

          <div className="space-y-3">
            <Card 
              onClick={() => setCurrentView('about')}
              className="p-4 bg-card border-border cursor-pointer hover:bg-foreground/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">About Forcheck</h4>
                  <p className="text-xs text-muted-foreground font-medium">Version, team, and mission</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>

            <Card 
              onClick={() => setCurrentView('support')}
              className="p-4 bg-card border-border cursor-pointer hover:bg-foreground/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Support Us</h4>
                  <p className="text-xs text-muted-foreground font-medium">Help us grow and improve</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>

        {/* Logout */}
        {onLogout && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LogOut className="w-5 h-5 text-red-400" />
              <h3 className="font-bold">Account</h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={onLogout}
                className="w-full p-5 bg-gradient-to-r from-red-950/40 to-red-900/30 border border-red-500/30 rounded-xl hover:from-red-900/50 hover:to-red-800/40 hover:border-red-500/50 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-sm text-red-400 mb-1">Sign Out</h4>
                    <p className="text-xs text-red-300/70 font-medium">Log out of your Forcheck account</p>
                  </div>
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const SettingsScreen = memo(SettingsScreenComponent);