import { View, Text, StyleSheet } from 'react-native';

type GlowScoreNumberProps = {
  value: number;
  fontSize?: number;
};

const getScoreGlow = (score: number) => {
  if (score >= 90) return { color: '#4ade80', glow: 'rgba(74,222,128,0.65)' };
  if (score >= 80) return { color: '#22c55e', glow: 'rgba(34,197,94,0.65)' };
  if (score >= 70) return { color: '#facc15', glow: 'rgba(250,204,21,0.65)' };
  if (score >= 60) return { color: '#fb923c', glow: 'rgba(251,146,60,0.65)' };
  if (score >= 50) return { color: '#f97316', glow: 'rgba(249,115,22,0.65)' };
  return { color: '#f87171', glow: 'rgba(248,113,113,0.65)' };
};

export function GlowScoreNumber({ value, fontSize = 64 }: GlowScoreNumberProps) {
  const { color, glow } = getScoreGlow(value);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.shadowLayer,
          {
            shadowColor: color,
            elevation: 10
          }
        ]}
      >
        <Text style={[styles.textBase, { fontSize, color, opacity: 0 }]}>{value}</Text>
      </View>
      <Text
        style={[
          styles.textBase,
          {
            fontSize,
            color,
            textShadowColor: glow,
            textShadowRadius: 24
          }
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shadowLayer: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 30
  },
  textBase: {
    fontWeight: '900',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 }
  }
});
