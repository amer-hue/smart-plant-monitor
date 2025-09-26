import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Plant, RootStackParamList } from '../types';
import { usePlantStore } from '../state/context';
import { getStatusColor, formatTemperature, getLightLevel } from '../utils/helpers';
import { colors } from '../theme/colors';

type Props = {
  plant: Plant;
};

const PlantCard = ({ plant }: Props) => {
  const { state: { isFahrenheit } } = usePlantStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const statusColor = getStatusColor(plant.last);
  const statusEmoji = statusColor === 'green' ? '🟢' : statusColor === 'amber' ? '🟠' : '🔴';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
    >
      <View style={styles.header}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={[styles.statusDot, { color: colors[statusColor] }]}>{statusEmoji}</Text>
      </View>
      <View style={styles.readings}>
        <Text style={styles.label}>Moisture:</Text>
        <Text style={styles.value}>
          {plant.last ? `${plant.last.moisture}%` : 'N/A'}
        </Text>
      </View>
      <View style={styles.readings}>
        <Text style={styles.label}>Temp:</Text>
        <Text style={styles.value}>
          {plant.last ? formatTemperature(plant.last.tempC, isFahrenheit) : 'N/A'}
        </Text>
      </View>
      <View style={styles.readings}>
        <Text style={styles.label}>Light:</Text>
        <Text style={styles.value}>
          {plant.last ? getLightLevel(plant.last.light) : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDot: {
    fontSize: 24,
  },
  readings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: colors.textFaded,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PlantCard;
