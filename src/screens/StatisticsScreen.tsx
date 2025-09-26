import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type StatisticsRouteProp = RouteProp<RootStackParamList, 'Statistics'>;

export default function StatisticsScreen() {
  const route = useRoute<StatisticsRouteProp>();
    const plant = route.params?.plant;
    
    if (!plant) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>No plant selected</Text>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics for {plant.name}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🌡 Temp:</Text>
          <Text style={styles.value}>
            {plant.last?.tempC ?? '--'}°C
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>💧 Moisture:</Text>
          <Text style={styles.value}>
            {plant.last?.moisture ?? '--'}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>💦 Humidity:</Text>
          <Text style={styles.value}>
            {plant.last?.humidity ?? '--'}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>☀️ Light:</Text>
          <Text style={styles.value}>
            {plant.last?.light ?? '--'} lux
          </Text>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center', // ✅ center content horizontally
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // ✅ spreads label and value apart
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  label: {
    fontSize: 16,
    color: '#bbb',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
