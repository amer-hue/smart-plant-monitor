// src/screens/StatisticsScreen.tsx
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { usePlantStore } from "../state/context";
import { RootStackParamList } from "../types";

type StatsRouteProp = RouteProp<RootStackParamList, "Statistics">;
type NavProp = StackNavigationProp<RootStackParamList, "Statistics">;

type HistoryPoint = {
  ts: number;
  label: string;
  temp: number;       // displayed (C or F depending on settings)
  humidity: number;   // %
  moisture: number;   // %
  light: number;      // numeric lux (or mapped value)
};

const MAX_POINTS = 24; // 24 points = 2 hours if you sample every 5 minutes
const MAX_X_LABELS = 5; // show ~5 labels only (prevents clustering)

function formatLabel(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Builds a labels array where only every Nth label is shown
function downsampleLabels(labels: string[]) {
  if (labels.length <= MAX_X_LABELS) return labels;

  const step = Math.ceil(labels.length / MAX_X_LABELS);
  return labels.map((l, i) => (i % step === 0 ? l : ""));
}

// Convert "High lux" / "Medium lux" / "Low lux" to numeric value for charting
function normalizeLight(light: any, fallback: number) {
  if (typeof light === "number" && Number.isFinite(light)) return light;

  if (typeof light === "string") {
    const s = light.toLowerCase();
    if (s.includes("high")) return 700;
    if (s.includes("medium")) return 400;
    if (s.includes("low")) return 150;
  }

  return fallback;
}

export default function StatisticsScreen() {
  const route = useRoute<StatsRouteProp>();
  const navigation = useNavigation<NavProp>();

  const {
    state: { plants, isFahrenheit },
  } = usePlantStore();

  const plantId = route.params?.plantId;
  const plant = plants.find((p) => p.id === plantId);

  const [history, setHistory] = useState<HistoryPoint[]>([]);

  const toDisplayTemp = (tempC: number) =>
    isFahrenheit ? tempC * (9 / 5) + 32 : tempC;

  // append real readings when plant.last changes
  useEffect(() => {
    if (!plant || !plant.last) return;

    const last: any = plant.last || {};
    const tempC = last.tempC;
    const humidity = last.humidity;

    // only require temp & humidity for stats to work
    if (tempC === undefined || humidity === undefined) return;

    const prevLast = history.length > 0 ? history[history.length - 1] : null;

    const moisture =
    typeof last.soilMoisture === "number"
      ? last.soilMoisture
      : typeof last.moisture === "number"
      ? last.moisture
      : prevLast
      ? prevLast.moisture
      : 0;  

    const light = normalizeLight(last.light, prevLast ? prevLast.light : 0);

    // use device timestamp if available; otherwise current
    const ts: number = typeof last.ts === "number" ? last.ts : Date.now();

    const point: HistoryPoint = {
      ts,
      label: formatLabel(ts),
      temp: toDisplayTemp(tempC),
      humidity,
      moisture,
      light,
    };

    setHistory((prev) => {
      const lastPoint = prev[prev.length - 1];

      // preventing rerenders
      if (lastPoint && Math.abs(lastPoint.ts - point.ts) < 1500) return prev;

      // p repeated identical values from spamming the graph
      if (lastPoint) {
        const sameValues =
          lastPoint.temp === point.temp &&
          lastPoint.humidity === point.humidity &&
          lastPoint.moisture === point.moisture &&
          lastPoint.light === point.light;

        if (sameValues) return prev;
      }

      return [...prev, point].slice(-MAX_POINTS);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plant?.last, plant?.id, isFahrenheit]);

  const chartData = useMemo(() => {
    if (history.length === 0) return null;

    const rawLabels = history.map((h) => h.label);
    const labels = downsampleLabels(rawLabels);

    return {
      labels,
      temps: history.map((h) => h.temp),
      humidities: history.map((h) => h.humidity),
      moistures: history.map((h) => h.moisture),
      lights: history.map((h) => h.light),
    };
  }, [history]);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plant Not Found</Text>
      </View>
    );
  }

  const unit = isFahrenheit ? "F" : "C";
  const width = Dimensions.get("window").width - 40;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Statistics for {plant.name}</Text>

      {chartData ? (
        <>
          <Text style={styles.chartLabel}>🌡 Temperature (°{unit})</Text>
          <LineChart
            data={{ labels: chartData.labels, datasets: [{ data: chartData.temps }] }}
            width={width}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            withInnerLines={false}
            formatYLabel={(v) => String(Math.round(Number(v)))}
          />

          <Text style={styles.chartLabel}>💨 Humidity (%)</Text>
          <LineChart
            data={{ labels: chartData.labels, datasets: [{ data: chartData.humidities }] }}
            width={width}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            withInnerLines={false}
            formatYLabel={(v) => String(Math.round(Number(v)))}
          />

          <Text style={styles.chartLabel}>💧 Moisture (%)</Text>
          <LineChart
            data={{ labels: chartData.labels, datasets: [{ data: chartData.moistures }] }}
            width={width}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            withInnerLines={false}
            formatYLabel={(v) => String(Math.round(Number(v)))}
          />

          <Text style={styles.chartLabel}>☀️ Light (lux)</Text>
          <LineChart
            data={{ labels: chartData.labels, datasets: [{ data: chartData.lights }] }}
            width={width}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            withInnerLines={false}
            formatYLabel={(v) => String(Math.round(Number(v)))}
          />
        </>
      ) : (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text style={{ color: "#aaa", textAlign: "center" }}>
            No readings yet for this session.
          </Text>
          <Text style={{ color: "#666", textAlign: "center", marginTop: 6 }}>
            Data will appear when readings update.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#1E1E1E",
  backgroundGradientFrom: "#1E1E1E",
  backgroundGradientTo: "#1E1E1E",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: () => "#bbb",
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#4CAF50",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  backButton: { marginBottom: 10 },
  backText: { color: "#888", fontSize: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  chartLabel: { color: "#fff", fontSize: 16, marginBottom: 8, marginTop: 10 },
  chart: { borderRadius: 10, marginBottom: 25 },
});
