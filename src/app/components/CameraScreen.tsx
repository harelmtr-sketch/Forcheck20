import { useState, useRef, useEffect } from 'react';
import { Upload, SwitchCamera, Zap, ZapOff, Camera as CameraIcon } from 'lucide-react';
import { Card } from './ui/card';

type Mode = 'workout' | 'meal';

export function CameraScreen() {
  const [selectedMode, setSelectedMode] = useState<Mode>('workout');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment'); // Track which camera
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start camera when component mounts or facingMode changes
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Stop any existing stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
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

        currentStream = mediaStream;
        setStream(mediaStream);
        setError(null);

        // Attach to video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        // Silently fail - camera is optional, fallback to file input
        setError(null);
        setStream(null);
      }
    };

    startCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
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
      console.log('File captured:', url);
      
      // Visual feedback
      alert(`${selectedMode === 'workout' ? 'Video' : 'Photo'} captured successfully! 📸`);
      
      // Here you would:
      // 1. Upload to server for AI analysis
      // 2. Display preview
      // 3. Add to workout/meal log
    }
  };

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
        <p className="text-center text-sm text-white/90 font-medium drop-shadow-lg">
          {selectedMode === 'workout' 
            ? 'Tap to record your workout'
            : 'Tap to take a photo of your meal'
          }
        </p>
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
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
            <CameraIcon className="w-32 h-32 text-gray-600/30 mb-6" />
            <div className="px-8 text-center">
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
            onClick={handleCapture}
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
    </div>
  );
}