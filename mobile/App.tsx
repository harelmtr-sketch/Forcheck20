import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/screens/SplashScreen';
import { RootNavigator } from './src/navigation/RootNavigator';

if (Platform.OS === 'web') {
  require('./global.css');
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    console.log('APP STARTED');
    const timer = setTimeout(() => setShowSplash(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  let content = null;

  try {
    content = showSplash ? (
      <SplashScreen onComplete={() => setShowSplash(false)} />
    ) : (
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    );
  } catch (error) {
    console.error('APP RENDER ERROR', error);
    content = (
      <View style={{ flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#f8fafc', fontSize: 16 }}>Booting...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {content}
    </>
  );
}
