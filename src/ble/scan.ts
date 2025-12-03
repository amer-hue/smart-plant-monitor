import { bleManager } from "./BLE";

export function scanForDevices(onFound: (device: any) => void) {
  console.log("🔍 Scanning for Bluetooth devices...");

  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log("Scan error:", error);
      return;
    }

    if (device?.name) {
      console.log("Found:", device.name, device.id);

      // TODO: CHANGE THIS to your actual device name
      if (device.name.includes("Plant")) {
        console.log("🌱 Found plant board:", device.name);
        bleManager.stopDeviceScan();
        onFound(device);
      }
    }
  });
}
