import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Gamepad2, ArrowLeft, RefreshCcw, Star, Search, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';

const GameCenterApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  const [displayCount, setDisplayCount] = useState(12);
  const loaderRef = useRef(null);

  const fetchSteamData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_STEAM_API_KEY;
      const steamId = import.meta.env.VITE_STEAM_ID;

      if (!apiKey || !steamId) {
        throw new Error("Steam API configuration missing in environment.");
      }

      // Using the proxy configured in vite.config.js
      const response = await fetch(
        `/api/steam/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`
      );

      if (!response.ok) {
        throw new Error(`Steam API Proxy Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      
      if (json.response && json.response.games) {
        const processed = json.response.games.map(game => ({
          id: game.appid,
          title: game.name,
          playtime: `${Math.round(game.playtime_forever / 60)}h`,
          coverImage: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
          achievementPercent: 0 // Achievement data requires a separate call per game, usually handled by a backend
        }));

        // Sort by title for now
        processed.sort((a, b) => a.title.localeCompare(b.title));
        setData(processed);
      } else {
        throw new Error("Malformed Steam API response or no games found.");
      }
    } catch (err) {
      console.error('API Fetch Error:', err);
      setError(err.message || "Failed to sync with Steam.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSteamData();
  }, [fetchSteamData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prev => prev + 12);
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, displayCount);
  }, [filteredData, displayCount]);

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Game Center</h1>
            <p className="text-[9px] text-emerald-500 uppercase tracking-[0.4em] font-bold mt-1">Direct Link // Engine Active</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-48 transition-all"
            />
          </div>
          <button onClick={fetchSteamData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-emerald-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 text-red-400 max-w-2xl mx-auto">
              <AlertCircle size={24} />
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest">Network Outage</p>
                <p className="text-[10px] opacity-80">{error}</p>
              </div>
              <button onClick={fetchSteamData} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all">Reconnect</button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 animate-elegant">
            {visibleData.map((item, idx) => (
              <div key={idx} className="group relative bg-black/40 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                <div className="aspect-video relative overflow-hidden bg-gray-900">
                  <LazyImage
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400">Library Entry</span>
                    <h3 className="text-xs font-black text-white leading-tight line-clamp-2 uppercase italic">{item.title}</h3>
                  </div>
                </div>
                <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Runtime</span>
                    <span className="text-[10px] text-emerald-500 font-bold">{item.playtime}</span>
                  </div>
                  <ExternalLink size={12} className="text-gray-700 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <div ref={loaderRef} className="h-20 flex items-center justify-center">
            {visibleData.length < filteredData.length && <RefreshCcw className="animate-spin text-gray-800" size={24} />}
          </div>
        </div>
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/40 sticky bottom-0 z-50">
        <span className="text-[8px] font-mono uppercase tracking-widest">Steam_Core: AugustElliott</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-emerald-500" />
          <div className="w-1 h-1 bg-emerald-500 animate-pulse" />
        </div>
      </footer>
    </div>
  );
};

export default GameCenterApp;
