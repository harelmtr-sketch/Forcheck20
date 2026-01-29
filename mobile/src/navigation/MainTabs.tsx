import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        tabBarStyle: { backgroundColor: '#1d2128', borderTopColor: 'rgba(255,255,255,0.08)', height: 64 },
        tabBarActiveTintColor: '#f8fafc',
        tabBarInactiveTintColor: '#6b7280',
        tabBarActiveBackgroundColor: 'rgba(59,130,246,0.2)',
        tabBarItemStyle: { borderRadius: 16, margin: 6, paddingVertical: 6 }
      }}
    >
      <Tab.Screen
        name="Daily"
        component={DailyScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-bar" size={size ?? 22} color={color} />
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group-outline" size={size ?? 22} color={color} />
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="camera-outline" size={size ?? 22} color={color} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" size={size ?? 22} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}
