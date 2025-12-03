// src/ble/permissions.ts
import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export async function requestBluetoothPermissions(): Promise<boolean> {
  // Android — allow for now
  if (Platform.OS !== 'ios') {
    return true;
  }

  // Handle both possible iOS keys
  const bluetoothPermission =
    (PERMISSIONS.IOS as any).BLUETOOTH_PERIPHERAL ??
    (PERMISSIONS.IOS as any).BLUETOOTH;

  try {
    // 1. Check current permission
    let status = await check(bluetoothPermission);
    console.log('[BLE] status (check):', status);

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      return true;
    }

    // 2. Request permission
    status = await request(bluetoothPermission);
    console.log('[BLE] status (request):', status);

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      return true;
    }

    if (status === RESULTS.BLOCKED) {
      // User disabled in Settings
      return false;
    }

    // denied/unavailable
    return false;

  } catch (err) {
    console.log('[BLE] permission error:', err);
    // Allow scan to proceed so iOS will handle
    return true;
  }
}
