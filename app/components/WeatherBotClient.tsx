"use client";

import { useState, useCallback, ReactElement } from "react";
import {
  FaSun,
  FaCloud,
  FaCloudSun,
  FaCloudRain,
  FaSnowflake,
  FaWind,
  FaTint,
  FaTemperatureLow,
  FaArrowAltCircleDown,
  FaRegSun,

} from "react-icons/fa";

type WeatherIconKey = "01d" | "02d" | "03d" | "04d" | "09d" | "13d" | "default";

interface WeatherData {
  name: string;
  country: string;
  temp: number;
  humidity: number;
  feels_like: number;
  pressure: number;
  description: string;
  icon: WeatherIconKey;
  wind_speed: number;
  sunrise: string;
  sunset: string;
}

const weatherIcons: Record<WeatherIconKey, ReactElement> = {
  "01d": <FaSun className="text-yellow-400 text-4xl" />,
  "02d": <FaCloudSun className="text-gray-400 text-4xl" />,
  "03d": <FaCloud className="text-gray-500 text-4xl" />,
  "04d": <FaCloud className="text-gray-600 text-4xl" />,
  "09d": <FaCloudRain className="text-blue-400 text-4xl" />,
  "13d": <FaSnowflake className="text-blue-200 text-4xl" />,
  default: <FaSun className="text-yellow-400 text-4xl" />,
};

export default function WeatherBotClient() {
  const [inputText, setInputText] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [specificAnswer, setSpecificAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchWeatherData = useCallback(async (query: string) => {
    if (!query.trim()) {
      console.log("Empty query, setting 'Specify city...'");
      setSpecificAnswer("Specify city...");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setSpecificAnswer("");
    setWeatherData(null);
    setRetryCount(0);

    try {
      console.log("Sending API request with query:", query);
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);

      if (data.error) {
        console.log("API returned error:", data.error);
        setError(data.error);
      } else if (data.specificAnswer) {
        console.log("Setting specificAnswer:", data.specificAnswer);
        setSpecificAnswer(data.specificAnswer);
      } else if (data.weatherData) {
        console.log("Setting weatherData:", data.weatherData);
        setWeatherData(data.weatherData);
      } else {
        console.log("Unexpected API response, setting 'Specify city...'");
        setSpecificAnswer("Specify city...");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("timeout")) {
        setError("Failed to connect to the weather server. Please check your internet connection.");
      } else {
        setSpecificAnswer("Specify city...");
      }

      if (
        retryCount < 2 &&
        (errorMessage.includes("Failed to fetch") || errorMessage.includes("timeout"))
      ) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        setTimeout(() => {
          fetchWeatherData(query);
        }, 1500);
        return;
      }
    } finally {
      setIsLoading(false);
      console.log("Current state - weatherData:", weatherData, "specificAnswer:", specificAnswer);
    }
  }, [retryCount, weatherData, specificAnswer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendClick = () => {
    if (inputText.trim()) {
      console.log("Sending text input:", inputText);
      fetchWeatherData(inputText);
      setInputText("");
    } else {
      console.log("Empty text input, setting 'Specify city...'");
      setSpecificAnswer("Specify city...");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim() && !isLoading) {
      console.log("Sending text input on Enter:", inputText);
      fetchWeatherData(inputText);
      setInputText("");
    } else if (e.key === "Enter" && !inputText.trim()) {
      console.log("Empty text input on Enter, setting 'Specify city...'");
      setSpecificAnswer("Specify city...");
    }
  };

  const getWeatherIcon = (icon: string): ReactElement => {
    return weatherIcons[icon as WeatherIconKey] || weatherIcons["default"];
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="form-input flex-1 mr-2 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md"
          placeholder="Specify city..."
        />
        <button
          onClick={handleSendClick}
          className={`form-button text-sm px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={isLoading}
        >
          Send
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
          {retryCount > 0 && (
            <div className="mt-2 text-xs">
              Automatic retry {retryCount}/2
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-lg animate-fade-in">
          {retryCount > 0
            ? `Retrying (${retryCount}/2)... Please wait.`
            : "Loading weather data..."}
        </div>
      )}

      {specificAnswer && !isLoading && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg animate-fade-in">
          <p className="text-sm italic text-gray-900 dark:text-gray-300">
            {specificAnswer}
          </p>
        </div>
      )}

      {weatherData && !isLoading && !specificAnswer && (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg animate-fade-in relative overflow-hidden">
          <div className="absolute top-2 right-2 animate-cloud opacity-50">
            <FaCloud className="text-gray-300 text-3xl" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base text-gray-900 dark:text-indigo-400">
                {weatherData.name}, {weatherData.country}
              </h4>
              <p className="special-word text-xl">
                {Math.round(weatherData.temp)}°C
              </p>
              <p className="text-sm capitalize text-gray-900 dark:text-gray-300">
                {weatherData.description}
              </p>
            </div>
            <div className="animate-cloud">
              {getWeatherIcon(weatherData.icon)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-900 dark:text-gray-300">
            <div className="flex items-center">
              <FaTint className="mr-2 text-blue-400" />
              <span>Humidity: {weatherData.humidity}%</span>
            </div>
            <div className="flex items-center">
              <FaWind className="mr-2 text-gray-400" />
              <span>Wind: {weatherData.wind_speed} m/s</span>
            </div>
            <div className="flex items-center">
              <FaTemperatureLow className="mr-2 text-red-400" />
              <span>Feels like: {Math.round(weatherData.feels_like)}°C</span>
            </div>
            <div className="flex items-center">
              <FaArrowAltCircleDown className="mr-2 text-gray-500" />
              <span>Pressure: {weatherData.pressure} hPa</span>
            </div>
            <div className="flex items-center">
              <FaRegSun className="mr-2 text-yellow-400" />
              <span>Sunrise: {weatherData.sunrise}</span>
            </div>
            <div className="flex items-center">
              <FaCloudSun className="mr-2 text-orange-400" />
              <span>Sunset: {weatherData.sunset}</span>
            </div>
          </div>
        </div>
      )}

      {weatherData && !isLoading && !specificAnswer && (
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg animate-fade-in">
          <p className="text-sm italic text-gray-900 dark:text-gray-300">
            {`Current weather in ${weatherData.name}: ${Math.round(
              weatherData.temp
            )}°C, ${weatherData.description}. Humidity ${
              weatherData.humidity
            }%, wind ${weatherData.wind_speed} m/s. Sunrise at ${
              weatherData.sunrise
            }, sunset at ${weatherData.sunset}. Need more info?`}
          </p>
        </div>
      )}
    </>
  );
}