import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Utensils } from 'lucide-react-native';

type AddMealsButtonProps = {
  onPress: () => void;
};

export function AddMealsButton({ onPress }: AddMealsButtonProps) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] });
  const borderColor = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(59,130,246,0.25)', 'rgba(59,130,246,0.4)']
  });

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
          borderColor
        }
      ]}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <LinearGradient
          colors={['#1E232D', 'rgba(30, 35, 45, 0.95)', 'rgba(26, 29, 36, 0.9)', 'rgba(22, 24, 30, 0.85)', '#16181E']}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          style={styles.gradient}
        >
          <View style={styles.copy}>
            <Text style={styles.title}>Add Meals</Text>
            <Text style={styles.subtitle}>Track your nutrition</Text>
          </View>
          <View style={styles.badgeShell}>
            <View style={styles.glowOuter} />
            <View style={styles.glowMid} />
            <View style={styles.glowInner} />
            <View style={styles.badge}>
              <LinearGradient colors={['rgba(59, 130, 246, 0.30)', 'rgba(37, 99, 235, 0.20)']} style={styles.badgeGradient}>
                <View style={styles.badgeRim} />
                <View style={styles.iconGlow}>
                  <Utensils size={24} color="#60a5fa" strokeWidth={2} />
                </View>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  copy: {
    flex: 1,
    paddingRight: 16
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.4,
    marginBottom: 8
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.1
  },
  badgeShell: {
    width: 52,
    height: 52,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  glowOuter: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 36
  },
  glowMid: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 32
  },
  glowInner: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(59, 130, 246, 0.10)',
    borderRadius: 28
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    overflow: 'hidden'
  },
  badgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 11
  },
  iconGlow: {
    shadowColor: 'rgba(96, 165, 250, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6
  }
});
