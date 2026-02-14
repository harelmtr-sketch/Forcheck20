import { useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!status.isPlaying);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1 }}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          shouldPlay
          isLooping
          resizeMode={ResizeMode.CONTAIN}
          style={{ flex: 1 }}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
            }
          }}
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          locations={[0, 0.3]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160 }}
          pointerEvents="none"
        />

        <View style={{ position: 'absolute', top: 20, left: 24, right: 24, alignItems: 'center' }}>
          <View style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: 'rgba(30, 35, 45, 0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{selectedExercise.name}</Text>
          </View>
        </View>

        <Pressable onPress={toggle} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          {!isPlaying && (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                ...(Platform.OS === 'ios'
                  ? { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }
                  : { elevation: 8 })
              }}
            >
              <MaterialCommunityIcons name="play" size={38} color="#fff" style={{ marginLeft: 4 }} />
            </View>
          )}
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12, backgroundColor: 'rgba(0, 0, 0, 0.95)', gap: 12 }}>
        <Pressable
          onPress={onRetake}
          disabled={isProcessing}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 16,
            borderRadius: 12,
            backgroundColor: pressed ? 'rgba(50,55,65,0.9)' : 'rgba(40,45,55,0.8)',
            borderWidth: 1,
            borderColor: pressed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
            opacity: isProcessing ? 0.5 : 1
          })}
        >
          <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Retake Video</Text>
        </Pressable>

        <Pressable
          onPress={onSubmit}
          disabled={isProcessing}
          style={({ pressed }) => ({ borderRadius: 12, overflow: 'hidden', opacity: isProcessing ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <LinearGradient colors={['#3B82F6', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 }}>
            {isProcessing ? (
              <>
                <ActivityIndicator color="#fff" />
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Analyzing Form...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Submit for Analysis</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
