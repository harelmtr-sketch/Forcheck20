import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
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
  const navigation = useNavigation();

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

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '600' }}>Camera access required</Text>
        <Text style={{ color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
          Enable camera permissions to record your push-up form.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1117' }}>
      <Camera ref={cameraRef} style={{ flex: 1 }} type={CameraType.front} ratio="16:9" />

      <View style={{ position: 'absolute', top: 48, left: 0, right: 0, alignItems: 'center' }}>
        <Pressable onPress={() => setShowExercisePicker(true)}>
          <Text style={{ color: '#cbd5f5', fontWeight: '600' }}>{selectedExercise}</Text>
          <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Tap to change</Text>
        </Pressable>
        {videoUri && (
          <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Video ready</Text>
        )}
      </View>

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
        {error && (
          <Text style={{ color: '#fca5a5', marginBottom: 12, textAlign: 'center' }}>{error}</Text>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Pressable
            onPress={handlePickVideo}
            style={{ flex: 1, marginRight: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', paddingVertical: 12 }}
          >
            <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Upload</Text>
          </Pressable>
          <Pressable
            onPress={handleAnalyze}
            style={{ flex: 1, borderRadius: 16, backgroundColor: '#3b82f6', paddingVertical: 12 }}
            disabled={isAnalyzing}
          >
            <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>
              {isAnalyzing ? 'Analyzing…' : 'Analyze'}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={isRecording ? handleStop : handleRecord}
          style={{
            height: 64,
            borderRadius: 32,
            backgroundColor: isRecording ? '#ef4444' : '#f8fafc',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: isRecording ? '#fff' : '#0f1117', fontWeight: '700' }}>
            {isRecording ? 'Stop Recording' : 'Record 10s'}
          </Text>
        </Pressable>
      </View>

      {isAnalyzing && (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,13,18,0.75)', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#3b82f6" size="large" />
          <Text style={{ color: '#f8fafc', marginTop: 12 }}>Analyzing…</Text>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(6,8,12,0.95)', padding: 24 }}>
          <View style={{ marginTop: 40, backgroundColor: '#1a1d23', borderRadius: 20, padding: 20, flex: 1 }}>
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
              style={{ backgroundColor: '#252932', color: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 }}
            />
            <ScrollView>
              {exerciseDatabase
                .filter((exercise) => exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
                .map((exercise) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => {
                      setSelectedExercise(exercise.name);
                      setShowExercisePicker(false);
                    }}
                    style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <Text style={{ color: '#f8fafc', fontWeight: '600' }}>{exercise.name}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                      {exercise.category} • {exercise.difficulty}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
