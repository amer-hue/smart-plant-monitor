import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import BananaImage from '../assets/banana.png';
import { usePlantStore } from '../state/context';
import { formatTemperature, getLightLevel } from '../utils/helpers';

export default function DashboardScreen() {
  const {
    state: { plants, isFahrenheit },
  } = usePlantStore();

  // Pick a "primary" plant — last added. Change selection logic if you prefer.
  const plant = plants.length > 0 ? plants[plants.length - 1] : undefined;

  const photoSource =
    plant?.imageUri ? { uri: plant.imageUri } : BananaImage;

  const plantName = plant?.name ?? 'No plants yet';
  const tempText = plant?.last
    ? formatTemperature(plant.last.tempC, isFahrenheit)
    : '--°C';
  const moistureText = plant?.last ? `${plant.last.moisture}%` : '--%';
  const lightText = plant?.last ? `${getLightLevel(plant.last.light)} lux` : 'N/A';

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back, Amer Issa</Text>

      <Image source={photoSource} style={styles.plantImage} />

      <Text style={styles.plantName}>{plantName}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🌡 Temperature</Text>
          <Text style={styles.value}>{tempText}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>💧 Moisture</Text>
          <Text style={styles.value}>{moistureText}</Text>
        </View>
        {/* You don't have humidity in your Reading type; show placeholder */}
        <View style={styles.row}>
          <Text style={styles.label}>💦 Humidity</Text>
          <Text style={styles.value}>--%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>☀️ Light</Text>
          <Text style={styles.value}>{lightText}</Text>
        </View>
      </View>

      {plants.length === 0 && (
        <Text style={styles.hint}>
          Add a plant to see live stats here.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#fff',
    marginTop: 40,
    marginBottom: 10,
  },
  plantImage: {
    width: 180,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 14,
    marginBottom: 15,
    backgroundColor: '#222',
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
  label: {
    color: '#bbb',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    color: '#9aa0a6',
    marginTop: 12,
  },
});