import { useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SelectedExercise } from '../utils/cameraSelection';

type VideoPreviewProps = {
  videoUri: string;
  selectedExercise: SelectedExercise;
  isProcessing: boolean;
  onRetake: () => void;
  onSubmit: () => void;
};

export function VideoPreview({ videoUri, selectedExercise, isProcessing, onRetake, onSubmit }: VideoPreviewProps) {
  const videoRef = useRef<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggle = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <Pressable onPress={toggle} style={{ flex: 1 }}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          shouldPlay
          isLooping
          resizeMode={ResizeMode.COVER}
          style={{ flex: 1 }}
        />
        <View style={{ position: 'absolute', top: 16, left: 16, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(15,17,23,0.75)' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{selectedExercise.name}</Text>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>{selectedExercise.sets} sets × {selectedExercise.reps} reps</Text>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row', padding: 16, backgroundColor: 'rgba(10,13,18,0.9)' }}>
        <Pressable onPress={onRetake} style={{ flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(248,113,113,0.5)', marginRight: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fca5a5', fontWeight: '700' }}>Retake</Text>
        </Pressable>
        <Pressable onPress={onSubmit} disabled={isProcessing} style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' }}>
          {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Submit</Text>}
        </Pressable>
      </View>

      {isProcessing && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#60a5fa" size="large" />
          <Text style={{ color: '#fff', marginTop: 12, fontWeight: '700' }}>Analyzing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
