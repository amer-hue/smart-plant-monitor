// src/ble/client.ts
import { bleManager } from "./BLE";

const SERVICE_UUID = "1234567A-1234-5678-1234-56789ABCDEF0";
const WRITE_UUID   = "1234567A-1234-5678-1234-56789ABCDEF1";
const NOTIFY_UUID  = "1234567A-1234-5678-1234-56789ABCDEF2";

function toLittleEndianInt32(value: number): number[] {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setInt32(0, value, true); // little endian
  return Array.from(new Uint8Array(buffer));
}

export const BLEClient = {
  async connect(deviceId: string) {
    const device = await bleManager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    return device;
  },

  /** SEND PLANT PROFILE (8 x int32) */
  async sendPlantProfile(
    deviceId: string,
    profile: {
      tempMin: number;       // °C
      tempMax: number;       // °C
      rhMin: number;         // %
      rhMax: number;         // %
      moistureMin: number;   // mV
      moistureMax: number;   // mV
      luxMin: number;
      luxMax: number;
    }
  ) {
    console.log("[BLE] Sending plant profile:", profile);

    const device = await this.connect(deviceId);

    // Build the 32-byte payload:
    const payload: number[] = [
      ...toLittleEndianInt32(profile.tempMin * 100),
      ...toLittleEndianInt32(profile.tempMax * 100),
      ...toLittleEndianInt32(profile.rhMin * 100),
      ...toLittleEndianInt32(profile.rhMax * 100),
      ...toLittleEndianInt32(profile.moistureMin),
      ...toLittleEndianInt32(profile.moistureMax),
      ...toLittleEndianInt32(profile.luxMin),
      ...toLittleEndianInt32(profile.luxMax),
    ];

    const base64Payload = Buffer.from(payload).toString("base64");

    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      WRITE_UUID,
      base64Payload
    );

    console.log("[BLE] Plant profile sent successfully.");
  },

  /** READ LATEST SENSOR VALUES (NOTIFY CHARACTERISTIC) */
  async readLatest(deviceId: string): Promise<any> {
    const device = await this.connect(deviceId);

    return new Promise(async (resolve) => {
      const characteristic = await device.monitorCharacteristicForService(
        SERVICE_UUID,
        NOTIFY_UUID,
        (error, char) => {
          if (error) {
            console.log("[BLE] Notify error:", error);
            return;
          }

          if (char?.value) {
            const raw = Buffer.from(char.value, "base64");
            console.log("[BLE] Raw notify data:", raw);

            // TODO: decode the board’s notify format
            resolve({ ok: true, raw });
          }
        }
      );
    });
  },
};
