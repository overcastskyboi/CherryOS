import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Clapperboard, ArrowLeft, RefreshCcw, Star, Search, 
  Clock, AlertCircle, PlayCircle, CheckCircle2, List, 
  TrendingUp, Hash, PieChart, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { ANIME_DATA } from '../data/constants';
import { formatHours } from '../data/time_utils';

import { useOS } from '../context/OSContext';

const WatchLogApp = () => {
  const navigate = useNavigate();
  const { setThemeColor } = useOS();

  useEffect(() => {
    setThemeColor('#f59e0b'); // Cherry Amber
  }, [setThemeColor]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSynced, setLastSynced] = useState(null);
  const [isMirror, setIsMirror] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [displayCount, setDisplayCount] = useState(12);
  const loaderRef = useRef(null);

  const fetchMirroredData = useCallback(async () => {
    setLoading(true);
    setIsMirror(false);
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      
      const metaPath = `${baseUrl}data/mirror/metadata.json`.replace(/\/+/g, '/');
      const metaRes = await fetch(metaPath).catch(() => null);
      if (metaRes?.ok) {
        const meta = await metaRes.json();
        setLastSynced(meta.lastUpdated);
      }

      const dataPath = `${baseUrl}data/mirror/anilist.json`.replace(/\/+/g, '/');
      const response = await fetch(dataPath);
      if (!response.ok) throw new Error("Mirror fetch failed");
      
      const json = await response.json();
      if (json && json.data) {
        const animeEntries = json.data.MediaListCollection?.lists?.flatMap(l => l.entries) || [];
        const mangaEntries = json.data.MangaList?.lists?.flatMap(l => l.entries) || [];
        
        const processed = [...animeEntries, ...mangaEntries].map(entry => ({
          title: entry.media.title.english || entry.media.title.romaji,
          type: entry.media.type,
          score: entry.score || entry.media.averageScore / 10 || 0,
          progress: entry.progress,
          status: entry.status,
          // Use mirrored image path if available
          coverImage: entry.media.coverImage.local 
            ? `${baseUrl}${entry.media.coverImage.local}`.replace(/\/+/g, '/')
            : entry.media.coverImage.extraLarge,
          id: entry.media.id,
          duration: entry.media.duration || 0,
          episodes: entry.media.episodes || 0,
          genres: entry.media.genres || [],
          updatedAt: entry.updatedAt || 0
        }));

        if (processed.length > 0) {
          setData(processed);
          setIsMirror(true);
        } else {
          setData(ANIME_DATA.catalogue);
        }
      }
    } catch (err) {
      console.error("WatchLogApp Data Sync Error:", err);
      setData(ANIME_DATA.catalogue);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMirroredData();
  }, [fetchMirroredData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prev => prev + 12);
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const anime = data.filter(i => i.type === 'ANIME');
    const totalMinutes = anime.reduce((acc, curr) => acc + (Number(curr.progress || 0) * Number(curr.duration || 0)), 0);
    const depth = formatHours(Math.round(totalMinutes / 60));

    const genreCounts = data.reduce((acc, curr) => {
      (curr.genres || []).forEach(g => acc[g] = (acc[g] || 0) + 1);
      return acc;
    }, {});
    const topGenre = Object.entries(genreCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const recent = data
      .filter(i => i.status === 'COMPLETED')
      .sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 3);

    return { depth, topGenre, recent, totalEntries: data.length };
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    const items = data.length > 0 ? data : ANIME_DATA.catalogue;
    return items
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [data, searchQuery, statusFilter]);

  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(0, displayCount);
  }, [filteredAndSortedData, displayCount]);

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-emerald-400';
    if (score >= 7.5) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const FilterButton = ({ label, value, icon: Icon }) => (
    <button
      onClick={() => setStatusFilter(value)}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
        statusFilter === value 
          ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
          : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'
      }`}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  );

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden font-sans">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-yellow-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={isMobile ? 20 : 24} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase italic leading-none">Activity Log</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-bold ${isMirror ? 'text-emerald-500' : 'text-yellow-600'}`}>
                {isMirror ? 'Cloud Mirror' : 'Local'} // Active
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex gap-2">
            <FilterButton label="All" value="ALL" icon={List} />
            <FilterButton label="Active" value="CURRENT" icon={PlayCircle} />
            <FilterButton label="Logged" value="COMPLETED" icon={CheckCircle2} />
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden lg:block" />

          <div className="relative flex-1 md:flex-none min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-full md:w-64 transition-all focus:border-yellow-500/50"
            />
          </div>
          <button onClick={fetchMirroredData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-yellow-500">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 relative z-10 space-y-8 md:space-y-12">
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-elegant">
            <div className="glass-card p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group border-yellow-500/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-yellow-500 group-hover:scale-110 transition-transform"><Clock size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Archive Depth</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl md:text-3xl font-black text-white italic">{stats.depth.label.split(' ')[0]}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-yellow-500 mb-1.5 uppercase">{stats.depth.label.split(' ').slice(1).join(' ') || 'Total'}</span>
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group border-emerald-500/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform"><PieChart size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Top Sector</p>
              <span className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate block">{stats.topGenre}</span>
            </div>

            <div className="glass-card p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group border-blue-500/10 lg:col-span-2 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-500 group-hover:scale-110 transition-transform"><TrendingUp size={60} /></div>
              <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 pr-12">Recent Finalized Sequence</p>
              <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-1">
                {stats.recent.map((show, i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0 bg-white/5 rounded-xl p-2 border border-white/5 shadow-2xl">
                    <img src={show.coverImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase truncate w-20 md:w-24 italic">{show.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {!loading && visibleData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4 opacity-50">
              <AlertCircle size={48} />
              <p className="text-sm font-black uppercase tracking-widest">Scanning empty sectors...</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6">
            {visibleData.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-black/40 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl flex flex-col animate-elegant"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="aspect-[2/3] relative overflow-hidden bg-gray-900 shrink-0">
                  <LazyImage
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  
                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                    <div className="px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-xl">
                      <Star size={8} className={`fill-current ${getScoreColor(item.score)}`} />
                      <span className={`text-[8px] md:text-[10px] font-black ${getScoreColor(item.score)}`}>{item.score || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 space-y-0.5 md:space-y-1">
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">{item.type}</span>
                    <h3 className="text-[10px] md:text-xs font-black text-white leading-tight line-clamp-2 uppercase italic tracking-tighter">{item.title}</h3>
                  </div>
                </div>
                
                <div className="p-3 md:p-4 bg-black/40 border-t border-white/5 flex flex-col gap-2 md:gap-3 flex-1 justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Progress</span>
                      <span className="text-[9px] md:text-[10px] text-gray-300 font-bold tracking-tighter">
                        {item.progress} {item.type === 'ANIME' ? 'EP' : 'CH'}
                      </span>
                    </div>
                    <div className={`px-1.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest border ${
                      item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      item.status === 'CURRENT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {item.status === 'CURRENT' ? 'Active' : item.status === 'COMPLETED' ? 'Logged' : item.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {(item.genres || []).slice(0, 2).map(g => (
                      <span key={g} className="text-[6px] md:text-[7px] text-gray-600 font-black uppercase border border-white/5 px-1 md:px-1.5 rounded shadow-inner truncate max-w-full">{g}</span>
                    ))}
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
        <span className="text-[8px] font-mono uppercase tracking-widest italic flex items-center gap-4">
          <span className="text-gray-500">Inventory: {stats?.totalEntries || 0} Artifacts</span>
          <span className="hidden sm:inline text-gray-800">|</span>
          <span className="text-emerald-500/50">Core Sync Status: NOMINAL</span>
        </span>
        <div className="flex gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
      </footer>
    </div>
  );
};

export default WatchLogApp;
