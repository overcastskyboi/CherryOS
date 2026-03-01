import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Gamepad2, ArrowLeft, RefreshCcw, Star, Search, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { GAMING_DATA } from '../data/constants';

const GameCenterApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(GAMING_DATA.collection);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSynced, setLastSynced] = useState(null);
  const [isMirror, setIsMirror] = useState(false);
  
  // Infinite Scroll State
  const [displayCount, setDisplayCount] = useState(12);
  const loaderRef = useRef(null);

  const fetchMirroredData = useCallback(async () => {
    setLoading(true);
    setIsMirror(false);
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';

      // 1. Fetch Metadata
      const metaPath = `${baseUrl}data/mirror/metadata.json`.replace(/\/+/g, '/');
      const metaRes = await fetch(metaPath).catch(() => null);
      if (metaRes?.ok) {
        const meta = await metaRes.json();
        setLastSynced(meta.lastUpdated);
      }

      // 2. Fetch Mirrored Steam Data
      const dataPath = `${baseUrl}data/mirror/steam.json`.replace(/\/+/g, '/');
      const response = await fetch(dataPath);
      if (!response.ok) throw new Error(`Mirror fetch failed with status: ${response.status}`);
      
      const json = await response.json();
      if (json && json.data && Array.isArray(json.data)) {
        const processed = json.data.map(item => ({
          ...item,
          coverImage: item.id ? `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg` : (item.coverImage || GAMING_DATA.covers[item.title])
        }));
        
        if (processed.length > 0) {
          setData(processed);
          setIsMirror(true);
        } else {
          console.warn("Steam Mirror contains 0 entries, using Local Fallback Buffer.");
          setData(GAMING_DATA.collection);
        }
      }
    } catch (err) {
      console.error("GameCenterApp Data Sync Error:", err);
      setData(GAMING_DATA.collection);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMirroredData();
  }, [fetchMirroredData]);

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
    const items = data.length > 0 ? data : GAMING_DATA.collection;
    return items
      .filter(item => item.platform === 'Steam')
      .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.achievementPercent || 0) - (a.achievementPercent || 0));
  }, [data, searchQuery]);

  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(0, displayCount);
  }, [filteredAndSortedData, displayCount]);

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Game Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[9px] uppercase tracking-[0.4em] font-bold ${isMirror ? 'text-emerald-500' : 'text-yellow-600'}`}>
                {isMirror ? 'Cloud Mirror // Active' : 'Local Buffer // Offline'}
              </p>
              {lastSynced && (
                <div className="flex items-center gap-1 text-[8px] text-gray-500 font-mono">
                  <Clock size={10} />
                  <span>{new Date(lastSynced).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Filter vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-48 transition-all"
            />
          </div>
          <button onClick={fetchMirroredData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-emerald-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {!loading && visibleData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
              <AlertCircle size={48} />
              <p className="text-sm font-black uppercase tracking-widest">No Library Entries Found</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {visibleData.map((item, idx) => (
              <div key={idx} className="group relative glass-card rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-500 animate-elegant">
                <div className="aspect-video relative overflow-hidden bg-gray-900">
                  <LazyImage
                    src={item.coverImage || (item.id ? `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg` : 'https://via.placeholder.com/460x215?text=No+Artwork')}
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
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Library Entry</span>
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
            ))}
          </div>
          <div ref={loaderRef} className="h-20 flex items-center justify-center">
            {visibleData.length < filteredAndSortedData.length && <RefreshCcw className="animate-spin text-gray-800" size={24} />}
          </div>
        </div>
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/40">
        <span className="text-[8px] font-mono uppercase tracking-widest">Source: {isMirror ? 'Cloud_Mirror' : 'Local_Buffer'}</span>
        <div className="flex gap-1">
          <div className={`w-1 h-1 ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
          <div className={`w-1 h-1 ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
      </footer>
    </div>
  );
};

export default GameCenterApp;
