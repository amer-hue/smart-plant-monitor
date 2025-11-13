import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PlantProvider } from './src/state/context';

import AddPlantScreen from './src/screens/AddPlantScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';
import ScanScreen from './src/screens/ScanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import StatisticsScreen from './src/screens/StatisticsScreen'; // (if needed)

import TabNavigator from './src/navigation/TabNavigator';
import { colors } from './src/theme/colors';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <PlantProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.primary,
              cardStyle: { backgroundColor: colors.background },
            }}
          >

            {/* 🔐 AUTH SCREENS */}
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />

            {/* 🧭 MAIN TABS */}
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />

           

            <Stack.Screen
              name="AddPlant"
              component={AddPlantScreen}
              options={{ title: 'Add Plant' }}
            />

            <Stack.Screen
              name="PlantDetail"
              component={PlantDetailScreen}
              options={{ title: 'Plant Details' }}
            />

            <Stack.Screen
              name="Statistics"
              component={StatisticsScreen}
              options={{ title: 'Statistics' }}
            />

            {/* 🔧 SETTINGS & SCAN */}
            <Stack.Screen
              name="Scan"
              component={ScanScreen}
              options={{ title: 'Find Sensor' }}
            />

            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </PlantProvider>
    </SafeAreaProvider>
  );
};

export default App;
