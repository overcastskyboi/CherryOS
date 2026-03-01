import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clapperboard, ArrowLeft, RefreshCcw, Star, AlertCircle, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { ANIME_DATA } from '../data/constants';

const WatchLogApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(ANIME_DATA.catalogue);
  const [searchQuery, setSearchQuery] = useState('');

  const ANILIST_ID = 36296;
  const ANILIST_TOKEN = "U88HlfpPU37Ghu8r3bgHfnuSe7cMQwDpWOWu602w";

  const fetchAniList = useCallback(async () => {
    setLoading(true);
    setError(null);

    const query = `
      query ($userId: Int) {
        MediaListCollection(userId: $userId, type: ANIME) {
          lists {
            name
            entries {
              media {
                id
                title { romaji english }
                coverImage { extraLarge large }
                averageScore
                type
                format
                status
              }
              status
              progress
              score(format: POINT_10)
            }
          }
        }
        MangaList: MediaListCollection(userId: $userId, type: MANGA) {
          lists {
            name
            entries {
              media {
                id
                title { romaji english }
                coverImage { extraLarge large }
                averageScore
                type
                format
                status
              }
              status
              progress
              score(format: POINT_10)
            }
          }
        }
      }
    `;

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${ANILIST_TOKEN}`
        },
        body: JSON.stringify({
          query,
          variables: { userId: ANILIST_ID }
        })
      });

      const json = await response.json();
      if (json.errors) throw new Error(json.errors[0].message);

      const animeLists = json.data.MediaListCollection.lists;
      const mangaLists = json.data.MangaList.lists;

      const allEntries = [...animeLists, ...mangaLists].flatMap(list => list.entries);
      
      const processed = allEntries.map(entry => ({
        title: entry.media.title.english || entry.media.title.romaji,
        type: entry.media.type,
        score: entry.score || entry.media.averageScore / 10 || 0,
        progress: entry.progress ? `${entry.progress} ${entry.media.type === 'ANIME' ? 'Eps' : 'Ch'}` : '---',
        status: entry.status,
        coverImage: entry.media.coverImage.extraLarge || entry.media.coverImage.large,
        id: entry.media.id
      }));

      // Sort by score descending
      processed.sort((a, b) => b.score - a.score);
      
      if (processed.length > 0) setData(processed);
    } catch (err) {
      console.error("AniList Fetch Error:", err);
      setError("Cloud Sync Unavailable. Using local database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAniList();
  }, [fetchAniList]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const MediaCard = ({ item }) => (
    <div className="group relative glass-card rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-500 animate-elegant">
      <div className="aspect-[2/3] relative overflow-hidden">
        <LazyImage
          src={item.coverImage || ANIME_DATA.covers[item.title] || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-yellow-400">
            <Star size={10} className="fill-current" />
            <span className="text-[10px] font-black">{item.score || 'N/A'}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">{item.type}</span>
          <h3 className="text-xs font-black text-white leading-tight line-clamp-2 uppercase italic">{item.title}</h3>
        </div>
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Progress</span>
          <span className="text-[10px] text-gray-300 font-bold">{item.progress}</span>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
          item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
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
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-yellow-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Activity Log</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Satellite // AniList Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Filter database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 w-48 transition-all"
            />
          </div>
          <button 
            onClick={fetchAniList}
            disabled={loading}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all disabled:opacity-30"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-yellow-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {error && (
            <div className="flex items-center justify-center p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl gap-3">
              <AlertCircle size={16} className="text-yellow-500" />
              <p className="text-[10px] text-yellow-500/80 font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredData.map((item, idx) => (
              <MediaCard key={idx} item={item} />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-20">
              <Clapperboard size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Records Found</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Decor */}
      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-white/5 text-gray-700 bg-black/40">
        <span className="text-[8px] font-mono uppercase tracking-widest">User_Link: AugustElliott</span>
        <div className="flex gap-4 items-center">
          <a href="https://anilist.co/user/AugustElliott" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <ExternalLink size={12} />
          </a>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-yellow-500" />
            <div className="w-1 h-1 bg-yellow-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WatchLogApp;
