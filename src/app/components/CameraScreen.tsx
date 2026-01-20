import { useState, useRef, useEffect } from 'react';
import { Upload, SwitchCamera, Zap, ZapOff, Camera as CameraIcon, X, Check, Search, Video } from 'lucide-react';
import { Card } from './ui/card';
import { exerciseDatabase } from '../data/exerciseDatabase-clean';
import { analyzeWorkoutForm } from '../utils/aiFormScoring';
import { AnalysisResultSheet } from './AnalysisResultSheet';
import type { Exercise, MuscleStatus } from '../App';
import type { ExerciseData } from '../data/exerciseDatabase-clean';
import type { FormAnalysisResult } from '../utils/aiFormScoring';

type Mode = 'workout' | 'meal';

interface CameraScreenProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  muscleStatus: MuscleStatus[];
  setMuscleStatus: React.Dispatch<React.SetStateAction<MuscleStatus[]>>;
  exerciseToRecord: number | null;
  onRecordingComplete: () => void;
}

export function CameraScreen({ exercises, setExercises, muscleStatus, setMuscleStatus, exerciseToRecord, onRecordingComplete }: CameraScreenProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>('workout');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FormAnalysisResult & { exerciseName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Start camera when component mounts or facingMode changes
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log('getUserMedia not supported');
          return;
        }

        // Request camera access
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
        setError(null);
        setPermissionState('granted');

        // Attach to video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.log('Camera access info:', err.name, err.message);
        // Silently fail - camera is optional, fallback to file input
        if (isMounted) {
          setError(null);
          setStream(null);
          setPermissionState('denied');
        }
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
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  const handleCapture = () => {
    // Just open the file picker - this will use native camera on mobile
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      if (selectedMode === 'workout') {
        // For workout videos, show preview then exercise picker
        setCapturedMedia(url);
        setCapturedBlob(file);
      } else {
        // For meal photos, show preview
        setCapturedMedia(url);
        setCapturedBlob(file);
      }
    }
    
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const takePhoto = () => {
    if (!videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedMedia(url);
        setCapturedBlob(blob);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleCaptureClick = () => {
    if (!stream) {
      // Fallback to file picker if camera not available
      fileInputRef.current?.click();
      return;
    }

    if (selectedMode === 'workout') {
      // Video recording
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    } else {
      // Photo capture
      takePhoto();
    }
  };

  const handleCloseCapturedMedia = () => {
    setCapturedMedia(null);
    setCapturedBlob(null);
    setRecordingTime(0);
    setShowExercisePicker(false);
    setSearchQuery('');
    setAnalysisResult(null);
  };

  const handleSaveCapturedMedia = () => {
    if (selectedMode === 'workout') {
      // If exerciseToRecord is set, automatically select that exercise
      if (exerciseToRecord !== null && exercises[exerciseToRecord]) {
        const exercise = exercises[exerciseToRecord];
        const exerciseData = exerciseDatabase.find(ex => ex.name === exercise.name);
        if (exerciseData) {
          handleExerciseSelect(exerciseData, exerciseToRecord);
          return;
        }
      }
      // Otherwise show exercise picker for workout videos
      setShowExercisePicker(true);
    } else {
      // For meals, just save (would upload for nutrition analysis in production)
      alert('Photo saved! Meal logged successfully! 🍽️');
      handleCloseCapturedMedia();
    }
  };

  const handleExerciseSelect = async (exerciseData: ExerciseData, targetIndex?: number) => {
    setIsAnalyzing(true);
    setShowExercisePicker(false);

    try {
      // Call real AI analysis
      const result = await analyzeWorkoutForm(exerciseData.name, capturedBlob || undefined);
      
      // If targetIndex is provided, update that specific exercise
      if (targetIndex !== undefined && targetIndex !== null) {
        const updatedExercises = [...exercises];
        updatedExercises[targetIndex] = {
          ...updatedExercises[targetIndex],
          score: result.score
          // Keep existing sets/reps from template
        };
        setExercises(updatedExercises);
      } else {
        // Find or create the exercise in the workout
        const existingIndex = exercises.findIndex(ex => ex.name === exerciseData.name);
        
        if (existingIndex >= 0) {
          // Update existing exercise with the AI score and add to set count
          const updatedExercises = [...exercises];
          updatedExercises[existingIndex] = {
            ...updatedExercises[existingIndex],
            score: result.score,
            sets: updatedExercises[existingIndex].sets + result.sets
          };
          setExercises(updatedExercises);
        } else {
          // Add new exercise with AI score and detected sets
          const newExercise: Exercise = {
            name: exerciseData.name,
            sets: result.sets, // Use AI-detected sets (rep count)
            reps: exerciseData.baseReps,
            score: result.score,
            timestamp: new Date().toISOString(),
            fromTemplate: false
          };
          setExercises([...exercises, newExercise]);
        }
      }

      // Update muscle status
      const affectedMuscles = [...exerciseData.primaryMuscles, ...exerciseData.secondaryMuscles];
      setMuscleStatus(prev => prev.map(muscle => {
        if (affectedMuscles.includes(muscle.key)) {
          return {
            ...muscle,
            status: 'sore' as const,
            lastTrained: 'Today',
            setsToday: muscle.setsToday + result.sets // Use detected sets
          };
        }
        return muscle;
      }));

      setIsAnalyzing(false);
      
      // Show beautiful result sheet instead of alert
      console.log('Setting analysis result:', { ...result, exerciseName: exerciseData.name });
      setAnalysisResult({ ...result, exerciseName: exerciseData.name });
      
      // DON'T close captured media yet - wait for user to close result sheet
      
      // Clear exerciseToRecord after successful recording
      if (targetIndex !== undefined && targetIndex !== null) {
        onRecordingComplete();
      }
    } catch (error: any) {
      setIsAnalyzing(false);
      
      // Reset gradio client on error so it can reconnect next time
      const errorMessage = error?.message || 'Unable to analyze video. Please try again.';
      
      // Show user-friendly error
      alert(`❌ Analysis Failed\n\n${errorMessage}\n\nTip: Make sure you have a stable internet connection and the analysis server is available.`);
      console.error('Analysis error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    if (!stream) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setCapturedMedia(url);
      setCapturedBlob(blob);
      recordedChunksRef.current = [];
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }

    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const filteredExercises = exerciseDatabase.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-[#1a1d23]">
      {/* Hidden file input for capture - uses native camera on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept={selectedMode === 'workout' ? 'video/*' : 'image/*'}
        capture={facingMode}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Camera Feed - Full Screen */}
      <div className="absolute inset-0">
        {/* Live Video Stream */}
        {stream && !error && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Error State */}
        {error && (
          <div className="w-full h-full bg-gradient-to-br from-[#252932] to-[#1a1d23] flex flex-col items-center justify-center">
            <CameraIcon className="w-32 h-32 text-gray-600/30 mb-6" />
            <div className="px-8 text-center">
              <h3 className="text-white text-lg font-bold mb-2">Camera Access Needed</h3>
              <p className="text-gray-400 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading State / Fallback */}
        {!stream && !error && (
          <div className="w-full h-full bg-gradient-to-br from-[#252932] to-[#1a1d23] flex flex-col items-center justify-center px-8">
            <CameraIcon className="w-32 h-32 text-gray-600/30 mb-6" />
            <div className="text-center">
              <h3 className="text-white text-lg font-bold mb-2">Camera Ready</h3>
              <p className="text-gray-400 text-sm font-medium">
                Tap the button below to {selectedMode === 'workout' ? 'record video' : 'take a photo'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Controls - Overlaid */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-safe">
        <div className="flex justify-between items-start px-4 pt-4 pb-2">
          {/* Left side - Mode indicator */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMode('workout')}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md border transition-all text-xs font-bold ${
                selectedMode === 'workout'
                  ? 'bg-blue-500/60 border-blue-400/80 text-white shadow-lg'
                  : 'bg-black/30 border-white/20 text-white/70'
              }`}
            >
              Workout
            </button>
            <button
              onClick={() => setSelectedMode('meal')}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md border transition-all text-xs font-bold ${
                selectedMode === 'meal'
                  ? 'bg-green-500/60 border-green-400/80 text-white shadow-lg'
                  : 'bg-black/30 border-white/20 text-white/70'
              }`}
            >
              Meal
            </button>
          </div>

          {/* Right side - Camera controls */}
          <div className="flex gap-2">
            <button
              onClick={handleFlipCamera}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all active:scale-95 shadow-lg"
            >
              <SwitchCamera className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setFlashEnabled(!flashEnabled)}
              className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                flashEnabled 
                  ? 'bg-yellow-500/40 border-yellow-400/60' 
                  : 'bg-black/40 border-white/20'
              }`}
            >
              {flashEnabled ? (
                <Zap className="w-5 h-5 text-yellow-300" />
              ) : (
                <ZapOff className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Exercise Recording Badge */}
        {exerciseToRecord !== null && exercises[exerciseToRecord] && (
          <div className="px-4 mt-2">
            <div className="bg-red-500/20 backdrop-blur-md px-3 py-2 rounded-full border border-red-500/40 inline-flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-red-400" />
              <p className="text-xs text-red-400 font-medium">
                Recording: <span className="font-bold">{exercises[exerciseToRecord].name}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-24 left-0 right-0 z-20 flex items-center justify-center">
          <div className="bg-red-500 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white font-bold text-sm">REC {formatTime(recordingTime)}</span>
          </div>
        </div>
      )}

      {/* Bottom Controls - Overlaid */}
      <div className="absolute bottom-20 left-0 right-0 z-20 pb-6">
        <div className="flex items-center justify-center gap-8">
          {/* Upload Button */}
          <button 
            onClick={handleUpload}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-black/70 transition-all active:scale-95 shadow-xl"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>

          {/* Capture Button - Larger, centered */}
          <button 
            onClick={handleCaptureClick}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white hover:scale-105 relative"
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-red-600 rounded-md" />
            ) : (
              <div className={`w-[72px] h-[72px] rounded-full ${
                selectedMode === 'workout'
                  ? 'bg-blue-500'
                  : 'bg-blue-500'
              }`} />
            )}
          </button>

          {/* Spacer for symmetry */}
          <div className="w-12 h-12" />
        </div>
      </div>

      {/* Captured Media Preview */}
      {capturedMedia && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-30 bg-black flex flex-col items-center justify-center">
          <div className="relative w-full h-full">
            {selectedMode === 'workout' ? (
              <video
                src={capturedMedia}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={capturedMedia}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            )}
            {recordingTime > 0 && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                <p className="text-white text-sm font-bold">
                  {formatTime(recordingTime)}
                </p>
              </div>
            )}
          </div>
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 px-4">
            <button
              onClick={handleCloseCapturedMedia}
              className="w-14 h-14 rounded-full bg-red-500/80 backdrop-blur-md border-2 border-red-400/80 flex items-center justify-center transition-all active:scale-95 shadow-xl"
            >
              <X className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={handleSaveCapturedMedia}
              className="w-14 h-14 rounded-full bg-green-500/80 backdrop-blur-md border-2 border-green-400/80 flex items-center justify-center transition-all active:scale-95 shadow-xl"
            >
              <Check className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Exercise Picker */}
      {showExercisePicker && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-white/10">
            <h3 className="text-white font-bold text-lg">Select Exercise</h3>
            <button
              onClick={() => setShowExercisePicker(false)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-24">
            <div className="space-y-2 py-2">
              {filteredExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-left active:scale-[0.98]"
                >
                  <p className="text-white font-semibold">{exercise.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{exercise.category} • {exercise.baseSets}x{exercise.baseReps}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Analyzing Overlay */}
      {isAnalyzing && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center px-8">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white font-bold text-lg">Analyzing Form...</p>
          <p className="text-gray-400 text-sm mt-2">AI is processing your video</p>
          <p className="text-gray-500 text-xs mt-4 text-center max-w-xs">This may take up to 2 minutes depending on video length and server load. Shorter videos (10-15 seconds) process faster.</p>
        </div>
      )}

      {/* Analysis Result Sheet */}
      {analysisResult && (
        <AnalysisResultSheet
          result={analysisResult}
          onClose={() => {
            setAnalysisResult(null);
            handleCloseCapturedMedia();
          }}
        />
      )}
    </div>
  );
}