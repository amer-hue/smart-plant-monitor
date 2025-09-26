import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { usePlantStore } from '../state/context';
import { colors } from '../theme/colors';
import { formatTemperature, getLightLevel } from '../utils/helpers';
import EmptyState from '../components/EmptyState';
import { BLEClient } from '../ble/client';

type PlantDetailScreenRouteProp = RouteProp<RootStackParamList, 'PlantDetail'>;
type PlantDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlantDetail'>;

const PlantDetailScreen = () => {
  const route = useRoute<PlantDetailScreenRouteProp>();
  const navigation = useNavigation<PlantDetailScreenNavigationProp>();
  const { plantId } = route.params;
  const { state: { plants, isFahrenheit }, refreshReading, unpairDevice } = usePlantStore();
  const plant = plants.find(p => p.id === plantId);

  useEffect(() => {
    // Refresh reading on component load for up-to-date data
    if (plant && plant.deviceId) {
      refreshReading(plant.id);
    }
  }, [plant, refreshReading]);

  if (!plant) {
    return <EmptyState message="Plant not found." />;
  }

  const handleRefresh = async () => {
    if (plant.deviceId) {
      await refreshReading(plant.id);
    } else {
      // In a real app, this would show an error message
      alert('Plant not paired with a device!');
    }
  };

  const handleUnpair = () => {
    unpairDevice(plant.id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{plant.name}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Status</Text>
        <Text style={styles.infoText}>
          {plant.deviceId ? `Paired to: ${plant.deviceId}` : 'Not Paired'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Reading</Text>
        {plant.last ? (
          <>
            <View style={styles.readingItem}>
              <Text style={styles.label}>Moisture:</Text>
              <Text style={styles.value}>{`${plant.last.moisture}%`}</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.label}>Temperature:</Text>
              <Text style={styles.value}>
                {formatTemperature(plant.last.tempC, isFahrenheit)}
              </Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.label}>Light:</Text>
              <Text style={styles.value}>{getLightLevel(plant.last.light)}</Text>
            </View>
            <Text style={styles.timestamp}>
              Last updated: {new Date(plant.last.ts).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.infoText}>No readings available.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={!plant.deviceId}
      >
        <Text style={styles.buttonText}>Refresh Reading</Text>
      </TouchableOpacity>
      {plant.deviceId && (
        <TouchableOpacity style={styles.unpairButton} onPress={handleUnpair}>
          <Text style={styles.buttonText}>Unpair Device</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    marginTop: 16,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    color: colors.textFaded,
    fontSize: 14,
  },
  readingItem: {
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
  timestamp: {
    color: colors.textFaded,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  unpairButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlantDetailScreen;
