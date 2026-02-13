import { useCallback, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DailyStack } from './DailyStack';
import { FriendsScreen } from '../screens/FriendsScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { loadSelectedExercise, type SelectedExercise } from '../utils/cameraSelection';

export type MainTabParamList = {
  Daily: undefined;
  Friends: undefined;
  Camera: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const [selectedExercise, setSelectedExercise] = useState<SelectedExercise | null>(null);

  const refreshSelection = useCallback(async () => {
    const selected = await loadSelectedExercise();
    setSelectedExercise(selected);
  }, []);

  useEffect(() => {
    refreshSelection();
  }, [refreshSelection]);

  useFocusEffect(
    useCallback(() => {
      refreshSelection();
    }, [refreshSelection])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1d23',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6
        },
        tabBarActiveTintColor: '#f8fafc',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarActiveBackgroundColor: 'rgba(59,130,246,0.25)',
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 6,
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
        component={DailyStack}
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
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="camera-outline" size={size ?? 22} color={color} />,
          tabBarButton: ({ onPress, children, accessibilityState }) => (
            <Pressable
              onPress={() => {
                if (!selectedExercise) {
                  Alert.alert('Select Exercise', 'Go to Daily and choose an exercise first.');
                  return;
                }
                onPress?.({} as never);
              }}
              accessibilityState={accessibilityState}
              style={{ flex: 1 }}
            >
              {children}
            </Pressable>
          )
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
