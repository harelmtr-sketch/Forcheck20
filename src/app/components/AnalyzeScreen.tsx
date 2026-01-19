import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, TrendingUp, Camera, Zap, Target, Award, Sparkles, Brain, Dumbbell, Utensils, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AnalysisResult {
  score: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

export function AnalyzeScreen() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const workoutInputRef = useRef<HTMLInputElement>(null);
  const mealInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setAnalysisResult(null);
    }
  };

  const handleWorkoutCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setAnalysisResult(null);
    }
  };

  const handleMealCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Handle meal photo
      alert('Meal tracking coming soon!');
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 4000));
    clearInterval(progressInterval);
    setProgress(100);

    const mockScore = Math.floor(Math.random() * 30) + 70;
    const confidenceLevels: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
    const randomConfidence = confidenceLevels[Math.floor(Math.random() * 3)];
    
    setAnalysisResult({
      score: mockScore,
      feedback: [
        'Your pull-up form shows good overall technique',
        'Core engagement is strong throughout the movement',
        'Consider focusing on tempo for better muscle activation',
      ],
      strengths: [
        'Full range of motion achieved',
        'Shoulder stability maintained',
        'Consistent breathing pattern',
      ],
      improvements: [
        'Reduce leg swing at the bottom',
        'Focus on controlled descent',
        'Keep elbows closer to body',
      ],
      confidence: randomConfidence,
    });

    setIsAnalyzing(false);
  };

  const reset = () => {
    setVideoFile(null);
    setAnalysisResult(null);
    setProgress(0);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    if (workoutInputRef.current) {
      workoutInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Main Content - Takes Full Screen */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {!videoFile && !analysisResult && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Large Camera Circle */}
            <div className="relative mb-12">
              <input
                ref={cameraInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
                id="camera-capture"
              />
              <label
                htmlFor="camera-capture"
                className="relative block cursor-pointer group"
              >
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-red-500/30 blur-2xl animate-pulse" />
                
                {/* Main Camera Circle */}
                <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-red-600/40 border-4 border-white/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_60px_rgba(59,130,246,0.4)]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                  <Camera className="w-28 h-28 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                </div>

                {/* Pulsing Ring Animation */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '2s' }} />
              </label>
            </div>

            {/* Action Buttons Below Circle */}
            <div className="w-full space-y-4">
              {/* Workout Button */}
              <input
                ref={workoutInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleWorkoutCapture}
                className="hidden"
                id="workout-capture"
              />
              <label
                htmlFor="workout-capture"
                className="block w-full cursor-pointer"
              >
                <Card className="p-5 bg-gradient-to-r from-blue-600/40 to-purple-600/30 border-blue-400/50 hover:from-blue-600/50 hover:to-purple-600/40 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/40 rounded-xl border border-blue-400/40">
                      <Dumbbell className="w-7 h-7 text-blue-200 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Record Workout</h3>
                      <p className="text-sm text-blue-200/80">Film your sets and get AI feedback</p>
                    </div>
                    <Sparkles className="w-6 h-6 text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" />
                  </div>
                </Card>
              </label>

              {/* Meal Button */}
              <input
                ref={mealInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleMealCapture}
                className="hidden"
                id="meal-capture"
              />
              <label
                htmlFor="meal-capture"
                className="block w-full cursor-pointer"
              >
                <Card className="p-5 bg-gradient-to-r from-orange-600/40 to-red-600/30 border-orange-400/50 hover:from-orange-600/50 hover:to-red-600/40 transition-all shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:shadow-[0_0_40px_rgba(251,146,60,0.5)] active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/40 rounded-xl border border-orange-400/40">
                      <Utensils className="w-7 h-7 text-orange-200 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Track Meal</h3>
                      <p className="text-sm text-orange-200/80">Snap a photo to log nutrition</p>
                    </div>
                    <Camera className="w-6 h-6 text-orange-300 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
                  </div>
                </Card>
              </label>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mt-8 justify-center">
              <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">Real-time Analysis</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">Form Scoring</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {videoFile && !analysisResult && (
          <div className="w-full max-w-md space-y-6">
            <Card className="p-6 bg-gradient-to-br from-white/15 to-gray-100/10 border-white/40 shadow-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-4 bg-white/30 rounded-2xl">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold">{videoFile.name}</p>
                  <p className="text-sm text-gray-200 font-medium">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200 font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-pulse text-white" />
                      Analyzing your form...
                    </span>
                    <span className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{progress}%</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-800/40 border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 transition-all duration-300 shadow-lg shadow-blue-500/50"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center font-medium">
                    Our AI is analyzing your technique and form
                  </p>
                </div>
              )}
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={analyzeVideo}
                disabled={isAnalyzing}
                className="flex-1 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold border-0 shadow-xl shadow-blue-500/30 text-lg"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-6 h-6 animate-pulse" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Analyze Form
                  </span>
                )}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                disabled={isAnalyzing}
                className="h-16 px-6 border-white/40 hover:bg-white/10 hover:border-white/60 font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="w-full max-w-md space-y-6 pb-6">
            {/* Score Card with Confidence Indicator */}
            <Card className="p-7 bg-gradient-to-br from-white/25 via-white/20 to-gray-100/25 border-white/50 relative overflow-hidden shadow-2xl shadow-white/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-100/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                      <p className="text-sm text-gray-200 font-bold">Form Score</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-7xl font-extrabold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                        {analysisResult.score}
                      </span>
                      <span className="text-4xl text-muted-foreground font-bold">/100</span>
                    </div>
                    {/* AI Confidence Indicator */}
                    <div className="flex items-center gap-2 mt-3">
                      <Brain className="w-4 h-4 text-white/70" />
                      <span className="text-xs text-gray-300 font-medium">
                        AI confidence: <span className={`font-bold ${
                          analysisResult.confidence === 'High' ? 'text-green-400' :
                          analysisResult.confidence === 'Medium' ? 'text-yellow-400' :
                          'text-orange-400'
                        }`}>{analysisResult.confidence}</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-28 h-28 rounded-full border-[6px] border-white/40 flex items-center justify-center bg-background/60 backdrop-blur-sm shadow-xl shadow-white/20">
                    <CheckCircle className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  </div>
                </div>
                <div className="p-4 bg-background/60 rounded-xl backdrop-blur-sm border border-white/20">
                  <p className="text-sm font-medium">{analysisResult.feedback[0]}</p>
                </div>
              </div>
            </Card>

            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-green-400 font-bold">Strengths</h3>
              </div>
              <Card className="p-5 bg-gradient-to-br from-green-500/15 to-emerald-500/10 border-green-400/30 shadow-lg">
                <ul className="space-y-3">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shadow-md shadow-green-400/50" />
                      <span className="text-sm font-medium">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Areas for Improvement */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                <h3 className="text-white font-bold">Areas for Improvement</h3>
              </div>
              <Card className="p-5 bg-gradient-to-br from-white/15 to-gray-100/10 border-white/30 shadow-lg">
                <ul className="space-y-3">
                  {analysisResult.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-white mt-1.5 shadow-md shadow-white/50" />
                      <span className="text-sm font-medium">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Additional Feedback */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
                <h3 className="text-blue-400 font-bold">Detailed Feedback</h3>
              </div>
              <Card className="p-5 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border-blue-400/30 shadow-lg">
                <ul className="space-y-3">
                  {analysisResult.feedback.slice(1).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shadow-md shadow-blue-400/50" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Button 
              onClick={reset} 
              className="w-full h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold border-0 shadow-xl shadow-blue-500/30 text-lg"
            >
              <Camera className="w-6 h-6 mr-2" />
              Analyze Another Video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
