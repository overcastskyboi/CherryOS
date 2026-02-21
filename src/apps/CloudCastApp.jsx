import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CloudRain, Sun, Cloud as CloudIcon, Thermometer, MapPin, Wind, Droplet, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CloudCastApp = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = useCallback(async () => {
    if (!WEATHER_API_KEY) {
      setError('Weather API key not configured. Please set VITE_WEATHER_API_KEY in .env');
      return;
    }
    if (!location) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`Location not found or API error: ${response.statusText}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, [location, WEATHER_API_KEY]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <Sun size={24} />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <CloudIcon size={24} />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudRain size={24} />;
      default:
        return <CloudIcon size={24} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-blue-900 text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-blue-950 border-b border-blue-800 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-blue-800 rounded text-blue-300">
            <ArrowLeft size={20} />
          </button>
          <CloudIcon size={20} className="text-blue-400" />
          <span className="text-sm font-bold">CloudCast</span>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); fetchWeather(); }} className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city..."
            className="bg-blue-800 text-white text-xs p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
          />
          <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Fetch
          </button>
        </form>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col items-center justify-center">
        {loading && <p className="text-blue-300 animate-pulse">Fetching weather...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {weatherData && !loading && !error && (
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-4xl font-bold flex items-center gap-2">
              <MapPin size={32} /> {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div className="flex items-center gap-4 text-6xl font-extrabold">
              {getWeatherIcon(weatherData.weather[0].icon)}
              <span>{Math.round(weatherData.main.temp)}°C</span>
            </div>
            <p className="text-xl capitalize">{weatherData.weather[0].description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div className="flex items-center gap-2">
                <Thermometer size={16} /> Feels like: {Math.round(weatherData.main.feels_like)}°C
              </div>
              <div className="flex items-center gap-2">
                <Wind size={16} /> Wind: {weatherData.wind.speed} m/s
              </div>
              <div className="flex items-center gap-2">
                <Droplet size={16} /> Humidity: {weatherData.main.humidity}%
              </div>
              <div className="flex items-center gap-2">
                <Gauge size={16} /> Pressure: {weatherData.main.pressure} hPa
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudCastApp;
