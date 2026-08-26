export type HealthEntry = {
  id: string;
  metricName: string;
  value: number;
  unit: string;
  category: string;
  recordedAt: string;
  notes?: string;
};

export type WeatherEntry = {
  id: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
  locality?: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
};

export type CalendarEntry = {
  id: string;
  title: string;
  category: "Pessoal" | "Saúde" | "Trabalho" | "Outro";
  startsAt: string;
  endsAt?: string;
  notes?: string;
};

export type AppData = {
  version: 1;
  healthEntries: HealthEntry[];
  weatherEntries: WeatherEntry[];
  calendarEntries: CalendarEntry[];
};

export const EMPTY_APP_DATA: AppData = {
  version: 1,
  healthEntries: [],
  weatherEntries: [],
  calendarEntries: [],
};

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
