import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PlantProvider } from './src/state/context';
import DashboardScreen from './src/screens/DashboardScreen';
import ScanScreen from './src/screens/ScanScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';
import SignInScreen from './src/screens/SignInScreen';   // ⬅️ add
import SignUpScreen from './src/screens/SignUpScreen';   // ⬅️ add
import { RootStackParamList } from './src/types';
import { colors } from './src/theme/colors';
import TabNavigator from './src/navigation/TabNavigator';
import AddPlantScreen from './src/screens/AddPlantScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <PlantProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SignIn"  // ⬅️ start at SignIn
            screenOptions={{
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.primary,
              cardStyle: { backgroundColor: colors.background },
            }}
          >
            {/* Auth Screens */}
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
            <Stack.Screen
            name="MainTabs"
            component={TabNavigator}   // <- use your bottom tabs
            options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Scan"
              component={ScanScreen}
              options={{ title: 'Find Sensor' }}
            />
            <Stack.Screen
            name="AddPlant"
            component={AddPlantScreen}
            options={{ title: 'Add Plant' }}
            />
            <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="PlantDetail"
              component={PlantDetailScreen}
              options={{ title: 'Plant Details' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PlantProvider>
    </SafeAreaProvider>
  );
};

export default App;
