import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import BananaImage from '../assets/banana.png';


export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      {/* Welcome message */}
      <Text style={styles.welcome}>Welcome back, Amer Issa</Text>

      {/* Plant image */}
      <Image source={BananaImage} style={styles.plantImage} />

      {/* Plant name */}
      <Text style={styles.plantName}>Large Banana Leaf Potted Plant</Text>

      {/* Stats card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🌡 Temperature</Text>
          <Text style={styles.value}>23°C</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>💧 Moisture</Text>
          <Text style={styles.value}>45%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>💦 Humidity</Text>
          <Text style={styles.value}>60%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>☀️ Light</Text>
          <Text style={styles.value}>1,200 lux</Text>
        </View>
      </View>
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
    marginTop: 40, // ✅ pushes it down a bit
    marginBottom: 10,
  },
  plantImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 15,
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
});
