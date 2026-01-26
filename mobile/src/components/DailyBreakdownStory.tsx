import { useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

type StoryData = {
  userName: string;
  score: number;
  exercise: string;
  timestamp: string;
};

type DailyBreakdownStoryProps = {
  visible: boolean;
  story: StoryData | null;
  onClose: () => void;
};

export function DailyBreakdownStory({ visible, story, onClose }: DailyBreakdownStoryProps) {
  const captureRef = useRef<ViewShot>(null);
  const [isSharing, setIsSharing] = useState(false);

  const scoreLabel = useMemo(() => {
    if (!story) return '';
    if (story.score >= 90) return 'Elite';
    if (story.score >= 75) return 'Strong';
    if (story.score >= 60) return 'Solid';
    if (story.score >= 40) return 'Needs Work';
    return 'Keep Going';
  }, [story]);

  const handleShare = async () => {
    if (!captureRef.current) return;
    setIsSharing(true);
    try {
      const uri = await captureRef.current.capture?.();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleSave = async () => {
    if (!captureRef.current) return;
    setIsSharing(true);
    try {
      const uri = await captureRef.current.capture?.();
      if (!uri) return;
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return;
      await MediaLibrary.saveToLibraryAsync(uri);
    } finally {
      setIsSharing(false);
    }
  };

  if (!story) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(6,8,12,0.95)', padding: 24, justifyContent: 'center' }}>
        <ViewShot ref={captureRef} options={{ format: 'png', quality: 1 }}>
          <View style={{ backgroundColor: '#111827', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
            <Text style={{ color: '#60a5fa', fontWeight: '700' }}>Daily Breakdown</Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 10 }}>{story.userName}</Text>
            <Text style={{ color: '#94a3b8', marginTop: 4 }}>{story.timestamp}</Text>

            <View style={{ marginTop: 20, backgroundColor: '#1f2937', borderRadius: 20, padding: 16 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>Score</Text>
              <Text style={{ color: '#fbbf24', fontSize: 40, fontWeight: '900' }}>{story.score}</Text>
              <Text style={{ color: '#e2e8f0', marginTop: 4 }}>{scoreLabel}</Text>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={{ color: '#e2e8f0', fontWeight: '600' }}>{story.exercise}</Text>
              <Text style={{ color: '#94a3b8', marginTop: 6 }}>Captured with Kinetic AI form analysis.</Text>
            </View>
          </View>
        </ViewShot>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Pressable onPress={onClose} style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingVertical: 12, marginRight: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Close</Text>
          </Pressable>
          <Pressable onPress={handleSave} style={{ flex: 1, backgroundColor: '#1d4ed8', borderRadius: 14, paddingVertical: 12, marginRight: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Save</Text>
          </Pressable>
          <Pressable onPress={handleShare} style={{ flex: 1, backgroundColor: '#22c55e', borderRadius: 14, paddingVertical: 12 }}>
            <Text style={{ color: '#0f1117', textAlign: 'center', fontWeight: '800' }}>Share</Text>
          </Pressable>
        </View>

        {isSharing && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#60a5fa" />
          </View>
        )}
      </View>
    </Modal>
  );
}
