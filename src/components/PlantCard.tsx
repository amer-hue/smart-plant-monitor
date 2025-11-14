import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { usePlantStore } from '../state/context';
import { colors } from '../theme/colors';
import { Plant, RootStackParamList } from '../types';
import { formatTemperature, getLightLevel } from '../utils/helpers';

type Props = {
  plant: Plant;
};

const PlantCard = ({ plant }: Props) => {
  const {
    state: { isFahrenheit },
  } = usePlantStore();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // 👇 this will show "IMG" or "NO IMG" on each card
  const hasImage = !!plant.imageUri;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
    >
      {/* Top: name/location + small thumbnail */}
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.plantName}>🌱 {plant.name}</Text>
          <Text style={styles.locationText}>
            {plant.location?.trim() || 'Unknown location'}
          </Text>
          <Text style={styles.debugText}>{hasImage ? 'IMG' : 'NO IMG'}</Text>
        </View>

        {hasImage && (
          <Image
            source={{ uri: plant.imageUri! }}
            style={styles.thumb}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Stats */}
      <View style={styles.row}>
        <Text style={styles.label}>💧 Moisture</Text>
        <Text style={styles.value}>
          {plant.last ? `${plant.last.moisture}%` : '--%'}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>🌡 Temperature</Text>
        <Text style={styles.value}>
          {plant.last
            ? formatTemperature(plant.last.tempC, isFahrenheit)
            : '--°C'}
        </Text>
      </View>
      <View style={styles.rowNoBorder}>
        <Text style={styles.label}>☀️ Light</Text>
        <Text style={styles.value}>
          {plant.last ? getLightLevel(plant.last.light) : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    margin: 8,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    color: colors.textFaded,
    fontSize: 13,
    marginTop: 2,
  },
  debugText: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
  rowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: colors.textFaded,
    fontSize: 13,
  },
  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default PlantCard;