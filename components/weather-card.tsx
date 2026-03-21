"use client";

import { useState, useEffect } from "react";
import { MapPin, Cloud, Thermometer, Wind, Droplets } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  time: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Get user's location
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported");
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Fetch weather data (using OpenWeatherMap API as example)
          const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
          if (!apiKey) {
            // Fallback to mock data for UK
            setWeather(getMockUKWeatherData());
            setLoading(false);
            return;
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }

          const data = await response.json();
          
          // Transform API data to our format
          const weatherData: WeatherData = {
            location: data.name || "Unknown Location",
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            forecast: [] // Would need separate API call for forecast
          };

          setWeather(weatherData);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to UK mock data
          setWeather(getMockUKWeatherData());
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Weather fetch error:", error);
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  const getMockUKWeatherData = (): WeatherData => ({
    location: "London, UK",
    temperature: 18,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    forecast: [
      { day: "Mon", high: 20, low: 12, condition: "Sunny" },
      { day: "Tue", high: 18, low: 10, condition: "Cloudy" },
      { day: "Wed", high: 16, low: 8, condition: "Rainy" },
      { day: "Thu", high: 19, low: 11, condition: "Partly Cloudy" },
      { day: "Fri", high: 21, low: 13, condition: "Sunny" }
    ]
  });

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-full bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="card">
        <div className="content-section">
          <p className="text-red-500 text-sm">Weather unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* From Uiverse.io by KSAplay */
        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 220px;
          height: 350px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.1);
          background-color: white;
        }

        /* Landscape section */
        .landscape-section {
          position: relative;
          width: 100%;
          height: 70%;
          overflow: hidden;
        }

        .landscape-section * {
          position: absolute;
        }

        .sky {
          width: 100%;
          height: 100%;
          background: rgb(247, 225, 87);
          background: linear-gradient(
            0deg,
            rgba(247, 225, 87, 1) 0%,
            rgba(233, 101, 148, 1) 100%
          );
        }

        .sun {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: white;
          bottom: 40%;
          left: 23%;
          filter: drop-shadow(0px 0px 10px white);
        }

        .sun::after {
          position: absolute;
          content: "";
          width: 118%;
          height: 118%;
          border-radius: 50%;
          background-color: white;
          opacity: 0.5;
        }

        .sun::before {
          position: absolute;
          content: "";
          width: 134%;
          height: 134%;
          border-radius: 50%;
          background-color: white;
          opacity: 0.1;
        }

        .ocean {
          overflow: hidden;
          bottom: 0;
          width: 100%;
          height: 28%;
          background: rgb(241, 192, 125);
          background: linear-gradient(
            0deg,
            rgba(241, 192, 125, 1) 0%,
            rgba(247, 218, 150, 1) 100%
          );
        }

        .reflection {
          position: absolute;
          background-color: white;
          opacity: 0.5;
          z-index: 1;
        }

        .reflection:nth-child(1) {
          width: 40px;
          height: 10px;
          clip-path: polygon(0% 0%, 100% 0%, 50% 20%);
          top: 5%;
          left: 32%;
        }

        .reflection:nth-child(2) {
          width: 80px;
          height: 15px;
          clip-path: polygon(0% 0%, 100% 0%, 60% 20%, 40% 20%);
          top: 15%;
          left: 39%;
        }

        .reflection:nth-child(3) {
          width: 60px;
          height: 2px;
          clip-path: polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%);
          top: 27%;
          right: 15%;
        }

        .reflection:nth-child(4) {
          width: 70px;
          height: 2px;
          clip-path: polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%);
          top: 37%;
          right: 28%;
        }

        .reflection:nth-child(5) {
          width: 70px;
          height: 3px;
          clip-path: polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%);
          top: 46%;
          right: 8%;
        }

        .hill-1 {
          right: -25%;
          bottom: 20%;
          width: 150px;
          height: 40px;
          border-radius: 50%;
          background-color: #e6b29d;
        }

        .shadow-hill-1 {
          right: -25%;
          top: -30%;
          width: 150px;
          height: 40px;
          border-radius: 50%;
          background-color: #f1c7a0;
          opacity: 1;
        }

        .hill-2 {
          right: -36%;
          bottom: 10%;
          width: 150px;
          height: 80px;
          border-radius: 50%;
          background-color: #c29182;
        }

        .shadow-hill-2 {
          right: -36%;
          top: -65%;
          width: 150px;
          height: 80px;
          border-radius: 50%;
          background-color: #e5bb96;
          opacity: 1;
        }

        .hill-3 {
          left: -100%;
          bottom: -28%;
          width: 350px;
          height: 150px;
          border-radius: 50%;
          background-color: #b77873;
          z-index: 3;
        }

        .tree-1 {
          bottom: 20%;
          left: 3%;
          width: 50px;
          height: 70px;
          z-index: 3;
        }

        .tree-2 {
          bottom: 14%;
          left: 25%;
          width: 50px;
          height: 70px;
          z-index: 3;
        }

        .hill-4 {
          right: -100%;
          bottom: -40%;
          width: 350px;
          height: 150px;
          border-radius: 50%;
          background-color: #a16773;
          z-index: 3;
        }

        .tree-3 {
          bottom: 10%;
          right: 1%;
          width: 65px;
          height: 80px;
          z-index: 3;
        }

        .filter {
          height: 100%;
          width: 100%;
          background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0) 40%
          );
          z-index: 5;
          opacity: 0.2;
        }

        /* Content section */
        .content-section {
          width: 100%;
          height: 30%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .weather-info {
          display: flex;
          align-items: center;
          justify-content: space-around;
          position: absolute;
          text-align: center;
          top: 0;
          right: 0%;
          width: 100%;
          padding-top: 15px;
          color: white;
          z-index: 10;
        }

        .weather-info .left-side:not(.icon) {
          width: 20%;
          font-size: 11pt;
          font-weight: 600;
          align-self: baseline;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon svg {
          width: 40px;
        }

        .weather-info .right-side {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .weather-info .right-side p:nth-child(2) {
          font-size: 9pt;
          margin: 0;
          padding: 0;
        }

        .weather-info .location span {
          font-size: 11pt;
          font-weight: 700;
          text-transform: uppercase;
        }

        .location {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .location svg {
          width: 14px;
          height: auto;
        }

        .temperature {
          font-size: 20pt;
          font-weight: 700;
          line-height: 30px;
        }

        .forecast {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          height: 100%;
          width: 100%;
          padding: 10px 25px;
        }

        .forecast > div {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: lightslategray;
          font-size: 9pt;
        }

        .separator {
          width: 100%;
          height: 2px;
          background-color: rgb(233, 233, 233);
          border-radius: 1px;
        }
      `}</style>

      <div className="card">
        <div className="landscape-section">
          <div className="sky"></div>
          <div className="sun"></div>
          <div className="ocean">
            <div className="reflection"></div>
            <div className="reflection"></div>
            <div className="reflection"></div>
            <div className="reflection"></div>
            <div className="reflection"></div>
          </div>
          <div className="hill-1"></div>
          <div className="shadow-hill-1"></div>
          <div className="hill-2"></div>
          <div className="shadow-hill-2"></div>
          <div className="hill-3"></div>
          <div className="tree-1">
            <svg viewBox="0 0 50 70" fill="none">
              <rect x="20" y="40" width="10" height="30" fill="#8B4513"/>
              <circle cx="25" cy="25" r="20" fill="#228B22"/>
              <circle cx="25" cy="15" r="15" fill="#32CD32"/>
            </svg>
          </div>
          <div className="tree-2">
            <svg viewBox="0 0 50 70" fill="none">
              <rect x="20" y="40" width="10" height="30" fill="#8B4513"/>
              <circle cx="25" cy="25" r="20" fill="#228B22"/>
              <circle cx="25" cy="15" r="15" fill="#32CD32"/>
            </svg>
          </div>
          <div className="hill-4"></div>
          <div className="tree-3">
            <svg viewBox="0 0 65 80" fill="none">
              <rect x="27" y="50" width="11" height="30" fill="#8B4513"/>
              <circle cx="32" cy="30" r="25" fill="#228B22"/>
              <circle cx="32" cy="18" r="18" fill="#32CD32"/>
            </svg>
          </div>
          <div className="filter"></div>
          
          <div className="weather-info">
            <div className="left-side">
              <div className="icon">
                <Cloud className="text-white" />
              </div>
            </div>
            <div className="right-side">
              <div className="location">
                <MapPin className="mr-1" />
                <span>{weather.location}</span>
              </div>
              <p>{weather.time}</p>
              <div className="temperature">{weather.temperature}°C</div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="forecast">
            <div>
              <span>Today</span>
              <span>{weather.condition}</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="separator"></div>
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index}>
                <span>{day.day}</span>
                <span>{day.condition}</span>
                <span>{day.low}° - {day.high}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
