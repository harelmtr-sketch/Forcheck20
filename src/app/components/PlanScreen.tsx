import { useState } from 'react';
import { Calendar, TrendingUp, CheckCircle, Circle, Brain, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface Workout {
  id: string;
  name: string;
  exercises: string[];
  completed: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reason?: string;
  progressionPreview?: string;
  reason?: string;
  nextProgression?: string;
}

export function PlanScreen() {
  const [weeklyProgress] = useState(65);
  const [currentWeek] = useState(3);
  const [workouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Push Day',
      exercises: ['Push-ups: 3x12', 'Dips: 3x10', 'Pike Push-ups: 3x8'],
      completed: true,
      difficulty: 'Intermediate',
      reason: 'Good push recovery + strong form last session',
      reason: 'Good push recovery + strong form last session',
      nextProgression: 'Archer push-ups next week',
    },
    {
      id: '2',
      name: 'Pull Day',
      exercises: ['Pull-ups: 3x8', 'Australian Rows: 3x12', 'Chin-ups: 3x6'],
      completed: true,
      difficulty: 'Intermediate',
      reason: 'Pull strength improving, maintaining current volume',
      reason: 'Shoulder stability improved 15% last analysis',
      nextProgression: 'Weighted pull-ups if today goes well',
    },
    {
      id: '3',
      name: 'Leg Day',
      exercises: ['Pistol Squats: 3x6', 'Jump Squats: 3x15', 'Lunges: 3x10'],
      completed: false,
      difficulty: 'Advanced',
      reason: 'Your balance and control have improved significantly',
      progressionPreview: 'If today goes well → weighted pistol squats next week',
      reason: 'Balance scores trending up, ready for progression',
      nextProgression: 'Jumping pistol squats',
    },
    {
      id: '4',
      name: 'Core & Cardio',
      exercises: ['L-sits: 3x20s', 'Plank: 3x60s', 'Burpees: 3x15'],
      completed: false,
      difficulty: 'Intermediate',
      reason: 'Core strength building for advanced skills',
      progressionPreview: 'If today goes well → add dragon flags next week',
      reason: 'Core engagement strong in last 3 sessions',
      nextProgression: 'Dragon flags introduction',
    },
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="mb-2 font-bold">Workout Plan</h1>
        <p className="text-muted-foreground font-medium">
          Your personalized calisthenics program
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
        {/* Progress Card */}
        <Card className="p-6 bg-gradient-to-br from-whithite/15 to-grwhity1/10 border-whithite/40 shadow-[0_0_30px_rgba(255,255,255,0.2)] shadow-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-medium">Week {currentWeek}</p>
              <h2>Weekly Progress</h2>
            </div>
            <div className="p-3 bg-background rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <TrendingUp className="w-6 h-6 text-whitwhite drop-shad drop-shadow-[[0__0_8px_rgba(255,255,255,0.6)]_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Completion</span>
              <span className="text-whitwhite font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">{weeklyProgress}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>
        </Card>

        {/* Adaptive Note */}
        <div className="bg-whithite/15 border border-whithite/30 rounded-xl p-4 shadow-[0_0_20px_rg shadow-white/5ba(255,255,255,0.2)]">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-grawhit mt-0.5 drop-shad-2[0_0_8px_rgba(255,255,255,0.8)]" />
            <p className="text-sm text-white/90 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
             Your plan adapts based on form analysis. Keep uploading videos for optimized workouts!
            </p>
          </div>
        </div>

        {/* This Week's Workouts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h3>This Week's Workouts</h3>
          </div>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <Card
                key={workout.id}
                className={`p-4 border transition-all ${
                  workout.completed
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {workout.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4>{workout.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {workout.difficulty}
                      </span>
                    </div>
                    
                    {/* Why this workout was chosen */}
                    {workout.reason && (
                      <div className="mb-3 flex items-start gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                        <Brain className="w-3.5 h-3.5 mt-0.5 text-white/60 flex-shrink-0" />
                        <span>
                          <span className="text-white/70 font-medium">Chosen because:</span> {workout.reason}
                        </span>
                      </div>
                    )}
                    
                    
                    {/* Why this workout was chosen */}
                    {workout.reason && (
                      <div className="mb-3 p-2 bg-white/10 border border-white/20 rounded-lg">
                        <p className="text-xs text-white/80">
                          <span className="font-semibold text-white">Chosen because:</span> {workout.reason}
                        </p>
                      </div>
                    )}

                    <ul className="space-y-1 mb-3 mb-3">
                      {workout.exercises.map((exercise, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {exercise}
                        </li>
                      ))}
                    </ul>

                    {/* Next progression preview */}
                    {workout.nextProgression && !workout.completed && (
                      <div className="mb-3 p-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-white/70" />
                        <p className="text-xs text-white/80">
                          <span className="font-semibold">Next:</span> {workout.nextProgression}
                        </p>
                      </div>
                    )}

                    
                    {/* Next progression preview */}
                    {!workout.completed && workout.progressionPreview && (
                      <div className="mb-3 flex items-start gap-2 text-xs bg-gradient-to-r from-white/10 to-gray-100/5 rounded-lg px-3 py-2 border border-white/20">
                        <TrendingUp className="w-3.5 h-3.5 mt-0.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] flex-shrink-0" />
                        <span className="text-gray-300 font-medium">{workout.progressionPreview}</span>
                      </div>
                    )}
                    
                    {!workout.completed && (
                      <Button className="w-full mt-3 h-9 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:from-gray-100 hover:via-white hover:to-gray-100 text-black font-semibold bg-gradient-to-r from-white/80 to-white/70 hover:from-white/90 hover:to-white/80 text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]" size="sm">
                        Start Workout
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div>
          <h3 className="mb-4">Monthly Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Workouts</p>
              <p className="text-2xl font-bold">12</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
              <p className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">85</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Time</p>
              <p className="text-2xl font-bold">8.5h</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Streak</p>
              <p className="text-2xl font-bold">7 days</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

