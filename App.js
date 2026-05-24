import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';

const Tab = createBottomTabNavigator();

// Deep linking config
const linking = {
  prefixes: [
    Linking.createURL('/'),
    'socialapp://',
  ],

  config: {
    screens: {
      Home: 'home',
      Camera: 'camera',
      Profile: 'profile',
      Map: 'map',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopWidth: 0,
            height: 65,
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            }
            else if (route.name === 'Camera') {
              iconName = 'camera';
            }
            else if (route.name === 'Profile') {
              iconName = 'person';
            }
            else if (route.name === 'Map') {
              iconName = 'map';
            }
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name='Home'
          component={HomeScreen}
        />

        <Tab.Screen
          name='Camera'
          component={CameraScreen}
        />

        <Tab.Screen
          name='Profile'
          component={ProfileScreen}
        />

        <Tab.Screen
          name='Map'
          component={MapScreen}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}