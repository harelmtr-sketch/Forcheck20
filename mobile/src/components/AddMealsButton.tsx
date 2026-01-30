import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Utensils } from 'lucide-react-native';
import { GlowIconBadge } from './GlowIconBadge';

type AddMealsButtonProps = {
  onPress: () => void;
};

export function AddMealsButton({ onPress }: AddMealsButtonProps) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] });
  const borderColor = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.5)']
  });
  const shadowOpacity = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] });
  const iconScale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: false }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 0, useNativeDriver: false }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale }],
          borderColor,
          shadowOpacity
        }
      ]}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <LinearGradient colors={['#1b2230', '#171c24']} style={styles.gradient}>
          <View>
            <Text style={styles.title}>Add Meals</Text>
            <Text style={styles.subtitle}>Track your nutrition</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <GlowIconBadge size={56} borderRadius={12}>
              <Utensils size={32} color="#60a5fa" strokeWidth={2} />
            </GlowIconBadge>
          </Animated.View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4
  },
  gradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 6
  }
});
