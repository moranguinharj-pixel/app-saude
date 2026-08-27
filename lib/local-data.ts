import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppData, CalendarEntry, EMPTY_APP_DATA, FoodProfile, HealthEntry, MedicationProfile, PainEntry, WeatherEntry } from "@/shared/records";

type StoredData = Partial<AppData> & { version?: number };
const STORAGE_KEY = "@registro-pessoal/v1/data";

function sortByMostRecent<T extends { recordedAt?: string; capturedAt?: string; startsAt?: string; occurredAt?: string }>(items: T[]) {
  return [...items].sort((first, second) => {
    const firstDate = first.recordedAt ?? first.capturedAt ?? first.startsAt ?? first.occurredAt ?? "";
    const secondDate = second.recordedAt ?? second.capturedAt ?? second.startsAt ?? second.occurredAt ?? "";
    return secondDate.localeCompare(firstDate);
  });
}

export async function loadAppData(): Promise<AppData> {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (!rawValue) return EMPTY_APP_DATA;
  try {
    const parsed = JSON.parse(rawValue) as StoredData;
    return {
      version: 2,
      healthEntries: Array.isArray(parsed.healthEntries) ? sortByMostRecent(parsed.healthEntries) : [],
      weatherEntries: Array.isArray(parsed.weatherEntries) ? sortByMostRecent(parsed.weatherEntries) : [],
      calendarEntries: Array.isArray(parsed.calendarEntries) ? [...parsed.calendarEntries].sort((first, second) => first.startsAt.localeCompare(second.startsAt)) : [],
      painEntries: Array.isArray(parsed.painEntries) ? sortByMostRecent(parsed.painEntries) : [],
      medicationHistory: Array.isArray(parsed.medicationHistory) ? parsed.medicationHistory : [],
      customFoods: Array.isArray(parsed.customFoods) ? parsed.customFoods : [],
    };
  } catch {
    return EMPTY_APP_DATA;
  }
}

export async function saveAppData(data: AppData) { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
export async function addHealthEntry(entry: HealthEntry) { const data = await loadAppData(); const nextData = { ...data, healthEntries: sortByMostRecent([entry, ...data.healthEntries]) }; await saveAppData(nextData); return nextData; }
export async function addWeatherEntry(entry: WeatherEntry) { const data = await loadAppData(); const nextData = { ...data, weatherEntries: sortByMostRecent([entry, ...data.weatherEntries]) }; await saveAppData(nextData); return nextData; }
export async function addPainEntry(entry: PainEntry) { const data = await loadAppData(); const nextData = { ...data, painEntries: sortByMostRecent([entry, ...data.painEntries]) }; await saveAppData(nextData); return nextData; }
export async function addMedicationProfile(profile: MedicationProfile) { const data = await loadAppData(); const history = data.medicationHistory.some((item) => item.name.toLowerCase() === profile.name.toLowerCase()) ? data.medicationHistory : [...data.medicationHistory, profile]; const nextData = { ...data, medicationHistory: history }; await saveAppData(nextData); return nextData; }
export async function addCustomFood(profile: FoodProfile) { const data = await loadAppData(); const foods = data.customFoods.some((item) => item.label.toLowerCase() === profile.label.toLowerCase()) ? data.customFoods : [...data.customFoods, profile]; const nextData = { ...data, customFoods: foods }; await saveAppData(nextData); return nextData; }
export async function addCalendarEntry(entry: CalendarEntry) { const data = await loadAppData(); const nextData = { ...data, calendarEntries: [...data.calendarEntries, entry].sort((first, second) => first.startsAt.localeCompare(second.startsAt)) }; await saveAppData(nextData); return nextData; }

export async function deleteEntry(kind: "health" | "weather" | "calendar" | "pain", id: string) {
  const data = await loadAppData();
  const nextData: AppData = {
    ...data,
    healthEntries: kind === "health" ? data.healthEntries.filter((entry) => entry.id !== id) : data.healthEntries,
    weatherEntries: kind === "weather" ? data.weatherEntries.filter((entry) => entry.id !== id) : data.weatherEntries,
    calendarEntries: kind === "calendar" ? data.calendarEntries.filter((entry) => entry.id !== id) : data.calendarEntries,
    painEntries: kind === "pain" ? data.painEntries.filter((entry) => entry.id !== id) : data.painEntries,
  };
  await saveAppData(nextData);
  return nextData;
}

export async function clearAllAppData() { await AsyncStorage.removeItem(STORAGE_KEY); }
