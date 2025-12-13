import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { usePlantStore } from "../state/context";
import { useLiveReadingsStore } from "../state/liveReadingsStore";
import { PlantTypeData } from "../types/index";
import { auth, db } from "../utils/firebaseConfig";
import { formatTemperature, generateCareReminder, getLightLevel } from "../utils/helpers";
import { registerForNotifications } from "../utils/notifications";
import { Level, levelFor, maybeSendAlert, Metric } from "../utils/plantAlerts";

// warning handler for the dashboard plant card
function checkWarning(
  value: number | undefined,
  limits?: number[]
): "low" | "high" | null {
  if (value === undefined || !limits) return null;
  const [min, max] = limits;
  if (value < min) return "low";
  if (value > max) return "high";
  return null;
}

export default function DashboardScreen() {
  const [userName, setUserName] = useState("User");
  const [plants, setPlants] = useState<any[]>([]);
  const [plantTypes, setPlantTypes] = useState<any>({});

  const {
    state: { isFahrenheit },
  } = usePlantStore();

  const liveReadingsByPlantId = useLiveReadingsStore((s) => s.readingsByPlantId);

  const notifications: Record<string, string> = {
    "testing-two-id": "Moisture dropped recently",
    "plant-two-id": "Low light detected",
  };

  const alertStateRef = useRef<
    Record<string, { prevLevel: Level | null; lastNotifiedAt: number | null }>
  >({});

  useEffect(() => {
    registerForNotifications();
  }, []);

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
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection("plantTypes").onSnapshot((snap) => {
      const obj: any = {};
      snap.forEach((doc) => {
        obj[doc.id] = doc.data();
      });
      setPlantTypes(obj);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    //loads users stored plants
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

  const lastRunRef = useRef(0);
  
  //notifications checker and handler
  useEffect(() => {
    const now = Date.now();
    if (now - lastRunRef.current < 5000) return;
    lastRunRef.current = now;
  
    let cancelled = false;
  
    const run = async () => {
      for (const plant of plants) {
        if (cancelled) return;
  
        const live = liveReadingsByPlantId[plant.id] ?? null;
        const source = live ?? plant.last;
        if (!source) continue;
  
        const plantType: PlantTypeData | undefined = plantTypes[plant.plantTypeId];
        const ideals = plantType?.idealMetrics;
        if (!ideals) continue;
  
        const plantName = plant.customName || plant.name || "Plant";
  
        const metrics: Array<{
          metric: Metric;
          value: number | undefined;
          limits?: number[];
        }> = [
          { metric: "temp", value: source?.tempC, limits: ideals?.temperature },
          { metric: "humidity", value: source?.humidity, limits: ideals?.humidity },
          { metric: "moisture", value: source?.soilMoisture, limits: ideals?.soilMoisture },
          { metric: "light", value: source?.light, limits: ideals?.light },
        ];
  
        for (const m of metrics) {
          if (cancelled) return;
          if (m.value === undefined || m.value === null) continue;
          if (!m.limits || m.limits.length < 2) continue;
  
          const valueNum = Number(m.value);
          if (!Number.isFinite(valueNum)) continue;
  
          if ((m.metric === "temp" || m.metric === "humidity" || m.metric === "light") && valueNum === 0) {
            continue;
          }
  
          const [min, max] = m.limits;
          const level = levelFor(valueNum, min, max);
  
          const key = `${plant.id}:${m.metric}`;
          const prev = alertStateRef.current[key]?.prevLevel ?? null;
          const lastNotifiedAt = alertStateRef.current[key]?.lastNotifiedAt ?? null;
  
          const res = await maybeSendAlert({
            plantId: plant.id,
            plantName,
            metric: m.metric,
            value: valueNum,
            level,
            prevLevel: prev,
            lastNotifiedAt,
            cooldownMs: 5 * 60 * 1000,
          });
  
          alertStateRef.current[key] = {
            prevLevel: level,
            lastNotifiedAt: res.notified ? Date.now() : lastNotifiedAt,
          };
        }
      }
    };
  
    run();
  
    return () => {
      cancelled = true;
    };
  }, [plants, plantTypes, liveReadingsByPlantId]);  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome back, {userName}</Text>
      <Text style={styles.subtitle}>Recent Activity</Text>

      {plants.length === 0 && <Text style={styles.empty}>No plants added yet 🌱</Text>}

      {plants.map((plant) => {
        const live = liveReadingsByPlantId[plant.id] ?? null;
        const source = live ?? plant.last;

        const plantType: PlantTypeData | undefined = plantTypes[plant.plantTypeId];
        const ideals = plantType?.idealMetrics;

        const temp =
          source?.tempC !== undefined
            ? formatTemperature(Number(source.tempC), isFahrenheit)
            : `--°${isFahrenheit ? "F" : "C"}`;

        const soilMoisture =
          source?.soilMoisture !== undefined ? `${Number(source.soilMoisture)}%` : "--%";

        const humidity =
          source?.humidity !== undefined ? `${Number(source.humidity)}%` : "--%";

        const light =
          source?.light !== undefined ? `${getLightLevel(source.light)} lux` : "-- lux";

        const moistureWarning = checkWarning(source?.soilMoisture, ideals?.soilMoisture);
        const humidityWarning = checkWarning(source?.humidity, ideals?.humidity);
        const lightWarning = checkWarning(source?.light, ideals?.light);

        const note = notifications[plant.id] || "No updates yet. Everything looks good!";

        return (
          <View style={styles.card} key={plant.id}>
            <Text style={styles.plantName}>🪴 {plant.customName || plant.name}</Text>

            <Image source={{ uri: plant.imageUri }} style={styles.image} />

            <View style={styles.statsRow}>
              <Text style={styles.stat}>🌡 {temp}</Text>
              <Text style={styles.stat}>
                💧 {soilMoisture} {moistureWarning ? "⚠️" : ""}
              </Text>
              <Text style={styles.stat}>
                💨 {humidity} {humidityWarning ? "⚠️" : ""}
              </Text>
              <Text style={styles.stat}>
                ☀️ {light} {lightWarning ? "⚠️" : ""}
              </Text>
            </View>

            <Text style={styles.noteTitle}>Last update:</Text>
            <Text style={styles.note}>{note}</Text>

            <Text style={styles.careTitle}>Care Reminder:</Text>
            <Text style={styles.careText}>{generateCareReminder(plant.last)}</Text>
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

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
