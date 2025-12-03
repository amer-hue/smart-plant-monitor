import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';
import { formatTemperature, getLightLevel } from '../utils/helpers';

import { auth, db } from "../utils/firebaseConfig";

type DetailRouteProp = RouteProp<RootStackParamList, 'PlantDetail'>;
type NavProp = StackNavigationProp<RootStackParamList, 'PlantDetail'>;

const PlantDetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavProp>();

  const plantId = route.params.plantId;
  const uid = auth.currentUser?.uid;

  const [plant, setPlant] = useState<any>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  useEffect(() =>{
    if (!uid) return;
    const unsubscribe = db 
      .collection("users")
      .doc(uid)
      .onSnapshot((doc) => {
        if(doc.exists && doc.data()?.isFahrenheit !== undefined){
          setIsFahrenheit(doc.data()?.isFahrenheit);
        }
      });
      return () => unsubscribe();
  }, []);

  useEffect(() =>{
    if(!uid) return;

    const unsubscribe = db 
      .collection("users")
      .doc(uid)
      .collection("plants")
      .doc(plantId)
      .onSnapshot((doc) => {
        if(doc.exists){
          setPlant({id: doc.id, ...doc.data()});
        }
      });
      return () => unsubscribe();
  }, [plantId]);

  

  // 🔁 Auto-refresh readings every 5 seconds while on this screen
  // 🔁 Auto-refresh readings every 5 seconds while this screen is open
  

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!res.canceled) {
      const uri = res.assets[0].uri;
      
      await db
        .collection("users")
        .doc(uid)
        .collection("plants")
        .doc(plantId)
        .update({
          imageUri: uri,
        });
        setPlant((prev:any) => ({...prev, imageUri: uri}));
    }
  };


  const handleDelete = () => {
    Alert.alert('Delete Plant', 'Are you sure you want to delete this plant?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await db
            .collection("users")
            .doc(uid)
            .collection("plants")
            .doc(plantId)
            .delete();

          navigation.goBack();
        },
      },
    ]);
  };

  if (plant === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <Text style={{ color: "#fff" }}>Loading plant...</Text>
      </View>
    );
    }

  if (!plant) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <Text style={{ color: "#fff" }}>Plant not found</Text>
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image + small "Change" button overlay */}
      <View style={styles.imageWrapper}>
        {plant.imageUri ? (
          <Image
            source={{ uri: plant.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ fontSize: 28 }}>🌱</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.changePhotoButton}
          onPress={handleChangePhoto}
        >
          <Text style={styles.changePhotoText}>Change</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{plant.name}</Text>

      {/* Stats card */}
      <View style={styles.card}>
        <Text style={styles.rowText}>
          🌡 Temperature:{' '}
          {plant.last
            ? formatTemperature(plant.last.tempC, isFahrenheit)
            : '--°C'}
        </Text>
        <Text style={styles.rowText}>
          Humidity:{' '}
          
        </Text>
        <Text style={styles.rowText}>
          💧 Moisture: {plant.last ? `${plant.last.moisture}%` : '--%'}
        </Text>
        <Text style={styles.rowText}>
          ☀️ Light:{' '}
          {plant.last ? `${getLightLevel(plant.last.light)} lux` : '-- lux'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Statistics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>Delete Plant</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rowText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#b00020',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  back: {
    marginTop: 12,
  },
  backText: {
    color: colors.textFaded,
    fontSize: 16,
  },
  errorText: {
    color: colors.text,
  },
});

export default PlantDetailScreen;