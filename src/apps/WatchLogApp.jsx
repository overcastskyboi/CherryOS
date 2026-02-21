import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Clapperboard, Star, ArrowLeft, RefreshCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ANIME_DATA } from '../data/constants';

const MediaItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['Anime', 'Manga']),
  score: z.number().min(0).max(10),
  progress: z.string(),
  cover: z.string().optional(),
  status: z.string(),
});

const WatchLogApp = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Anime');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(ANIME_DATA.catalogue);

  const syncData = useCallback(async (retries = 3) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // eslint-disable-next-line sonarjs/pseudo-random
          if (Math.random() > 0.95) reject(new Error('Watchlist service temporarily unavailable'));
          else resolve();
        }, 800);
      });
      const validatedData = ANIME_DATA.catalogue.map(item => MediaItemSchema.parse(item));
      setData(validatedData);
    } catch (err) {
      if (retries > 0) return syncData(retries - 1);
      setError(err instanceof Error ? err.message : 'Unknown sync error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncData();
  }, [syncData]);

  const filteredList = data.filter((item) => item.type === filter).sort((a, b) => b.score - a.score);

  return (
    <div className="bg-[#0a0a0a] text-gray-100 min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-yellow-500"
            aria-label="Back to Desktop"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Watch List</h1>
        </div>
        
        <button 
          onClick={() => syncData()}
          disabled={loading}
          className={`p-2 hover:bg-gray-800 rounded-full transition-all ${loading ? 'animate-spin text-gray-500' : 'text-gray-400'}`}
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-gray-900/30 border-b border-gray-800 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFilter('Anime')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all border ${filter === 'Anime' ? 'bg-yellow-600 border-yellow-500 text-black shadow-lg shadow-yellow-600/20' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}
        >
          <Clapperboard size={16} />
          <span>Anime</span>
        </button>
        <button
          onClick={() => setFilter('Manga')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all border ${filter === 'Manga' ? 'bg-yellow-600 border-yellow-500 text-black shadow-lg shadow-yellow-600/20' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}
        >
          <BookOpen size={16} />
          <span>Manga</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-4 text-xs text-gray-500 bg-gray-900/50 p-2 rounded border border-gray-800 text-center">
            Demo Mode: Displaying simulated data. API keys are not configured.
          </div>
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 mb-6">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-500 font-bold text-sm">Sync Error</h3>
                <p className="text-red-200/70 text-xs mt-1">{error}</p>
                <button onClick={() => syncData()} className="mt-3 text-xs font-bold text-red-500 hover:underline">Try Again</button>
              </div>
            </div>
          )}

          {filteredList.length === 0 && !loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-600 gap-4">
              <AlertCircle size={48} className="opacity-20" />
              <span className="text-sm font-medium">No entries found for {filter}</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {filteredList.map((show, i) => (
                <div 
                  key={i} 
                  className="group flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* 2:3 Aspect Ratio Card */}
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 border border-gray-700 shadow-xl group-hover:border-yellow-500/50 transition-all group-hover:-translate-y-1">
                    {/* Uniform stylized cover area */}
                    <div className={`absolute inset-0 ${show.cover || 'bg-gradient-to-br from-gray-700 to-gray-900'} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                      {!show.cover && <Clapperboard size={48} className="text-gray-600 opacity-20" />}
                    </div>
                    
                    {/* Visual Density reduction via Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
                    
                    {/* Metadata Overlays */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded-md font-bold text-[10px] shadow-lg">
                      <Star size={10} fill="black" />
                      <span>{show.score.toFixed(1)}</span>
                    </div>

                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${show.status === 'Completed' ? 'bg-blue-600/90' : 'bg-green-600/90'}`}>
                        {show.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono text-gray-300 border border-white/10 w-fit">
                        {show.progress}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="px-1 h-10 overflow-hidden">
                    <h3 className="text-xs md:text-sm font-bold text-gray-100 leading-snug group-hover:text-yellow-500 transition-colors line-clamp-2">
                      {show.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchLogApp;
