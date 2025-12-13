import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PlantType } from "../types";
import { auth, db } from "../utils/firebaseConfig";

type Props = {
  onClose: () => void;
};

export default function AddPlantCard({ onClose }: Props) {
  const [customName, setCustomName] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [selectedType, setSelectedType] = useState<PlantType | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);

  /** loading plantTypes*/
  useEffect(() => {
    const fetchTypes = async () => {
      const snap = await db.collection("plantTypes").get();
      const types = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlantType[];

      setPlantTypes(types);
      setLoadingTypes(false);
    };

    fetchTypes();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!selectedType) {
      alert("Please select a plant type.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const finalImage = imageUri ?? selectedType.image; // fallback to default type image

    await db
      .collection("users")
      .doc(uid)
      .collection("plants")
      .add({
        customName: customName.trim(),
        plantTypeId: selectedType.id,
        location: location.trim(),
        imageUri: finalImage,
        createdAt: Date.now(),
        last: null,
      });

    alert("Plant added!");
    onClose();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onClose} style={styles.collapseBtn}>
        <Text style={{ fontSize: 22, color: "#999" }}>▼</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.label}>Plant Type</Text>
        {loadingTypes ? (
          <ActivityIndicator color="#4CAF50" />
        ) : (
          <View style={styles.dropdownBox}>
            {plantTypes.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.typeOption,
                  selectedType?.id === t.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedType(t)}
              >
                <Text
                  style={{
                    color: selectedType?.id === t.id ? "#fff" : "#ccc",
                    fontWeight: "600",
                  }}
                >
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Custom Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. My Big Monstera"
          placeholderTextColor="#666"
          value={customName}
          onChangeText={setCustomName}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Living Room, Bedroom..."
          placeholderTextColor="#666"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {imageUri ? "Change Image" : "Upload Image"}
          </Text>
        </TouchableOpacity>

        {(imageUri || selectedType?.image) && (
          <Image
            source={{ uri: imageUri ?? selectedType?.image }}
            style={styles.preview}
          />
        )}

        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
            Add Plant
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ------------------------------- Styles ------------------------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 4,
  },
  collapseBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  label: {
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    color: "#fff",
  },
  dropdownBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  typeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: "#4CAF50",
  },
  uploadBtn: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginTop: 12,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
});
