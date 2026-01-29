import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DailyScreen } from '../screens/DailyScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type MainTabParamList = {
  Daily: undefined;
  Friends: undefined;
  Camera: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1d2128', borderTopColor: 'rgba(255,255,255,0.08)' },
        tabBarActiveTintColor: '#f8fafc',
        tabBarInactiveTintColor: '#6b7280'
      }}
    >
      <Tab.Screen name="Daily" component={DailyScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
