import { View, Text } from 'react-native';

export function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1d23', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '600' }}>Settings</Text>
      <Text style={{ color: '#94a3b8', marginTop: 8 }}>Settings toggles will be ported next.</Text>
    </View>
  );
}
