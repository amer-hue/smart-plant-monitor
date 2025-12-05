import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { startLiveStreamingForPlant } from "../ble/live";
import { auth, db } from "../utils/firebaseConfig";

import { bleManager } from "../ble/BLE";
import { requestBluetoothPermissions } from "../ble/permissions";
import EmptyState from "../components/EmptyState";
import { colors } from "../theme/colors";
import { FirestorePlant, RootStackParamList } from "../types";

/* ---------------------------
   DEVICE DICTIONARY TYPE
---------------------------- */
type DeviceState = {
  name: string;
  rssi: number;
  connected: boolean;
  plantId: string | null;
};

const TARGET_NAME_KEYWORDS = ["SPMS"];
const SPMS_SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";

/* ---------------------------
   FETCH USER PLANTS
---------------------------- */
function useUserPlants() {
  const [plants, setPlants] = useState<FirestorePlant[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsub = db
      .collection("users")
      .doc(uid)
      .collection("plants")
      .onSnapshot((snap) => {
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestorePlant[];

        setPlants(list);
      });

    return unsub;
  }, []);

  return plants;
}

/* ---------------------------
   MAIN SCREEN
---------------------------- */
const ScanScreen = () => {
  const plants = useUserPlants();
  const [devices, setDevices] = useState<Record<string, DeviceState>>({});
  const [isScanning, setIsScanning] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  /* ---------------------------
       AUTOSTART SCAN
  ---------------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const granted = await requestBluetoothPermissions();
      if (!granted) {
        Alert.alert(
          "Bluetooth Required",
          "Enable Bluetooth permissions to scan for sensors."
        );
        return;
      }

      if (!cancelled) startScan();
    })();

    return () => {
      cancelled = true;
      try {
        bleManager.stopDeviceScan();
      } catch {}
    };
  }, []);

  
  /* ---------------------------
          START SCAN
  ---------------------------- */
  const startScan = async () => {
    console.log("[Scan] Starting scan…");

    const granted = await requestBluetoothPermissions();
    if (!granted) return;

    setIsScanning(true);

    try {
      bleManager.stopDeviceScan();
    } catch {}

    
    bleManager.startDeviceScan(null, null, (err, device) => {
      if (err) {
        console.log("[Scan] Error:", err);
        setIsScanning(false);
        return;
      }
      if (!device || !device.id) return;

      const name = device.name ?? "";
      const matchesTarget =
        name.length > 0 &&
        TARGET_NAME_KEYWORDS.some((kw) =>
          name.toLowerCase().includes(kw.toLowerCase())
        );

      if (!matchesTarget) return;

      setDevices((prev) => {
        const existing = prev[device.id];
        return {
          ...prev,
          [device.id]: {
            name,
            rssi: device.rssi ?? existing?.rssi ?? 0,
            connected: existing?.connected ?? false,
            plantId: existing?.plantId ?? null,
          },
        };
      });
    });

    setTimeout(() => {
      console.log("[Scan] Auto-stop");
      try {
        bleManager.stopDeviceScan();
      } catch {}
      setIsScanning(false);
    }, 10000);
  };

  /* ---------------------------
      DISCONNECT DEVICE
  ---------------------------- */
  async function disconnectDevice(deviceId: string) {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
    } catch {}

    setDevices((prev) => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        connected: false,
        plantId: null,
      },
    }));
  }

  /* ---------------------------
       TAP DEVICE CARD
  ---------------------------- */
  const handleDevicePress = (device: { id: string } & DeviceState) => {
    if (device.connected) {
      const plantName =
        plants.find((p) => p.id === device.plantId)?.customName ??
        device.plantId ??
        "";

      Alert.alert(
        "Device Connected",
        `${device.name} is linked to ${plantName}.`,
        [
          { text: "Switch Plant", onPress: () => showPlantSelect(device) },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => disconnectDevice(device.id),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    showPlantSelect(device);
  };

  /* ---------------------------
       SELECT A PLANT
  ---------------------------- */
  function showPlantSelect(device: { id: string } & DeviceState) {
    Alert.alert(
      "Pair Device",
      `Link ${device.name} to which plant?`,
      [
        ...plants.map((p) => ({
          text: p.customName,
          onPress: async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            await db
              .collection("users")
              .doc(uid)
              .collection("plants")
              .doc(p.id)
              .update({ deviceId: device.id });

            startLiveStreamingForPlant(p.id, device.id);

            setDevices((prev) => ({
              ...prev,
              [device.id]: {
                ...prev[device.id],
                connected: true,
                plantId: p.id,
              },
            }));

            navigation.goBack();
          },
        })),
        {
          text: "Create New Plant",
          onPress: () => navigation.navigate("MyPlants"),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  /* ---------------------------
       RENDER DEVICE CARD
  ---------------------------- */
  const deviceList = Object.entries(devices).map(([id, dev]) => ({
    id,
    ...dev,
  }));

  const renderDevice = ({ item }: { item: { id: string } & DeviceState }) => {
    const plantName =
      plants.find((p) => p.id === item.plantId)?.customName ?? null;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          item.connected && { borderColor: "#4CAF50", borderWidth: 2 },
        ]}
        onPress={() => handleDevicePress(item)}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="bluetooth" size={22} />
          <Text style={styles.deviceName}>{item.name}</Text>
        </View>

        <Text style={styles.deviceId}>{item.id}</Text>

        {item.connected && plantName && (
          <Text style={{ color: "#4CAF50", marginBottom: 5 }}>
            Connected to: {plantName}
          </Text>
        )}

        <View style={styles.signalRow}>
          <Ionicons name="wifi-outline" size={16} />
          <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------------------------
        UI
  ---------------------------- */
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan for Devices</Text>

      {isScanning && <Text style={styles.scanningText}>Scanning...</Text>}

      {deviceList.length === 0 && !isScanning ? (
        <EmptyState
          message="No sensors detected."
          ctaText="Scan Again"
          onCtaPress={startScan}
        />
      ) : (
        <FlatList
          data={deviceList}
          keyExtractor={(item) => item.id}
          renderItem={renderDevice}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ScanScreen;

/* ---------------------------
        STYLES
---------------------------- */
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
