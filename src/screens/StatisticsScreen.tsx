import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
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

export default function StatisticsScreen() {
  const route = useRoute<StatsRouteProp>();
  const navigation = useNavigation<NavProp>();

  // 👇 This line is REQUIRED for the °C/°F toggle to work
  const {
    state: { plants, isFahrenheit },
  } = usePlantStore();

  const plantId = route.params?.plantId;
  const plant = plants.find((p) => p.id === plantId);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plant Not Found</Text>
      </View>
    );
  }

  // Fake data for now — replace later with Firestore
  const history = {
    labels: ["M", "T", "W", "T", "F"],
    temp: [22, 23, 20, 24, 26],
    moisture: [40, 42, 45, 38, 50],
    light: [400, 500, 650, 550, 700],
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Statistics for {plant.name}</Text>

      {/* 🌡 Temperature Chart */}
      <Text style={styles.chartLabel}>
        🌡 Temperature (°{isFahrenheit ? "F" : "C"})
      </Text>

      <LineChart
        data={{
          labels: history.labels,
          datasets: [{ data: history.temp }],
        }}
        width={Dimensions.get("window").width - 40}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
      />

      {/* 💧 Moisture Chart */}
      <Text style={styles.chartLabel}>💧 Moisture (%)</Text>

      <LineChart
        data={{
          labels: history.labels,
          datasets: [{ data: history.moisture }],
        }}
        width={Dimensions.get("window").width - 40}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
      />

      {/* ☀️ Light Chart */}
      <Text style={styles.chartLabel}>☀️ Light (lux)</Text>

      <LineChart
        data={{
          labels: history.labels,
          datasets: [{ data: history.light }],
        }}
        width={Dimensions.get("window").width - 40}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
      />
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
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: "#888",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  chartLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
  },
  chart: {
    borderRadius: 10,
    marginBottom: 25,
  },
});
