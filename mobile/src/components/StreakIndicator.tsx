import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';

type StreakIndicatorProps = {
  days: number;
};

export function StreakIndicator({ days }: StreakIndicatorProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.outerGlow} />
      <LinearGradient
        colors={['rgba(69,10,10,0.50)', 'rgba(69,26,3,0.30)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <Flame size={24} color="#f87171" fill="#f87171" strokeWidth={2} />
        <View style={styles.textStack}>
          <Text style={styles.number}>{days}</Text>
          <Text style={styles.label}>days</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative'
  },
  outerGlow: {
    position: 'absolute',
    top: -6,
    right: -6,
    bottom: -6,
    left: -6,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.2)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  badge: {
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  textStack: {
    marginLeft: 8,
    alignItems: 'center'
  },
  number: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f87171',
    textShadowColor: 'rgba(248,113,113,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6
  },
  label: {
    marginTop: -4,
    fontSize: 12,
    color: 'rgba(252,165,165,0.8)'
  }
});
