import { NextRequest, NextResponse } from 'next/server';

// OpenWeatherMap API configuration
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');

    if (!WEATHER_API_KEY) {
      console.warn('Weather API key not configured, returning mock data');
      return NextResponse.json(getMockWeatherData());
    }

    let weatherUrl: string;

    if (lat && lon) {
      // Get weather by coordinates
      weatherUrl = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else if (city) {
      // Get weather by city name
      weatherUrl = `${WEATHER_API_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      // Default to London if no location provided
      weatherUrl = `${WEATHER_API_URL}/weather?q=London&appid=${WEATHER_API_KEY}&units=metric`;
    }

    console.log('Fetching weather from:', weatherUrl);

    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      console.error('Weather API error:', response.status, response.statusText);
      return NextResponse.json(getMockWeatherData());
    }

    const data = await response.json();
    console.log('Weather API response:', data);

    // Transform OpenWeatherMap data to our format
    const weatherData = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      feelsLike: Math.round(data.main.feels_like),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      }
    };

    return NextResponse.json(weatherData);

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(getMockWeatherData());
  }
}

function getMockWeatherData() {
  return {
    location: "London, UK",
    temperature: 18,
    condition: "Partly Cloudy",
    description: "partly cloudy",
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    feelsLike: 17,
    sunrise: "06:30",
    sunset: "19:45",
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    coordinates: {
      lat: 51.5074,
      lon: -0.1278
    }
  };
}
