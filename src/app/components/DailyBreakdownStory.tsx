import { X, Share2, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { FriendStory } from '../data/mockFriendsData';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

interface DailyBreakdownStoryProps {
  story: FriendStory;
  onClose: () => void;
  isOwnStory?: boolean;
}

export function DailyBreakdownStory({ story, onClose, isOwnStory = false }: DailyBreakdownStoryProps) {
  const breakdownRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!breakdownRef.current) return;
    
    try {
      const canvas = await html2canvas(breakdownRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `forcheck-daily-${new Date().toISOString().split('T')[0]}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  const handleShare = async () => {
    if (!breakdownRef.current) return;
    
    try {
      const canvas = await html2canvas(breakdownRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'forcheck-daily.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'My Daily Forcheck Stats',
              text: `Check out my daily score: ${story.dailyScore}! 💪`,
            });
          } else {
            // Fallback to download
            handleExport();
          }
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Story Content */}
      <div className="w-full max-w-[448px] h-[calc(100vh-2rem)] flex flex-col">
        {/* Action Buttons */}
        {isOwnStory && (
          <div className="flex gap-2 mb-3">
            <Button
              onClick={handleExport}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        )}

        {/* Breakdown Card (This is what gets exported) */}
        <div 
          ref={breakdownRef}
          className="flex-1 overflow-y-auto rounded-2xl"
          style={{ maxHeight: isOwnStory ? 'calc(100vh - 6rem)' : 'calc(100vh - 2rem)' }}
        >
          <div className="bg-gradient-to-br from-[#252932] via-[#1a1d23] to-[#252932] p-6 space-y-6">
            {/* Header with Profile */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                {story.userAvatar}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl text-white">{story.userName}</h2>
                <p className="text-sm text-white/60 font-medium">{story.timestamp}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60 font-medium">Daily Score</div>
                <div className={`text-4xl font-black ${
                  story.dailyScore >= 90 ? 'text-green-400' :
                  story.dailyScore >= 80 ? 'text-yellow-400' :
                  story.dailyScore >= 70 ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {story.dailyScore}
                </div>
              </div>
            </div>

            {/* Scores Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/10 border-blue-500/40">
                <p className="text-xs text-white/60 font-medium mb-1">Workout Score</p>
                <p className="text-3xl font-black text-blue-400">{story.workoutScore}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-600/20 to-emerald-600/10 border-green-500/40">
                <p className="text-xs text-white/60 font-medium mb-1">Diet Score</p>
                <p className="text-3xl font-black text-green-400">{story.dietScore}</p>
              </Card>
            </div>

            {/* Workout Details */}
            {story.exercises.length > 0 && (
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">💪</span>
                  Workout ({story.exercises.length} exercises)
                </h3>
                <div className="space-y-2">
                  {story.exercises.map((exercise, idx) => (
                    <Card 
                      key={idx}
                      className="p-3 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-sm">{exercise.name}</p>
                          <p className="text-xs text-white/60">
                            {exercise.sets} × {exercise.reps} reps
                          </p>
                        </div>
                        {exercise.score && (
                          <div className="text-2xl font-black text-yellow-400">
                            {exercise.score}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Details */}
            {story.meals.length > 0 && (
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">🍎</span>
                  Nutrition ({story.meals.length} meals)
                </h3>
                <div className="space-y-2">
                  {story.meals.map((meal, idx) => (
                    <Card 
                      key={idx}
                      className="p-3 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-white text-sm">{meal.name}</p>
                        <div className="text-xl font-black text-green-400">
                          {meal.score}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-white/60">
                        <span>{meal.calories} cal</span>
                        <span>{meal.protein}g protein</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Branding */}
            <div className="pt-6 border-t border-white/10 text-center">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                FORCHECK
              </div>
              <p className="text-xs text-white/40 font-medium">
                Track • Analyze • Improve
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
