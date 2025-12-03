// src/ble/scan.ts
import { bleManager } from './BLE';

const BOARD_NAME_FRAGMENT = 'Plant'; // TODO: exact advertised name from your board

export function scanForDevices(onFound: (device: any) => void) {
  console.log('🔍 Scanning for Bluetooth devices...');

  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log('Scan error:', error);
      return;
    }

    if (!device?.name) return;

    console.log('Found:', device.name, device.id);

    if (device.name.includes(BOARD_NAME_FRAGMENT)) {
      console.log('🌱 Found plant board:', device.name);
      bleManager.stopDeviceScan();
      onFound(device);
    }
  });
}
