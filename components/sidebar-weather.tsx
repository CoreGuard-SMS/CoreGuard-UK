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

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        return <CloudRain className="w-8 h-8" />;
      case 'clear':
      case 'sunny':
        return isNight ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />;
      default:
        return <Cloud className="w-8 h-8" />;
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
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName} ${day} ${month}`;
  };

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="animate-pulse">
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .body-wrapper {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #3a3897 0%, #2c2a72 40%, #1a1a4e 100%);
        }

        .weather-widget::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
          animation: shimmer 15s infinite linear;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .weather-icon-main {
          filter: drop-shadow(0 0 12px rgba(220, 220, 255, 0.5));
          animation: floating 3.5s ease-in-out infinite;
        }

        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        #cloud-container {
          pointer-events: auto;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInScaleUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInScaleUp {
          opacity: 0;
          animation: fadeInScaleUp 0.7s ease-out forwards;
        }

        @keyframes gentleBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-gentleBob {
          animation: gentleBob 2.5s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 0.1s !important; }
        .delay-200 { animation-delay: 0.2s !important; }
        .delay-300 { animation-delay: 0.3s !important; }
        .delay-400 { animation-delay: 0.4s !important; }
        .delay-500 { animation-delay: 0.5s !important; }
        .delay-600 { animation-delay: 0.6s !important; }
        .delay-700 { animation-delay: 0.7s !important; }
      `}</style>

      <div className="px-3 py-2">
        <div className="weather-widget body-wrapper relative rounded-lg p-3 w-full max-w-xs overflow-hidden">
          <div className="relative z-10">
            <div className="text-white text-sm font-bold animate-fadeInUp">
              {weather.location}
            </div>
            <div className="text-white/70 text-xs animate-fadeInUp delay-100">
              {formatDate(currentTime)}
            </div>
            
            <div className="mt-2 flex items-center justify-center">
              <div className="weather-icon-main text-white/90 animate-gentleBob">
                {weather.icon}
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-2">
              <div className="text-white text-2xl font-bold animate-fadeInScaleUp delay-200">
                {weather.temperature}°
              </div>
              <div className="flex flex-col items-center ml-3 animate-fadeInScaleUp delay-300">
                <div className="text-white text-xs">
                  {weather.condition}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-white/70 text-xs">↑</span>
                  <span className="text-white/70 text-xs">
                    {weather.high}°
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white/70 text-xs">↓</span>
                  <span className="text-white/70 text-xs">
                    {weather.low}°
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3 animate-fadeInScaleUp delay-400">
              <div className="text-center">
                <div className="text-white/80 text-xs font-medium">
                  Wind
                </div>
                <div className="text-white/60 text-xs">
                  {weather.wind}k/h
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/80 text-xs font-medium">
                  Humidity
                </div>
                <div className="text-white/60 text-xs">
                  {weather.humidity}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/80 text-xs font-medium">
                  Visibility
                </div>
                <div className="text-white/60 text-xs">
                  {weather.visibility}km
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
