import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlantStore } from "../state/context";

export default function SettingsScreen() {
  const {
    state: { isFahrenheit },
    dispatch,
  } = usePlantStore();

  // local state just for notifications toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleTempUnit = () => {
    dispatch({ type: "TOGGLE_TEMP_UNIT" });
  };

  const handleAbout = () => {
    Alert.alert(
      "About",
      "Smart Plant Monitor\nVersion 1.0.0\n\nMonitor your plants with temperature, moisture, and light readings."
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "This is a demo screen – no real account is connected yet.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Temperature unit toggle */}
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>
          Temperature Unit ({isFahrenheit ? "°F" : "°C"})
        </Text>
        <Switch
          value={isFahrenheit}
          onValueChange={toggleTempUnit}
          trackColor={{ false: "#555", true: "#4CAF50" }}
          thumbColor="#fff"
        />
      </View>

      {/* Notifications toggle (local state only for now) */}
      <View className="settingRow" style={styles.settingRow}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#555", true: "#4CAF50" }}
          thumbColor="#fff"
        />
      </View>

      {/* About button */}
      <TouchableOpacity style={styles.button} onPress={handleAbout}>
        <Text style={styles.buttonText}>ℹ️  About</Text>
      </TouchableOpacity>

      {/* Logout button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>📕  Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  settingRow: {
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});