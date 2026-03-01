import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Clapperboard, ArrowLeft, RefreshCcw, Star, Search, ExternalLink, Clock, AlertCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { ANIME_DATA } from '../data/constants';

const WatchLogApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(ANIME_DATA.catalogue);
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
      if (!response.ok) throw new Error(`Mirror fetch failed`);
      
      const json = await response.json();
      if (json && json.data) {
        const allEntries = [
          ...(json.data.MediaListCollection?.lists?.flatMap(l => l.entries) || []),
          ...(json.data.MangaList?.lists?.flatMap(l => l.entries) || [])
        ];
        
        const processed = allEntries.map(entry => ({
          title: entry.media.title.english || entry.media.title.romaji,
          type: entry.media.type,
          score: entry.score || entry.media.averageScore / 10 || 0,
          progress: entry.progress ? `${entry.progress} ${entry.media.type === 'ANIME' ? 'Eps' : 'Ch'}` : '---',
          status: entry.status,
          coverImage: entry.media.coverImage.extraLarge,
          id: entry.media.id
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

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setStatusFilter(value)}
      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
        statusFilter === value 
          ? 'bg-yellow-500 text-black border-yellow-500' 
          : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[#050505] text-gray-100 min-h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-6 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-yellow-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Activity Log</h1>
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

        <div className="flex flex-wrap items-center gap-2">
          <FilterButton label="All" value="ALL" />
          <FilterButton label="Watching" value="CURRENT" />
          <FilterButton label="Completed" value="COMPLETED" />
          <FilterButton label="Planning" value="PLANNING" />
          
          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block" />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-48 transition-all"
            />
          </div>
          <button onClick={fetchMirroredData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-yellow-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {!loading && visibleData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
              <AlertCircle size={48} />
              <p className="text-sm font-black uppercase tracking-widest">No matching entries found</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 animate-elegant">
            {visibleData.map((item, idx) => (
              <div key={idx} className="group relative bg-black/40 rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl">
                <div className="aspect-[2/3] relative overflow-hidden bg-gray-900">
                  <LazyImage
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-yellow-400 shadow-xl">
                      <Star size={10} className="fill-current" />
                      <span className="text-[10px] font-black">{item.score || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">{item.type}</span>
                    <h3 className="text-xs font-black text-white leading-tight line-clamp-2 uppercase italic tracking-tighter">{item.title}</h3>
                  </div>
                </div>
                <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Progress</span>
                    <span className="text-[10px] text-gray-300 font-bold tracking-tighter">{item.progress}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    item.status === 'CURRENT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {item.status === 'CURRENT' ? 'Watching' : item.status}
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
        <span className="text-[8px] font-mono uppercase tracking-widest italic">Anilist_Archive: {ANIME_DATA.catalogue.length} cached // {data.length} live</span>
        <div className="flex gap-1">
          <div className={`w-1 h-1 ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
          <div className={`w-1 h-1 ${isMirror ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
      </footer>
    </div>
  );
};

export default WatchLogApp;
