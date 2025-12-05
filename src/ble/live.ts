// src/ble/live.ts
import { Buffer } from "buffer";
import type { Device, Subscription } from "react-native-ble-plx";
import { useLiveReadingsStore } from "../state/liveReadingsStore";
import type { Reading } from "../types";
import { auth, db } from "../utils/firebaseConfig";
import { bleManager } from "./BLE";

if (!(global as any).Buffer) {
  (global as any).Buffer = Buffer;
}

// UUIDs
const SPMS_SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const TEMP_CHAR_UUID    = "12345678-1234-5678-1234-56789abcdef2";
const RH_CHAR_UUID      = "12345678-1234-5678-1234-56789abcdef3";
const LUX_CHAR_UUID     = "12345678-1234-5678-1234-56789abcdef4";
const MOIST_CHAR_UUID   = "12345678-1234-5678-1234-56789abcdef5";

// Track active streams
type StreamState = {
  device: Device;
  subs: Subscription[];
};

const activeStreams: Record<string, StreamState> = {};

// 🔥 FIX: Global reference so callbacks always use the newest plant
let currentPlantIdRef = { id: "" };

function mergeReading(plantId: string, partial: Partial<Reading>): Reading & { ts: number } {
  const store = useLiveReadingsStore.getState();
  const prev  = store.readingsByPlantId[plantId];

  return {
    tempC:        partial.tempC        ?? prev?.tempC        ?? NaN,
    humidity:     partial.humidity     ?? prev?.humidity     ?? NaN,
    light:        partial.light        ?? prev?.light        ?? NaN,
    soilMoisture: partial.soilMoisture ?? prev?.soilMoisture ?? NaN,
    ts: Date.now(),
  };
}

async function saveLastToFirestore(plantId: string, reading: any) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  try {
    await db
      .collection("users")
      .doc(uid)
      .collection("plants")
      .doc(plantId)
      .update({ last: reading });
  } catch (err) {
    console.log("[BLE] Failed to update Firestore last reading:", err);
  }
}

export async function startLiveStreamingForPlant(plantId: string, deviceId: string) {
  console.log("[BLE] startLiveStreamingForPlant:", { plantId, deviceId });

  stopAllLiveStreams();

  // 🔥 Important: point global ref to newly selected plantId
  currentPlantIdRef.id = plantId;

  useLiveReadingsStore.getState().clearOtherReadings(plantId);

  // Connect
  const device = await bleManager.connectToDevice(deviceId, {
    autoConnect: true,
  });

  await device.discoverAllServicesAndCharacteristics();

  const subs: Subscription[] = [];
  const store = useLiveReadingsStore.getState();
  const thisStreamId = deviceId;

  // 🔥 CALL ALWAYS USES MOST RECENT plantIdRef.id
  const handlePartial = async (partial: Partial<Reading>) => {
    const activePlantId = currentPlantIdRef.id;

    const curr = activeStreams[activePlantId];
    if (!curr || curr.device.id !== thisStreamId) return;

    const merged = mergeReading(activePlantId, partial);
    store.setReading(activePlantId, merged);
    await saveLastToFirestore(activePlantId, merged);
  };

  // Temperature notifications
  subs.push(
    device.monitorCharacteristicForService(
      SPMS_SERVICE_UUID,
      TEMP_CHAR_UUID,
      (error, char) => {
        if (error || !char?.value) return;
        const raw = Buffer.from(char.value, "base64");
        if (raw.length >= 2) {
          handlePartial({ tempC: raw.readInt16LE(0) / 100 });
        }
      }
    )
  );

  // Humidity notifications
  subs.push(
    device.monitorCharacteristicForService(
      SPMS_SERVICE_UUID,
      RH_CHAR_UUID,
      (error, char) => {
        if (error || !char?.value) return;
        const raw = Buffer.from(char.value, "base64");
        if (raw.length >= 2) {
          handlePartial({ humidity: raw.readUInt16LE(0) / 100 });
        }
      }
    )
  );

  // Lux notifications
  subs.push(
    device.monitorCharacteristicForService(
      SPMS_SERVICE_UUID,
      LUX_CHAR_UUID,
      (error, char) => {
        if (error || !char?.value) return;
        const raw = Buffer.from(char.value, "base64");
        if (raw.length >= 4) {
          handlePartial({ light: raw.readInt32LE(0) });
        }
      }
    )
  );

  // Moisture notifications
  subs.push(
    device.monitorCharacteristicForService(
      SPMS_SERVICE_UUID,
      MOIST_CHAR_UUID,
      (error, char) => {
        if (error || !char?.value) return;
        const raw = Buffer.from(char.value, "base64");
        if (raw.length >= 4) {
          handlePartial({ soilMoisture: raw.readInt32LE(0) });
        }
      }
    )
  );

  activeStreams[plantId] = { device, subs };
}

export function stopLiveStreamingForPlant(plantId: string) {
  const stream = activeStreams[plantId];
  if (!stream) return;

  console.log("[BLE] Stopping stream for plant", plantId);

  stream.subs.forEach((s) => {
    try { s.remove(); } catch {}
  });

  try { stream.device.cancelConnection(); } catch {}

  delete activeStreams[plantId];
}

export function stopAllLiveStreams() {
  Object.keys(activeStreams).forEach(stopLiveStreamingForPlant);
}
