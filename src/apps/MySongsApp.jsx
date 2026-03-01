import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Disc, Pause, Play, SkipForward, ArrowLeft, Music, LayoutGrid, AlertCircle, RefreshCcw } from 'lucide-react';
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

  const audioRef = useRef(new Audio());
  
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
      
      if (!result.success) throw new Error("Invalid schema");

      setLibrary(result.data.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0)));
    } catch (err) {
      console.warn("Fetch Failed, entering Demo Mode");
      setIsDemoMode(true);
      setLibrary(DEMO_MUSIC);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMusicData();
    const audio = audioRef.current;
    audio.crossOrigin = 'anonymous';
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [fetchMusicData]);

  const skipTrack = useCallback((dir) => {
    if (queue.length === 0) return;
    const next = (currentIndex + dir + queue.length) % queue.length;
    setCurrentIndex(next);
    setIsPlaying(true);
  }, [currentIndex, queue.length]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Autoplay blocked", e));
    }
    setIsPlaying(!isPlaying);
  };
  
  useEffect(() => {
    const audio = audioRef.current;
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
  }, [skipTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (queue.length > 0) {
      const track = queue[currentIndex];
      if (audio.src !== track.url) {
        audio.src = track.url;
      }
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [currentIndex, queue, isPlaying]);

  const playCollection = (album, startIndex = 0) => {
    setQueue(album.tracks.map(t => ({ ...t, albumName: album.album_name, cover_url: album.cover_url, artist: album.artist })));
    setCurrentIndex(startIndex);
    setIsPlaying(true);
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-yellow-500 font-mono text-xs animate-pulse">
      <Disc className="animate-spin mb-4" size={32} />
      <span>INITIALIZING_AUDIO_CORE...</span>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] text-white min-h-[100dvh] flex flex-col relative select-none font-sans pb-24 z-10 animate-elegant">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-yellow-950/20 pointer-events-none" />
      
      <header className="bg-black/60 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-yellow-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">My Music</h1>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">
              {isDemoMode ? 'Demo Mode // Local Buffer' : `Official Releases // ${library.length} Collections`}
            </p>
          </div>
        </div>
        <button onClick={fetchMusicData} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
          <RefreshCcw size={18} />
        </button>
      </header>

      <main className="flex-1 p-6 relative z-20">
        {view === 'library' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {library.map((album, i) => (
              <button 
                key={i} 
                onClick={() => { setSelectedAlbum(album); setView('album'); }}
                className="group text-left space-y-3 focus:outline-none"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden glass-card group-hover:border-yellow-500/30 transition-all shadow-2xl">
                  <LazyImage 
                    src={album.cover_url} 
                    alt={album.album_name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-black truncate uppercase tracking-tight text-white">{album.album_name}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{album.artist}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {view === 'album' && selectedAlbum && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => setView('library')} className="text-xs font-black text-gray-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Library
            </button>
            
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl glass-card">
                <LazyImage src={selectedAlbum.cover_url} alt={selectedAlbum.album_name} />
              </div>
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">{selectedAlbum.type}</span>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{selectedAlbum.album_name}</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{selectedAlbum.artist} • {selectedAlbum.releaseDate}</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden shadow-2xl">
              {selectedAlbum.tracks.map((track, i) => (
                <button 
                  key={i} 
                  onClick={() => playCollection(selectedAlbum, i)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-colors text-left group"
                >
                  <span className="text-xs font-mono text-gray-600 w-4">{i + 1}</span>
                  <span className="flex-1 text-sm font-bold group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{track.title}</span>
                  <Music size={14} className="text-gray-800 group-hover:text-yellow-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {queue.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-2xl border-t border-white/10 px-6 flex items-center justify-between z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-4 w-1/3 cursor-pointer group" onClick={() => setView('album')}>
            <LazyImage src={queue[currentIndex].cover_url} alt={queue[currentIndex].title} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
            <div className="min-w-0">
              <div className="text-xs font-black truncate uppercase text-white tracking-tight">{queue[currentIndex].title}</div>
              <div className="text-[9px] text-gray-500 font-bold truncate uppercase tracking-widest">{queue[currentIndex].artist}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button onClick={() => skipTrack(-1)} className="hover:text-white transition-colors"><SkipForward size={20} className="rotate-180" /></button>
              <button onClick={togglePlay} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all">
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
              </button>
              <button onClick={() => skipTrack(1)} className="hover:text-white transition-colors"><SkipForward size={20} /></button>
            </div>
          </div>

          <div className="w-1/3 flex justify-end items-center gap-4">
            <div className="hidden md:block w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono text-gray-500 w-10 text-right">{Math.floor(progress / 60)}:{(Math.floor(progress % 60)).toString().padStart(2, '0')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMusicApp;
