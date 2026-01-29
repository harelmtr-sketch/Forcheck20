import { createStackNavigator } from '@react-navigation/stack';
import { MainTabs } from './MainTabs';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AnalyzeScreen } from '../screens/AnalyzeScreen';

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  Analyze: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Analyze" component={AnalyzeScreen} />
    </Stack.Navigator>
  );
}
