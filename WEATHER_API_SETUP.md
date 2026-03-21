# Weather API Setup Guide

## OpenWeatherMap API Integration

The CoreGuard SMS system now includes a comprehensive weather API system that displays real-time weather data and forecasts on the dashboard.

### 🌤️ Features

- **Current Weather**: Temperature, humidity, wind speed, pressure, visibility
- **5-Day Forecast**: Daily high/low temperatures and conditions
- **GPS Location**: Automatic location detection with fallback to London, UK
- **City Lookup**: Support for city name weather lookup
- **Coordinate Lookup**: Support for latitude/longitude weather lookup
- **Error Handling**: Graceful fallback to mock data if API is unavailable

### 🔧 Setup Instructions

#### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

#### 2. Configure Environment Variables

Add your API key to your `.env.local` file:

```bash
# Option 1: Preferred (server-side only)
OPENWEATHER_API_KEY=your_actual_api_key_here

# Option 2: Client-side (less secure)
NEXT_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
```

#### 3. Restart Your Application

```bash
npm run dev
# or
npm run build && npm start
```

### 🌐 API Endpoints

#### Current Weather
```
GET /api/weather?lat={latitude}&lon={longitude}
GET /api/weather?city={city_name}
```

#### Weather Forecast
```
GET /api/weather/forecast?lat={latitude}&lon={longitude}&days={1-16}
GET /api/weather/forecast?city={city_name}&days={1-16}
```

### 📊 Response Format

#### Current Weather Response
```json
{
  "location": "London, GB",
  "temperature": 18,
  "condition": "Clouds",
  "description": "partly cloudy",
  "humidity": 65,
  "windSpeed": 12,
  "pressure": 1013,
  "visibility": 10,
  "feelsLike": 17,
  "sunrise": "06:30",
  "sunset": "19:45",
  "time": "14:20",
  "coordinates": {
    "lat": 51.5074,
    "lon": -0.1278
  }
}
```

#### Forecast Response
```json
{
  "location": "London, GB",
  "forecasts": [
    {
      "day": "Mon",
      "date": "21/03/2026",
      "high": 20,
      "low": 12,
      "condition": "Clear",
      "description": "clear sky",
      "humidity": 60,
      "windSpeed": 10
    }
  ]
}
```

### 🎮 Usage Examples

#### Frontend Component Usage
```typescript
// Fetch weather by coordinates
const response = await fetch('/api/weather?lat=51.5074&lon=-0.1278');
const weather = await response.json();

// Fetch weather by city
const response = await fetch('/api/weather?city=London');
const weather = await response.json();

// Fetch forecast
const response = await fetch('/api/weather/forecast?city=London&days=5');
const forecast = await response.json();
```

### 🛡️ Security Notes

- **Server-side API key** (`OPENWEATHER_API_KEY`) is recommended for production
- **Client-side API key** (`NEXT_PUBLIC_WEATHER_API_KEY`) works but is less secure
- The API automatically falls back to mock data if no key is configured
- Rate limits apply: 1000 calls/day for free OpenWeatherMap plan

### 🚨 Troubleshooting

#### Weather Not Loading
1. Check if API key is set in environment variables
2. Verify API key is valid and active
3. Check browser console for error messages
4. Ensure network connectivity to OpenWeatherMap

#### Location Issues
1. Enable location permissions in your browser
2. Check if GPS is available on your device
3. System falls back to London, UK if location is unavailable

#### API Errors
1. Check OpenWeatherMap API status
2. Verify your API key hasn't expired
3. Monitor rate limits (1000 calls/day free tier)

### 🔄 Mock Data Fallback

When the API key is not configured or API calls fail, the system automatically uses realistic mock data for London, UK, ensuring the weather widget always displays properly.

### 📱 Mobile Considerations

- Geolocation works on mobile devices with GPS
- Weather widget is responsive and mobile-friendly
- Location permission may be required on first visit
- Fallback to London ensures functionality even without location access

### 🌍 Supported Locations

- **GPS Coordinates**: Automatic detection based on user location
- **City Names**: Any worldwide city (e.g., "London", "New York", "Tokyo")
- **Coordinates**: Manual latitude/longitude specification
- **Default**: London, UK as fallback location

The weather system is now fully integrated and ready to use! 🌤️
