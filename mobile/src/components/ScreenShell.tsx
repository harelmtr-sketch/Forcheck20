import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { exerciseMenuColors as C } from '../theme/exerciseMenuColors';

type ScreenShellProps = {
  children: ReactNode;
};

export function ScreenShell({ children }: ScreenShellProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={C.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.screen
  }
});
