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

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";


type Props = {
  onClose: () => void;
  selectedPlant?: PlantType | null;
};

export default function AddPlantCard({ onClose, selectedPlant }: Props) {
    type NavProp = StackNavigationProp<RootStackParamList, "AddPlant">;

    const navigation = useNavigation<NavProp>();
  const [customName, setCustomName] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [filtered, setFiltered] = useState<PlantType[]>([]);
  const [selectedType, setSelectedType] = useState<PlantType | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [searchText, setSearchText] = useState(""); // 🔍 smart search

  /** 🔥 Load plantTypes from Firestore */
  useEffect(() => {
    const fetchTypes = async () => {
      const snap = await db.collection("plantTypes").get();
      const types = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlantType[];

      setPlantTypes(types);
      setFiltered(types);
      setLoadingTypes(false);
    };

    fetchTypes();
  }, []);

  /** 🔍 Filtering logic */
  useEffect(() => {
    if (!searchText) {
      setFiltered(plantTypes);
      return;
    }
    const text = searchText.toLowerCase();
    const matches = plantTypes.filter((t) =>
      t.name.toLowerCase().includes(text)
    );

    setFiltered(matches);
  }, [searchText, plantTypes]);

  useEffect(() => {
        if (selectedPlant) {
            setSelectedType(selectedPlant);
            setSearchText(selectedPlant.name); // fills text box
        }
        }, [selectedPlant]);

  /** 🌄 Pick image from gallery */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  /** ✔ Save to Firebase */
  const handleSave = async () => {
    if (!selectedType) {
      alert("Please select a plant type.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const finalImage = imageUri ?? selectedType.image;

    await db
      .collection("users")
      .doc(uid)
      .collection("plants")
      .add({
        userId: uid,
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
        
        {/* 🔍 SMART SEARCH INPUT */}
        <Text style={styles.label}>Plant Type</Text>
        <View style = {styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Search plant types..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={(txt) => {
            setSearchText(txt);
            setSelectedType(null); // reset selected type if user resumes typing
          }}
        />

        <TouchableOpacity
            onPress={() => navigation.navigate("AllPlants")}
            style = {styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
        </View>

        {/* 🔽 Filtered results */}
        {loadingTypes ? (
          <ActivityIndicator color="#4CAF50" />
        ) : (
          filtered.length > 0 && searchText.length > 1 && (
            <View style={styles.searchResults}>
            <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator = {true}>
              {filtered.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.resultItem}
                  onPress={() => {
                    setSelectedType(t);
                    setSearchText(t.name); // autofill
                  }}
                >
                  <Image
                    source={{ uri: t.image }}
                    style={styles.resultImg}
                  />
                  <Text style={styles.resultTxt}>{t.name}</Text>
                </TouchableOpacity>
              ))}
              </ScrollView>
            </View>
          )
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
  searchResults: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 180,
    overflow: "hidden",
    padding: 8,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  resultImg: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 10,
  },
  resultTxt: {
    color: "#fff",
    fontSize: 15,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  viewAllBtn: {
    marginLeft: 8,
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  viewAllText: {
    color: "#4CAF50",
    fontWeight: "700",
    fontSize: 13,
  },
});
