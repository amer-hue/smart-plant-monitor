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

import { usePlantStore } from '../state/context';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';
import { formatTemperature, getLightLevel } from '../utils/helpers';

type DetailRouteProp = RouteProp<RootStackParamList, 'PlantDetail'>;
type NavProp = StackNavigationProp<RootStackParamList, 'PlantDetail'>;

const PlantDetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavProp>();

  const {
    state: { plants, isFahrenheit },
    updatePlant,
    dispatch,
    refreshReading, 
  } = usePlantStore();

  const plant = plants.find(p => p.id === route.params.plantId);

  const [localImageUri, setLocalImageUri] = useState<string | undefined>(
    plant?.imageUri,
  );

  // 🔁 Auto-refresh readings every 5 seconds while on this screen
  // 🔁 Auto-refresh readings every 5 seconds while this screen is open
  useEffect(() => {
    const plantId = route.params.plantId;

    const intervalId = setInterval(() => {
      refreshReading(plantId);
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId);
  }, [route.params.plantId, refreshReading]);

  const handleChangePhoto = async () => {
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
      const uri = res.assets[0].uri;
      setLocalImageUri(uri);
      updatePlant({ ...plant, imageUri: uri });
    }
  };

  const handleViewStatistics = () => {
    navigation.navigate('Statistics', { plantId: plant.id });
  };

  const handleDelete = () => {
    Alert.alert('Delete Plant', 'Are you sure you want to delete this plant?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'REMOVE_PLANT', payload: plant.id });
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image + small "Change" button overlay */}
      <View style={styles.imageWrapper}>
        {localImageUri ? (
          <Image
            source={{ uri: localImageUri }}
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
          💧 Moisture: {plant.last ? `${plant.last.moisture}%` : '--%'}
        </Text>
        <Text style={styles.rowText}>
          ☀️ Light:{' '}
          {plant.last ? `${getLightLevel(plant.last.light)} lux` : '-- lux'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewStatistics}>
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