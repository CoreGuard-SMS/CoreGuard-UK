"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, Moon, CloudRain, Wind, Droplets, Eye } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  wind: number;
  humidity: number;
  visibility: number;
  icon: React.ReactNode;
}

export default function SidebarWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDaytime, setIsDaytime] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if it's daytime
  useEffect(() => {
    const hour = currentTime.getHours();
    setIsDaytime(hour >= 6 && hour < 18);
  }, [currentTime]);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Get user's location or default to Sydney
      if (!navigator.geolocation) {
        setWeather(getMockWeatherData());
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Fetch weather data from our API
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data) {
            setWeather({
              location: data.location || "Sydney",
              temperature: data.temperature || 24,
              condition: data.condition || "Cloudy",
              high: data.high || 28,
              low: data.low || 20,
              wind: data.wind || 9,
              humidity: data.humidity || 68,
              visibility: data.visibility || 10,
              icon: getWeatherIcon(data.condition || "Cloudy")
            });
          } else {
            setWeather(getMockWeatherData());
          }
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeather(getMockWeatherData());
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeather(getMockWeatherData());
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const hour = currentTime.getHours();
    const isNight = hour < 6 || hour >= 18;
    
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-32 h-32" />;
      case 'clear':
      case 'sunny':
        return isNight ? <Moon className="w-32 h-32" /> : <Sun className="w-32 h-32" />;
      default:
        return <Cloud className="w-32 h-32" />;
    }
  };

  const getMockWeatherData = (): WeatherData => ({
    location: "Sydney",
    temperature: 24,
    condition: "Cloudy",
    high: 28,
    low: 20,
    wind: 9,
    humidity: 68,
    visibility: 10,
    icon: getWeatherIcon("Cloudy")
  });

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="px-3 py-2">
      <div className={`flex flex-col ${isDaytime ? 'bg-white' : 'bg-gray-900'} rounded p-4 w-full max-w-xs transition-colors duration-1000`}>
        <div className={`font-bold text-xl ${isDaytime ? 'text-gray-900' : 'text-white'}`}>
          {weather.location}
        </div>
        <div className={`text-sm ${isDaytime ? 'text-gray-500' : 'text-gray-400'}`}>
          {formatDate(currentTime)}
        </div>
        
        <div className={`mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg ${isDaytime ? 'text-indigo-400' : 'text-indigo-300'} h-24 w-24 transition-colors duration-1000`}>
          {weather.icon}
        </div>
        
        <div className="flex flex-row items-center justify-center mt-6">
          <div className={`font-medium text-6xl ${isDaytime ? 'text-gray-900' : 'text-white'}`}>
            {weather.temperature}°
          </div>
          <div className="flex flex-col items-center ml-6">
            <div className={isDaytime ? 'text-gray-900' : 'text-white'}>
              {weather.condition}
            </div>
            <div className="mt-1">
              <span className="text-sm">
                {isDaytime ? '↑' : '↑'}
              </span>
              <span className={`text-sm font-light ${isDaytime ? 'text-gray-500' : 'text-gray-400'}`}>
                {weather.high}°C
              </span>
            </div>
            <div>
              <span className="text-sm">
                {isDaytime ? '↓' : '↓'}
              </span>
              <span className={`text-sm font-light ${isDaytime ? 'text-gray-500' : 'text-gray-400'}`}>
                {weather.low}°C
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row justify-between mt-6">
          <div className="flex flex-col items-center">
            <div className={`font-medium text-sm ${isDaytime ? 'text-gray-900' : 'text-white'}`}>
              Wind
            </div>
            <div className={`text-sm ${isDaytime ? 'text-gray-500' : 'text-gray-400'}`}>
              {weather.wind}k/h
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`font-medium text-sm ${isDaytime ? 'text-gray-900' : 'text-white'}`}>
              Humidity
            </div>
            <div className={`text-sm ${isDaytime ? 'text-gray-500' : 'text-gray-400'}`}>
              {weather.humidity}%
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`font-medium text-sm ${isDaytime ? 'text-gray-900' : 'text-white'}`}>
              Visibility
            </div>
            <div className={`text-sm ${isDaytime ? 'text-gray-500' : 'text-gray-400'}`}>
              {weather.visibility}km
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
