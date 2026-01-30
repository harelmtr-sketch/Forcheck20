import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';

type StreakBadgeProps = {
  days: number;
};

export function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.outerGlow} />
      <LinearGradient
        colors={['rgba(69,10,10,0.50)', 'rgba(69,26,3,0.30)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <View style={styles.content}>
          <View style={styles.iconGlow}>
            <Flame size={18} color="#f87171" strokeWidth={2} />
          </View>
          <View style={styles.textStack}>
            <Text style={styles.number}>{days}</Text>
            <Text style={styles.label}>days</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    borderRadius: 12
  },
  outerGlow: {
    position: 'absolute',
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.20)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.40)',
    overflow: 'hidden'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconGlow: {
    shadowColor: 'rgba(248,113,113,1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
    marginRight: 6
  },
  textStack: {
    alignItems: 'center'
  },
  number: {
    fontSize: 18,
    fontWeight: '900',
    color: '#f87171',
    textShadowColor: 'rgba(248,113,113,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5
  },
  label: {
    marginTop: -4,
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(252,165,165,0.80)'
  }
});
