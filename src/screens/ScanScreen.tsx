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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BLEClient } from '../ble/client';
import EmptyState from '../components/EmptyState';
import { usePlantStore } from '../state/context';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';

type Device = { id: string; name: string; rssi: number };

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

  useEffect(() => {
    startScan();
    return () => BLEClient.stopScan && BLEClient.stopScan();
  }, []);

  const startScan = async () => {
    setDevices([]);
    setIsScanning(true);

    try {
      const list = await BLEClient.startScan();
      setDevices(list);

      if (list.length === 0)
        Alert.alert("No devices found", "Make sure your sensor is powered on.");
    } catch (e) {
      Alert.alert("Error", "Bluetooth scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDevicePress = (device: Device) => {
    Alert.alert(
      "Pair Device",
      `Which plant do you want to link to ${device.name}?`,
      [
        ...plants.map((p) => ({
          text: p.name,
          onPress: async () => {
            await pairDevice(p.id, device.id);
            await refreshReading(p.id);
            navigation.goBack();
          },
        })),
        {
          text: "Create New Plant",
          onPress: async () => {
            const newPlantId = Crypto.randomUUID();
            dispatch({
              type: "ADD_PLANT",
              payload: { id: newPlantId, name: `New Plant ${plants.length + 1}` },
            });
            await pairDevice(newPlantId, device.id);
            await refreshReading(newPlantId);
            navigation.goBack();
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleDevicePress(item)}>
      <View style={styles.cardHeader}>
        <Ionicons name="bluetooth" size={22} color="#4CAF50" />
        <Text style={styles.deviceName}>
          {item.name || "Unknown Device"}
        </Text>
      </View>

      <Text style={styles.deviceId}>{item.id}</Text>

      <View style={styles.signalRow}>
        <Ionicons name="wifi-outline" size={16} color="#bbb" />
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
          message="No devices found nearby."
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
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  scanningText: {
    color: colors.textFaded,
    textAlign: "center",
    marginBottom: 20,
  },

  // CARD
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderColor: "#333",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  deviceName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
  },
  deviceId: {
    color: colors.textFaded,
    fontSize: 13,
    marginBottom: 8,
  },
  signalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceRssi: {
    color: colors.textFaded,
    fontSize: 13,
    marginLeft: 6,
  },
});
