import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePlantStore } from '../state/context';

export default function SettingsScreen() {
  const { state, dispatch } = usePlantStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Temperature Unit Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>
          Temperature Unit ({state.isFahrenheit ? '°F' : '°C'})
        </Text>
        <Switch
          value={state.isFahrenheit}
          onValueChange={() => dispatch({ type: 'TOGGLE_TEMP_UNIT' })}
        />
      </View>

      {/* Notifications Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={() => setNotifications(!notifications)}
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={() => setDarkMode(!darkMode)}
        />
      </View>

      {/* Manage Plants */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Manage Plants', 'Feature coming soon!')}
      >
        <Text style={styles.buttonText}>🌱 Manage Plants</Text>
      </TouchableOpacity>

      {/* About */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          Alert.alert(
            'About Smart Plant',
            'Smart Plant Monitoring System v1.0\nDeveloped by Amer Issa.'
          )
        }
      >
        <Text style={styles.buttonText}>ℹ️ About</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#E53935' }]}
        onPress={() => Alert.alert('Logout', 'You have been logged out.')}
      >
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
