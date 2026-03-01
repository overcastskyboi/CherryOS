import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Gamepad2, ArrowLeft, RefreshCcw, Star, Search, Monitor, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { GAMING_DATA } from '../data/constants';

const GameCenterApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(GAMING_DATA.collection);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Infinite Scroll State
  const [displayCount, setDisplayCount] = useState(12);
  const loaderRef = useRef(null);

  const PROXY_URL = import.meta.env.VITE_PROXY_URL;
  const STEAM_ID = import.meta.env.VITE_STEAM_ID || GAMING_DATA.steam.steamId;

  const fetchData = useCallback(async () => {
    if (!PROXY_URL) return;
    setLoading(true);
    try {
      const response = await fetch(`${PROXY_URL}/steam?steamId=${STEAM_ID}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error();
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        const processed = json.data.map(item => ({
          ...item,
          coverImage: item.coverImage || GAMING_DATA.covers[item.title] || undefined
        }));
        setData(processed);
      }
    } catch (err) {
      console.warn("Cloud synchronization silent fail - using local buffer.");
    } finally {
      setLoading(false);
    }
  }, [PROXY_URL, STEAM_ID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prev => prev + 12);
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter(item => item.platform === 'Steam')
      .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.achievementPercent || 0) - (a.achievementPercent || 0));
  }, [data, searchQuery]);

  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(0, displayCount);
  }, [filteredAndSortedData, displayCount]);

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
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Steam Sync</span>
          <h3 className="text-xs font-black text-white leading-tight line-clamp-2 uppercase italic">{item.title}</h3>
        </div>
      </div>
      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Achievements</span>
          <span className="text-[10px] text-emerald-500 font-bold">{Math.round(item.achievementPercent || 0)}%</span>
        </div>
        <div className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border bg-blue-500/10 text-blue-400 border-blue-500/20">
          {item.playtime || '---'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Game Center</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Direct Link // Engine Active</p>
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
          <button onClick={fetchData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-emerald-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {visibleData.map((item, idx) => (
              <GameCard key={idx} item={item} />
            ))}
          </div>
          <div ref={loaderRef} className="h-20 flex items-center justify-center">
            {visibleData.length < filteredAndSortedData.length && <RefreshCcw className="animate-spin text-gray-800" size={24} />}
          </div>
        </div>
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/40">
        <span className="text-[8px] font-mono uppercase tracking-widest">Steam_ID: AugustElliott</span>
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
