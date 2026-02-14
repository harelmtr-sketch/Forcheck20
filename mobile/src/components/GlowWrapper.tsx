import { Platform, StyleSheet, View, type ReactNode } from 'react-native';
import { BlurView } from 'expo-blur';

type GlowWrapperProps = {
  active: boolean;
  children: ReactNode;
};

const ENABLE_ANDROID_BLUR = false;

export function GlowWrapper({ active, children }: GlowWrapperProps) {
  if (!active) {
    return <View style={styles.inactiveContainer}>{children}</View>;
  }

  const showBlur = Platform.OS === 'ios' || ENABLE_ANDROID_BLUR;

  return (
    <View style={styles.root}>
      <View style={styles.glowL1} />
      <View style={styles.glowL2} />
      <View style={styles.glowL3} />

      {showBlur && (
        <BlurView
          intensity={Platform.OS === 'ios' ? 28 : 16}
          tint="dark"
          {...(Platform.OS === 'android' ? ({ experimentalBlurMethod: 'dimezisBlurView' } as const) : {})}
          style={styles.blurPlate}
        />
      )}

      <View style={styles.iconPlate}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inactiveContainer: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  glowL1: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(59, 130, 246, 0.05)'
  },
  glowL2: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(59, 130, 246, 0.08)'
  },
  glowL3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.10)'
  },
  blurPlate: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden'
  },
  iconPlate: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
