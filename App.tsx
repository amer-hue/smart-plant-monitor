import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FirebaseOptions } from "firebase/app";
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PlantProvider } from './src/state/context';

import AddPlantScreen from './src/screens/AddPlantScreen';
import AllPlantsScreen from './src/screens/AllPlantsScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';
import ScanScreen from './src/screens/ScanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

import EditProfileScreen from './src/screens/EditProfileScreen'; // ✅ ADD THIS

import TabNavigator from './src/navigation/TabNavigator';
import { colors } from './src/theme/colors';
import { RootStackParamList } from './src/types';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/utils/firebaseConfig";



const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  console.log("Firebase here?:", auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state succesfully changed:", firebaseUser);
      console.log("AUTH STATE CHANGED. CURRENT USER =", firebaseUser);
      const opts = auth.app.options as FirebaseOptions;
      console.log("AUTH INSTANCE PROJECT ID:", opts.projectId);

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <PlantProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.primary,
            cardStyle: { backgroundColor: colors.background },
            headerShown: false,
          }}
        >
          {user ? (
            <>
              {/* LOGGED IN */}
              <Stack.Screen name="MainTabs" component={TabNavigator} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="AddPlant" component={AddPlantScreen} />
              <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
              <Stack.Screen name="Statistics" component={StatisticsScreen} />
              <Stack.Screen name="Scan" component={ScanScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name = "AllPlants" component={AllPlantsScreen} />
            </>
        ) : (
            <>
              {/* LOGGED OUT */}
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
          </Stack.Navigator>

        </NavigationContainer>
      </PlantProvider>
    </SafeAreaProvider>
  );
};

export default App;
