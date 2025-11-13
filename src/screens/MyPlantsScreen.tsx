import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlantStore } from "../state/context";
import { RootStackParamList } from "../types";

type NavProp = StackNavigationProp<RootStackParamList, "MyPlants">;

export default function MyPlantsScreen() {
  const navigation = useNavigation<NavProp>();
  const { state, dispatch } = usePlantStore();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Plant",
      "Are you sure you want to delete this plant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch({ type: "REMOVE_PLANT", payload: id }),
        },
      ]
    );
  };

  const renderPlant = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PlantDetail", { plantId: item.id })}
      onLongPress={() => handleDelete(item.id)}
    >
      <Text style={styles.plantName}>🌱 {item.name}</Text>

      <View style={styles.statRow}>
        <Text style={styles.statText}>
          💧 {item.last?.moisture ?? "--"}%
        </Text>
        <Text style={styles.statText}>
          🌡 {item.last?.tempC ?? "--"}°C
        </Text>
      </View>

      <Text style={styles.location}>
        📍 {item.location || "Unknown location"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Plants</Text>

      <FlatList
        data={state.plants}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderPlant}
        ListEmptyComponent={
          <Text style={styles.empty}>No plants yet. Add one!</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddPlant")}
      >
        <Text style={styles.addButtonText}>Add New Plant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 15,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1E1E1E",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  plantName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  location: {
    color: "#aaa",
    fontSize: 12,
  },
  empty: {
    color: "#777",
    marginTop: 30,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
