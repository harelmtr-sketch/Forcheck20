import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AnalysisResultSheet } from '../components/AnalysisResultSheet';
import { PermissionGate } from '../components/PermissionGate';
import { VideoPreview } from '../components/VideoPreview';
import { uploadAndAnalyze } from '../utils/uploadAndAnalyze';
import { loadWorkoutSession, saveWorkoutSession, upsertExercise } from '../utils/workoutStorage';
import { clearSelectedExercise, loadSelectedExercise, type SelectedExercise } from '../utils/cameraSelection';

export function CameraScreen() {
  const navigation = useNavigation();
  const cameraRef = useRef<CameraView | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [selectedExercise, setSelectedExercise] = useState<SelectedExercise | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [])
  );

  useEffect(() => {
    const init = async () => {
      const selected = await loadSelectedExercise();
      setSelectedExercise(selected);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
      setTimeout(() => setCameraReady(true), 100);
    };
    init();
  }, []);

  const formattedTime = `${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}`;

  const closeCamera = async () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
    setVideoUri(null);
    navigation.navigate('Daily' as never);
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingTime(0);
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;
    try {
      setError(null);
      setVideoUri(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsRecording(true);
      startTimer();
      const recording = await cameraRef.current.recordAsync({
        maxDuration: 60,
        mute: false
      });
      if (!recording?.uri) {
        throw new Error('Recording failed, try again');
      }
      setVideoUri(recording.uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e?.message?.includes('permission') ? 'Camera permission denied' : 'Recording failed, try again');
    } finally {
      setIsRecording(false);
      stopTimer();
    }
  };

  const stopRecording = async () => {
    cameraRef.current?.stopRecording();
  };

  const flipCamera = async () => {
    if (isRecording) return;
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = async () => {
    if (!videoUri || !selectedExercise) return;
    try {
      setIsProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const analysis = await uploadAndAnalyze(videoUri, selectedExercise);
      setResult({ ...analysis, exerciseName: selectedExercise.name });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e?.message?.includes('Upload') ? 'Upload failed, check connection' : e?.message || 'Upload failed, check connection');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedExercise) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Select an exercise first</Text>
        <Text style={{ color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>Go to Daily and choose an exercise before opening the Camera tab.</Text>
        <Pressable onPress={closeCamera} style={{ marginTop: 16, backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Go to Daily</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <PermissionGate onClose={closeCamera}>
      {videoUri ? (
        <VideoPreview
          videoUri={videoUri}
          selectedExercise={selectedExercise}
          isProcessing={isProcessing}
          onRetake={() => setVideoUri(null)}
          onSubmit={handleSubmit}
        />
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flex: 1 }}>
            {cameraReady ? (
              <CameraView ref={cameraRef} style={{ flex: 1 }} facing={cameraType} ratio="16:9" videoQuality="720p" />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#60a5fa" /></View>
            )}

            <View style={{ position: 'absolute', top: 10, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Pressable onPress={closeCamera} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(10,13,18,0.65)', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="close" size={22} color="#f8fafc" />
              </Pressable>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(10,13,18,0.65)' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>{selectedExercise.name}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{selectedExercise.sets} sets × {selectedExercise.reps} reps</Text>
              </View>
              <Pressable disabled={isRecording} onPress={flipCamera} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(10,13,18,0.65)', alignItems: 'center', justifyContent: 'center', opacity: isRecording ? 0.5 : 1 }}>
                <MaterialCommunityIcons name="camera-flip-outline" size={20} color="#f8fafc" />
              </Pressable>
            </View>

            {isRecording && (
              <View style={{ position: 'absolute', top: 70, alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 18, backgroundColor: 'rgba(220,38,38,0.35)', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
                <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 8 }}>REC {formattedTime}</Text>
              </View>
            )}

            <View style={{ position: 'absolute', bottom: 28, left: 0, right: 0, alignItems: 'center' }}>
              <Pressable onPress={isRecording ? stopRecording : startRecording} style={{ width: 94, height: 94, borderRadius: 47, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 70, height: 70, borderRadius: isRecording ? 10 : 35, backgroundColor: isRecording ? '#ef4444' : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                  {!isRecording && <Text style={{ color: '#111827', fontWeight: '800' }}>REC</Text>}
                </View>
              </Pressable>
              <Text style={{ color: '#d1d5db', marginTop: 12 }}>{isRecording ? 'Tap to stop' : 'Tap to record up to 60s'}</Text>
            </View>
          </View>
        </SafeAreaView>
      )}

      {error && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(7,10,16,0.9)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 340, backgroundColor: '#1a1d23', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Camera Error</Text>
            <Text style={{ color: '#9ca3af', marginTop: 8 }}>{error}</Text>
            <Pressable onPress={() => { setError(null); closeCamera(); }} style={{ marginTop: 14, backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 10 }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      )}

      {result && (
        <AnalysisResultSheet
          result={result}
          onSave={async () => {
            const session = await loadWorkoutSession();
            const nextExercise = {
              name: result.exerciseName,
              sets: selectedExercise.sets,
              reps: selectedExercise.reps,
              score: result.score,
              timestamp: new Date().toISOString()
            };
            await saveWorkoutSession({ ...session, exercises: upsertExercise(session.exercises, nextExercise) });
            await clearSelectedExercise();
            setResult(null);
            setVideoUri(null);
            navigation.navigate('Daily' as never);
          }}
          onRetry={() => {
            setResult(null);
            setVideoUri(null);
          }}
          onClose={() => setResult(null)}
        />
      )}
    </PermissionGate>
  );
}
