import { Reading } from '../types';

export type MockDevice = {
  id: string;
  name: string;
  rssi: number;
};

const mockDevices: MockDevice[] = [
  { id: 'mock-ble-1', name: 'PlantSensor-A', rssi: -50 },
  { id: 'mock-ble-2', name: 'PlantSensor-B', rssi: -70 },
];

export const BLEClient = {
  /**
   * startScan
   * - Works with: BLEClient.startScan(device => { ... })
   * - AND:       const list = await BLEClient.startScan()
   */
  startScan: async (
    onDevice?: (device: MockDevice) => void
  ): Promise<MockDevice[]> => {
    console.log('Mock BLE scan started...');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (onDevice) {
      mockDevices.forEach(d => onDevice(d));
    }

    return mockDevices;
  },

  stopScan: async (): Promise<void> => {
    console.log('Mock BLE scan stopped.');
  },

  connect: async (deviceId: string): Promise<boolean> => {
    console.log(`Mock connect to ${deviceId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  },

  disconnect: async (deviceId: string): Promise<boolean> => {
    console.log(`Mock disconnect from ${deviceId}`);
    return true;
  },

  readLatest: async (deviceId: string): Promise<Reading> => {
    console.log(`Mock reading from ${deviceId}`);

    const reading: Reading = {
      moisture: Math.floor(Math.random() * 40) + 40, // 40–80%
      tempC: Math.floor(Math.random() * 10) + 20,    // 20–30°C
      light: Math.floor(Math.random() * 4000) + 200, // 200–4200 lux
      ts: Date.now(),
    };

    return reading;
  },
};