
import { NextRequest, NextResponse } from "next/server";

// Типы
interface WeatherData {
  name: string;
  country: string;
  temp: number;
  humidity: number;
  feels_like: number;
  pressure: number;
  description: string;
  icon: string;
  wind_speed: number;
  sunrise: string; // Формат: "HH:mm"
  sunset: string;  // Формат: "HH:mm"
}

// Простое кэширование в памяти
const cache: Record<string, { data: unknown; timestamp: number }> = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    console.log("API /weather received query:", query);

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      console.log("Invalid query, returning 'Specify city...'");
      return NextResponse.json({ specificAnswer: "Specify city..." }, { status: 400 });
    }

    const city = query.trim();
    const cacheKey = `current_${city.toLowerCase()}`;

    // Проверка кэша (10 минут)
    if (
      cache[cacheKey] &&
      Date.now() - cache[cacheKey].timestamp < 10 * 60 * 1000
    ) {
      console.log("Returning cached data for:", cacheKey);
      return NextResponse.json(cache[cacheKey].data);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error("Weather API key is missing");
      return NextResponse.json({ error: "Weather API key is missing" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      console.log("OpenWeatherMap error, status:", response.status);
      return NextResponse.json({ specificAnswer: "Specify city..." }, { status: 400 });
    }

    const data = await response.json();

    // Преобразование sunrise и sunset в локальное время (HH:mm)
    const formatTime = (unixTimestamp: number, timezoneOffset: number): string => {
      const date = new Date((unixTimestamp + timezoneOffset) * 1000);
      return date.toUTCString().slice(-12, -7); // Извлекает "HH:mm"
    };

    const weatherData: WeatherData = {
      name: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      humidity: data.main.humidity,
      feels_like: data.main.feels_like,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      sunrise: formatTime(data.sys.sunrise, data.timezone),
      sunset: formatTime(data.sys.sunset, data.timezone),
    };

    const result = { weatherData };
    cache[cacheKey] = { data: result, timestamp: Date.now() };
    console.log("Returning weather data for:", city);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ specificAnswer: "Specify city..." }, { status: 500 });
  }
}

