import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { bleManager } from '../ble/BLE';
import { requestBluetoothPermissions } from '../ble/permissions';
import EmptyState from '../components/EmptyState';
import { usePlantStore } from '../state/context';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';

type Device = { id: string; name: string; rssi: number };

// 👇 change this if your board name ever changes
const TARGET_NAME_KEYWORDS = ['SPMS']; // e.g. ['SPMS', 'Plant']

const ScanScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    state: { plants },
    dispatch,
    pairDevice,
    refreshReading,
  } = usePlantStore();

  // Start scanning as soon as screen opens
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const granted = await requestBluetoothPermissions();

      if (!granted) {
        Alert.alert(
          'Bluetooth Required',
          'Bluetooth permission is required to scan for plant sensors. Please enable it in Settings > Privacy & Security > Bluetooth.'
        );
        return;
      }

      if (!cancelled) {
        await startScan();
      }
    })();

    return () => {
      cancelled = true;
      try {
        bleManager.stopDeviceScan();
      } catch {
        // ignore
      }
    };
  }, []);

  const startScan = async () => {
    console.log('[Scan] Starting scan…');

    const granted = await requestBluetoothPermissions();
    if (!granted) {
      Alert.alert(
        'Bluetooth Required',
        'Bluetooth permission is required to scan for plant sensors. Please enable it in Settings > Privacy & Security > Bluetooth.'
      );
      return;
    }

    setDevices([]);
    setIsScanning(true);

    // Stop any previous scan
    try {
      bleManager.stopDeviceScan();
    } catch {
      // ignore
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('[Scan] Scan error:', error);
        Alert.alert('Error', 'Bluetooth scan failed.');
        setIsScanning(false);
        try {
          bleManager.stopDeviceScan();
        } catch {
          // ignore
        }
        return;
      }

      if (!device || !device.id) return;

      const name = device.name ?? '';

      // 🔍 Filter: only keep devices whose name matches our board
      const matchesTarget =
        name.length > 0 &&
        TARGET_NAME_KEYWORDS.some((kw) => name.toLowerCase().includes(kw.toLowerCase()));

      if (!matchesTarget) {
        // Ignore random "Unknown Device" things
        return;
      }

      setDevices((prev) => {
        const rssi = device.rssi ?? 0;

        const existingIndex = prev.findIndex((d) => d.id === device.id);
        const updatedDevice: Device = { id: device.id, name, rssi };

        if (existingIndex === -1) {
          return [...prev, updatedDevice];
        }

        const copy = [...prev];
        copy[existingIndex] = updatedDevice;
        return copy;
      });
    });

    // Auto-stop scan after 10 seconds
    setTimeout(() => {
      console.log('[Scan] Auto-stopping scan');
      try {
        bleManager.stopDeviceScan();
      } catch {
        // ignore
      }
      setIsScanning(false);
    }, 10000);
  };

  const handleDevicePress = (device: Device) => {
    console.log('[Scan] Device tapped:', device);

    try {
      bleManager.stopDeviceScan();
    } catch {
      // ignore
    }
    setIsScanning(false);

    Alert.alert(
      'Pair Device',
      `Which plant do you want to link to ${device.name}?`,
      [
        ...plants.map((p) => ({
          text: p.name,
          onPress: async () => {
            console.log('[Scan] Pairing existing plant', p.id, 'to', device.id);
            await pairDevice(p.id, device.id);
            await refreshReading(p.id);
            navigation.goBack();
          },
        })),
        {
          text: 'Create New Plant',
          onPress: async () => {
            const newPlantId = Crypto.randomUUID();
            console.log(
              '[Scan] Creating new plant',
              newPlantId,
              'for device',
              device.id
            );
            dispatch({
              type: 'ADD_PLANT',
              payload: { id: newPlantId, name: `New Plant ${plants.length + 1}` },
            });
            await pairDevice(newPlantId, device.id);
            await refreshReading(newPlantId);
            navigation.goBack();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleDevicePress(item)}>
      <View style={styles.cardHeader}>
        <Ionicons name="bluetooth" size={22} />
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      </View>

      <Text style={styles.deviceId}>{item.id}</Text>

      <View style={styles.signalRow}>
        <Ionicons name="wifi-outline" size={16} />
        <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan for Devices</Text>

      {isScanning && <Text style={styles.scanningText}>Scanning...</Text>}

      {devices.length === 0 && !isScanning ? (
        <EmptyState
          message="No plant sensors found nearby."
          ctaText="Scan Again"
          onCtaPress={startScan}
        />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderDevice}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ScanScreen;

// -------------------------------
// STYLES
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  scanningText: {
    color: colors.textFaded,
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderColor: '#333',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  deviceId: {
    color: colors.textFaded,
    fontSize: 13,
    marginBottom: 8,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceRssi: {
    color: colors.textFaded,
    fontSize: 13,
    marginLeft: 6,
  },
});
