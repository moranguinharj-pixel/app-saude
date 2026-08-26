export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
};

type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
};

export async function getCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Não foi possível consultar o clima neste momento.");
  }

  const payload = (await response.json()) as OpenMeteoResponse;
  if (!payload.current) {
    throw new Error("A resposta meteorológica não contém as condições atuais.");
  }

  return {
    temperature: payload.current.temperature_2m,
    apparentTemperature: payload.current.apparent_temperature,
    humidity: payload.current.relative_humidity_2m,
    windSpeed: payload.current.wind_speed_10m,
    weatherCode: payload.current.weather_code,
    isDay: payload.current.is_day === 1,
  };
}

export function weatherDescription(code: number) {
  const labels: Record<number, string> = {
    0: "Céu limpo",
    1: "Predominantemente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina com geada",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa intensa",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Pancadas leves",
    81: "Pancadas moderadas",
    82: "Pancadas fortes",
    95: "Trovoada",
    96: "Trovoada com granizo leve",
    99: "Trovoada com granizo forte",
  };

  return labels[code] ?? "Condição indisponível";
}
