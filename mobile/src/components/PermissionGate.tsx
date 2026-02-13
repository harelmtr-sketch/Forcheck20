import { useEffect, useState, type ReactNode } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

type PermissionGateProps = {
  onClose: () => void;
  children: ReactNode;
};

export function PermissionGate({ onClose, children }: PermissionGateProps) {
  const [loading, setLoading] = useState(true);
  const [granted, setGranted] = useState(false);

  const check = async () => {
    setLoading(true);
    const cam = await Camera.getCameraPermissionsAsync();
    const mic = await Audio.getPermissionsAsync();
    setGranted(cam.granted && mic.granted);
    setLoading(false);
  };

  useEffect(() => {
    check();
  }, []);

  const requestAll = async () => {
    setLoading(true);
    const cam = await Camera.requestCameraPermissionsAsync();
    const mic = await Audio.requestPermissionsAsync();
    setGranted(cam.granted && mic.granted);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117' }}>
        <ActivityIndicator color="#60a5fa" />
      </View>
    );
  }

  if (!granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1117', paddingHorizontal: 24 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Camera and microphone access needed</Text>
        <Text style={{ color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
          Enable permissions to record and analyze your workout.
        </Text>
        <Pressable onPress={requestAll} style={{ marginTop: 16, backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Enable Camera</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openSettings()} style={{ marginTop: 10 }}>
          <Text style={{ color: '#60a5fa' }}>Open Settings</Text>
        </Pressable>
        <Pressable onPress={onClose} style={{ marginTop: 16 }}>
          <Text style={{ color: '#9ca3af' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
}
