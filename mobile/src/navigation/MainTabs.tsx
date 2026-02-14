import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowWrapper } from '../components/GlowWrapper';
import { DailyStack } from './DailyStack';
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

function CameraTabScreen() {
  return <CameraScreen />;
}

const renderIcon = (focused: boolean, name: keyof typeof MaterialCommunityIcons.glyphMap) => (
  <GlowWrapper active={focused}>
    <MaterialCommunityIcons name={name} size={22} color={focused ? '#ffffff' : '#6b7280'} />
  </GlowWrapper>
);

export function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Camera"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1d23',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 70 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8
        },
        tabBarActiveTintColor: '#f8fafc',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarActiveBackgroundColor: 'transparent',
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 4,
          paddingVertical: 4
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
        component={DailyStack}
        options={{
          tabBarIcon: ({ focused }) => renderIcon(focused, 'chart-bar')
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused }) => renderIcon(focused, 'account-group-outline')
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraTabScreen}
        options={{
          tabBarIcon: ({ focused }) => renderIcon(focused, 'camera-outline')
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderIcon(focused, 'account-outline')
        }}
      />
    </Tab.Navigator>
  );
}
