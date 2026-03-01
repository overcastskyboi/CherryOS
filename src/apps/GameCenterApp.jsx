import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Gamepad2, ArrowLeft, RefreshCcw, Star, AlertCircle, Search, Trophy, Monitor, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { GAMING_DATA } from '../data/constants';

const GameCenterApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(GAMING_DATA.collection);
  const [searchQuery, setSearchQuery] = useState('');

  const PROXY_URL = import.meta.env.VITE_PROXY_URL;
  const STEAM_ID = GAMING_DATA.steam.steamId;

  const fetchData = useCallback(async () => {
    if (!PROXY_URL) {
      console.warn("Proxy URL missing, staying in local mode.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${PROXY_URL}/steam?steamId=${STEAM_ID}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error("Cloud synchronization failed.");
      
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        const processed = json.data.map(item => ({
          ...item,
          coverImage: item.coverImage || GAMING_DATA.covers[item.title] || undefined
        }));
        
        // Ensure requested top games are present if returned by API
        setData(processed);
      }
    } catch (err) {
      console.error("Steam Fetch Error:", err);
      setError("Cloud Sync Unavailable. Using local database.");
    } finally {
      setLoading(false);
    }
  }, [PROXY_URL, STEAM_ID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
const filteredAndSortedData = useMemo(() => {
  return data
    .filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by achievement completion % if available, then by rating
      const aComp = a.achievementPercent || 0;
      const bComp = b.achievementPercent || 0;
      if (bComp !== aComp) return bComp - aComp;
      return (b.rating || 0) - (a.rating || 0);
    });
}, [data, searchQuery]);
  const GameCard = ({ item }) => (
    <div className="group relative glass-card rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-500 animate-elegant">
      <div className="aspect-square relative overflow-hidden">
        <LazyImage
          src={item.coverImage || GAMING_DATA.covers[item.title] || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-emerald-400">
            <Star size={10} className="fill-current" />
            <span className="text-[10px] font-black">{item.rating || 'N/A'}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">
            {item.platform}
          </span>
          <h3 className="text-xs font-black text-white leading-tight line-clamp-2 uppercase italic">{item.title}</h3>
        </div>
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Time</span>
          <span className="text-[10px] text-gray-300 font-bold">{item.playtime}</span>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
          item.status === 'Mastered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          {item.status}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Game Center</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Direct Link // Steam API</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex gap-6 mr-4 border-r border-white/5 pr-6">
            <div className="text-right">
              <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Library</p>
              <p className="text-xs font-black text-emerald-500">{GAMING_DATA.steam.gamesCount}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Level</p>
              <p className="text-xs font-black text-blue-500">{GAMING_DATA.steam.level}</p>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Filter vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 w-48 transition-all"
            />
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all disabled:opacity-30"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-emerald-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {error && (
            <div className="flex items-center justify-center p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl gap-3 text-emerald-500">
              <AlertCircle size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredData.map((item, idx) => (
              <GameCard key={idx} item={item} />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-20">
              <Gamepad2 size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Vault is Empty</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Decor */}
      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/40">
        <span className="text-[8px] font-mono uppercase tracking-widest">Profile_ID: AugustElliott</span>
        <div className="flex gap-4 items-center">
          <a href={`https://steamcommunity.com/profiles/${STEAM_ID}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <ExternalLink size={12} />
          </a>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-emerald-500" />
            <div className="w-1 h-1 bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GameCenterApp;
