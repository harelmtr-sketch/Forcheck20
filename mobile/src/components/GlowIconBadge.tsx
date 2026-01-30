import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type GlowIconBadgeProps = {
  children: ReactNode;
  shape?: 'square' | 'circle';
  size: number;
  borderRadius?: number;
  borderColor?: string;
  outerGlowColor?: string;
  gradientColors?: string[];
  rimColor?: string;
  outerGlowInset?: number;
  outerShadowRadius?: number;
  outerElevation?: number;
  iconShadowRadius?: number;
  iconElevation?: number;
};

export function GlowIconBadge({
  children,
  shape = 'square',
  size,
  borderRadius,
  borderColor = 'rgba(59,130,246,0.5)',
  outerGlowColor = 'rgba(59,130,246,0.15)',
  gradientColors = ['rgba(59,130,246,0.30)', 'rgba(37,99,235,0.20)'],
  rimColor = 'rgba(96,165,250,0.20)',
  outerGlowInset = 4,
  outerShadowRadius = 12,
  outerElevation = 6,
  iconShadowRadius = 6,
  iconElevation = 3
}: GlowIconBadgeProps) {
  const resolvedRadius = shape === 'circle' ? size / 2 : borderRadius ?? size / 2;
  const rimRadius = Math.max(0, resolvedRadius - 1);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View
        style={[
          styles.outerGlow,
          {
            backgroundColor: outerGlowColor,
            borderRadius: resolvedRadius + outerGlowInset,
            top: -outerGlowInset,
            right: -outerGlowInset,
            bottom: -outerGlowInset,
            left: -outerGlowInset,
            shadowRadius: outerShadowRadius,
            elevation: outerElevation
          }
        ]}
      />
      <View style={[styles.container, { width: size, height: size, borderRadius: resolvedRadius, borderColor }]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.rim, { borderRadius: rimRadius, borderColor: rimColor }]} />
        <View
          style={[
            styles.iconWrap,
            {
              shadowRadius: iconShadowRadius,
              elevation: iconElevation
            }
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  outerGlow: {
    position: 'absolute',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3
  },
  container: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: 'rgba(96,165,250,1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6
  }
});
