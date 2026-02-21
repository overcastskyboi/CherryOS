import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clapperboard, ArrowLeft, RefreshCcw, Star, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { ANIME_DATA } from '../data/constants';

const ErrorState = ({ message, onRetry }) => (
  <div className="h-full flex flex-col items-center justify-center text-red-500 space-y-4">
    <img src="/assets/images/cloud_mascot.png" alt="Cloud Mascot" className="w-24 h-24 mb-4" />
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

const WatchLogApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(ANIME_DATA.catalogue); // Default to local data
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    const PROXY_URL = import.meta.env.VITE_PROXY_URL;
    if (!PROXY_URL) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${PROXY_URL}/anilist`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error("Connection failed");
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        // Ensure coverImage is pulled if available, otherwise use local fallback logic later
        const processedData = json.data.map(item => ({
          ...item,
          // API might provide coverImage, if not, it will be handled by MediaCard's fallback
          coverImage: item.coverImage || ANIME_DATA.covers[item.title] || undefined
        }));
        setData(processedData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || 'Failed to fetch watch log data.');
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
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [data, searchQuery]);

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-yellow-400';
    if (score >= 8) return 'text-green-400';
    if (score >= 7) return 'text-blue-400';
    return 'text-gray-400';
  };

  const MediaCard = ({ item }) => (
    <div className="group relative bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all hover:-translate-y-1 shadow-2xl">
      <div className="aspect-[2/3] relative">
        <LazyImage
          src={item.coverImage || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 ${getScoreColor(item.score)}`}>
            <Star size={12} className="fill-current" />
            <span className="text-xs font-black font-mono">{item.score || 'N/A'}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/80">{item.type}</span>
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors uppercase italic">{item.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Progress</span>
          <span className="text-[10px] text-gray-300 font-mono">{item.progress}</span>
        </div>
        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
          item.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          {item.status}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-gray-100 min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-2xl sticky top-0 z-30 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-yellow-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Activity Log</h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1 font-bold">Media Tracking System</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 w-64 transition-all"
                />
            </div>
            <button
                onClick={fetchData}
                disabled={loading}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all disabled:opacity-30 border border-white/5"
            >
                <RefreshCcw size={18} className={loading ? 'animate-spin' : 'text-yellow-500'} />
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
                        placeholder="Search catalog..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 w-full transition-all"
                    />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAndSortedData.map((item, idx) => (
                  <MediaCard key={idx} item={item} />
                ))}
              </div>

              {filteredAndSortedData.length === 0 && (
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-6 bg-white/5 rounded-full">
                        <Clapperboard size={48} className="text-gray-700" />
                      </div>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No media found matching your search</p>
                  </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer Info */}
      {!import.meta.env.VITE_PROXY_URL && (
        <div className="bg-yellow-500/5 border-t border-yellow-500/10 px-6 py-2 flex items-center gap-3">
          <AlertCircle size={14} className="text-yellow-500" />
          <p className="text-[9px] text-yellow-500/80 uppercase font-black tracking-widest">
            OCI Proxy Offline: Running in local demonstration mode.
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchLogApp;
