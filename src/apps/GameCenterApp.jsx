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
import { useOS } from '../context/OSContext';

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
      if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
        setData(json.data);
        setIsMirror(true);
      } else {
        setData(GAMING_DATA.collection);
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
      if (entries[0].isIntersecting && !loading) {
        setDisplayCount(prev => prev + 12);
      }
    }, { threshold: 0.1 });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      // Sort by achievement percentage (highest first), then by playtime_raw
      .sort((a, b) => {
        const diff = (Number(b.achievementPercent) || 0) - (Number(a.achievementPercent) || 0);
        if (Math.abs(diff) < 0.01) {
          return (Number(b.playtime_raw) || 0) - (Number(a.playtime_raw) || 0);
        }
        return diff;
      });
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
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-emerald-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={isMobile ? 20 : 24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-[2px]">
              <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center overflow-hidden">
                <img src="https://avatars.githubusercontent.com/u/1?v=4" alt="Steam Avatar" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase italic leading-none">{GAMING_DATA.steam.user}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Level {GAMING_DATA.steam.level}</span>
                <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-bold ${isMirror ? 'text-emerald-500' : 'text-yellow-600'}`}>
                  {isMirror ? 'Neural Link' : 'Local'} // Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 md:py-2.5 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-full md:w-64 lg:w-80 transition-all focus:border-emerald-500/50 shadow-inner"
            />
          </div>
          <button onClick={fetchMirroredData} className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-emerald-500">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 relative z-10 space-y-8 md:space-y-12">
        {/* Revamped Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 animate-elegant">
            <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group border-emerald-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform duration-700"><Clock size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Neural Immersion</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{stats.immersion.label.split(' ')[0]}</span>
                <span className="text-[10px] md:text-xs font-bold text-emerald-500 mb-1 uppercase tracking-widest leading-none">{stats.immersion.label.split(' ').slice(1).join(' ') || 'Total'}</span>
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group border-yellow-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 text-yellow-500 group-hover:scale-110 transition-transform duration-700"><Trophy size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Mastered Sequences</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{stats.masteryCount}</span>
                <span className="text-[10px] md:text-xs font-bold text-yellow-500 mb-1 uppercase tracking-widest leading-none">Games</span>
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group border-cyan-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 text-cyan-500 group-hover:scale-110 transition-transform duration-700"><Target size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Avg completion</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{stats.avgComp}</span>
                <span className="text-[10px] md:text-xs font-bold text-cyan-500 mb-1 uppercase tracking-widest leading-none">% total</span>
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group border-purple-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 text-purple-500 group-hover:scale-110 transition-transform duration-700"><Library size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Total artifacts</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{stats.totalGames}</span>
                <span className="text-[10px] md:text-xs font-bold text-purple-500 mb-1 uppercase tracking-widest leading-none">Owned</span>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {!loading && filteredAndSortedData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 md:py-40 text-gray-600 space-y-6 opacity-50">
              <Activity size={64} className="animate-pulse" />
              <p className="text-sm font-black uppercase tracking-[0.5em] italic text-center">No compatible artifacts found in sector...</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {visibleData.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0a0a0a] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-700 shadow-2xl flex flex-col hover:-translate-y-2 animate-elegant"
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
                  
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2">
                    <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl backdrop-blur-md border flex items-center gap-1.5 md:gap-2 shadow-2xl ${Number(item.achievementPercent) >= 100 ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' : 'bg-black/60 border-white/10 text-emerald-400'}`}>
                      {Number(item.achievementPercent) >= 100 ? <Trophy size={10} className="fill-current" /> : <Star size={10} className="fill-current" />}
                      <span className="text-[10px] md:text-xs font-black">{Math.round(Number(item.achievementPercent) || 0)}%</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-6 md:right-6 space-y-1">
                    <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-blue-400 opacity-80 italic leading-none">Steam Entry</span>
                    <h3 className="text-sm md:text-lg font-black text-white leading-tight line-clamp-2 uppercase italic tracking-tighter drop-shadow-2xl">{item.title}</h3>
                  </div>
                </div>
                
                <div className="p-4 md:p-6 flex-1 flex flex-col justify-between gap-4 md:gap-6 bg-gradient-to-b from-transparent to-white/[0.01]">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1">
                      <p className="text-[7px] md:text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-1.5 md:gap-2">
                        <Clock size={10} /> Runtime
                      </p>
                      <p className="text-xs md:text-sm font-black text-white italic truncate">{formatTime(Number(item.playtime_raw)).label}</p>
                    </div>
                    {item.lastPlayed && item.lastPlayed > 0 && (
                      <div className="space-y-1">
                        <p className="text-[7px] md:text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-1.5 md:gap-2">
                          <Calendar size={10} /> Logged
                        </p>
                        <p className="text-xs md:text-sm font-black text-gray-400 italic truncate">{formatLastPlayed(item.lastPlayed)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <span>Neural Mastery</span>
                      <span className={Number(item.achievementPercent) >= 100 ? 'text-yellow-500' : 'text-emerald-500 opacity-80'}>
                        {item.achievements ? `${item.achievements.won}/${item.achievements.total}` : `${Math.round(Number(item.achievementPercent) || 0)}%`}
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
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

      {/* Floating Back to Top */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-24 right-8 p-4 bg-emerald-500 text-black rounded-2xl shadow-2xl transition-all duration-500 z-[60] hover:scale-110 active:scale-90 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <Zap size={24} className="fill-current" />
      </button>
    </div>
  );
};

export default GameCenterApp;
