import { describe, expect, it } from "vitest";

import { calculateAverageTemperature, calculateMetricAverages, getDataForPeriod } from "@/lib/reports";
import { weatherDescription } from "@/lib/weather";
import { AppData } from "@/shared/records";

const data: AppData = {
  version: 2,
  painEntries: [],
  healthEntries: [
    { id: "h-1", metricName: "Peso", value: 70, unit: "kg", category: "Geral", recordedAt: "2026-08-25T12:00:00.000Z" },
    { id: "h-2", metricName: "Peso", value: 72, unit: "kg", category: "Geral", recordedAt: "2026-08-24T12:00:00.000Z" },
    { id: "h-3", metricName: "Sono", value: 8, unit: "h", category: "Bem-estar", recordedAt: "2026-08-23T12:00:00.000Z" },
  ],
  weatherEntries: [
    { id: "w-1", capturedAt: "2026-08-25T12:00:00.000Z", latitude: -23.5, longitude: -46.6, temperature: 20, apparentTemperature: 20, humidity: 60, windSpeed: 10, weatherCode: 0, isDay: true },
    { id: "w-2", capturedAt: "2026-08-24T12:00:00.000Z", latitude: -23.5, longitude: -46.6, temperature: 24, apparentTemperature: 24, humidity: 55, windSpeed: 8, weatherCode: 2, isDay: true },
  ],
  calendarEntries: [{ id: "c-1", title: "Consulta", category: "Saúde", startsAt: "2026-08-25T13:00:00.000Z" }],
  medicationHistory: [],
  customFoods: [],
};

describe("relatórios locais", () => {
  it("calcula médias agrupadas pela métrica e unidade", () => {
    const averages = calculateMetricAverages(data.healthEntries);
    expect(averages).toContainEqual({ metricName: "Peso", unit: "kg", count: 2, average: 71 });
    expect(averages).toContainEqual({ metricName: "Sono", unit: "h", count: 1, average: 8 });
  });

  it("calcula a média da temperatura capturada", () => {
    expect(calculateAverageTemperature(data.weatherEntries)).toBe(22);
  });

  it("filtra dados para o período solicitado", () => {
    const filtered = getDataForPeriod(data, 2, new Date("2026-08-26T15:00:00.000Z"));
    expect(filtered.healthEntries).toHaveLength(1);
    expect(filtered.weatherEntries).toHaveLength(1);
    expect(filtered.calendarEntries).toHaveLength(1);
  });
});

describe("descrições meteorológicas", () => {
  it("traduz o código WMO de condição conhecida", () => {
    expect(weatherDescription(61)).toBe("Chuva fraca");
  });

  it("retorna uma mensagem segura para código não mapeado", () => {
    expect(weatherDescription(999)).toBe("Condição indisponível");
  });
});
