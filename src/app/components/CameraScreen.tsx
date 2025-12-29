import { useState, useRef, useEffect } from 'react';
import { Upload, SwitchCamera, Zap, ZapOff, Camera as CameraIcon, X, Check, Search } from 'lucide-react';
import { Card } from './ui/card';
import { exerciseDatabase } from '../data/exerciseDatabase';
import { analyzeWorkoutForm } from '../utils/aiFormScoring';
import type { Exercise, MuscleStatus } from '../App';
import type { ExerciseData } from '../data/exerciseDatabase';

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
      
      // Show success feedback
      alert(`✅ ${exerciseData.name}\n${result.sets} reps detected\nForm Score: ${result.score}/100\n\n${result.feedback}\n\n💪 Strengths:\n${result.strengths.map(s => `• ${s}`).join('\n')}\n\n📈 Improvements:\n${result.improvements.map(i => `• ${i}`).join('\n')}`);
      
      handleCloseCapturedMedia();
      
      // Clear exerciseToRecord after successful recording
      if (targetIndex !== undefined && targetIndex !== null) {
        onRecordingComplete();
      }
    } catch (error: any) {
      setIsAnalyzing(false);
      alert(`❌ Analysis Failed\n\n${error?.message || 'Unable to analyze video. Please try again.'}`);
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
    <div className="h-full flex flex-col bg-black">
      {/* Hidden file input for capture - uses native camera on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept={selectedMode === 'workout' ? 'video/*' : 'image/*'}
        capture={facingMode}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-4 px-4">
        <div className="flex justify-end items-start gap-2">
          {/* Flip Camera Button */}
          <button
            onClick={handleFlipCamera}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all active:scale-95 shadow-lg"
          >
            <SwitchCamera className="w-6 h-6 text-white" />
          </button>

          {/* Flash Button */}
          <button
            onClick={() => setFlashEnabled(!flashEnabled)}
            className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-95 shadow-lg ${
              flashEnabled 
                ? 'bg-yellow-500/40 border-yellow-400/60 hover:bg-yellow-500/60' 
                : 'bg-black/40 border-white/20 hover:bg-black/60'
            }`}
          >
            {flashEnabled ? (
              <Zap className="w-6 h-6 text-yellow-300" />
            ) : (
              <ZapOff className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Instruction Text at Top */}
      <div className="absolute top-20 left-0 right-0 z-10 px-6">
        {exerciseToRecord !== null && exercises[exerciseToRecord] ? (
          <div className="bg-gradient-to-r from-red-600/80 to-pink-600/80 backdrop-blur-md px-4 py-3 rounded-lg shadow-xl border border-red-400/50">
            <p className="text-center text-xs text-white/80 font-medium mb-1">Recording for:</p>
            <p className="text-center text-sm text-white font-bold">
              {exercises[exerciseToRecord].name}
            </p>
            <p className="text-center text-xs text-white/70 mt-1">
              {exercises[exerciseToRecord].sets} sets × {exercises[exerciseToRecord].reps} reps
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-white/90 font-medium drop-shadow-lg">
            {selectedMode === 'workout' 
              ? 'Tap to record your workout'
              : 'Tap to take a photo of your meal'
            }
          </p>
        )}
      </div>

      {/* Camera Feed */}
      <div className="flex-1 relative overflow-hidden">
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

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-32 left-0 right-0 z-20 flex items-center justify-center">
            <div className="bg-red-500/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-white font-bold text-sm">REC {formatTime(recordingTime)}</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
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
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center px-8">
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

      {/* Camera Controls */}
      <div className="px-6 py-6 bg-black">
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Upload Button */}
          <button 
            onClick={handleUpload}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 shadow-lg"
          >
            <Upload className="w-6 h-6 text-white" />
          </button>

          {/* Capture Button */}
          <button 
            onClick={handleCaptureClick}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105"
          >
            <div className={`w-16 h-16 rounded-full shadow-inner ${
              selectedMode === 'workout'
                ? 'bg-gradient-to-br from-blue-400 to-purple-500'
                : 'bg-gradient-to-br from-green-400 to-emerald-500'
            }`} />
          </button>

          {/* Spacer for symmetry */}
          <div className="w-14 h-14" />
        </div>

        {/* Mode Selection Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            onClick={() => setSelectedMode('workout')}
            className={`p-4 cursor-pointer transition-all ${
              selectedMode === 'workout'
                ? 'bg-gradient-to-br from-blue-600/30 to-blue-500/20 border-blue-500/60 shadow-xl shadow-blue-500/20 scale-105'
                : 'bg-gradient-to-br from-blue-600/15 to-blue-500/10 border-blue-500/30 hover:from-blue-600/20 hover:to-blue-500/15'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <h4 className={`font-bold text-sm ${
                selectedMode === 'workout' 
                  ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                  : 'text-blue-200'
              }`}>
                Workout
              </h4>
              <p className="text-xs text-blue-300/80 font-medium text-center">
                Record sets for AI
              </p>
            </div>
          </Card>

          <Card 
            onClick={() => setSelectedMode('meal')}
            className={`p-4 cursor-pointer transition-all ${
              selectedMode === 'meal'
                ? 'bg-gradient-to-br from-green-600/30 to-green-500/20 border-green-500/60 shadow-xl shadow-green-500/20 scale-105'
                : 'bg-gradient-to-br from-green-600/15 to-green-500/10 border-green-500/30 hover:from-green-600/20 hover:to-green-500/15'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <h4 className={`font-bold text-sm ${
                selectedMode === 'meal' 
                  ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                  : 'text-green-200'
              }`}>
                Meal
              </h4>
              <p className="text-xs text-green-300/80 font-medium text-center">
                Photo for nutrition
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Captured Media Preview */}
      {capturedMedia && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-30 bg-black/80 flex flex-col items-center justify-center">
          <div className="relative">
            {selectedMode === 'workout' ? (
              <video
                src={capturedMedia}
                controls
                className="w-full h-full max-w-3xl max-h-3xl object-cover"
              />
            ) : (
              <img
                src={capturedMedia}
                alt="Captured"
                className="w-full h-full max-w-3xl max-h-3xl object-cover"
              />
            )}
            <div className="absolute top-4 left-4">
              <p className="text-white text-sm font-medium">
                {selectedMode === 'workout' ? formatTime(recordingTime) : ''}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleCloseCapturedMedia}
              className="w-12 h-12 rounded-full bg-red-500/40 backdrop-blur-md border border-red-500/60 flex items-center justify-center transition-all active:scale-95 shadow-lg"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleSaveCapturedMedia}
              className="w-12 h-12 rounded-full bg-green-500/40 backdrop-blur-md border border-green-500/60 flex items-center justify-center transition-all active:scale-95 shadow-lg"
            >
              <Check className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Exercise Picker */}
      {showExercisePicker && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-40 bg-black/95 flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Select Exercise</h3>
            <button
              onClick={() => setShowExercisePicker(false)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredExercises.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseSelect(exercise)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-left"
              >
                <p className="text-white font-medium">{exercise.name}</p>
                <p className="text-sm text-gray-400 mt-1">{exercise.category} • {exercise.baseSets}x{exercise.baseReps}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Analyzing Overlay */}
      {isAnalyzing && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white font-bold text-lg">Analyzing Form...</p>
          <p className="text-gray-400 text-sm mt-2">AI is processing your video</p>
        </div>
      )}
    </div>
  );
}