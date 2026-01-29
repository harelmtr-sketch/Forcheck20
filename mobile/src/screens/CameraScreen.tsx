import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { analyzeWorkoutForm, getLastAiDebugState, type FormAnalysisResult } from '../utils/aiFormScoring';
import { AnalysisResultSheet } from '../components/AnalysisResultSheet';
import { loadWorkoutSession, saveWorkoutSession, upsertExercise } from '../utils/workoutStorage';
import { exerciseDatabase } from '../data/exerciseDatabase';

const SUPPORTED_EXERCISE = 'Push-ups';

export function CameraScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(FormAnalysisResult & { exerciseName: string }) | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(SUPPORTED_EXERCISE);
  const [recordingTime, setRecordingTime] = useState(0);
  const navigation = useNavigation();
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [recordingTime]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleRecord = async () => {
    if (!cameraRef.current || isRecording) return;
    setError(null);
    setVideoUri(null);

    try {
      setIsRecording(true);
      const recording = await cameraRef.current.recordAsync({ maxDuration: 10, quality: Camera.Constants.VideoQuality['1080p'] });
      setVideoUri(recording.uri);
    } catch (err: any) {
      setError(err?.message || 'Failed to record video.');
    } finally {
      setIsRecording(false);
    }
  };

  const handleStop = () => {
    if (!cameraRef.current) return;
    cameraRef.current.stopRecording();
  };

  const handlePickVideo = async () => {
    setError(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!videoUri) {
      setError('Record or upload a push-up video first.');
      return;
    }

    if (selectedExercise !== SUPPORTED_EXERCISE) {
      setError('AI analysis coming soon for this exercise.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeWorkoutForm(selectedExercise, videoUri);
      setResult({ ...analysis, exerciseName: selectedExercise });
    } catch (err: any) {
      setError(err?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      setRecordingTime(0);
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      setRecordingTime(0);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRecording, recordingTime]);

  const filteredExercises = useMemo(
    () => exerciseDatabase.filter((exercise) => exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())),
    [exerciseSearch]
  );

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <LinearGradient colors={['#0f1117', '#1a1d23', '#0a0d12']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '600' }}>Camera access required</Text>
        <Text style={{ color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
          Enable camera permissions to record your push-up form.
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1117' }}>
      <LinearGradient colors={['#0f1117', '#1a1d23', '#0a0d12']} style={{ position: 'absolute', inset: 0 }} />
      <View style={{ position: 'absolute', inset: 0 }}>
        <View style={{ position: 'absolute', top: -120, left: 40, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(59,130,246,0.25)' }} />
        <View style={{ position: 'absolute', bottom: 120, right: 40, width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(34,211,238,0.18)' }} />
        <View style={{ position: 'absolute', top: '35%', right: '20%', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(168,85,247,0.18)' }} />
      </View>

      <Camera ref={cameraRef} style={{ flex: 1 }} type={CameraType.front} ratio="16:9" />

      {!videoUri && (
        <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -48, marginTop: -48, width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', inset: 0, borderRadius: 48, borderWidth: 2, borderColor: 'rgba(96,165,250,0.45)' }} />
          <View style={{ position: 'absolute', inset: 12, borderRadius: 36, borderWidth: 2, borderColor: 'rgba(56,189,248,0.35)' }} />
          <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(96,165,250,0.6)' }} />
          <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(56,189,248,0.6)' }} />
        </View>
      )}

      <View style={{ position: 'absolute', top: 48, left: 20, right: 20, alignItems: 'center' }}>
        <Pressable onPress={() => setShowExercisePicker(true)} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(59,130,246,0.4)', backgroundColor: 'rgba(15,17,23,0.75)' }}>
          <Text style={{ color: '#cbd5f5', fontWeight: '700', textAlign: 'center' }}>{selectedExercise}</Text>
          <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2, textAlign: 'center' }}>Tap to change</Text>
        </Pressable>
        {videoUri && (
          <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>Video ready</Text>
        )}
      </View>

      {isRecording && (
        <View style={{ position: 'absolute', top: 120, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)', backgroundColor: 'rgba(239,68,68,0.2)' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
          <Text style={{ color: '#fff', fontWeight: '700', fontVariant: ['tabular-nums'], marginLeft: 8 }}>{formattedTime}</Text>
        </View>
      )}

      <Pressable
        onPress={() => setShowDebug(true)}
        style={{
          position: 'absolute',
          top: 48,
          right: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(15,17,23,0.6)'
        }}
      >
        <Text style={{ color: '#f8fafc', fontSize: 12, fontWeight: '600' }}>Debug</Text>
      </Pressable>

      <View style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        {videoUri ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Pressable
              onPress={() => setVideoUri(null)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                borderWidth: 3,
                borderColor: 'rgba(248,113,113,0.5)',
                backgroundColor: 'rgba(239,68,68,0.75)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 32
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Redo</Text>
            </Pressable>
            <Pressable
              onPress={handleAnalyze}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                borderWidth: 3,
                borderColor: 'rgba(34,197,94,0.5)',
                backgroundColor: 'rgba(34,197,94,0.75)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              disabled={isAnalyzing}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{isAnalyzing ? '...' : 'Use'}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              onPress={handlePickVideo}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: 'rgba(168,85,247,0.5)',
                backgroundColor: 'rgba(168,85,247,0.25)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 32
              }}
            >
              <Text style={{ color: '#e9d5ff', fontWeight: '700' }}>Up</Text>
            </Pressable>

            <Pressable
              onPress={isRecording ? handleStop : handleRecord}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View style={{ position: 'absolute', inset: 0, borderRadius: 48, backgroundColor: isRecording ? 'rgba(239,68,68,0.6)' : 'rgba(59,130,246,0.6)' }} />
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: isRecording ? '#ef4444' : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                {isRecording ? (
                  <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: '#fff' }} />
                ) : (
                  <Text style={{ color: '#0f1117', fontWeight: '800' }}>REC</Text>
                )}
              </View>
            </Pressable>

            <View style={{ width: 56, height: 56, marginLeft: 32 }} />
          </View>
        )}
      </View>

      {isAnalyzing && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,13,18,0.85)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: 'rgba(59,130,246,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#3b82f6" size="large" />
          </View>
          <Text style={{ color: '#f8fafc', marginTop: 16, fontWeight: '600' }}>Analyzing Form...</Text>
          <Text style={{ color: '#94a3b8', marginTop: 6 }}>AI is reviewing your technique</Text>
        </View>
      )}

      {error && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6,8,12,0.85)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 320, backgroundColor: '#1a1d23', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' }}>
            <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>Analysis Unavailable</Text>
            <Text style={{ color: '#cbd5f5', textAlign: 'center', marginBottom: 16 }}>{error}</Text>
            <Pressable
              onPress={() => setError(null)}
              style={{ backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 10 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Got it</Text>
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
              sets: result.sets,
              reps: result.sets,
              score: result.score,
              timestamp: new Date().toISOString()
            };
            const updatedExercises = upsertExercise(session.exercises, nextExercise);
            await saveWorkoutSession({ ...session, exercises: updatedExercises });
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

      {showDebug && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,13,18,0.92)', padding: 24 }}>
          <View style={{ marginTop: 80, backgroundColor: '#1a1d23', borderRadius: 20, padding: 20 }}>
            <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Debug</Text>
            {(() => {
              const debug = getLastAiDebugState();
              return (
                <>
                  <Text style={{ color: '#94a3b8', marginBottom: 6 }}>
                    Status: {debug.status ?? '—'}
                  </Text>
                  <Text style={{ color: '#94a3b8', marginBottom: 6 }}>
                    Mime: {debug.mimeType ?? '—'}
                  </Text>
                  <Text style={{ color: '#94a3b8', marginBottom: 6 }}>
                    Video URI: {debug.videoUri ?? '—'}
                  </Text>
                  <Text style={{ color: '#94a3b8', marginBottom: 6 }}>
                    Body: {debug.body ?? '—'}
                  </Text>
                </>
              );
            })()}
            <Pressable
              onPress={() => setShowDebug(false)}
              style={{ marginTop: 16, borderRadius: 12, backgroundColor: '#3b82f6', paddingVertical: 10 }}
            >
              <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Modal visible={showExercisePicker} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(6,8,12,0.95)' }}>
          <LinearGradient colors={['rgba(2,6,23,0.95)', 'rgba(15,23,42,0.95)', 'rgba(30,27,75,0.95)']} style={{ flex: 1, padding: 24 }}>
            <View style={{ marginTop: 40, backgroundColor: '#1a1d23', borderRadius: 20, padding: 20, flex: 1, borderWidth: 1, borderColor: 'rgba(59,130,246,0.25)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700' }}>Select Exercise</Text>
                <Pressable onPress={() => setShowExercisePicker(false)}>
                  <Text style={{ color: '#94a3b8' }}>Close</Text>
                </Pressable>
              </View>
              <TextInput
                placeholder="Search exercises"
                placeholderTextColor="#64748b"
                value={exerciseSearch}
                onChangeText={setExerciseSearch}
                style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)' }}
              />
              <ScrollView>
                {filteredExercises.map((exercise) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => {
                      setSelectedExercise(exercise.name);
                      setShowExercisePicker(false);
                    }}
                    style={{ paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.15)', backgroundColor: 'rgba(37,41,50,0.75)', marginBottom: 8 }}
                  >
                    <Text style={{ color: '#f8fafc', fontWeight: '700' }}>{exercise.name}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                      {exercise.category} • {exercise.difficulty}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}
