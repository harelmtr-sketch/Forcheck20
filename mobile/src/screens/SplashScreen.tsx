import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2700);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LinearGradient
      colors={['#0f1117', '#1a1d23', '#0a0d12']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#f8fafc', fontSize: 28, fontWeight: '700', letterSpacing: 2 }}>
          KINETIC
        </Text>
        <Text style={{ color: '#94a3b8', marginTop: 12 }}>
          Preparing your daily session
        </Text>
      </View>
    </LinearGradient>
  );
}
