import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { usePlantStore } from '../state/context';
import EmptyState from '../components/EmptyState';
import { BLEClient } from '../ble/client';
import { colors } from '../theme/colors';
import { v4 as uuidv4 } from 'uuid';

const ScanScreen = () => {
  const [devices, setDevices] = useState<{ id: string; name: string; rssi: number }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { state: { plants }, dispatch, pairDevice } = usePlantStore();

  useEffect(() => {
    startScan();
    return () => BLEClient.stopScan();
  }, []);

  const startScan = async () => {
    setDevices([]);
    setIsScanning(true);
    // In a real app, this would use the real BLE library and permissions checks
    try {
      BLEClient.startScan(device => {
        setDevices(prev => {
          if (!prev.some(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      });
      setTimeout(() => {
        setIsScanning(false);
        BLEClient.stopScan();
        if (devices.length === 0) {
          Alert.alert("No devices found", "Check if your sensor is on and try again.");
        }
      }, 5000); // Stop scan after 5 seconds
    } catch (e) {
      console.error('BLE scan failed', e);
      setIsScanning(false);
    }
  };

  const handleDevicePress = (device: { id: string; name: string }) => {
    Alert.alert(
      "Pair with Plant",
      `Choose a plant to associate with ${device.name}.`,
      [
        ...plants.map(plant => ({
          text: plant.name,
          onPress: () => {
            pairDevice(plant.id, device.id);
            navigation.goBack();
          },
        })),
        {
          text: 'Create New Plant',
          onPress: () => {
            const newPlantId = uuidv4();
            dispatch({ type: 'ADD_PLANT', payload: { id: newPlantId, name: `New Plant ${plants.length + 1}` } });
            pairDevice(newPlantId, device.id);
            navigation.goBack();
          }
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderDevice = ({ item }: { item: { id: string; name: string; rssi: number } }) => (
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
          keyExtractor={item => item.id}
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
