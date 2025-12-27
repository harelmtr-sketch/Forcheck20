import { useState } from 'react';
import { Camera as CameraIcon, Video, Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

type Mode = 'workout' | 'meal';

export function CameraScreen() {
  const [selectedMode, setSelectedMode] = useState<Mode>('workout');

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
      {/* Mode Selector */}
      <div className="px-6 pt-4 pb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/40 rounded-full">
          <CameraIcon className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-green-300 uppercase tracking-wide">Photo Mode</span>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="px-6 pb-4">
        <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/15 border-blue-500/40 shadow-xl">
          <h3 className="font-bold text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            Ready to record?
          </h3>
          <p className="text-xs text-blue-200/90 font-medium">
            Take a video of your set or a photo of your meal
          </p>
        </Card>
      </div>

      {/* Camera Preview Area - flex-1 to fill available space */}
      <div className="flex-1 flex items-center justify-center px-6 min-h-0">
        <div className="w-full aspect-[3/4] max-h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border-2 border-gray-700/50 flex items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Camera Icon Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraIcon className="w-24 h-24 text-gray-600/30" />
          </div>
          
          {/* Glow Effect at Bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Camera Controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-center gap-6 mb-4">
          {/* Upload Button */}
          <button className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors active:scale-95">
            <Upload className="w-5 h-5 text-gray-300" />
          </button>

          {/* Capture Button */}
          <button className="w-16 h-16 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center hover:scale-105 transition-transform active:scale-95 relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner" />
          </button>

          {/* Video Mode Toggle */}
          <button className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors active:scale-95">
            <Video className="w-5 h-5 text-gray-300" />
          </button>
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
            <div className="flex items-start gap-2">
              <div className={`p-1.5 rounded-lg ${
                selectedMode === 'workout' ? 'bg-blue-500/30' : 'bg-blue-500/20'
              }`}>
                <Video className={`w-4 h-4 ${
                  selectedMode === 'workout' 
                    ? 'text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' 
                    : 'text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm mb-0.5 ${
                  selectedMode === 'workout' 
                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                    : 'text-blue-200'
                }`}>
                  Workout
                </h4>
                <p className="text-xs text-blue-300/80 font-medium">
                  Record sets for AI
                </p>
              </div>
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
            <div className="flex items-start gap-2">
              <div className={`p-1.5 rounded-lg ${
                selectedMode === 'meal' ? 'bg-green-500/30' : 'bg-green-500/20'
              }`}>
                <ImageIcon className={`w-4 h-4 ${
                  selectedMode === 'meal' 
                    ? 'text-green-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                    : 'text-green-400'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm mb-0.5 ${
                  selectedMode === 'meal' 
                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                    : 'text-green-200'
                }`}>
                  Meal
                </h4>
                <p className="text-xs text-green-300/80 font-medium">
                  Photo for nutrition
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}