import { View } from 'react-native';
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
        tabBarStyle: {
          backgroundColor: '#1a1d23',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 70
        },
        tabBarActiveTintColor: '#f8fafc',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarActiveBackgroundColor: 'transparent',
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 6,
          marginVertical: 8,
          paddingVertical: 6
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2
        }
      }}
    >
      <Tab.Screen
        name="Daily"
        component={DailyScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                width: 46,
                height: 34,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(59,130,246,0.25)' : 'transparent'
              }}
            >
              <MaterialCommunityIcons name="chart-bar" size={size ?? 22} color={focused ? '#f8fafc' : '#94a3b8'} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                width: 46,
                height: 34,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(59,130,246,0.25)' : 'transparent'
              }}
            >
              <MaterialCommunityIcons name="account-group-outline" size={size ?? 22} color={focused ? '#f8fafc' : '#94a3b8'} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                width: 46,
                height: 34,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(59,130,246,0.25)' : 'transparent'
              }}
            >
              <MaterialCommunityIcons name="camera-outline" size={size ?? 22} color={focused ? '#f8fafc' : '#94a3b8'} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                width: 46,
                height: 34,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(59,130,246,0.25)' : 'transparent'
              }}
            >
              <MaterialCommunityIcons name="account-outline" size={size ?? 22} color={focused ? '#f8fafc' : '#94a3b8'} />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}
