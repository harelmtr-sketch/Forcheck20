import { useState, useRef, useEffect, memo } from 'react';
import { Upload, SwitchCamera, Camera as CameraIcon, X, Check, Search, Video, Play, Sparkles, Utensils } from 'lucide-react';
import { Card } from './ui/card';
import { exerciseDatabase } from '../data/exerciseDatabase-clean';
import { analyzeWorkoutForm } from '../utils/aiFormScoring';
import { AnalysisResultSheet } from './AnalysisResultSheet';
import type { Exercise, MuscleStatus } from '../App';
import type { ExerciseData } from '../data/exerciseDatabase-clean';
import type { FormAnalysisResult } from '../utils/aiFormScoring';

interface CameraScreenProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  muscleStatus: MuscleStatus[];
  setMuscleStatus: React.Dispatch<React.SetStateAction<MuscleStatus[]>>;
  exerciseToRecord: number | null;
  onRecordingComplete: () => void;
}

const CameraScreenComponent = ({ exercises, setExercises, muscleStatus, setMuscleStatus, exerciseToRecord, onRecordingComplete }: CameraScreenProps) => {
  const [mode, setMode] = useState<'exercise' | 'meal'>('exercise');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('user');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FormAnalysisResult & { exerciseName: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera when component mounts or facingMode changes
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        // Stop any existing stream
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        currentStream = mediaStream;
        setStream(mediaStream);

        // Attach to video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.log('Camera access denied or not available');
        // Silently fail - camera is optional
      }
    };

    startCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to data URL
      const photoData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(photoData);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleUsePhoto = () => {
    setCapturedPhoto(null);
    if (mode === 'exercise') {
      setShowExercisePicker(true);
    } else {
      // Meal mode - show success message and return to daily
      onRecordingComplete();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExerciseSelect = async (exercise: ExerciseData) => {
    setShowExercisePicker(false);
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const result = analyzeWorkoutForm(exercise.name, [], muscleStatus);
      setAnalysisResult({ ...result, exerciseName: exercise.name });
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleSaveResult = (score: number) => {
    if (!analysisResult) return;

    const exerciseName = analysisResult.exerciseName;
    const exerciseData = exerciseDatabase.find(ex => ex.name === exerciseName);

    if (!exerciseData) return;

    const newExercise: Exercise = {
      name: exerciseName,
      sets: exerciseData.baseSets,
      reps: exerciseData.baseReps,
      score: score,
      timestamp: new Date().toISOString(),
    };

    setExercises(prev => [...prev, newExercise]);

    // Update muscle status
    const targetedMuscles = exerciseData.targetMuscles;
    setMuscleStatus(prev => prev.map(muscle => {
      if (targetedMuscles.includes(muscle.key)) {
        return {
          ...muscle,
          status: 'sore' as const,
          lastTrained: 'Today',
          setsToday: muscle.setsToday + exerciseData.baseSets,
        };
      }
      return muscle;
    }));

    setAnalysisResult(null);
    onRecordingComplete();
  };

  const handleCloseResult = () => {
    setAnalysisResult(null);
  };

  const filteredExercises = exerciseDatabase.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0f1117] via-[#1a1d23] to-[#0a0d12]">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Vibrant animated background gradients - color changes based on mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {mode === 'exercise' ? (
          <>
            {/* Exercise mode - Blue/Cyan/Purple theme */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Moving gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tl from-purple-600/5 via-transparent to-blue-600/5 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </>
        ) : (
          <>
            {/* Meal mode - Orange/Amber/Yellow theme */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Moving gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-amber-600/5 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tl from-yellow-600/5 via-transparent to-orange-600/5 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </>
        )}
      </div>

      {/* Camera Feed or Captured Photo */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {capturedPhoto ? (
          // Show captured photo with border
          <div className="relative w-full h-full">
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            {/* Colorful border overlay */}
            <div className="absolute inset-0 border-4 border-blue-500/30 pointer-events-none" />
          </div>
        ) : (
          // Show live camera feed
          <>
            {stream ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Colorful vignette effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
              </div>
            ) : (
              // Camera loading state - colorful version
              <div className="flex flex-col items-center justify-center text-center px-8 relative z-20">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                    <CameraIcon className="w-16 h-16 text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" />
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">Camera Access</h3>
                <p className="text-blue-300 text-sm font-medium drop-shadow-lg">
                  Allow camera to analyze your form
                </p>
              </div>
            )}
          </>
        )}

        {/* Animated corner brackets with color - only when no photo */}
        {!capturedPhoto && stream && (
          <>
            <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none z-20">
              <div className="w-full h-full border-l-4 border-t-4 border-blue-400/80 rounded-tl-xl shadow-[0_0_20px_rgba(96,165,250,0.6)] animate-pulse" />
            </div>
            <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none z-20">
              <div className="w-full h-full border-r-4 border-t-4 border-cyan-400/80 rounded-tr-xl shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-32 left-8 w-16 h-16 pointer-events-none z-20">
              <div className="w-full h-full border-l-4 border-b-4 border-purple-400/80 rounded-bl-xl shadow-[0_0_20px_rgba(192,132,252,0.6)] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute bottom-32 right-8 w-16 h-16 pointer-events-none z-20">
              <div className="w-full h-full border-r-4 border-b-4 border-blue-400/80 rounded-br-xl shadow-[0_0_20px_rgba(96,165,250,0.6)] animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
            
            {/* Center crosshair with color */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none z-20">
              <div className="absolute inset-0 border-2 border-blue-400/60 rounded-full animate-ping" />
              <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-full" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent" />
            </div>
          </>
        )}
      </div>

      {/* Top Controls with colorful styling */}
      {!capturedPhoto && (
        <div className="absolute top-0 left-0 right-0 z-20 pt-safe">
          {/* Mode Toggle - Exercise vs Meal */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex gap-2 bg-[#1a1d23]/90 backdrop-blur-xl rounded-2xl p-1.5 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <button
                onClick={() => setMode('exercise')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  mode === 'exercise'
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                    : 'text-blue-400/70 hover:text-blue-300 hover:bg-blue-500/10'
                }`}
              >
                <Video className={`w-4 h-4 ${mode === 'exercise' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />
                <span>Exercise</span>
              </button>
              <button
                onClick={() => setMode('meal')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  mode === 'meal'
                    ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-[0_0_20px_rgba(251,146,60,0.6)]'
                    : 'text-orange-400/70 hover:text-orange-300 hover:bg-orange-500/10'
                }`}
              >
                <Utensils className={`w-4 h-4 ${mode === 'meal' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />
                <span>Meal</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex-1">
              <h1 className="font-bold text-xl text-white drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                {mode === 'exercise' ? 'Record Form' : 'Log Meal'}
              </h1>
              <p className="text-sm text-blue-300 font-medium drop-shadow-lg">
                {mode === 'exercise' ? 'Position yourself in frame' : 'Capture your meal'}
              </p>
            </div>
            
            <button
              onClick={handleFlipCamera}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600/40 to-purple-600/40 backdrop-blur-xl border-2 border-blue-400/50 flex items-center justify-center transition-all active:scale-95 shadow-[0_0_30px_rgba(96,165,250,0.4)] hover:shadow-[0_0_40px_rgba(96,165,250,0.6)] hover:border-blue-300/70"
            >
              <SwitchCamera className="w-6 h-6 text-blue-200 drop-shadow-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls with vibrant colors */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-safe">
        {capturedPhoto ? (
          // Photo review controls - colorful version
          <div className="flex justify-center items-center gap-8 px-6 py-10">
            <button
              onClick={handleRetake}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/90 to-pink-600/90 backdrop-blur-md border-4 border-red-400/50 flex items-center justify-center transition-all active:scale-95 shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] hover:scale-105"
            >
              <X className="w-10 h-10 text-white drop-shadow-lg" />
            </button>
            <button
              onClick={handleUsePhoto}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600/90 to-emerald-600/90 backdrop-blur-md border-4 border-green-400/50 flex items-center justify-center transition-all active:scale-95 shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] hover:scale-105"
            >
              <Check className="w-10 h-10 text-white drop-shadow-lg" />
            </button>
          </div>
        ) : (
          // Camera controls - colorful version
          <div className="flex justify-center items-center gap-8 px-6 py-10">
            {/* Upload button */}
            <button
              onClick={handleUploadClick}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-xl border-2 border-purple-400/50 flex items-center justify-center transition-all active:scale-95 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-105"
            >
              <Upload className="w-6 h-6 text-purple-200 drop-shadow-lg" />
            </button>

            {/* Capture button - large glowing circle */}
            <button
              onClick={handleTakePhoto}
              disabled={!stream}
              className="relative w-24 h-24 rounded-full transition-all active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {/* Outer glowing ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-md opacity-75 group-hover:opacity-100 animate-pulse" />
              {/* Middle ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/30 shadow-[0_0_40px_rgba(96,165,250,0.8)]" />
              {/* Inner button */}
              <div className="absolute inset-3 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-cyan-100 transition-all" />
              {/* Center dot with sparkle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-8 h-8 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </button>

            {/* Placeholder for symmetry */}
            <div className="w-14 h-14" />
          </div>
        )}
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-blue-950/95 to-purple-950/95 backdrop-blur-xl flex flex-col z-50">
          <div className="px-6 py-6 border-b border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Select Exercise</h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#252932] border border-blue-500/30 rounded-xl text-white placeholder:text-blue-400/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                  className="w-full p-4 bg-gradient-to-br from-[#252932] to-[#1a1d23] border border-blue-500/20 rounded-xl text-left hover:border-blue-500/60 hover:bg-gradient-to-br hover:from-blue-950/40 hover:to-purple-950/40 transition-all group shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-blue-300 transition-colors drop-shadow-lg">
                        {exercise.name}
                      </h4>
                      <p className="text-xs text-blue-400/70 font-medium">
                        {exercise.category} • {exercise.difficulty}
                      </p>
                    </div>
                    <Play className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Loading - colorful version */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-blue-950/95 to-purple-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-50">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              {/* Spinning gradient rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-2xl opacity-60 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 animate-spin" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/40 to-purple-600/40 flex items-center justify-center border-2 border-blue-400/50 shadow-[0_0_40px_rgba(96,165,250,0.6)]">
                  <Video className="w-12 h-12 text-blue-300 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                </div>
              </div>
            </div>
            
            <h3 className="text-white font-bold text-2xl mb-3 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">Analyzing Form...</h3>
            <p className="text-blue-300 text-base font-medium drop-shadow-lg">AI is reviewing your technique</p>
            
            {/* Colorful progress bar */}
            <div className="w-80 h-3 bg-gray-800/50 rounded-full overflow-hidden mt-8 mx-auto border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_20px_rgba(96,165,250,0.8)]" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <AnalysisResultSheet
          result={analysisResult}
          onClose={handleCloseResult}
          onSave={handleSaveResult}
        />
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const CameraScreen = memo(CameraScreenComponent);