// src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BananaImage from "../assets/banana.png";
import { auth, db } from "../utils/firebaseConfig";
import {
  formatTemperature,
  generateCareReminder,
  getLightLevel,
} from "../utils/helpers";

export default function DashboardScreen() {
  const [userName, setUserName] = useState("User");
  const [plants, setPlants] = useState<any[]>([]);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  // Load user name + temperature preference
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    db.collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data() || {};
          if (data.name) setUserName(data.name);
          if (data.isFahrenheit !== undefined) {
            setIsFahrenheit(data.isFahrenheit);
          }
        }
      });
  }, []);

  // Subscribe to plants list
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsubscribe = db
      .collection("users")
      .doc(uid)
      .collection("plants")
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlants(list);
      });

    return unsubscribe;
  }, []);

  // Dummy notification data (can be replaced by real events later)
  const notifications: Record<string, string> = {
    "testing-two-id": "Moisture dropped from 60% → 55% (5 minutes ago)",
    "plant-two-id": "Low light detected (2 hours ago)",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome back, {userName}</Text>
      <Text style={styles.subtitle}>Recent Activity</Text>

      {plants.length === 0 && (
        <Text style={styles.empty}>No plants added yet 🌱</Text>
      )}

      {plants.map((plant) => {
        const imageSource = plant.imageUri ? { uri: plant.imageUri } : BananaImage;

        const temp = plant.last?.tempC
          ? formatTemperature(plant.last.tempC, isFahrenheit)
          : "--°";

        const moisture =
          plant.last?.moisture !== undefined
            ? `${plant.last.moisture}%`
            : "--%";

        const light =
          plant.last?.light !== undefined
            ? getLightLevel(plant.last.light)
            : "N/A";

        const moistureWarning =
          plant.last?.moisture !== undefined && plant.last.moisture < 30;

        const lightWarning =
          plant.last?.light !== undefined && plant.last.light < 500;

        const note =
          notifications[plant.id] || "No updates yet. Everything looks good!";

        return (
          <View key={plant.id} style={styles.card}>
            <Text style={styles.plantName}>
              🪴 {plant.customName || plant.name}
            </Text>

            <Image source={imageSource} style={styles.image} />

            <View style={styles.statsRow}>
              <Text style={styles.stat}>🌡 {temp}</Text>

              <Text style={styles.stat}>
                💧 {moisture} {moistureWarning ? "⚠️" : ""}
              </Text>

              <Text style={styles.stat}>
                ☀️ {light} {lightWarning ? "⚠️" : ""}
              </Text>
            </View>

            {/* Last Update */}
            <Text style={styles.noteTitle}>Last update:</Text>
            <Text style={styles.note}>{note}</Text>

            {/* CARE REMINDER */}
            <Text style={styles.careTitle}>Care Reminder:</Text>
            <Text style={styles.careText}>
              {generateCareReminder(plant.last)}
            </Text>
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ---------------------
// Styles
// ---------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 18,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 50,
  },
  subtitle: {
    color: "#bbb",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#2C2C2C",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  plantName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#333",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stat: {
    color: "#ddd",
    fontSize: 14,
  },
  noteTitle: {
    color: "#bbb",
    marginBottom: 4,
  },
  note: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  careTitle: {
    color: "#4CAF50",
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "600",
  },
  careText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
});
