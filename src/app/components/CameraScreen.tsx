import { useState, useRef, useEffect } from 'react';
import { Upload, SwitchCamera, Zap, ZapOff, Camera as CameraIcon, X, Check, Search, Video, Play } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
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
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FormAnalysisResult & { exerciseName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (selectedMode === 'workout') {
      // Show exercise picker for workout videos
      setShowExercisePicker(true);
    } else {
      // Handle meal photo upload
      alert('Meal photo analysis coming soon!');
    }
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
    <div className="h-full flex flex-col relative overflow-hidden bg-[#1a1d23]">
      {/* Subtle blue glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-400/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={selectedMode === 'workout' ? 'video/*' : 'image/*'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="relative z-10 px-6 py-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-xl text-white">Record Form</h1>
            <p className="text-sm text-gray-400 font-medium">Upload video to analyze</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-600/20 to-blue-500/10 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Video className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMode('workout')}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              selectedMode === 'workout'
                ? 'bg-gradient-to-br from-blue-600/30 to-blue-500/20 border border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-[#252932] border border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Workout Video
          </button>
          <button
            onClick={() => setSelectedMode('meal')}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              selectedMode === 'meal'
                ? 'bg-gradient-to-br from-green-600/30 to-green-500/20 border border-green-500/50 text-green-400 shadow-lg shadow-green-500/20'
                : 'bg-[#252932] border border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            <CameraIcon className="w-4 h-4 inline mr-2" />
            Meal Photo
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {/* Upload Area */}
        <div className="w-full max-w-sm">
          {/* Camera Viewfinder Card */}
          <Card className="p-0 overflow-hidden bg-gradient-to-br from-[#252932] to-[#1a1d23] border border-white/10 mb-6">
            <div className="aspect-[9/16] bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Grid overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/5" />
                ))}
              </div>

              {/* Center content */}
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-500/10 flex items-center justify-center border border-blue-500/30 shadow-xl shadow-blue-500/20">
                  <CameraIcon className="w-12 h-12 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.7)]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {selectedMode === 'workout' ? 'Upload Workout Video' : 'Upload Meal Photo'}
                </h3>
                <p className="text-gray-400 text-sm font-medium px-6">
                  {selectedMode === 'workout' 
                    ? 'AI will analyze your form and provide feedback' 
                    : 'Get instant nutrition analysis'}
                </p>
              </div>

              {/* Corner brackets for camera feel */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400/40" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400/40" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400/40" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400/40" />
            </div>
          </Card>

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30"
          >
            <Upload className="w-5 h-5 inline mr-3" />
            Choose {selectedMode === 'workout' ? 'Video' : 'Photo'}
          </button>

          {/* Info text */}
          <p className="text-center text-gray-500 text-xs font-medium mt-4">
            {selectedMode === 'workout' 
              ? 'Supported formats: MP4, MOV, AVI' 
              : 'Supported formats: JPG, PNG, HEIC'}
          </p>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col z-50">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Select Exercise</h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#252932] border border-white/10 rounded-xl text-white placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                  className="w-full p-4 bg-[#252932] border border-white/10 rounded-xl text-left hover:border-blue-500/40 hover:bg-[#2a2f3a] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {exercise.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {exercise.category} • {exercise.difficulty}
                      </p>
                    </div>
                    <Play className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-500/20 flex items-center justify-center border border-blue-500/50 shadow-2xl shadow-blue-500/30 animate-pulse">
              <Video className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Analyzing Form...</h3>
            <p className="text-gray-400 text-sm font-medium">AI is reviewing your technique</p>
            
            {/* Progress bar */}
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mt-6 mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: '70%' }} />
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
}
