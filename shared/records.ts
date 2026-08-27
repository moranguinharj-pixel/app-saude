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

export const BODY_SITE_DETAILS = [
  { id: "head-top", coarse: "head", label: "Topo da cabeça" },
  { id: "forehead-left", coarse: "head", label: "Testa esquerda" },
  { id: "forehead-right", coarse: "head", label: "Testa direita" },
  { id: "above-eye-left", coarse: "face", label: "Acima do olho esquerdo" },
  { id: "above-eye-right", coarse: "face", label: "Acima do olho direito" },
  { id: "below-eye-left", coarse: "face", label: "Abaixo do olho esquerdo" },
  { id: "below-eye-right", coarse: "face", label: "Abaixo do olho direito" },
  { id: "ear-left-upper", coarse: "face", label: "Orelha esquerda, parte superior" },
  { id: "ear-left-lower", coarse: "face", label: "Orelha esquerda, parte inferior" },
  { id: "ear-right-upper", coarse: "face", label: "Orelha direita, parte superior" },
  { id: "ear-right-lower", coarse: "face", label: "Orelha direita, parte inferior" },
  { id: "behind-eye-left", coarse: "face", label: "Atrás do olho esquerdo" },
  { id: "behind-eye-right", coarse: "face", label: "Atrás do olho direito" },
  { id: "temple-left", coarse: "face", label: "Têmpora esquerda" },
  { id: "temple-right", coarse: "face", label: "Têmpora direita" },
  { id: "cheek-left", coarse: "face", label: "Bochecha esquerda" },
  { id: "cheek-right", coarse: "face", label: "Bochecha direita" },
  { id: "jaw-left", coarse: "face", label: "Mandíbula esquerda" },
  { id: "jaw-right", coarse: "face", label: "Mandíbula direita" },
  { id: "behind-head-left", coarse: "head", label: "Atrás da cabeça, lado esquerdo" },
  { id: "behind-head-right", coarse: "head", label: "Atrás da cabeça, lado direito" },
  { id: "neck-front", coarse: "neck", label: "Frente do pescoço" },
  { id: "neck-back", coarse: "neck", label: "Nuca" },
  { id: "chest-left", coarse: "chest", label: "Peito esquerdo" },
  { id: "chest-right", coarse: "chest", label: "Peito direito" },
  { id: "chest-center", coarse: "chest", label: "Centro do peito" },
  { id: "rib-left-upper", coarse: "chest", label: "Costelas esquerdas superiores" },
  { id: "rib-right-upper", coarse: "chest", label: "Costelas direitas superiores" },
  { id: "rib-left-lower", coarse: "chest", label: "Costelas esquerdas inferiores" },
  { id: "rib-right-lower", coarse: "chest", label: "Costelas direitas inferiores" },
  { id: "abdomen-left-upper", coarse: "abdomen", label: "Abdômen superior esquerdo" },
  { id: "abdomen-right-upper", coarse: "abdomen", label: "Abdômen superior direito" },
  { id: "abdomen-left-lower", coarse: "abdomen", label: "Abdômen inferior esquerdo" },
  { id: "abdomen-right-lower", coarse: "abdomen", label: "Abdômen inferior direito" },
  { id: "lower-belly-left", coarse: "abdomen", label: "Baixo ventre esquerdo" },
  { id: "lower-belly-right", coarse: "abdomen", label: "Baixo ventre direito" },
  { id: "flank-left", coarse: "abdomen", label: "Flanco esquerdo" },
  { id: "flank-right", coarse: "abdomen", label: "Flanco direito" },
  { id: "pelvis-left", coarse: "left-hip", label: "Região pélvica esquerda" },
  { id: "pelvis-right", coarse: "right-hip", label: "Região pélvica direita" },
  { id: "ovary-left", coarse: "left-hip", label: "Região próxima ao ovário esquerdo" },
  { id: "ovary-right", coarse: "right-hip", label: "Região próxima ao ovário direito" },
  { id: "groin-left", coarse: "left-hip", label: "Virilha esquerda" },
  { id: "groin-right", coarse: "right-hip", label: "Virilha direita" },
  { id: "lower-back-left", coarse: "lower-back", label: "Lombar esquerda" },
  { id: "lower-back-right", coarse: "lower-back", label: "Lombar direita" },
  { id: "upper-back-left", coarse: "upper-back", label: "Parte alta das costas esquerda" },
  { id: "upper-back-right", coarse: "upper-back", label: "Parte alta das costas direita" },
  { id: "hip-left-side", coarse: "left-hip", label: "Lateral do quadril esquerdo" },
  { id: "hip-right-side", coarse: "right-hip", label: "Lateral do quadril direito" },
  { id: "thigh-left-front", coarse: "left-thigh", label: "Coxa esquerda anterior" },
  { id: "thigh-right-front", coarse: "right-thigh", label: "Coxa direita anterior" },
  { id: "thigh-left-back", coarse: "left-thigh", label: "Coxa esquerda posterior" },
  { id: "thigh-right-back", coarse: "right-thigh", label: "Coxa direita posterior" },
  { id: "knee-left", coarse: "left-knee", label: "Joelho esquerdo" },
  { id: "knee-right", coarse: "right-knee", label: "Joelho direito" },
  { id: "calf-left", coarse: "left-leg", label: "Panturrilha esquerda" },
  { id: "calf-right", coarse: "right-leg", label: "Panturrilha direita" },
  { id: "shin-left", coarse: "left-leg", label: "Canela esquerda" },
  { id: "shin-right", coarse: "right-leg", label: "Canela direita" },
  { id: "leg-left-lateral", coarse: "left-leg", label: "Lateral da perna esquerda" },
  { id: "leg-right-lateral", coarse: "right-leg", label: "Lateral da perna direita" },
  { id: "ankle-left", coarse: "left-foot", label: "Tornozelo esquerdo" },
  { id: "ankle-right", coarse: "right-foot", label: "Tornozelo direito" },
  { id: "foot-left", coarse: "left-foot", label: "Pé esquerdo" },
  { id: "foot-right", coarse: "right-foot", label: "Pé direito" },
] as const;
export type BodySiteDetailId = (typeof BODY_SITE_DETAILS)[number]["id"];
export type BodySiteDetail = (typeof BODY_SITE_DETAILS)[number];

export function bodySiteDetailLabel(id?: string) {
  return BODY_SITE_DETAILS.find((site) => site.id === id)?.label ?? (id ? bodySiteLabel(id) : "Local não informado");
}


export const CHRONIC_CONDITIONS = [
  { id: "fibromyalgia", label: "Fibromialgia", icon: "✦" },
  { id: "endometriosis", label: "Endometriose", icon: "◌" },
  { id: "fibroid", label: "Mioma", icon: "✿" },
  { id: "ovarian-cyst", label: "Cisto no ovário", icon: "◉" },
  { id: "breast-cysts", label: "Cistos nos seios", icon: "♡" },
  { id: "migraine-aura", label: "Enxaqueca com aura", icon: "☼" },
  { id: "disc-herniation", label: "Hérnia de disco", icon: "▥" },
  { id: "hip-bursitis", label: "Bursite na bacia", icon: "◇" },
  { id: "knee-bursitis", label: "Bursite no joelho", icon: "○" },
  { id: "hand-tendinitis", label: "Tendinite na mão", icon: "✋" },
  { id: "other-condition", label: "Outra condição", icon: "+" },
  { id: "unknown-condition", label: "Não sei / sem relação", icon: "?" },
] as const;

export function chronicConditionLabel(id: string) {
  return CHRONIC_CONDITIONS.find((condition) => condition.id === id)?.label ?? id;
}

export const LOCAL_SYMPTOMS = [
  { id: "swollen", label: "Inchado", icon: "🔴" },
  { id: "warm", label: "Quente", icon: "♨️" },
  { id: "red", label: "Vermelho", icon: "🟥" },
  { id: "blistered", label: "Com bolhas", icon: "🫧" },
  { id: "bruised", label: "Manchado", icon: "🟣" },
  { id: "numb", label: "Dormente", icon: "⭕" },
  { id: "stiff", label: "Rígido", icon: "🪵" },
  { id: "weak", label: "Fraco", icon: "〽️" },
  { id: "limited-movement", label: "Movimento limitado", icon: "🚫" },
  { id: "touch-sensitive", label: "Sensível ao toque", icon: "✋" },
] as const;

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

export type LocalSymptomId = (typeof LOCAL_SYMPTOMS)[number]["id"];

export type FoodProfile = { id: string; label: string };

export type MedicationPurpose = "preventive" | "pain-control";
export type MedicationProfile = { id: string; name: string; dose?: string; unit?: string };
export type MedicationUse = MedicationProfile & { purpose: MedicationPurpose; takenAt: string };

export type FollowUpStatus = "pending" | "improved" | "not-improved" | "worse" | "closed";

export type PainFollowUp = {
  id: string;
  painEntryId: string;
  scheduledAt: string;
  medicationName?: string;
  status: FollowUpStatus;
  answeredAt?: string;
  nextMedicationName?: string;
};

export type PainEntry = {
  id: string;
  occurredAt: string;
  primarySite: BodySiteId;
  primaryDetail?: BodySiteDetailId;
  conditions?: string[];
  radiationSites: BodySiteId[];
  radiationDetails?: BodySiteDetailId[];
  intensity: number;
  localSymptoms?: LocalSymptomId[];
  associatedPainIds?: string[];
  painTypes: string[];
  emotion: string;
  foods: string[];
  foodPeriod?: "today" | "last24h";
  medications?: MedicationUse[];
  weather?: WeatherSnapshot & { locality?: string };
  followUpNote?: string;
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
  medicationHistory: MedicationProfile[];
  customFoods: FoodProfile[];
  followUps: PainFollowUp[];
  deletedPainEntries: PainEntry[];
};

export const EMPTY_APP_DATA: AppData = {
  version: 2,
  healthEntries: [],
  weatherEntries: [],
  calendarEntries: [],
  painEntries: [],
  medicationHistory: [],
  customFoods: [],
  followUps: [],
  deletedPainEntries: [],
};

export function localSymptomLabel(id: string) {
  return LOCAL_SYMPTOMS.find((symptom) => symptom.id === id)?.label ?? id;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function bodySiteLabel(id: string) {
  return BODY_SITES.find((site) => site.id === id)?.label ?? bodySiteDetailLabelFallback(id);
}

function bodySiteDetailLabelFallback(id: string) {
  return BODY_SITE_DETAILS.find((site) => site.id === id)?.label ?? id;
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
