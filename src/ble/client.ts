import { Reading } from '../types';

// Mocked BLE client for simulator
// In a real app, this would use react-native-ble-plx
export const mockReading = (): Reading => ({
  moisture: Math.floor(Math.random() * (100 - 20 + 1)) + 20,
  tempC: Math.floor(Math.random() * (35 - 15 + 1)) + 15,
  light: Math.floor(Math.random() * (5000 - 100 + 1)) + 100,
  ts: Date.now(),
});

export const mockDevices = [
  { id: 'mock-ble-1', name: 'PlantSensor-A', rssi: -50 },
  { id: 'mock-ble-2', name: 'PlantSensor-B', rssi: -70 },
];

export const BLEClient = {
  startScan: (onDevice: (device: { id: string; name: string; rssi: number }) => void) => {
    console.log('Starting mocked BLE scan...');
    // Simulate finding devices
    setTimeout(() => {
      mockDevices.forEach(d => onDevice(d));
    }, 1000);
  },
  stopScan: () => {
    console.log('Stopping mocked BLE scan.');
  },
  connect: (deviceId: string) => {
    console.log(`Connecting to mock device: ${deviceId}`);
    return Promise.resolve(true); // Simulate successful connection
  },
  disconnect: (deviceId: string) => {
    console.log(`Disconnecting from mock device: ${deviceId}`);
    return Promise.resolve(true);
  },
  readLatest: (deviceId: string) => {
    console.log(`Reading from mock device: ${deviceId}`);
    return Promise.resolve(mockReading());
  },
};
