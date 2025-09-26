import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { usePlantStore } from '../state/context';

type StatisticsRouteProp = RouteProp<RootStackParamList, 'Statistics'>;

export default function StatisticsScreen() {
  const { state } = usePlantStore();
  const route = useRoute<StatisticsRouteProp>();
  const { plantId } = route.params;

  const plant = state.plants.find(p => p.id === plantId);

  // Dummy readings for now — later we’ll pull real ones
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [23, 25, 22, 24, 26],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      },
      {
        data: [40, 45, 50, 48, 52],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      },
    ],
    legend: ['Temperature °C', 'Moisture %'],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      {plant ? (
        <>
          <Text style={styles.subtitle}>{plant.name}</Text>
          <LineChart
            data={data}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: '#1E1E1E',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: () => '#aaa',
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#4CAF50',
              },
            }}
            bezier
            style={styles.chart}
          />
        </>
      ) : (
        <Text style={styles.empty}>Plant not found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 15 },
  chart: { borderRadius: 12, marginVertical: 10 },
  empty: { color: '#bbb', fontSize: 16, textAlign: 'center', marginTop: 30 },
});
