import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

import { usePlantStore } from '../state/context';
import { PlantType, RootStackParamList } from '../types';

import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

type NavProp = StackNavigationProp<RootStackParamList, 'AddPlant'>;


export default function AddPlantScreen() {
  const navigation = useNavigation<NavProp>();
  const { addPlant } = usePlantStore();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(); 
  
  const [allPlants, setAllPlantTypes] = useState<PlantType[]>([]);
  const[filteredPlantTypes, setFilteredPlantTypes] = useState<PlantType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadPlantTypes = async() => {
      try{
        const snap = await getDocs(collection(db, "plantTypes"));
        const list: PlantType[] = snap.docs.map(doc => doc.data() as PlantType);
        setAllPlantTypes(list);
      }catch(err){
        console.log("Error while loading plants: ", err);
      }
    };
    loadPlantTypes();
  }, []);

const persistToAppStorage = async (srcUri: string) => srcUri;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!res.canceled) {
      const local = await persistToAppStorage(res.assets[0].uri);
      setImageUri(local);
    }
  };

  // photo w/ user camera
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access.');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!res.canceled) {
      const local = await persistToAppStorage(res.assets[0].uri);
      setImageUri(local);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a plant name.');
      return;
    }

    
    navigation.navigate('MyPlants');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Plant</Text>

      <TouchableOpacity onPress={() => navigation.goBack()} style = {{position: 'absolute', top:50, left:20,}}>
        <Ionicons name = "chevron-back" size={28} color="rgba(205, 204, 204, 1)"/>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Plant Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <View style = {{marginBottom: 15}}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
      <TextInput
        style={styles.input}
        placeholder="Plant Type"
        placeholderTextColor="#888"
        value={type}
        onChangeText={(text) => {
          setType(text);

          if(text.length === 0){
            setShowDropdown(false);
            setFilteredPlantTypes([]);
            return;
          }

          const matches = allPlants.filter((p) => 
          p && p.name && p.name.toLowerCase().includes(text.toLowerCase())
        );

        setFilteredPlantTypes(matches);
        setShowDropdown(matches.length > 0);
        }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("AllPlants")}
        style={{
          marginLeft:10,
          backgroundColor: "#4CAF50",
          paddingVertical: 12,
          paddingHorizontal: 15,
          borderRadius: 10,
        }}
        >
          <Text style = {{color: "#fff", fontWeight: "600"}}>View All</Text>
      </TouchableOpacity>
      </View>
        {showDropdown && (
          <ScrollView style = {styles.dropdown}>
            {filteredPlantTypes.map((p, idx) => (
              <TouchableOpacity
                key = {idx}
                style = {styles.dropdownItem}
                onPress={() => {
                  setType(p.name);
                  setShowDropdown(false);
                }}
                >
                  <Text style = {{color:"white"}}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Location (optional)"
        placeholderTextColor="#888"
        value={location}
        onChangeText={setLocation}
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
      ) : (
        <Text style={styles.noImageText}>No image selected</Text>
      )}


      <View style={styles.row}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleTakePhoto}>
          <Text style={styles.secondaryButtonText}>📷 Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handlePickImage}>
          <Text style={styles.secondaryButtonText}>🖼️ Choose Image</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Plant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  dropdown: {
    maxHeight: 180,
    backgroundColor: "#1E1E1E",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  noImageText: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});