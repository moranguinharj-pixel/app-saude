import { describe, expect, it } from "vitest";

import { buildPainReport } from "@/lib/pain-reports";
import { PainEntry } from "@/shared/records";

const now = new Date("2026-08-27T12:00:00.000Z");
const entries: PainEntry[] = [
  { id: "p-1", occurredAt: "2026-08-27T10:00:00.000Z", primarySite: "lower-back", radiationSites: ["left-leg"], intensity: 8, painTypes: ["burning", "stabbing"], emotion: "worried", foods: ["chocolate"], weather: { temperature: 18, apparentTemperature: 17, humidity: 88, windSpeed: 10, weatherCode: 61, isDay: true, locality: "São Paulo" } },
  { id: "p-2", occurredAt: "2026-08-25T10:00:00.000Z", primarySite: "lower-back", radiationSites: [], intensity: 4, painTypes: ["aching"], emotion: "tired", foods: ["none"], weather: { temperature: 22, apparentTemperature: 22, humidity: 60, windSpeed: 4, weatherCode: 1, isDay: true } },
];

describe("relatório do diário de dor", () => {
  it("resume ocorrências, local e intensidade média no período", () => {
    const report = buildPainReport(entries, 7, now);
    expect(report.entries).toHaveLength(2);
    expect(report.intensityAverage).toBe(6);
    expect(report.sites[0]).toMatchObject({ id: "lower-back", count: 2 });
    expect(report.weatherCount).toBe(2);
  });

  it("calcula associações descritivas de alimentos e emoções", () => {
    const report = buildPainReport(entries, 7, now);
    expect(report.foods[0]).toMatchObject({ id: "chocolate", count: 1, averageIntensity: 8 });
    expect(report.averageIntensityByEmotion[0]).toMatchObject({ id: "worried", averageIntensity: 8 });
    expect(report.types[0].label).toBe("Queimação");
  });

  it("exclui registros fora do intervalo escolhido", () => {
    const report = buildPainReport([...entries, { ...entries[0], id: "old", occurredAt: "2026-07-01T10:00:00.000Z" }], 7, now);
    expect(report.entries).toHaveLength(2);
  });
});
