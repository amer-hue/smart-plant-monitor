// src/ble/scan.ts
import { bleManager } from "./BLE";
import { requestBluetoothPermissions } from "./permissions";
import { Device, State } from "react-native-ble-plx";

const SERVICE_UUID = "1234567A-1234-5678-1234-56789ABCDEF0";

export async function scanForDevices(
  onFound: (device: Device) => void,
  onError?: (error: Error) => void
) {
  console.log("🔍 Starting scan for devices with service:", SERVICE_UUID);

  const ok = await requestBluetoothPermissions();
  if (!ok) {
    const err = new Error("Bluetooth permissions not granted");
    console.log("[BLE] Permission denied");
    onError?.(err);
    return;
  }

  // Ensure Bluetooth is powered on (especially on Android)
  const state = await bleManager.state();
  console.log("[BLE] Manager state:", state);

  if (state !== State.PoweredOn) {
    console.log("[BLE] Bluetooth not powered on; listening for state change...");
    const sub = bleManager.onStateChange((newState) => {
      if (newState === State.PoweredOn) {
        sub.remove();
        startScanInternal(onFound, onError);
      }
    }, true);
  } else {
    startScanInternal(onFound, onError);
  }
}

function startScanInternal(
  onFound: (device: Device) => void,
  onError?: (error: Error) => void
) {
  console.log("[BLE] Calling startDeviceScan with service UUID filter");

  bleManager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
    if (error) {
      console.log("[BLE] Scan error:", error);
      bleManager.stopDeviceScan();
      onError?.(error);
      return;
    }

    if (!device) return;

    console.log("[BLE] Found device:", device.name, device.id);

    // As soon as we find a device with the service UUID, stop scanning
    bleManager.stopDeviceScan();
    console.log("[BLE] Stopped scan after finding a device");
    onFound(device);
  });
}
