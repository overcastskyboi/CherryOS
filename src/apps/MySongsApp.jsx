import { useState, useEffect, useRef, useCallback } from 'react';
import { Disc, Pause, Play, SkipForward, ArrowLeft, Music, LayoutGrid, AlertCircle, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { MusicManifestSchema, TrackSchema, AlbumSchema } from '../data/schemas';

const MyMusicApp = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // Data State
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const audioRef = useRef(null);
  const seekTimeout = useRef(null);
  
    useEffect(() => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
  
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current = null;
        }
      };
    }, []);
  const manifestUrl = "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json";

  const APPLE_MUSIC_URL = "https://music.apple.com/us/artist/colin-cherry/1639040887";
  const SPOTIFY_URL = "https://open.spotify.com/artist/2lCz91g9DugcZhbtvMnaUN";

  // --- Audio Logic ---
  const skipTrack = useCallback((dir) => {
    let next = currentIndex + dir;
    if (next >= queue.length) next = 0;
    if (next < 0) next = queue.length - 1;
    setCurrentIndex(next);
    setIsPlaying(true);
  }, [currentIndex, queue]);

  // --- Data Fetching ---
  const fetchMusicData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(manifestUrl);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const json = await response.json();

      // Validate Data Schema
      const result = MusicManifestSchema.safeParse(json);
      if (!result.success) {
        console.error("Schema Validation Failed:", result.error);
        throw new Error("Invalid music manifest format.");
      }

      // Sort: Newest to Oldest
      const sortedLibrary = result.data.sort((a, b) => {
        return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
      });

      setLibrary(sortedLibrary);
    } catch (err) {
      console.error("Fetch Failed:", err);
      setError(err.message || "Failed to load music library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMusicData();

    // Audio Cleanup
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [fetchMusicData]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => skipTrack(1);
    const handleTimeUpdate = () => {
        if (!isSeeking) {
          setProgress(audio.currentTime);
        }
      };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleError = (e) => {
        console.error("Audio Error:", e);
        setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
          }
    
          clearTimeout(seekTimeout.current);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
        };
  }, [queue, currentIndex, skipTrack, isSeeking, handleEnded, handleTimeUpdate, handleLoadedMetadata, handleError]); // Added all dependencies

  useEffect(() => {
    if (queue.length > 0) {
      const track = queue[currentIndex];
      // Only change src if it's different to prevent reloading
      if (audioRef.current.src !== track.url) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        if (isPlaying) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            console.warn("Autoplay blocked:", e);
                            // Fallback: show user notification to click play
                            setAutoplayBlocked(true);
                        });
                    }
                }
      } else {
          if (isPlaying && audioRef.current.paused) {
                         const playPromise = audioRef.current.play();
                         if (playPromise !== undefined) {
                             playPromise.catch(e => {
                                 console.warn("Play failed:", e);
                                 setAutoplayBlocked(true);
                             });
                         }
                     }
      }
    }
  }, [currentIndex, queue, isPlaying]);

  const validateTrackDuration = (duration) => {
      if (!duration || duration === '--:--') return 0;
      
      const parts = duration.split(':');
      if (parts.length !== 2) return 0;
      
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      
      if (isNaN(minutes) || isNaN(seconds)) return 0;
      
      return minutes * 60 + seconds;
    };
  
    const validateTrack = (track) => {
      const validatedTrack = TrackSchema.parse({
        ...track,
        duration: validateTrackDuration(track.duration)
      });
      return validatedTrack;
    };
  
    const validateAlbum = (album) => {
      const validatedAlbum = AlbumSchema.parse(album);
      return {
        ...validatedAlbum,
        tracks: validatedAlbum.tracks.map(validateTrack)
      };
    };
  
    const playCollection = (album, startIndex = 0) => {
      const validatedAlbum = validateAlbum(album);
      const playerQueue = validatedAlbum.tracks.map(t => ({
        ...t,
        albumName: validatedAlbum.album_name,
        artist: validatedAlbum.artist,
        cover_url: validatedAlbum.cover_url
      }));
      setQueue(playerQueue);
      setCurrentIndex(startIndex);
      setIsPlaying(true);
      setView('player');
    };

  const togglePlay = () => {
    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play().catch(e => console.error("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
      setIsSeeking(true);
      
      // Debounce seeking to prevent rapid updates
      clearTimeout(seekTimeout.current);
      seekTimeout.current = setTimeout(() => {
        setIsSeeking(false);
      }, 100);
  };

  const formatTime = (time) => {
      if (!time) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // --- Components ---

  const LoadingState = () => (
    <div className="h-full flex flex-col items-center justify-center text-yellow-500 font-mono text-xs animate-pulse">
      <Disc className="animate-spin mb-4" size={32} />
      <span>INITIALIZING_AUDIO_CORE...</span>
    </div>
  );

  const ErrorState = () => (
    <div className="h-full flex flex-col items-center justify-center text-red-500 space-y-4">
      <img src="assets/images/cloud_mascot.png" alt="Cloud Mascot" className="w-24 h-24 mb-4" />
      <AlertCircle size={48} />
      <div className="text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Connection Error</h2>
        <p className="text-sm text-red-400/60 font-mono mt-2">{error}</p>
      </div>
      <button
        onClick={fetchMusicData}
        className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
      >
        <RefreshCcw size={14} /> Retry Connection
      </button>
    </div>
  );

  const PaginationControls = () => {
      const totalPages = Math.ceil(library.length / ITEMS_PER_PAGE);
      if (totalPages <= 1) return null;

      return (
          <div className="flex items-center justify-center gap-4 mt-8 pb-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                  <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-mono text-gray-500">PAGE {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                  <ChevronRight size={20} />
              </button>
          </div>
      );
  };

  const LibraryView = () => {
      const paginatedLibrary = library.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
      );

      return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 mb-8 gap-4">
            <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">My Music</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Official Releases â€¢ {library.length} Collections</p>
            </div>
            <div className="flex gap-3">
                <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 rounded-full transition-colors text-[#1DB954] border border-[#1DB954]/20"><Music size={16} /></a>
                <a href={APPLE_MUSIC_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-pink-500 border border-white/10"><Music size={16} /></a>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {paginatedLibrary.map((album, i) => (
            <button
                key={i}
                onClick={() => {
                if (album.type === 'Single') playCollection(album);
                else { setSelectedAlbum(album); setView('album'); }
                }}
                className="group text-left space-y-3 focus:outline-none w-full"
            >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-gray-900 group-hover:border-yellow-500/30 transition-all group-hover:-translate-y-1">
                <LazyImage
                    src={album.cover_url}
                    alt={album.album_name}
                    className="w-full h-full"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${album.type === 'Album' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-black'}`}>
                    {album.type}
                    </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                        <Play fill="black" className="text-black ml-1" size={20} />
                    </div>
                </div>
                </div>
                <div className="px-1">
                <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-yellow-500 transition-colors">{album.album_name}</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{album.artist}</p>
                </div>
            </button>
            ))}
        </div>

        <PaginationControls />
        </div>
      );
  };

  const AlbumDetailView = () => (
    <div className="flex-1 overflow-y-auto animate-in slide-in-from-right-4 duration-300 bg-black/20">
      <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
        <button onClick={() => setView('library')} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Return to Library
        </button>

        <div className="flex flex-col md:flex-row gap-8 md:items-end mb-12">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-gray-900">
            <LazyImage src={selectedAlbum.cover_url} alt={selectedAlbum.album_name} className="w-full h-full" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] bg-blue-500/10 px-2 py-1 rounded">Official {selectedAlbum.type}</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none mt-2">{selectedAlbum.album_name}</h2>
            <div className="flex items-center gap-3 text-gray-400 font-bold text-sm uppercase tracking-widest mt-4">
                <span>{selectedAlbum.artist}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span>{selectedAlbum.tracks.length} Tracks</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md">
          {selectedAlbum.tracks.map((track, i) => (
            <button
              key={i}
              onClick={() => playCollection(selectedAlbum, i)}
              className="w-full flex items-center gap-4 p-5 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0 group"
            >
              <span className="w-8 text-xs font-mono text-gray-600 text-center group-hover:text-yellow-500 transition-colors">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white uppercase tracking-tight transition-colors">{track.title}</h4>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400">{track.duration || "--:--"}</span>
                 <Play size={14} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0" fill="currentColor" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const PlayerView = () => {
    const current = queue[currentIndex];
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-10 animate-in zoom-in-95 duration-500 relative z-10">
        <div className="absolute top-6 left-6 md:top-10 md:left-10 flex gap-4 items-center z-20">
          <button onClick={() => setView('library')} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <LayoutGrid size={24} />
          </button>
        </div>

        <div className="relative w-64 h-64 md:w-96 md:h-96 group perspective-1000">
          <div className={`absolute inset-0 bg-yellow-500/20 rounded-full blur-3xl transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-gray-900 transform transition-transform duration-500 hover:scale-105">
            <LazyImage src={current.cover_url} alt={current.title} className={`w-full h-full transition-transform duration-[30s] linear ${isPlaying ? 'scale-110' : 'scale-100'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>

        <div className="text-center space-y-2 max-w-lg px-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-tight">{current.title}</h2>
          <div className="flex flex-col items-center gap-1">
            <p className="text-yellow-500 text-xs md:text-sm font-black tracking-[0.3em] uppercase">{current.artist}</p>
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">{current.albumName}</p>
          </div>
        </div>

        {/* Progress Bar (Visual Only for now) */}
        <div className="w-full max-w-md flex items-center gap-4 text-[10px] font-mono text-gray-500">
            <span>{formatTime(progress)}</span>
            <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={(e) => {
                              const newProgress = parseFloat(e.target.value);
                              setProgress(newProgress);
                              setIsSeeking(true);
                              
                              // Debounce seeking to prevent rapid updates
                              clearTimeout(seekTimeout.current);
                              seekTimeout.current = setTimeout(() => {
                                if (audioRef.current) {
                                  audioRef.current.currentTime = newProgress;
                                }
                                setIsSeeking(false);
                              }, 100);
                            }}
                            onMouseUp={() => {
                              if (audioRef.current && isSeeking) {
                                audioRef.current.currentTime = progress;
                                setIsSeeking(false);
                              }
                            }}
                            className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
            <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 md:gap-12">
            <button onClick={() => skipTrack(-1)} className="text-gray-500 hover:text-white transition-colors active:scale-90 p-4"><SkipForward size={32} className="rotate-180" /></button>
            <button
                onClick={togglePlay}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-yellow-500/20"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={() => skipTrack(1)} className="text-gray-500 hover:text-white transition-colors active:scale-90 p-4"><SkipForward size={32} /></button>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="bg-[#0a0a0a] text-white min-h-[100dvh] flex flex-col relative select-none font-sans pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-yellow-950/20 pointer-events-none" />

      {/* Main Viewport */}
      {view === 'library' && <LibraryView />}
      {view === 'album' && <AlbumDetailView />}
      {view === 'player' && <PlayerView />}

      {/* Persistent Mini-Player */}
      {queue.length > 0 && view !== 'player' && (
        <div className="h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-between px-6 md:px-12 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500">
          <div className="flex items-center gap-4 w-1/3 cursor-pointer group" onClick={() => setView('player')}>
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shadow-lg relative">
              <LazyImage src={queue[currentIndex].cover_url} alt="" className="w-full h-full" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LayoutGrid size={16} className="text-white" />
              </div>
            </div>
            <div className="min-w-0 hidden md:block">
              <div className="text-xs font-black truncate text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">{queue[currentIndex].title}</div>
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">{queue[currentIndex].artist}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 flex-1">
            <button onClick={() => skipTrack(-1)} className="text-gray-500 hover:text-white transition-colors active:scale-90"><SkipForward size={20} className="rotate-180" /></button>
            <button onClick={togglePlay} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg">
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={() => skipTrack(1)} className="text-gray-500 hover:text-white transition-colors active:scale-90"><SkipForward size={20} /></button>
          </div>

          <div className="hidden md:flex justify-end items-center gap-6 w-1/3">
             <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-500" style={{ width: `${(progress / duration) * 100}%` }} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMusicApp;
