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
    const days = parseInt(searchParams.get('days') || '5');

    if (!WEATHER_API_KEY) {
      console.warn('Weather API key not configured, returning mock forecast data');
      return NextResponse.json(getMockForecastData(days));
    }

    let forecastUrl: string;

    if (lat && lon) {
      // Get forecast by coordinates
      forecastUrl = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&cnt=${days * 8}`; // 8 forecasts per day (3-hour intervals)
    } else if (city) {
      // Get forecast by city name
      forecastUrl = `${WEATHER_API_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&cnt=${days * 8}`;
    } else {
      // Default to London if no location provided
      forecastUrl = `${WEATHER_API_URL}/forecast?q=London&appid=${WEATHER_API_KEY}&units=metric&cnt=${days * 8}`;
    }

    console.log('Fetching weather forecast from:', forecastUrl);

    const response = await fetch(forecastUrl);
    
    if (!response.ok) {
      console.error('Weather forecast API error:', response.status, response.statusText);
      return NextResponse.json(getMockForecastData(days));
    }

    const data = await response.json();
    console.log('Weather forecast API response:', data);

    // Process forecast data to get daily forecasts
    const dailyForecasts = processForecastData(data.list, days);

    return NextResponse.json({
      location: `${data.city.name}, ${data.city.country}`,
      forecasts: dailyForecasts
    });

  } catch (error) {
    console.error('Weather forecast API error:', error);
    return NextResponse.json(getMockForecastData(5));
  }
}

function processForecastData(forecastList: any[], days: number) {
  const dailyData: { [key: string]: any[] } = {};
  
  // Group forecasts by date
  forecastList.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString('en-GB');
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(forecast);
  });

  // Process each day to get min/max temp and dominant condition
  const forecasts = Object.entries(dailyData)
    .slice(0, days)
    .map(([date, dayForecasts]) => {
      const temps = dayForecasts.map(f => f.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      
      // Get the most common weather condition
      const conditions = dayForecasts.map(f => f.weather[0].main);
      const condition = getMostCommon(conditions);
      
      // Get the day name
      const dayName = new Date(date).toLocaleDateString('en-GB', { weekday: 'short' });
      
      return {
        day: dayName,
        date: date,
        high: maxTemp,
        low: minTemp,
        condition: condition,
        description: getMostCommon(dayForecasts.map(f => f.weather[0].description)),
        humidity: Math.round(dayForecasts.reduce((sum, f) => sum + f.main.humidity, 0) / dayForecasts.length),
        windSpeed: Math.round(dayForecasts.reduce((sum, f) => sum + f.wind.speed, 0) / dayForecasts.length * 3.6)
      };
    });

  return forecasts;
}

function getMostCommon(arr: string[]) {
  const counts = arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts).reduce((a, b) => counts[a[0] as string] > counts[b[0]] ? a : b)[0];
}

function getMockForecastData(days: number) {
  const mockDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'];
  
  return {
    location: "London, UK",
    forecasts: mockDays.slice(0, days).map((day, index) => ({
      day: day,
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
      high: Math.floor(Math.random() * 10) + 15, // 15-25°C
      low: Math.floor(Math.random() * 8) + 8,   // 8-16°C
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      description: 'mock weather description',
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 20) + 5   // 5-25 km/h
    }))
  };
}
