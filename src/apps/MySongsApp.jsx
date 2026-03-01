import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Disc, Pause, Play, SkipForward, ArrowLeft, Music, LayoutGrid, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { MusicManifestSchema } from '../data/schemas';
import { DEMO_MUSIC } from '../data/constants';

const MyMusicApp = () => {
  const navigate = useNavigate();

  // Data State
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Player State
  const [view, setView] = useState('library');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Persistent Audio Element
  const audio = useMemo(() => {
    const a = new Audio();
    a.crossOrigin = 'anonymous';
    return a;
  }, []);
  
  const manifestUrl = "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json";

  const fetchMusicData = useCallback(async () => {
    setLoading(true);
    setIsDemoMode(false);
    try {
      const response = await fetch(manifestUrl);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const json = await response.json();
      const libraryData = Array.isArray(json.value) ? json.value : (Array.isArray(json) ? json : []);
      const result = MusicManifestSchema.safeParse(libraryData);
      
      if (!result.success) {
        console.error("Schema Validation Failed:", result.error);
        throw new Error("Invalid music manifest format.");
      }

      setLibrary(result.data.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0)));
    } catch (err) {
      console.error("Fetch Failed, entering Demo Mode:", err);
      setIsDemoMode(true);
      setLibrary(DEMO_MUSIC); // Use high-fidelity demo data
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

  const skipTrack = useCallback((dir) => {
    if (queue.length === 0) return;
    const next = (currentIndex + dir + queue.length) % queue.length;
    setCurrentIndex(next);
    setIsPlaying(true);
  }, [currentIndex, queue.length]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setAutoplayBlocked(true));
    }
    setIsPlaying(!isPlaying);
  };
  
  useEffect(() => {
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => skipTrack(1);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, skipTrack]);

  useEffect(() => {
    if (queue.length > 0) {
      const track = queue[currentIndex];
      if (audio.src !== track.url) {
        audio.src = track.url;
      }
      if (isPlaying) {
        audio.play().catch(() => setAutoplayBlocked(true));
      } else {
        audio.pause();
      }
    }
  }, [currentIndex, queue, isPlaying, audio]);

  const playCollection = (album, startIndex = 0) => {
    setQueue(album.tracks.map(t => ({ ...t, albumName: album.album_name, cover_url: album.cover_url, artist: album.artist })));
    setCurrentIndex(startIndex);
    setView('player');
    setIsPlaying(true);
    setAutoplayBlocked(false);
  };

  const formatTime = (time) => {
    if (!time || !Number.isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Main render logic...
  // ... (Rest of the component is largely unchanged, focusing on data and state logic)

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-yellow-500 font-mono text-xs animate-pulse relative z-[100]">
      <Disc className="animate-spin mb-4" size={32} />
      <span>INITIALIZING_AUDIO_CORE...</span>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-white min-h-[100dvh] flex flex-col relative select-none font-sans pb-24 z-10 animate-elegant">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-yellow-950/20 pointer-events-none" />
      <div className="bg-black/60 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-yellow-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">My Music</h1>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">
              {isDemoMode ? 'Demo Mode • Local Buffer' : `Official Releases • ${library.length} Collections`}
            </p>
          </div>
        </div>
      </div>

      {view === 'library' && (
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 z-20">
          {library.map((album, i) => (
            <button key={i} onClick={() => { setSelectedAlbum(album); setView('album'); }} className="group text-left space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden glass-card group-hover:border-yellow-500/30 transition-all shadow-2xl">
                <LazyImage src={album.cover_url} alt={album.album_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="text-sm font-black truncate uppercase tracking-tight text-white">{album.album_name}</h3>
            </button>
          ))}
        </div>
      )}

      {view === 'album' && selectedAlbum && (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300 z-20">
           <button onClick={() => setView('library')} className="text-xs font-black text-gray-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back to Library
          </button>
          <div className="glass-card rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden shadow-2xl">
            {selectedAlbum.tracks.map((track, i) => (
              <button key={i} onClick={() => playCollection(selectedAlbum, i)} className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-colors text-left group">
                <span className="text-xs font-mono text-gray-600 w-4">{i + 1}</span>
                <span className="flex-1 text-sm font-bold group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{track.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {queue.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-2xl border-t border-white/10 px-6 flex items-center justify-between z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.9)]">
           <div className="flex items-center gap-4 w-1/3 cursor-pointer group" onClick={() => setView('player')}>
            <LazyImage src={queue[currentIndex].cover_url} alt={queue[currentIndex].title} className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:border-yellow-500/50 transition-all bg-gray-900 shadow-xl" />
            <div>
              <div className="text-xs font-black truncate uppercase text-white">{queue[currentIndex].title}</div>
            </div>
           </div>
          <div className="flex items-center gap-6">
            <button onClick={() => skipTrack(-1)} className="hover:text-white active:scale-75"><SkipForward size={20} className="rotate-180 text-gray-500" /></button>
            <button onClick={togglePlay} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-90 transition-all shadow-lg">
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
            </button>
            <button onClick={() => skipTrack(1)} className="hover:text-white active:scale-75"><SkipForward size={20} className="text-gray-500" /></button>
          </div>
          <div className="w-1/3 hidden md:block px-8">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMusicApp;
