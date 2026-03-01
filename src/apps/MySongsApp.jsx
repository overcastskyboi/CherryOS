import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Disc, Pause, Play, SkipForward, ArrowLeft, Music, LayoutGrid, AlertCircle, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { MusicManifestSchema } from '../data/schemas';
import { TRACKS } from '../data/constants';

const MyMusicApp = () => {
  const navigate = useNavigate();

  // Data State
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Player State
  const [view, setView] = useState('library'); // library, album, player
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Persistent Audio Element
  const audio = useMemo(() => {
    const a = new Audio();
    a.crossOrigin = 'anonymous';
    return a;
  }, []);
  const seekTimeout = useRef(null);

  const manifestUrl = "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json";
  const APPLE_MUSIC_URL = "https://music.apple.com/us/artist/colin-cherry/1639040887";
  const SPOTIFY_URL = "https://open.spotify.com/artist/2lCz91g9DugcZhbtvMnaUN";

  // --- Audio Logic ---
  const skipTrack = useCallback((dir) => {
    if (queue.length === 0) return;
    let next = currentIndex + dir;
    if (next >= queue.length) next = 0;
    if (next < 0) next = queue.length - 1;
    setCurrentIndex(next);
    setIsPlaying(true);
  }, [currentIndex, queue]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      }).catch((err) => {
        console.warn("Playback failed:", err);
        setAutoplayBlocked(true);
      });
    }
  };

  // --- Data Fetching ---
  const fetchMusicData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);
    try {
      const response = await fetch(manifestUrl);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const json = await response.json();
      const result = MusicManifestSchema.safeParse(json);
      
      if (!result.success) {
        console.error("Schema Validation Failed:", result.error);
        throw new Error("Invalid music manifest format.");
      }

      const sortedLibrary = result.data.sort((a, b) => 
        new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0)
      );

      setLibrary(sortedLibrary);
    } catch (err) {
      console.error("Fetch Failed, entering Demo Mode:", err);
      setIsDemoMode(true);
      const demoAlbum = {
        album_name: "CherryOS Momentum",
        artist: "Colin Cherry",
        type: "EP",
        releaseDate: "2026-01-01",
        cover_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
        tracks: TRACKS.map(t => ({
          title: t.title,
          track_number: t.id,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }))
      };
      setLibrary([demoAlbum]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMusicData();
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [fetchMusicData, audio]);

  useEffect(() => {
    const handleEnded = () => skipTrack(1);
    const handleTimeUpdate = () => { if (!isSeeking) setProgress(audio.currentTime); };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [skipTrack, isSeeking, audio]);

  // Handle Source Changes
  useEffect(() => {
    if (queue.length > 0) {
      const track = queue[currentIndex];
      if (audio.src !== track.url) {
        audio.src = track.url;
        if (isPlaying) {
          audio.play().catch(() => setAutoplayBlocked(true));
        }
      }
    }
  }, [currentIndex, queue, isPlaying, audio]);

  // Sync state with audio element (essential for hardware controls/external interference)
  useEffect(() => {
    const syncState = () => setIsPlaying(!audio.paused);
    audio.addEventListener('play', syncState);
    audio.addEventListener('pause', syncState);
    return () => {
      audio.removeEventListener('play', syncState);
      audio.removeEventListener('pause', syncState);
    };
  }, [audio]);

  const playCollection = (album, startIndex = 0) => {
    const playerQueue = album.tracks.map(t => ({
      ...t,
      albumName: album.album_name,
      artist: album.artist,
      cover_url: album.cover_url
    }));
    setQueue(playerQueue);
    setCurrentIndex(startIndex);
    setView('player');
    
    // Explicit play triggered by user action
    audio.src = playerQueue[startIndex].url;
    audio.play().then(() => {
      setIsPlaying(true);
      setAutoplayBlocked(false);
    }).catch(() => {
      setAutoplayBlocked(true);
    });
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setProgress(newTime);
    setIsSeeking(true);
    clearTimeout(seekTimeout.current);
    seekTimeout.current = setTimeout(() => {
      audio.currentTime = newTime;
      setIsSeeking(false);
    }, 100);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-yellow-500 font-mono text-xs animate-pulse relative z-[100]">
      <Disc className="animate-spin mb-4" size={32} />
      <span>INITIALIZING_AUDIO_CORE...</span>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-white min-h-[100dvh] flex flex-col relative select-none font-sans pb-24 z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-yellow-950/20 pointer-events-none" />

      {/* Header */}
      <div className="bg-black/60 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-yellow-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">My Music</h1>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">
              {isDemoMode ? 'Demo Mode • Local Buffer' : `Official Releases • ${library.length} Collections`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 rounded-full text-[#1DB954] border border-[#1DB954]/20"><Music size={16} /></a>
          <a href={APPLE_MUSIC_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-pink-500 border border-white/10"><Music size={16} /></a>
        </div>
      </div>

      {/* Library Grid */}
      {view === 'library' && (
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 relative z-20">
          {library.map((album, i) => (
            <button key={i} onClick={() => { setSelectedAlbum(album); setView('album'); }} className="group text-left space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-gray-900 group-hover:border-yellow-500/30 transition-all">
                <LazyImage src={album.cover_url} alt={album.album_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play fill="white" className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-sm font-bold truncate uppercase tracking-tight">{album.album_name}</h3>
              <p className="text-[10px] text-gray-500 uppercase font-black">{album.artist}</p>
            </button>
          ))}
        </div>
      )}

      {/* Album Detail */}
      {view === 'album' && selectedAlbum && (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300 relative z-20">
          <button onClick={() => setView('library')} className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Library
          </button>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-gray-900">
              <img src={selectedAlbum.cover_url} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{selectedAlbum.type}</span>
              <h2 className="text-4xl font-black tracking-tighter leading-none uppercase italic">{selectedAlbum.album_name}</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest">{selectedAlbum.artist}</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
            {selectedAlbum.tracks.map((track, i) => (
              <button key={i} onClick={() => playCollection(selectedAlbum, i)} className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
                <span className="text-xs font-mono text-gray-600 w-4">{i + 1}</span>
                <span className="flex-1 text-sm font-bold group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{track.title}</span>
                <Play size={12} className="opacity-0 group-hover:opacity-100 text-yellow-500" fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Full Player */}
      {view === 'player' && queue[currentIndex] && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-in zoom-in-95 duration-500 relative z-30 min-h-[60vh]">
          <button onClick={() => setView('library')} className="absolute top-8 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <LayoutGrid size={24} />
          </button>
          
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
            <img src={queue[currentIndex].cover_url} className="w-full h-full object-cover" alt="" />
            <div className={`absolute inset-0 bg-yellow-500/10 animate-pulse ${isPlaying ? 'block' : 'hidden'}`} />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white leading-tight">{queue[currentIndex].title}</h2>
            <p className="text-yellow-500 text-sm font-black uppercase tracking-widest">{queue[currentIndex].artist}</p>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <input type="range" min="0" max={duration || 0} value={progress} onChange={handleSeek} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => skipTrack(-1)} className="text-gray-500 hover:text-white transition-colors active:scale-90"><SkipForward size={32} className="rotate-180" /></button>
            <button onClick={togglePlay} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all">
              {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
            </button>
            <button onClick={() => skipTrack(1)} className="text-gray-500 hover:text-white transition-colors active:scale-90"><SkipForward size={32} /></button>
          </div>

          {autoplayBlocked && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full animate-bounce">
              <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">Action Required: Click Play to Start Audio</p>
            </div>
          )}
        </div>
      )}

      {/* Mini Player */}
      {queue.length > 0 && view !== 'player' && (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-2xl border-t border-white/5 px-6 flex items-center justify-between z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 w-1/3 cursor-pointer group" onClick={() => setView('player')}>
            <img src={queue[currentIndex].cover_url} className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-yellow-500/50 transition-all bg-gray-900" alt="" />
            <div className="min-w-0">
              <div className="text-xs font-black truncate uppercase text-white group-hover:text-yellow-500 transition-colors">{queue[currentIndex].title}</div>
              <div className="text-[9px] text-gray-500 uppercase font-bold truncate">{queue[currentIndex].artist}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => skipTrack(-1)} className="hover:text-white transition-colors"><SkipForward size={18} className="rotate-180 text-gray-500" /></button>
            <button onClick={togglePlay} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg">
              {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
            </button>
            <button onClick={() => skipTrack(1)} className="hover:text-white transition-colors"><SkipForward size={18} className="text-gray-500" /></button>
          </div>
          <div className="w-1/3 hidden md:block px-4">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMusicApp;
