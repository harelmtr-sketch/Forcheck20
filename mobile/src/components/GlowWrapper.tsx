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
          intensity={Platform.OS === 'ios' ? 35 : 18}
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
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inactiveContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  glowL1: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(59, 130, 246, 0.10)'
  },
  glowL2: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(59, 130, 246, 0.14)'
  },
  glowL3: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.10)'
  },
  blurPlate: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden'
  },
  iconPlate: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(30, 41, 59, 0.90)',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
