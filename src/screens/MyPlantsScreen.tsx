import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlantStore } from "../state/context";
import { Plant, RootStackParamList } from "../types"; // 👈 Plant type

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

  // 👇 use Plant type and include small image inside the card
  const renderPlant = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PlantDetail", { plantId: item.id })}
      onLongPress={() => handleDelete(item.id)}
    >
      {/* top row: text + small thumbnail */}
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.plantName}>🌱 {item.name}</Text>
          <Text style={styles.location}>
            📍 {item.location || "Unknown location"}
          </Text>
        </View>

        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.thumb}
            resizeMode="cover"
          />
        )}
      </View>

      {/* stats */}
      <View style={styles.statRow}>
        <Text style={styles.statText}>
          💧 {item.last?.moisture ?? "--"}%
        </Text>
        <Text style={styles.statText}>
          🌡 {item.last?.tempC ?? "--"}°C
        </Text>
      </View>
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  plantName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  // small thumbnail
  thumb: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: "#222",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  location: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
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