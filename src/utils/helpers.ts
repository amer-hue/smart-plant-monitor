import { Reading } from '../types';

export const celsiusToFahrenheit = (c: number) => (c * 9) / 5 + 32;

export const formatTemperature = (celsius: number, isFahrenheit: boolean) => {
  if (isFahrenheit) {
    return `${celsiusToFahrenheit(celsius).toFixed(1)}°F`;
  }
  return `${celsius.toFixed(1)}°C`;
};

export const getStatusColor = (reading: Reading | undefined) => {
  if (!reading) return 'red';
  if (reading.moisture > 60 && reading.moisture < 90) return 'green';
  if (reading.moisture <= 60 && reading.moisture > 30) return 'amber';
  return 'red';
};

export const getLightLevel = (lux: number) => {
  if (lux < 500) return 'Low';
  if (lux >= 500 && lux < 2000) return 'Medium';
  return 'High';
};
