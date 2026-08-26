import { AppData, HealthEntry } from "@/shared/records";

export function dateInLastDays(date: string, days: number, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return new Date(date) >= start;
}

export function getDataForPeriod(data: AppData, days: number, now = new Date()) {
  return {
    healthEntries: data.healthEntries.filter((entry) => dateInLastDays(entry.recordedAt, days, now)),
    weatherEntries: data.weatherEntries.filter((entry) => dateInLastDays(entry.capturedAt, days, now)),
    calendarEntries: data.calendarEntries.filter((entry) => dateInLastDays(entry.startsAt, days, now)),
  };
}

export function calculateMetricAverages(entries: HealthEntry[]) {
  const groups = new Map<string, HealthEntry[]>();
  entries.forEach((entry) => {
    const key = `${entry.metricName}::${entry.unit}`;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  });
  return Array.from(groups.entries()).map(([key, group]) => {
    const [metricName, unit] = key.split("::");
    const sum = group.reduce((total, entry) => total + entry.value, 0);
    return { metricName, unit, count: group.length, average: sum / group.length };
  }).sort((first, second) => second.count - first.count);
}

export function calculateAverageTemperature(entries: AppData["weatherEntries"]) {
  return entries.length ? entries.reduce((total, entry) => total + entry.temperature, 0) / entries.length : null;
}
