import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AppData,
  CalendarEntry,
  EMPTY_APP_DATA,
  HealthEntry,
  WeatherEntry,
} from "@/shared/records";

const STORAGE_KEY = "@registro-pessoal/v1/data";

function sortByMostRecent<T extends { recordedAt?: string; capturedAt?: string; startsAt?: string }>(items: T[]) {
  return [...items].sort((first, second) => {
    const firstDate = first.recordedAt ?? first.capturedAt ?? first.startsAt ?? "";
    const secondDate = second.recordedAt ?? second.capturedAt ?? second.startsAt ?? "";
    return secondDate.localeCompare(firstDate);
  });
}

export async function loadAppData(): Promise<AppData> {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (!rawValue) return EMPTY_APP_DATA;

  try {
    const parsed = JSON.parse(rawValue) as Partial<AppData>;
    return {
      version: 1,
      healthEntries: Array.isArray(parsed.healthEntries) ? sortByMostRecent(parsed.healthEntries) : [],
      weatherEntries: Array.isArray(parsed.weatherEntries) ? sortByMostRecent(parsed.weatherEntries) : [],
      calendarEntries: Array.isArray(parsed.calendarEntries)
        ? [...parsed.calendarEntries].sort((first, second) => first.startsAt.localeCompare(second.startsAt))
        : [],
    };
  } catch {
    return EMPTY_APP_DATA;
  }
}

export async function saveAppData(data: AppData) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function addHealthEntry(entry: HealthEntry) {
  const data = await loadAppData();
  const nextData: AppData = {
    ...data,
    healthEntries: sortByMostRecent([entry, ...data.healthEntries]),
  };
  await saveAppData(nextData);
  return nextData;
}

export async function addWeatherEntry(entry: WeatherEntry) {
  const data = await loadAppData();
  const nextData: AppData = {
    ...data,
    weatherEntries: sortByMostRecent([entry, ...data.weatherEntries]),
  };
  await saveAppData(nextData);
  return nextData;
}

export async function addCalendarEntry(entry: CalendarEntry) {
  const data = await loadAppData();
  const nextData: AppData = {
    ...data,
    calendarEntries: [...data.calendarEntries, entry].sort((first, second) =>
      first.startsAt.localeCompare(second.startsAt),
    ),
  };
  await saveAppData(nextData);
  return nextData;
}

export async function deleteEntry(kind: "health" | "weather" | "calendar", id: string) {
  const data = await loadAppData();
  const nextData: AppData = {
    ...data,
    healthEntries: kind === "health" ? data.healthEntries.filter((entry) => entry.id !== id) : data.healthEntries,
    weatherEntries: kind === "weather" ? data.weatherEntries.filter((entry) => entry.id !== id) : data.weatherEntries,
    calendarEntries:
      kind === "calendar" ? data.calendarEntries.filter((entry) => entry.id !== id) : data.calendarEntries,
  };
  await saveAppData(nextData);
  return nextData;
}

export async function clearAllAppData() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
