// src/ble/permissions.ts
import { Platform, PermissionsAndroid } from "react-native";

export async function requestBluetoothPermissions(): Promise<boolean> {
  // iOS – BLE-PLX + Info.plist is enough. No manual request API.
  if (Platform.OS === "ios") {
    return true;
  }

  // Android – basic runtime permissions (you can expand this later)
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    const ok =
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED;

    return ok;
  } catch (e) {
    console.log("[BLE] Android permission error:", e);
    return false;
  }
}
