import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Gamepad2, ArrowLeft, RefreshCcw, Star, Search, 
  ExternalLink, Clock, AlertCircle, Calendar,
  Trophy, Target, Zap, Activity, Info,
  Library, LayoutGrid, ListFilter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { GAMING_DATA } from '../data/constants';
import { formatTime, formatHours } from '../data/time_utils';

const GameCenterApp = () => {
  const navigate = useNavigate();
  const { setThemeColor } = useOS();

  useEffect(() => {
    setThemeColor('#10b981'); // Cherry Emerald
  }, [setThemeColor]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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
      if (!response.ok) throw new Error("Mirror fetch failed");
      
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
    }, { threshold: 0.1 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [data.length]);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Total Playtime (playtime_raw is in minutes)
    const totalMinutes = data.reduce((acc, curr) => acc + (Number(curr.playtime_raw) || 0), 0);
    const immersion = formatHours(Math.round(totalMinutes / 60));

    // Mastery (100% achievements)
    const masteryCount = data.filter(g => Number(g.achievementPercent) >= 100).length;

    // Most Played
    const topGame = [...data].sort((a,b) => (Number(b.playtime_raw) || 0) - (Number(a.playtime_raw) || 0))[0];

    // Average Completion
    const playedGames = data.filter(g => g.playtime_raw > 0);
    const avgComp = playedGames.length > 0 
      ? Math.round(playedGames.reduce((acc, curr) => acc + (Number(curr.achievementPercent) || 0), 0) / playedGames.length)
      : 0;

    return { immersion, masteryCount, topGame, avgComp, totalGames: data.length };
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    const items = data.length > 0 ? data : GAMING_DATA.collection;
    return items
      .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      // Sort by achievement percentage (highest first)
      .sort((a, b) => (Number(b.achievementPercent) || 0) - (Number(a.achievementPercent) || 0));
  }, [data, searchQuery]);

  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(0, displayCount);
  }, [filteredAndSortedData, displayCount]);

  const formatLastPlayed = (timestamp) => {
    if (!timestamp || timestamp === 0) return '---';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden font-sans">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-6 flex flex-col lg:flex-row lg:items-center justify-between sticky top-0 z-50 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Game Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[9px] uppercase tracking-[0.4em] font-bold ${isMirror ? 'text-emerald-500' : 'text-yellow-600'}`}>
                {isMirror ? 'Neural Link // Active' : 'Local Buffer // Offline'}
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-64 lg:w-80 transition-all focus:border-emerald-500/50 shadow-inner"
            />
          </div>
          <button onClick={fetchMirroredData} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all shadow-xl text-emerald-500">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 relative z-10 space-y-12">
        {/* Revamped Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-elegant">
            <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border-emerald-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform duration-700"><Clock size={80} /></div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Neural Immersion</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white italic tracking-tighter">{stats.immersion.label.split(' ')[0]}</span>
                <span className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">{stats.immersion.label.split(' ').slice(1).join(' ') || 'Total'}</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border-yellow-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-yellow-500 group-hover:scale-110 transition-transform duration-700"><Trophy size={80} /></div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Mastered Sequences</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white italic tracking-tighter">{stats.masteryCount}</span>
                <span className="text-xs font-bold text-yellow-500 mb-2 uppercase tracking-widest">Games</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border-cyan-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-cyan-500 group-hover:scale-110 transition-transform duration-700"><Target size={80} /></div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Avg completion</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white italic tracking-tighter">{stats.avgComp}</span>
                <span className="text-xs font-bold text-cyan-500 mb-2 uppercase tracking-widest">% total</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border-purple-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-purple-500 group-hover:scale-110 transition-transform duration-700"><Library size={80} /></div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Total artifacts</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white italic tracking-tighter">{stats.totalGames}</span>
                <span className="text-xs font-bold text-purple-500 mb-2 uppercase tracking-widest">Owned</span>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-12">
          {!loading && filteredAndSortedData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-gray-600 space-y-6 opacity-50">
              <Activity size={64} className="animate-pulse" />
              <p className="text-sm font-black uppercase tracking-[0.5em] italic">No compatible artifacts found in sector...</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleData.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-700 shadow-2xl flex flex-col hover:-translate-y-2 animate-elegant"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Holographic Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-30 bg-gradient-to-tr from-emerald-500 via-cyan-400 to-purple-500 mix-blend-overlay" />
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-all duration-1000 z-30 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] mix-blend-overlay group-hover:scale-110" />

                <div className="aspect-video relative overflow-hidden bg-gray-900 shrink-0">
                  <LazyImage
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md border flex items-center gap-2 shadow-2xl ${Number(item.achievementPercent) >= 100 ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' : 'bg-black/60 border-white/10 text-emerald-400'}`}>
                      {Number(item.achievementPercent) >= 100 ? <Trophy size={12} className="fill-current" /> : <Star size={12} className="fill-current" />}
                      <span className="text-xs font-black">{Math.round(Number(item.achievementPercent) || 0)}%</span>
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-6 right-6 space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-80 italic">Steam Registry Entry</span>
                    <h3 className="text-lg font-black text-white leading-tight line-clamp-2 uppercase italic tracking-tighter drop-shadow-2xl">{item.title}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between gap-6 bg-gradient-to-b from-transparent to-white/[0.01]">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock size={10} /> Runtime
                      </p>
                      <p className="text-sm font-black text-white italic">{formatTime(Number(item.playtime_raw)).label}</p>
                    </div>
                    {item.lastPlayed && item.lastPlayed > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                          <Calendar size={10} /> Logged
                        </p>
                        <p className="text-sm font-black text-gray-400 italic">{formatLastPlayed(item.lastPlayed)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <span>Neural Mastery</span>
                      <span className={Number(item.achievementPercent) >= 100 ? 'text-yellow-500' : 'text-emerald-500 opacity-80'}>
                        {item.achievements ? `${item.achievements.won}/${item.achievements.total} LINKED` : `${Math.round(Number(item.achievementPercent) || 0)}% SYNC`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className={`h-full transition-all duration-[1500ms] ease-out shadow-[0_0_15px_rgba(16,185,129,0.2)] ${Number(item.achievementPercent) >= 100 ? 'bg-gradient-to-r from-yellow-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-cyan-400'}`}
                        style={{ width: `${Number(item.achievementPercent) || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div ref={loaderRef} className="h-40 flex flex-col items-center justify-center gap-4 opacity-30">
            {visibleData.length < filteredAndSortedData.length ? (
              <>
                <RefreshCcw className="animate-spin text-emerald-500" size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Loading next sector...</span>
              </>
            ) : (
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Sequence_Terminated // End of Archive</div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto px-8 py-6 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/60 backdrop-blur-2xl sticky bottom-0 z-50">
        <span className="text-[9px] font-mono uppercase tracking-widest italic flex items-center gap-6">
          <span className="text-gray-500">Archive Index: {stats?.totalGames || 0} Artifacts</span>
          <span className="hidden sm:inline text-gray-900">|</span>
          <span className="text-emerald-500/50">Core Sync Status: NOMINAL</span>
        </span>
        <div className="flex gap-2.5">
          <div className={`w-2 h-2 rounded-full ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'} shadow-[0_0_15px_rgba(16,185,129,0.4)]`} />
          <div className={`w-2 h-2 rounded-full ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
      </footer>
    </div>
  );
};

export default GameCenterApp;
