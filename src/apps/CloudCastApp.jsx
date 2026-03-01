import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, CloudRain, Sun, Cloud as CloudIcon, Thermometer, MapPin, Wind, Droplet, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PixelIcon } from '../components/PixelIcons';

import { useOS } from '../context/OSContext';

const CloudCastApp = () => {
  const navigate = useNavigate();
  const { setThemeColor } = useOS();

  useEffect(() => {
    setThemeColor('#3b82f6'); // Blue
  }, [setThemeColor]);
  const [location, setLocation] = useState('Indianapolis, IN');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const weatherSchema = z.object({
    weather: z.array(z.object({ description: z.string(), icon: z.string() })),
    main: z.object({
      temp: z.number(),
      feels_like: z.number(),
      humidity: z.number()
    }),
    wind: z.object({ speed: z.number() }),
    name: z.string(),
    sys: z.object({ country: z.string() })
  });

  const fetchWeather = useCallback(async () => {
    if (!WEATHER_API_KEY) {
      // Mock data for demo if no key
      setWeatherData({
        name: 'Indianapolis',
        sys: { country: 'US' },
        main: { temp: 22, feels_like: 21, humidity: 45 },
        weather: [{ description: 'Pixel Perfect Skies', icon: '01d' }],
        wind: { speed: 4.2 }
      });
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=imperial`);
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      setWeatherData(weatherSchema.parse(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [location, WEATHER_API_KEY]);

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] flex flex-col text-white font-sans relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* Header */}
      <div className="bg-black border-b-4 border-[#111] px-4 md:px-6 py-4 md:py-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/')}
            className="p-2 bg-[#111] border-2 border-[#333] text-indigo-400 hover:border-white transition-all shadow-[2px_2px_0_#000]"
          >
            <ArrowLeft size={isMobile ? 20 : 24} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic leading-none">CloudCast</h1>
            <p className="text-[8px] md:text-[10px] text-gray-600 uppercase tracking-[0.4em] font-bold mt-1 mobile-hide">SATELLITE_LINK // ACTIVE</p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-12 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-lg bg-[#111] border-4 border-white shadow-[8px_8px_0_#000] p-6 md:p-12 space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <MapPin size={12} />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{location}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none">
                {weatherData?.name || '---'}
              </h2>
            </div>
            <button 
              onClick={fetchWeather}
              className="p-2 bg-white text-black hover:bg-indigo-500 hover:text-white transition-all"
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {weatherData && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="p-4 md:p-6 bg-black border-2 border-[#333] text-white shrink-0">
                  <PixelIcon name="rain" size={isMobile ? 48 : 64} color="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-5xl md:text-6xl font-black tracking-tighter italic leading-none">
                    {Math.round(weatherData.main.temp)}°F
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {weatherData.weather[0].description}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-black/40 border-2 border-[#222] p-3 md:p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Thermometer size={10} />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Feels Like</span>
                  </div>
                  <span className="text-base md:text-lg font-black italic">{Math.round(weatherData.main.feels_like)}°F</span>
                </div>
                <div className="bg-black/40 border-2 border-[#222] p-3 md:p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Droplet size={10} />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Humidity</span>
                  </div>
                  <span className="text-base md:text-lg font-black italic">{weatherData.main.humidity}%</span>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
        </div>
      </main>

      {/* Footer Decor */}
      <div className="mt-auto px-6 py-4 flex justify-between items-center bg-black border-t-4 border-[#111]">
        <span className="text-[8px] font-mono text-gray-700 uppercase tracking-tighter">DATA_SOURCE: OPENWEATHER_API</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-indigo-500 animate-pulse" />
          <div className="w-1.5 h-1.5 bg-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default CloudCastApp;
