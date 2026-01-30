import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Plus } from 'lucide-react-native';
import { GlowIconBadge } from './GlowIconBadge';

type WorkoutHeaderProps = {
  onAddPress: () => void;
};

export function WorkoutHeader({ onAddPress }: WorkoutHeaderProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.row}>
      <GlowIconBadge
        shape="square"
        size={40}
        borderRadius={10}
        borderColor="rgba(59,130,246,0.5)"
        outerGlowColor="rgba(59,130,246,0.15)"
        gradientColors={['rgba(59,130,246,0.30)', 'rgba(37,99,235,0.20)']}
        rimColor="rgba(96,165,250,0.20)"
        outerGlowInset={4}
      >
        <Dumbbell size={20} color="#60a5fa" strokeWidth={2} />
      </GlowIconBadge>
      <Text style={styles.title}>Workout</Text>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPress={onAddPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <LinearGradient
            colors={['rgba(59,130,246,0.35)', 'rgba(37,99,235,0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.plusButton}
          >
            <Plus size={16} color="#93c5fd" strokeWidth={2} />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginLeft: 10,
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(96,165,250,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  }
});
