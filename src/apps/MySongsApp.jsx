import { useState, useEffect, useRef } from 'react';
import { Disc, Pause, Play, SkipForward, ArrowLeft, Music, ListMusic, LayoutGrid, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyMusicApp = () => {
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState('library'); // library, album, player
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(new Audio());
  const manifestUrl = "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json";

  const APPLE_MUSIC_URL = "https://music.apple.com/us/artist/colin-cherry/1639040887";
  const SPOTIFY_URL = "https://open.spotify.com/artist/2lCz91g9DugcZhbtvMnaUN";

  useEffect(() => {
    fetch(manifestUrl)
      .then(res => res.json())
      .then(data => {
        setLibrary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load music:", err);
        setLoading(false);
      });

    const audio = audioRef.current;
    const handleEnded = () => skipTrack(1);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (queue.length > 0) {
      const track = queue[currentIndex];
      audioRef.current.src = track.url;
      if (isPlaying) audioRef.current.play().catch(e => console.warn(e));
    }
  }, [currentIndex, queue]);

  const playCollection = (album, startIndex = 0) => {
    const playerQueue = album.tracks.map(t => ({
      ...t,
      albumName: album.album_name,
      artist: album.artist,
      cover_url: album.cover_url
    }));
    setQueue(playerQueue);
    setCurrentIndex(startIndex);
    setIsPlaying(true);
    setView('player');
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (dir) => {
    let next = currentIndex + dir;
    if (next >= queue.length) next = 0;
    if (next < 0) next = queue.length - 1;
    setCurrentIndex(next);
    setIsPlaying(true);
  };

  if (loading) return (
    <div className="bg-[#0a0a0a] h-full flex flex-col items-center justify-center text-yellow-500 font-mono text-sm">
      <Disc className="animate-spin mb-4" size={32} />
      <span>STREAMING_CORE_INITIALIZED...</span>
    </div>
  );

  const PlatformLinks = () => (
    <div className="flex gap-4 items-center">
      <a 
        href={SPOTIFY_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/30 rounded-full transition-all group"
      >
        <div className="w-4 h-4 bg-[#1DB954] rounded-full flex items-center justify-center">
          <Play size={8} fill="black" className="ml-0.5" />
        </div>
        <span className="text-[10px] font-black text-[#1DB954] uppercase tracking-tighter">Spotify</span>
      </a>
      <a 
        href={APPLE_MUSIC_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
      >
        <Music size={12} className="text-pink-500" />
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Apple Music</span>
      </a>
    </div>
  );

  const LibraryView = () => (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">My Music</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Official Releases • {library.length} Collections</p>
        </div>
        <PlatformLinks />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
        {library.map((album, i) => (
          <button 
            key={i}
            onClick={() => {
              if (album.type === 'Single') playCollection(album);
              else { setSelectedAlbum(album); setView('album'); }
            }}
            className="group text-left space-y-3 focus:outline-none"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-gray-900 group-hover:border-yellow-500/30 transition-all group-hover:-translate-y-1">
              <img src={album.cover_url} alt={album.album_name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${album.type === 'Album' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-black'}`}>
                  {album.type}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                <Play fill="currentColor" className="text-white" size={40} />
              </div>
            </div>
            <div className="px-1">
              <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-yellow-500 transition-colors">{album.album_name}</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{album.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const AlbumDetailView = () => (
    <div className="flex-1 overflow-y-auto animate-in slide-in-from-right-4 duration-300">
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <button onClick={() => setView('library')} className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase hover:text-yellow-400">
            <ArrowLeft size={16} /> Back to Library
          </button>
          <PlatformLinks />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:items-end mb-12">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
            <img src={selectedAlbum.cover_url} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Official {selectedAlbum.type}</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">{selectedAlbum.album_name}</h2>
            <p className="text-gray-400 font-bold text-lg">{selectedAlbum.artist} • {selectedAlbum.tracks.length} Tracks</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md">
          {selectedAlbum.tracks.map((track, i) => (
            <button 
              key={i}
              onClick={() => playCollection(selectedAlbum, i)}
              className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0 group"
            >
              <span className="w-6 text-xs font-mono text-gray-600 text-center group-hover:text-yellow-500">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white uppercase tracking-tight">{track.title}</h4>
              </div>
              <div className="flex items-center gap-4">
                <Play size={14} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-10 animate-in zoom-in-95 duration-500 relative">
        <div className="absolute top-10 left-10 flex gap-6 items-center">
          <button onClick={() => setView('library')} className="text-gray-500 hover:text-white transition-colors">
            <LayoutGrid size={24} />
          </button>
          <PlatformLinks />
        </div>

        <div className="relative w-64 h-64 md:w-[28rem] md:h-[28rem] group">
          <div className={`absolute inset-0 bg-yellow-500/20 rounded-3xl blur-3xl transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10 bg-gray-900">
            <img src={current.cover_url} className={`w-full h-full object-cover transition-transform duration-[20s] linear ${isPlaying ? 'scale-125 rotate-3' : 'scale-100'}`} alt="" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">{current.title}</h2>
          <div className="flex flex-col items-center gap-1">
            <p className="text-yellow-500 text-sm md:text-lg font-black tracking-[0.3em] uppercase">{current.artist}</p>
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">{current.albumName}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0a0a0a] text-white h-full flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-yellow-950/20 pointer-events-none" />
      
      {/* Dynamic Viewport */}
      {view === 'library' && <LibraryView />}
      {view === 'album' && <AlbumDetailView />}
      {view === 'player' && <PlayerView />}

      {/* Global Mini-Player */}
      {queue.length > 0 && (
        <div className="h-24 bg-black/90 backdrop-blur-3xl border-t border-white/5 z-40 flex items-center justify-between px-6 md:px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="hidden md:flex items-center gap-4 w-1/3">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <img src={queue[currentIndex].cover_url} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black truncate text-white uppercase tracking-tight">{queue[currentIndex].title}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{queue[currentIndex].artist}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-10 flex-1">
            <button onClick={() => skipTrack(-1)} className="text-gray-500 hover:text-white transition-colors active:scale-90"><SkipForward size={24} className="rotate-180" /></button>
            <button onClick={togglePlay} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-xl">
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={() => skipTrack(1)} className="text-gray-500 hover:text-white transition-colors active:scale-90"><SkipForward size={24} /></button>
          </div>

          <div className="hidden md:flex justify-end items-center gap-6 w-1/3">
             <button onClick={() => setView('player')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${view === 'player' ? 'text-yellow-500' : 'text-gray-500 hover:text-white'}`}>Now Playing</button>
             <button onClick={() => setView('library')} className="text-gray-500 hover:text-white transition-colors"><LayoutGrid size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMusicApp;
