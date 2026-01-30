import { createStackNavigator } from '@react-navigation/stack';
import { DailyScreen } from '../screens/DailyScreen';
import { RateFormScreen } from '../screens/RateFormScreen';

export type DailyStackParamList = {
  DailyHome: undefined;
  RateForm: {
    index: number;
    name: string;
    sets: number;
    reps: number;
    score: number | null;
  };
};

const Stack = createStackNavigator<DailyStackParamList>();

export function DailyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DailyHome" component={DailyScreen} />
      <Stack.Screen name="RateForm" component={RateFormScreen} />
    </Stack.Navigator>
  );
}
