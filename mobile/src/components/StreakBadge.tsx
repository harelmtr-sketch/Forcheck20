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
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderRadius: 18,
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 10
        }}
      />

      <View
        style={{
          minWidth: 88,
          height: 52,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(239, 68, 68, 0.4)',
          overflow: 'hidden'
        }}
      >
        <LinearGradient
          colors={['rgba(69, 10, 10, 0.7)', 'rgba(69, 26, 3, 0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 14 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: '100%' }}>
            <View
              style={{
                shadowColor: 'rgba(248, 113, 113, 1)',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 12,
                elevation: 8
              }}
            >
              <Flame size={28} color="#F87171" fill="#F87171" strokeWidth={2} />
            </View>

            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '900',
                  color: '#F87171',
                  lineHeight: 28,
                  letterSpacing: -0.8,
                  textShadowColor: 'rgba(248, 113, 113, 0.6)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                  includeFontPadding: false
                }}
              >
                {days}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: 'rgba(252, 165, 165, 0.9)',
                  marginTop: -2,
                  lineHeight: 16,
                  includeFontPadding: false
                }}
              >
                days
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
