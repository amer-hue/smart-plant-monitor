import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlantStore } from "../state/context";
import { RootStackParamList } from "../types";

type DetailRouteProp = RouteProp<RootStackParamList, "PlantDetail">;
type NavProp = StackNavigationProp<RootStackParamList, "PlantDetail">;

export default function PlantDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { state, dispatch } = usePlantStore();

  const plant = state.plants.find((p) => p.id === route.params?.plantId);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plant Not Found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Plant",
      `Delete "${plant.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "REMOVE_PLANT", payload: plant.id });
            navigation.navigate("MyPlants");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plant.name}</Text>

      <View style={styles.card}>
        <Text style={styles.row}>
          🌡 Temperature: {plant.last?.tempC ?? "--"}°C
        </Text>
        <Text style={styles.row}>
          💧 Moisture: {plant.last?.moisture ?? "--"}%
        </Text>
        <Text style={styles.row}>
          ☀️ Light: {plant.last?.light ?? "--"} lux
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Statistics", { plantId: plant.id })
        }
      >
        <Text style={styles.buttonText}>View Statistics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Plant</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
  },
  row: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#8b0000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 25,
    alignItems: "center",
  },
  backText: {
    color: "#888",
    fontSize: 16,
  },
});
