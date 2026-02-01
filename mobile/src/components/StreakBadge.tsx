import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';

type StreakBadgeProps = {
  days: number;
};

export function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <View style={{ position: 'relative' }}>
      <View
        style={{
          position: 'absolute',
          top: -6,
          left: -6,
          right: -6,
          bottom: -6,
          backgroundColor: 'rgba(239, 68, 68, 0.20)',
          borderRadius: 18,
          shadowColor: '#ef4444',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 8
        }}
      />

      <View
        style={{
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: 'rgba(239, 68, 68, 0.40)',
          overflow: 'hidden',
          minWidth: 90
        }}
      >
        <LinearGradient
          colors={['rgba(69, 10, 10, 0.60)', 'rgba(69, 26, 3, 0.40)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              shadowColor: 'rgba(248, 113, 113, 1)',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
              elevation: 6
            }}
          >
            <Flame size={26} color="#f87171" fill="#f87171" strokeWidth={2} />
          </View>

          <View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '900',
                color: '#f87171',
                lineHeight: 26,
                letterSpacing: -0.5,
                textShadowColor: 'rgba(248, 113, 113, 0.45)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8
              }}
            >
              {days}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: 'rgba(252, 165, 165, 0.85)',
                marginTop: -3,
                lineHeight: 16
              }}
            >
              days
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
