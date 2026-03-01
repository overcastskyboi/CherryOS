import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Gamepad2, ArrowLeft, RefreshCcw, Star, AlertCircle, Search, Trophy, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { GAMING_DATA } from '../data/constants';

const ErrorState = ({ message, onRetry }) => (
  <div className="h-full flex flex-col items-center justify-center text-red-500 space-y-4">
    <img src="assets/images/cloud_mascot.png" alt="Cloud Mascot" className="w-24 h-24 mb-4" />
    <AlertCircle size={48} />
    <div className="text-center">
      <h2 className="text-xl font-bold uppercase tracking-widest">Connection Error</h2>
      <p className="text-sm text-red-400/60 font-mono mt-2">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
    >
      <RefreshCcw size={14} /> Retry Connection
    </button>
  </div>
);

const GameCenterApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(GAMING_DATA.collection);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Steam Level', value: GAMING_DATA.steam.level, icon: <Gamepad2 size={16} /> },
    { label: 'HC Points', value: GAMING_DATA.retro.hardcorePoints, icon: <Trophy size={16} /> },
    { label: 'Library Size', value: GAMING_DATA.steam.gamesCount, icon: <Monitor size={16} /> },
  ];

  const fetchData = useCallback(async () => {
    const PROXY_URL = import.meta.env.VITE_PROXY_URL;
    if (!PROXY_URL) return;

    setLoading(true);
    setError(null);

    try {
      const steamId = GAMING_DATA.steam.steamId;
      // Fetch from both Steam and RetroAchievements
      const [steamRes, raRes] = await Promise.all([
        fetch(`${PROXY_URL}/steam?steamId=${steamId}`, { headers: { 'Accept': 'application/json' } }).catch(err => { console.error("Steam fetch error:", err); return null; }),
        fetch(`${PROXY_URL}/retroachievements`, { headers: { 'Accept': 'application/json' } }).catch(err => { console.error("RetroAchievements fetch error:", err); return null; })
      ]);

      let combinedData = [];

      if (steamRes && steamRes.ok) {
        const steamJson = await steamRes.json();
        if (Array.isArray(steamJson.data)) {
          combinedData = [...combinedData, ...steamJson.data.map(item => ({
            ...item,
            coverImage: item.coverImage || GAMING_DATA.covers[item.title] || undefined
          }))];
        }
      }

      if (raRes && raRes.ok) {
        const raJson = await raRes.json();
        if (Array.isArray(raJson.data)) {
          combinedData = [...combinedData, ...raJson.data.map(item => ({
            ...item,
            coverImage: item.coverImage || GAMING_DATA.covers[item.title] || undefined
          }))];
        }
      }

      if (combinedData.length > 0) {
        setData(combinedData);
      }
    } catch (err) {
      console.error("Fetch error in fetchData:", err); // Log the error explicitly
      setError(err.message || 'Failed to fetch game data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [data, searchQuery]);

  const getRatingColor = (rating) => {
    if (rating >= 9.5) return 'text-green-400';
    if (rating >= 8.5) return 'text-blue-400';
    return 'text-gray-400';
  };

  const GameCard = ({ item }) => (
    <div className="group relative bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-2xl">
      <div className="aspect-square relative">
        <LazyImage
          src={item.coverImage || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 ${getRatingColor(item.rating)}`}>
            <Star size={12} className="fill-current" />
            <span className="text-xs font-black font-mono">{item.rating || 'N/A'}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.platform === 'Steam' ? 'text-blue-400' : 'text-purple-400'}`}>
                {item.platform}
            </span>
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-green-400 transition-colors uppercase italic">{item.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Playtime</span>
          <span className="text-[10px] text-gray-300 font-mono">{item.playtime}</span>
        </div>
        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
          item.status === 'Mastered' || item.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          {item.status}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-gray-100 min-h-[100dvh] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-2xl sticky top-0 z-30 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-green-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Game Center</h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1 font-bold">Cross-Platform Library</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="hidden lg:flex gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className="flex flex-col items-end">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{stat.label}</span>
                        <div className="flex items-center gap-1.5 text-green-500">
                            {stat.icon}
                            <span className="font-mono text-xs font-bold">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 w-64 transition-all"
                />
            </div>

            <button
                onClick={fetchData}
                disabled={loading}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all disabled:opacity-30 border border-white/5"
            >
                <RefreshCcw size={18} className={loading ? 'animate-spin' : 'text-green-500'} />
            </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {error && <ErrorState message={error} onRetry={fetchData} />}
          {!error && (
            <>
              {/* Search Mobile */}
              <div className="md:hidden mb-8 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 w-full transition-all"
                    />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                {filteredAndSortedData.map((item, idx) => (
                  <GameCard key={idx} item={item} />
                ))}
              </div>

              {filteredAndSortedData.length === 0 && (
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-6 bg-white/5 rounded-full">
                        <Gamepad2 size={48} className="text-gray-700" />
                      </div>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No games found in your collection</p>
                  </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer Info */}
      {!import.meta.env.VITE_PROXY_URL && (
        <div className="bg-green-500/5 border-t border-green-500/10 px-6 py-2 flex items-center gap-3">
          <AlertCircle size={14} className="text-green-500" />
          <p className="text-[9px] text-green-500/80 uppercase font-black tracking-widest">
            Steam API Sync Offline: Displaying cached collection metadata.
          </p>
        </div>
      )}
    </div>
  );
};

export default GameCenterApp;
