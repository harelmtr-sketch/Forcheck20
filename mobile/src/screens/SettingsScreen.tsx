import { useEffect, useState } from 'react';
import { View, Text, Switch, TextInput, Pressable, ScrollView } from 'react-native';
import { loadJson, saveJson } from '../utils/storage';

type SettingsState = {
  darkMode: boolean;
  notifications: boolean;
  soundEffects: boolean;
  calorieGoal: string;
  proteinGoal: string;
};

const SETTINGS_KEY = 'kinetic_settings';

export function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: true,
    notifications: true,
    soundEffects: true,
    calorieGoal: '2400',
    proteinGoal: '180'
  });

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await loadJson<SettingsState>(SETTINGS_KEY);
      if (saved) setSettings(saved);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    saveJson(SETTINGS_KEY, settings);
  }, [settings]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f1117' }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20 }}>Settings</Text>

      <View style={{ backgroundColor: '#252932', borderRadius: 18, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#e2e8f0', fontWeight: '600' }}>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => setSettings((prev) => ({ ...prev, darkMode: value }))}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#e2e8f0', fontWeight: '600' }}>Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => setSettings((prev) => ({ ...prev, notifications: value }))}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#e2e8f0', fontWeight: '600' }}>Sound Effects</Text>
          <Switch
            value={settings.soundEffects}
            onValueChange={(value) => setSettings((prev) => ({ ...prev, soundEffects: value }))}
          />
        </View>
      </View>

      <View style={{ backgroundColor: '#252932', borderRadius: 18, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: 12 }}>Goals</Text>
        <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Daily Calories</Text>
        <TextInput
          value={settings.calorieGoal}
          onChangeText={(value) => setSettings((prev) => ({ ...prev, calorieGoal: value }))}
          keyboardType="numeric"
          style={{ backgroundColor: '#1f2937', borderRadius: 12, padding: 12, color: '#fff', marginBottom: 12 }}
        />
        <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Daily Protein (g)</Text>
        <TextInput
          value={settings.proteinGoal}
          onChangeText={(value) => setSettings((prev) => ({ ...prev, proteinGoal: value }))}
          keyboardType="numeric"
          style={{ backgroundColor: '#1f2937', borderRadius: 12, padding: 12, color: '#fff' }}
        />
      </View>

      <Pressable style={{ backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}
