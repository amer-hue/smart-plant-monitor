// src/utils/plantAlerts.ts
import { sendLocalAlert } from "./notifications";

// Only alert on LOW/HIGH, based off of PlantType ideal metrics
export type Level = "LOW" | "MODERATE" | "HIGH";
export type Metric = "light" | "moisture" | "humidity" | "temp";

export function levelFor(value: number, min: number, max: number): Level {
  if (value < min) return "LOW";
  if (value > max) return "HIGH";
  return "MODERATE";
}

function prettyMetric(metric: Metric) {
  switch (metric) {
    case "temp":
      return "Temperature";
    case "humidity":
      return "Humidity";
    case "moisture":
      return "Soil Moisture";
    case "light":
      return "Light";
  }
}

function formatValue(metric: Metric, value: number) {
  if (metric === "temp") return `${Math.round(value)}°C`;
  if (metric === "humidity" || metric === "moisture")
    return `${Math.round(value)}%`;
  return `${Math.round(value)}`;
}

/**
 * Prevent spamming:
 * - only alert when entering LOW/HIGH
 * - cooldown per plant+metric (default 30 min)
 */
export async function maybeSendAlert(params: {
  plantId: string;
  plantName: string;
  metric: Metric;
  value: number;
  level: Level;
  prevLevel: Level | null;
  lastNotifiedAt: number | null;
  cooldownMs?: number;
}) {
  const {
    plantName,
    metric,
    value,
    level,
    prevLevel,
    lastNotifiedAt,
    cooldownMs = 30 * 60 * 1000,
  } = params;

  if (level === "MODERATE") return { notified: false };
  if (prevLevel === level) return { notified: false };
  if (lastNotifiedAt && Date.now() - lastNotifiedAt < cooldownMs) {
    return { notified: false };
  }

  const metricName = prettyMetric(metric);
  const msgLevel = level === "LOW" ? "too low" : "too high";

  await sendLocalAlert(
    `⚠️ ${plantName}`,
    `${metricName} is ${msgLevel}: ${formatValue(metric, value)}`
  );

  return { notified: true };
}
