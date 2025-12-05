// src/screens/MyPlantsScreen.tsx
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddPlantCard from "../components/AddPlantCard";
import { usePlantStore } from "../state/context";
import { PlantType, RootStackParamList } from "../types";
import { auth, db } from "../utils/firebaseConfig";

type Props = StackScreenProps<RootStackParamList, "MyPlants">;

export default function MyPlantsScreen({ route, navigation }: Props) {
  const returnedPlant = (route.params as any)?.selectedPlant ?? null;
  const { state, dispatch } = usePlantStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Subscribe to this user's plants in Firestore and store them in context
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsubscribe = db
      .collection("users")
      .doc(uid)
      .collection("plants")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const plants = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PlantType[];

        dispatch({ type: "SET_PLANTS", payload: plants });
      });

    return unsubscribe;
  }, [dispatch]);

  // If we navigated here with a selectedPlant (from AddPlant flow), open the card
  useEffect(() => {
    if (route.params?.selectedPlant) {
      setIsExpanded(true);
    }
  }, [route.params]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Plant", "Are you sure you want to delete this plant?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          db
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("plants")
            .doc(id)
            .delete(),
      },
    ]);
  };

  const renderPlant = ({ item }: { item: any }) => {
    const last = (item as any).last; // last reading, if your backend writes it
    const moisture = last?.moisture ?? "--";
    const tempC = last?.tempC ?? "--";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("PlantDetail", { plantId: item.id })}
        onLongPress={() => handleDelete(item.id)}
      >
        {/* top row: text + small thumbnail */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>🌱 {item.customName}</Text>
            <Text style={styles.location}>
              📍 {(item as any).location || "Unknown location"}
            </Text>
          </View>

          {(item as any).imageUri && (
            <Image
              source={{ uri: (item as any).imageUri }}
              style={styles.thumb}
              resizeMode="cover"
            />
          )}
        </View>

        {/* stats */}
        <View style={styles.statRow}>
          <Text style={styles.statText}>💧 {moisture}%</Text>
          <Text style={styles.statText}>🌡 {tempC}°C</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {isExpanded && (
        <AddPlantCard
          onClose={() => setIsExpanded(false)}
          selectedPlant={returnedPlant}
        />
      )}

      {!isExpanded && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={styles.addButtonText}>Add New Plant</Text>
        </TouchableOpacity>
      )}
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
