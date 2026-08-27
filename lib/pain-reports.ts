import { bodySiteLabel, emotionLabel, foodLabel, PainEntry, painTypeLabel } from "@/shared/records";

export function isWithinPeriod(value: string, days: number, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return new Date(value) >= start;
}

function rankedCounts(values: string[], labelFor: (value: string) => string) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, label: labelFor(id), count }))
    .sort((first, second) => second.count - first.count);
}

export function buildPainReport(entries: PainEntry[], days: number, now = new Date()) {
  const periodEntries = entries.filter((entry) => isWithinPeriod(entry.occurredAt, days, now));
  const intensityAverage = periodEntries.length ? periodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / periodEntries.length : 0;
  const sites = rankedCounts(periodEntries.map((entry) => entry.primarySite), bodySiteLabel);
  const types = rankedCounts(periodEntries.flatMap((entry) => entry.painTypes), painTypeLabel);
  const radiation = rankedCounts(periodEntries.flatMap((entry) => entry.radiationSites), bodySiteLabel);
  const emotions = rankedCounts(periodEntries.map((entry) => entry.emotion), emotionLabel);
  const foods = rankedCounts(periodEntries.flatMap((entry) => entry.foods).filter((food) => food !== "none"), foodLabel);
  const weatherEntries = periodEntries.filter((entry) => entry.weather);
  const weatherAverage = weatherEntries.length ? weatherEntries.reduce((sum, entry) => sum + (entry.weather?.temperature ?? 0), 0) / weatherEntries.length : null;
  const averageIntensityByFood = foods.map((food) => {
    const matching = periodEntries.filter((entry) => entry.foods.includes(food.id));
    return { ...food, averageIntensity: matching.reduce((sum, entry) => sum + entry.intensity, 0) / matching.length };
  });
  const averageIntensityByEmotion = emotions.map((emotion) => {
    const matching = periodEntries.filter((entry) => entry.emotion === emotion.id);
    return { ...emotion, averageIntensity: matching.reduce((sum, entry) => sum + entry.intensity, 0) / matching.length };
  });
  return { entries: periodEntries, intensityAverage, sites, radiation, types, emotions, foods: averageIntensityByFood, averageIntensityByEmotion, weatherAverage, weatherCount: weatherEntries.length };
}
