"use client";

import { useState, useEffect } from "react";
import { Cloud, MapPin } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  time: string;
}

export default function SidebarWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Get user's location or default to London
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
              location: data.location,
              temperature: data.temperature,
              condition: data.condition,
              time: data.time
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

  const getMockWeatherData = (): WeatherData => ({
    location: "London, UK",
    temperature: 18,
    condition: "Partly Cloudy",
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  });

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="animate-pulse">
          <div className="h-20 bg-muted rounded-lg"></div>
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
        * {
          padding: 0;
          margin: 0;
          color: #FFF;
        }

        .container {
          overflow: hidden;
          z-index: 10;
          position: relative;
          margin: 0 auto;
          height: 90px;
          width: 100%;
          background-color: #F17022;
          border-radius: 10px;
          box-shadow: 2px 2px 1px rgba(0,0,0,0.2);
        }

        /* BACKGROUND */
        .Circle1 {
          z-index: 100;
          position: absolute;
          height: 80px;
          width: 80px;
          right: -20px;
          top: -30px;
          border-radius: 50%;
          background-color: rgba(253,184,19,1);
          animation: enlarge;
          animation-duration: 5s;
          animation-iteration-count: infinite;
        }

        .Circle2 {
          z-index: 80;
          position: absolute;
          height: 150px;
          width: 150px;
          right: -50px;
          top: -70px;
          border-radius: 50%;
          background-color: rgba(246,140,31,0.7);
          animation: enlarge;
          animation-duration: 7s;
          animation-iteration-count: infinite;
        }

        .Circle3 {
          z-index: 50;
          position: absolute;
          height: 200px;
          width: 200px;
          right: -50px;
          top: -100px;
          border-radius: 50%;
          background-color: rgba(241,125,45,0.7);
          animation: enlarge;
          animation-duration: 10s;
          animation-iteration-count: infinite;
        }

        /* CONTENT */
        .sun {
          z-index: 1000;
          font-size: 15px !important;
        }

        .Condition {
          z-index: 1000;
          position: absolute;
          font-family: "Roboto", sans-serif;
          font-weight: 100;
          font-size: 20px;
          left: 20px;  
          top: 10px;
        }

        .Temp {
          z-index: 1000;
          position: absolute;
          font-family: "Roboto", sans-serif;
          font-size: 35px;
          font-weight: 400;
          left: 20px;
          bottom: 5px;
        }

        #F {
          z-index: 1000;
          font-family: "Roboto",sans-serif;
          font-weight: 100;
          font-size: 30px;
        }

        .Time {
          z-index: 1000;
          position: absolute;
          font-family: "Noto Sans", sans-serif;
          font-size: 18px;
          font-weight: 200;
          right: 20px;
          top: 10px;
        }

        .locationIcon {
          z-index: 1000;
          font-size: 10px !important;
        }

        .Location {
          z-index: 1000;
          position: absolute;
          font-family: "Noto Sans", sans-serif;
          font-size: 12px;
          font-weight: 200;
          right: 20px;
          bottom: 15px;
        }

        @keyframes enlarge {
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>

      <div className="px-3 py-2">
        <div className="container">
          {/* BACKGROUND CIRCLES */}
          <div className="Circle1"></div>
          <div className="Circle2"></div>
          <div className="Circle3"></div>

          {/* CONTENT */}
          <div className="sun">
            <Cloud className="text-white" />
          </div>
          
          <div className="Condition">{weather.condition}</div>
          
          <div className="Temp">
            {weather.temperature}
            <span id="F">°C</span>
          </div>
          
          <div className="Time">{weather.time}</div>
          
          <div className="locationIcon">
            <MapPin className="text-white" />
          </div>
          
          <div className="Location">{weather.location}</div>
        </div>
      </div>
    </>
  );
}
