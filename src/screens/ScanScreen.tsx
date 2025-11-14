import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BLEClient } from '../ble/client';
import EmptyState from '../components/EmptyState';
import { usePlantStore } from '../state/context';
import { colors } from '../theme/colors';
import { Plant, RootStackParamList } from '../types';

type Device = { id: string; name: string; rssi: number };

const ScanScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    state: { plants },
    dispatch,
    pairDevice,
    refreshReading,   // 👈 pull this from store
  } = usePlantStore();

  useEffect(() => {
    startScan();
    return () => {
      if (BLEClient.stopScan) {
        BLEClient.stopScan();
      }
    };
  }, []);

  const startScan = async () => {
    setDevices([]);
    setIsScanning(true);

    try {
      const list = await BLEClient.startScan();
      setDevices(list);

      if (list.length === 0) {
        Alert.alert(
          'No devices found',
          'Check if your sensor is on and try again.',
        );
      }
    } catch (e) {
      console.error('BLE scan failed', e);
      Alert.alert('Scan error', 'Bluetooth scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleDevicePress = (device: Device) => {
    Alert.alert(
      'Pair with Plant',
      `Choose a plant to associate with ${device.name}.`,
      [
        // existing plants
        ...plants.map((plant: Plant) => ({
          text: plant.name,
          onPress: async () => {
            await pairDevice(plant.id, device.id);
            await refreshReading(plant.id);   // 👈 get a mock reading right away
            navigation.goBack();
          },
        })),

        // create new plant
        {
          text: 'Create New Plant',
          onPress: async () => {
            const newPlantId = Crypto.randomUUID();
            dispatch({
              type: 'ADD_PLANT',
              payload: {
                id: newPlantId,
                name: `New Plant ${plants.length + 1}`,
              } as Plant,
            });
            await pairDevice(newPlantId, device.id);
            await refreshReading(newPlantId); // 👈 and here too
            navigation.goBack();
          },
        },

        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => handleDevicePress(item)}
    >
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
      <Text style={styles.deviceRssi}>{`RSSI: ${item.rssi}`}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan for Devices</Text>

      {isScanning && <Text style={styles.scanningText}>Scanning...</Text>}

      {devices.length === 0 && !isScanning ? (
        <EmptyState
          message="No devices found."
          ctaText="Try Again"
          onCtaPress={startScan}
        />
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id}
          style={styles.deviceList}
        />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    marginTop: 16,
  },
  scanningText: {
    color: colors.textFaded,
    textAlign: 'center',
    marginBottom: 10,
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  deviceName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    color: colors.textFaded,
    fontSize: 12,
  },
  deviceRssi: {
    color: colors.textFaded,
    fontSize: 12,
  },
});

export default ScanScreen;