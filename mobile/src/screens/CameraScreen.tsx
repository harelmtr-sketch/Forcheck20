import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Platform, Animated, StatusBar } from 'react-native';
import { CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function CameraScreen() {
  const navigation = useNavigation();
  const cameraRef = useRef<CameraView | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordScaleAnim = useRef(new Animated.Value(1)).current;

  const [selectedExercise, setSelectedExercise] = useState<SelectedExercise | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraSessionReady, setIsCameraSessionReady] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const effectiveExercise = useMemo(
    () => selectedExercise ?? { name: 'Quick Record', sets: 0, reps: 0 },
    [selectedExercise]
  );

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
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

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

  const closeCamera = async () => {
    if (isRecording) {
      try {
      cameraRef.current?.stopRecording();
    } catch {}
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
      setRecordingTime((prev) => (prev >= 60 ? 60 : prev + 1));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const animateRecordPress = () => {
    Animated.sequence([
      Animated.timing(recordScaleAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.spring(recordScaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
    ]).start();
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording || !isCameraSessionReady) return;

    try {
      setError(null);
      setVideoUri(null);
      animateRecordPress();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsRecording(true);
      startTimer();

      const recording = await cameraRef.current.recordAsync({
        maxDuration: 60,
        quality: '720p',
        mute: false
      });

      if (!recording?.uri) {
        throw new Error('Recording failed, try again');
      }

      setVideoUri(recording.uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const message = String(e?.message ?? '');
      if (message.toLowerCase().includes('permission')) {
        setError('Camera permission denied');
      } else if (message.toLowerCase().includes('storage')) {
        setError('Not enough storage');
      } else {
        setError('Recording failed, try again');
      }
    } finally {
      setIsRecording(false);
      stopTimer();
      setRecordingTime(0);
    }
  };

  const stopRecording = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      cameraRef.current?.stopRecording();
    } catch {}
  };

  const flipCamera = async () => {
    if (isRecording) return;
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = async () => {
    if (!videoUri) return;
    try {
      setIsProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const analysis = await uploadAndAnalyze(videoUri, selectedExercise);
      setResult({ ...analysis, exerciseName: selectedExercise?.name ?? 'Quick Record' });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Upload failed, check connection');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PermissionGate onClose={closeCamera}>
      <StatusBar barStyle="light-content" />

      {videoUri ? (
        <VideoPreview
          videoUri={videoUri}
          selectedExercise={effectiveExercise}
          isProcessing={isProcessing}
          onRetake={() => setVideoUri(null)}
          onSubmit={handleSubmit}
        />
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            {cameraReady ? (
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={cameraType}
                mode="video"
                videoQuality="720p"
                onCameraReady={() => setIsCameraSessionReady(true)}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#60a5fa" />
              </View>
            )}

            <LinearGradient
              colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.3)', 'transparent']}
              locations={[0, 0.5, 1]}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180 }}
              pointerEvents="none"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.8)']}
              locations={[0, 0.3, 1]}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 280 }}
              pointerEvents="none"
            />

            <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
                <Pressable
                  onPress={closeCamera}
                  disabled={isRecording}
                  style={({ pressed }) => ({
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pressed ? 'rgba(40, 45, 55, 0.85)' : 'rgba(30, 35, 45, 0.7)',
                    borderWidth: 1,
                    borderColor: pressed ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                    opacity: isRecording ? 0.4 : 1
                  })}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </Pressable>

                <Pressable
                  onPress={flipCamera}
                  disabled={isRecording}
                  style={({ pressed }) => ({
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pressed ? 'rgba(40, 45, 55, 0.85)' : 'rgba(30, 35, 45, 0.7)',
                    borderWidth: 1,
                    borderColor: pressed ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                    opacity: isRecording ? 0.4 : 1
                  })}
                >
                  <MaterialCommunityIcons name="camera-flip-outline" size={24} color="#fff" />
                </Pressable>
              </View>
            </SafeAreaView>

            <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 120 : 104, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 40 }}>
              <View style={{ position: 'relative' }}>
                <View style={{ position: 'absolute', top: -8, left: -8, right: -8, bottom: -8, backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: 32 }} />
                <View style={{ position: 'absolute', top: -5, left: -5, right: -5, bottom: -5, backgroundColor: 'rgba(59, 130, 246, 0.12)', borderRadius: 29 }} />
                <View style={{ position: 'absolute', top: -2, left: -2, right: -2, bottom: -2, backgroundColor: 'rgba(59, 130, 246, 0.18)', borderRadius: 26 }} />
                <LinearGradient
                  colors={['rgba(30, 35, 45, 0.9)', 'rgba(26, 31, 41, 0.85)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center' }}>{effectiveExercise.name}</Text>
                </LinearGradient>
              </View>
            </View>

            {isRecording && (
              <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 180 : 164, left: 20 }}>
                <View style={{ position: 'absolute', top: -6, left: -6, right: -6, bottom: -6, backgroundColor: 'rgba(239, 68, 68, 0.3)', borderRadius: 26 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(239, 68, 68, 0.95)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                  <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', opacity: pulseAnim }} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 1.5, marginLeft: 10 }}>REC</Text>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff', marginLeft: 10 }}>{formatTime(recordingTime)}</Text>
                </View>
              </View>
            )}

            <SafeAreaView edges={['bottom']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
              <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: '600', color: '#fff', marginBottom: 20 }}>{isRecording ? formatTime(recordingTime) : '00:00'}</Text>
                <Animated.View style={{ transform: [{ scale: recordScaleAnim }] }}>
                  <Pressable
                    onPress={isRecording ? stopRecording : startRecording}
                    disabled={!isCameraSessionReady}
                    style={{ position: 'relative', opacity: isCameraSessionReady ? 1 : 0.55 }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        top: -12,
                        left: -12,
                        right: -12,
                        bottom: -12,
                        borderRadius: 52,
                        backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.15)'
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        right: -8,
                        bottom: -8,
                        borderRadius: 48,
                        backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.2)'
                      }}
                    />
                    <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: isRecording ? 32 : 66, height: isRecording ? 32 : 66, borderRadius: isRecording ? 6 : 33, backgroundColor: isRecording ? '#EF4444' : '#fff' }} />
                    </View>
                  </Pressable>
                </Animated.View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginTop: 16 }}>
                  {isCameraSessionReady ? (isRecording ? 'Tap to stop recording' : 'Tap to start recording') : 'Preparing camera...'}
                </Text>
              </View>
            </SafeAreaView>
          </View>
        </SafeAreaView>
      )}

      {error && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(7,10,16,0.9)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 340, backgroundColor: '#1a1d23', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Camera Error</Text>
            <Text style={{ color: '#9ca3af', marginTop: 8 }}>{error}</Text>
            <Pressable
              onPress={() => {
                setError(null);
                closeCamera();
              }}
              style={{ marginTop: 14, backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 10 }}
            >
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
              sets: selectedExercise?.sets ?? 0,
              reps: selectedExercise?.reps ?? 0,
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
