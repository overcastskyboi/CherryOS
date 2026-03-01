import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Gamepad2, ArrowLeft, RefreshCcw, Star, Search, ExternalLink, Clock, AlertCircle, Calendar } from 'lucide-react';
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
      if (!response.ok) throw new Error(`Mirror fetch failed`);
      
      const json = await response.json();
      if (json && json.data && Array.isArray(json.data)) {
        if (json.data.length > 0) {
          setData(json.data);
          setIsMirror(true);
        } else {
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
      .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      // Sort by achievement percentage (highest first)
      .sort((a, b) => (b.achievementPercent || 0) - (a.achievementPercent || 0));
  }, [data, searchQuery]);

  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(0, displayCount);
  }, [filteredAndSortedData, displayCount]);

  const formatLastPlayed = (timestamp) => {
    if (!timestamp) return '---';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-6 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Game Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[9px] uppercase tracking-[0.4em] font-bold ${isMirror ? 'text-emerald-500' : 'text-yellow-600'}`}>
                {isMirror ? 'Direct Link // Engine Active' : 'Local Buffer // Offline'}
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-64 transition-all"
            />
          </div>
          <button onClick={fetchMirroredData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-emerald-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-elegant">
            {visibleData.map((item, idx) => (
              <div key={idx} className="group relative bg-black/40 rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-gray-900 shrink-0">
                  <LazyImage
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-emerald-400">
                      <Star size={10} className="fill-current" />
                      <span className="text-[10px] font-black">{Math.round(item.achievementPercent)}%</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Steam Entry</span>
                    <h3 className="text-sm font-black text-white leading-tight line-clamp-2 uppercase italic tracking-tighter">{item.title}</h3>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1">
                        <Clock size={8} /> Playtime
                      </p>
                      <p className="text-xs font-bold text-white">{item.playtime}</p>
                    </div>
                    {item.lastPlayed && (
                      <div className="space-y-1">
                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1">
                          <Calendar size={8} /> Last Played
                        </p>
                        <p className="text-xs font-bold text-gray-300">{formatLastPlayed(item.lastPlayed)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-500">
                      <span>Completion</span>
                      <span className="text-emerald-500">{Math.round(item.achievementPercent)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        style={{ width: `${item.achievementPercent}%` }}
                      />
                    </div>
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

      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/40 sticky bottom-0 z-50">
        <span className="text-[8px] font-mono uppercase tracking-widest italic">Steam_Archive: {GAMING_DATA.collection.length} cached // {data.length} live</span>
        <div className="flex gap-1">
          <div className={`w-1 h-1 ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
          <div className={`w-1 h-1 ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
      </footer>
    </div>
  );
};

export default GameCenterApp;
