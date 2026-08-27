export type HealthEntry = {
  id: string;
  metricName: string;
  value: number;
  unit: string;
  category: string;
  recordedAt: string;
  notes?: string;
};

export type WeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
};

export type WeatherEntry = WeatherSnapshot & {
  id: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
  locality?: string;
};

export const BODY_SITES = [
  { id: "head", label: "Cabeça", icon: "◉" },
  { id: "face", label: "Face", icon: "◌" },
  { id: "neck", label: "Pescoço", icon: "▰" },
  { id: "left-shoulder", label: "Ombro esquerdo", icon: "◒" },
  { id: "right-shoulder", label: "Ombro direito", icon: "◓" },
  { id: "left-arm", label: "Braço esquerdo", icon: "╱" },
  { id: "right-arm", label: "Braço direito", icon: "╲" },
  { id: "chest", label: "Peito", icon: "♡" },
  { id: "abdomen", label: "Abdômen", icon: "◇" },
  { id: "upper-back", label: "Costas altas", icon: "▥" },
  { id: "lower-back", label: "Lombar", icon: "▥" },
  { id: "left-hip", label: "Quadril esquerdo", icon: "◒" },
  { id: "right-hip", label: "Quadril direito", icon: "◓" },
  { id: "left-thigh", label: "Coxa esquerda", icon: "╱" },
  { id: "right-thigh", label: "Coxa direita", icon: "╲" },
  { id: "left-knee", label: "Joelho esquerdo", icon: "○" },
  { id: "right-knee", label: "Joelho direito", icon: "○" },
  { id: "left-leg", label: "Perna esquerda", icon: "╱" },
  { id: "right-leg", label: "Perna direita", icon: "╲" },
  { id: "left-foot", label: "Pé esquerdo", icon: "⌁" },
  { id: "right-foot", label: "Pé direito", icon: "⌁" },
] as const;

export type BodySiteId = (typeof BODY_SITES)[number]["id"];

export const PAIN_TYPES = [
  { id: "throbbing", label: "Pulsante", icon: "〰" },
  { id: "aching", label: "Dolorida", icon: "◉" },
  { id: "stabbing", label: "Pontada", icon: "✦" },
  { id: "needle", label: "Agulhada", icon: "✧" },
  { id: "electric", label: "Choque", icon: "ϟ" },
  { id: "burning", label: "Queimação", icon: "♨" },
  { id: "stinging", label: "Ardência", icon: "✹" },
  { id: "tingling", label: "Formigamento", icon: "⁙" },
  { id: "numbness", label: "Dormência", icon: "⊙" },
  { id: "pressure", label: "Pressão", icon: "⇣" },
  { id: "heavy", label: "Peso", icon: "⬇" },
  { id: "tightness", label: "Aperto", icon: "⟷" },
  { id: "cramping", label: "Cólica", icon: "∿" },
  { id: "itching", label: "Coceira", icon: "✋" },
  { id: "tearing", label: "Rasgando", icon: "⌁" },
  { id: "continuous", label: "Contínua", icon: "—" },
  { id: "intermittent", label: "Intermitente", icon: "···" },
] as const;

export const EMOTIONS = [
  { id: "calm", label: "Calmo", icon: "🙂" },
  { id: "well", label: "Bem", icon: "😊" },
  { id: "worried", label: "Preocupado", icon: "😟" },
  { id: "irritated", label: "Irritado", icon: "😠" },
  { id: "sad", label: "Triste", icon: "😔" },
  { id: "anxious", label: "Ansioso", icon: "😰" },
  { id: "tired", label: "Cansado", icon: "😴" },
  { id: "frustrated", label: "Frustrado", icon: "😣" },
  { id: "overwhelmed", label: "Sobrecarregado", icon: "🥴" },
] as const;

export const FOOD_TRIGGERS = [
  { id: "chocolate", label: "Chocolate", icon: "🍫" },
  { id: "alcohol", label: "Álcool", icon: "🍷" },
  { id: "carbs", label: "Carboidratos", icon: "🍞" },
  { id: "ultra-processed", label: "Ultraprocessado", icon: "🍔" },
  { id: "fried", label: "Fritura", icon: "🍟" },
  { id: "dairy", label: "Laticínios", icon: "🥛" },
  { id: "gluten", label: "Glúten", icon: "🌾" },
  { id: "sugar", label: "Açúcar", icon: "🍬" },
  { id: "caffeine", label: "Cafeína", icon: "☕" },
  { id: "processed-meat", label: "Carne processada", icon: "🥓" },
  { id: "salty", label: "Muito sal", icon: "🧂" },
  { id: "new-food", label: "Alimento novo", icon: "✨" },
  { id: "none", label: "Nenhum desses", icon: "✓" },
] as const;

export type PainEntry = {
  id: string;
  occurredAt: string;
  primarySite: BodySiteId;
  radiationSites: BodySiteId[];
  intensity: number;
  painTypes: string[];
  emotion: string;
  foods: string[];
  weather?: WeatherSnapshot & { locality?: string };
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
  version: 2;
  healthEntries: HealthEntry[];
  weatherEntries: WeatherEntry[];
  calendarEntries: CalendarEntry[];
  painEntries: PainEntry[];
};

export const EMPTY_APP_DATA: AppData = {
  version: 2,
  healthEntries: [],
  weatherEntries: [],
  calendarEntries: [],
  painEntries: [],
};

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function bodySiteLabel(id: string) {
  return BODY_SITES.find((site) => site.id === id)?.label ?? id;
}

export function painTypeLabel(id: string) {
  return PAIN_TYPES.find((type) => type.id === id)?.label ?? id;
}

export function emotionLabel(id: string) {
  return EMOTIONS.find((emotion) => emotion.id === id)?.label ?? id;
}

export function foodLabel(id: string) {
  return FOOD_TRIGGERS.find((food) => food.id === id)?.label ?? id;
}
