import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import type { FormAnalysisResult } from '../utils/aiFormScoring';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnalysisResultSheetProps {
  result: FormAnalysisResult & { exerciseName: string };
  onSave: () => void;
  onRetry: () => void;
  onClose: () => void;
}

const radius = 92;
const strokeWidth = 12;
const circumference = 2 * Math.PI * radius;

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Great';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Try Again';
}

function scoreColor(score: number) {
  if (score >= 85) return '#22c55e';
  if (score >= 75) return '#84cc16';
  if (score >= 65) return '#eab308';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

export function AnalysisResultSheet({ result, onSave, onRetry, onClose }: AnalysisResultSheetProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(result.score, {
      duration: 1600,
      easing: Easing.bezier(0.16, 1, 0.3, 1)
    });
  }, [result.score, progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(progress.value, [0, 100], [circumference, 0]);
    return {
      strokeDashoffset
    };
  });

  return (
    <View style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(10, 13, 18, 0.92)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24
    }}>
      <View style={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#1a1d23',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 24
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600' }}>{result.exerciseName}</Text>
          <Text style={{ color: '#f8fafc', fontSize: 20, fontWeight: '700', marginTop: 6 }}>
            {scoreLabel(result.score)}
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Svg width={220} height={220}>
            <Circle
              cx="110"
              cy="110"
              r={radius}
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <AnimatedCircle
              cx="110"
              cy="110"
              r={radius}
              stroke={scoreColor(result.score)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={animatedProps}
              fill="none"
            />
          </Svg>
          <View style={{ position: 'absolute', alignItems: 'center' }}>
            <Text style={{ color: '#f8fafc', fontSize: 48, fontWeight: '700' }}>{result.score}</Text>
            <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600' }}>Score</Text>
          </View>
        </View>

        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: '#cbd5f5', fontWeight: '600' }}>{result.sets} reps</Text>
          <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>{result.feedback}</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#f8fafc', fontWeight: '700', marginBottom: 6 }}>Strengths</Text>
          {result.strengths.length === 0 ? (
            <Text style={{ color: '#94a3b8' }}>Keep working on fundamentals.</Text>
          ) : (
            result.strengths.map((item) => (
              <Text key={item} style={{ color: '#cbd5f5', marginBottom: 4 }}>• {item}</Text>
            ))
          )}
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#f8fafc', fontWeight: '700', marginBottom: 6 }}>Improvements</Text>
          {result.improvements.map((item) => (
            <Text key={item} style={{ color: '#fca5a5', marginBottom: 4 }}>• {item}</Text>
          ))}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 24 }}>
          <Pressable
            onPress={onRetry}
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              paddingVertical: 12,
              marginRight: 12
            }}
          >
            <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Retry</Text>
          </Pressable>
          <Pressable
            onPress={onSave}
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: '#3b82f6',
              paddingVertical: 12
            }}
          >
            <Text style={{ color: '#f8fafc', textAlign: 'center', fontWeight: '600' }}>Save</Text>
          </Pressable>
        </View>

        <Pressable onPress={onClose} style={{ marginTop: 16 }}>
          <Text style={{ color: '#94a3b8', textAlign: 'center' }}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}
