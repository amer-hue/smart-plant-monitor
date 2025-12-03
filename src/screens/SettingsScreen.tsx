import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FirebaseOptions } from "firebase/app";
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
import { RootStackParamList } from "../types";


import { signOut } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

type NavProp = StackNavigationProp<RootStackParamList, "Settings">;

export default function SettingsScreen() {
  const navigation = useNavigation<NavProp>();
  
  const {
    state: { isFahrenheit },
    dispatch,
  } = usePlantStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const currentUser = auth.currentUser;
  const opts = auth.app.options as FirebaseOptions;
  console.log("AUTH INSTANCE PROJECT ID:", opts.projectId);

  const toggleTempUnit = () => {
    dispatch({ type: "TOGGLE_TEMP_UNIT" });
  };

  const handleAbout = () => {
    Alert.alert(
      "About",
      "Smart Plant Monitor\nVersion 1.0.0\nMonitor your plants with temperature, moisture, and light readings."
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              dispatch({ type: "SET_PLANTS", payload: []});
              console.log("User logged out");
            } catch (error: any) {
              console.log("Logout error:", error.message);
              Alert.alert("Logout Error", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <Text style={styles.profileIcon}>👤</Text>
        <Text style={styles.profileName}>
          {currentUser?.displayName || "User"}
        </Text>
        <Text style={styles.profileEmail}>
          {currentUser?.email || "No email"}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#555", true: "#4CAF50" }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAbout}>
        <Text style={styles.buttonText}>ℹ️  About</Text>
      </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  profileIcon: { fontSize: 42, marginBottom: 10 },
  profileName: { fontSize: 18, fontWeight: "700", color: "#fff" },
  profileEmail: { fontSize: 14, color: "#aaa", marginBottom: 10 },
  editButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
  },
  editButtonText: { color: "#fff", fontWeight: "600" },
  settingRow: {
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  settingLabel: { color: "#fff", fontSize: 16 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  logoutButton: { backgroundColor: "#D32F2F" },
  logoutText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
