import { Reading } from "../types";


export const celsiusToFahrenheit = (c: number) => (c * 9) / 5 + 32;

export function formatTemperature(tempC: number, isFahrenheit: boolean) {
  if (typeof tempC !== "number") return "--";

  const value = isFahrenheit
    ? tempC * (9 / 5) + 32
    : tempC;

  const unit = isFahrenheit ? "F" : "C";
  return `${Math.round(value)}°${unit}`;
}


export const getStatusColor = (reading: Reading | undefined) => {
  if (!reading) return "red";
  if (reading.soilMoisture > 60 && reading.soilMoisture < 90) return "green";
  if (reading.soilMoisture <= 60 && reading.soilMoisture > 30) return "amber";
  return "red";
};


export const getLightLevel = (lux: number) => {
  if (lux === undefined || lux === null) return "N/A";
  if (lux < 500) return "Low";
  if (lux < 2000) return "Medium";
  return "High";
};


export function generateCareReminder(reading?: {
  tempC?: number;
  moisture?: number;
  light?: number;
}) {
  if (!reading) return "No sensor data available yet.";

  const messages: string[] = [];

  // Temperature
  if (reading.tempC !== undefined) {
    if (reading.tempC < 18) {
      messages.push("❄️ Temperature is low — consider moving your plant to a warmer spot.");
    } else if (reading.tempC > 30) {
      messages.push("🔥 Temperature is high — try placing your plant somewhere cooler.");
    }
  }

  // Moisture
  if (reading.moisture !== undefined) {
    if (reading.moisture < 30) {
      messages.push("💧 Soil moisture is low — your plant may need watering soon.");
    } else if (reading.moisture > 80) {
      messages.push("⚠️ Soil is very wet — avoid overwatering.");
    }
  }

  // Light
  if (reading.light !== undefined) {
    if (reading.light < 400) {
      messages.push("☀️ Light levels are low — consider moving plant closer to light.");
    }
  }

  // If no warnings
  if (messages.length === 0) {
    return "🌱 Everything looks good!";
  }

  return messages.join("\n");
}
