import React, { useState, useEffect, useRef, createContext, useContext, memo } from 'react';
import {
  Terminal,
  Activity,
  User,
  Disc,
  LayoutGrid,
  X,
  Minus,
  Battery,
  Wifi,
  Search,
  Sliders,
  Power,
  Gamepad2,
  Tv,
  Headphones,
  Play,
  Pause,
  SkipForward,
  Star,
  BookOpen,
  Clapperboard,
} from 'lucide-react';

const VST_LIST = {
  Dynamics: ['CLA-2A', 'OTT', 'LAxLimit4', 'Vocal Rider', 'kHs Transient Shaper', 'soothe2'],
  'Reverb/Delay': ['Valhalla VintageVerb', 'Valhalla Shimmer', 'Valhalla Supermassive', 'TAL Reverb 4', 'EchoBoy'],
  Instruments: ['Serum', 'Spitfire LABS', 'TyrellN6', 'UVIWorkstation', 'Vital'],
  Creative: ['Fresh Air', 'Super VHS', 'Drip', 'ShaperBox 3', 'kHs Trance Gate'],
  Utility: ['Auto-Tune Access', 'Little AlterBoy', 'HoRNet SongKey'],
};

const ANIME_DATA = {
  user: {
    name: 'AugustElliott',
    avatar: 'bg-blue-600',
    stats: {
      animeCount: 141,
      mangaCount: 1,
      meanScore: 7.9,
    },
  },
  catalogue: [
    { title: 'Berserk', type: 'Manga', score: 9.5, progress: '376+ Ch', cover: 'bg-red-900', status: 'Reading' },
    { title: 'Hunter x Hunter (2011)', type: 'Anime', score: 10, progress: '148 Eps', cover: 'bg-green-600', status: 'Completed' },
    { title: 'Fullmetal Alchemist: B', type: 'Anime', score: 10, progress: '64 Eps', cover: 'bg-red-700', status: 'Completed' },
    { title: 'Steins;Gate', type: 'Anime', score: 10, progress: '24 Eps', cover: 'bg-gray-600', status: 'Completed' },
    { title: 'Vinland Saga Season 2', type: 'Anime', score: 10, progress: '24 Eps', cover: 'bg-yellow-900', status: 'Completed' },
    { title: 'Neon Genesis Evangelion', type: 'Anime', score: 9, progress: '26 Eps', cover: 'bg-purple-700', status: 'Completed' },
    { title: 'Cowboy Bebop', type: 'Anime', score: 9, progress: '26 Eps', cover: 'bg-blue-800', status: 'Completed' },
    { title: 'Attack on Titan Final', type: 'Anime', score: 9, progress: '28 Eps', cover: 'bg-orange-800', status: 'Completed' },
    { title: 'Cyberpunk: Edgerunners', type: 'Anime', score: 9, progress: '10 Eps', cover: 'bg-yellow-400', status: 'Completed' },
    { title: 'Death Note', type: 'Anime', score: 8, progress: '37 Eps', cover: 'bg-gray-800', status: 'Completed' },
    { title: 'Chainsaw Man', type: 'Anime', score: 8, progress: '12 Eps', cover: 'bg-orange-600', status: 'Completed' },
    { title: 'Demon Slayer', type: 'Anime', score: 7, progress: '26 Eps', cover: 'bg-teal-700', status: 'Completed' },
    { title: 'My Hero Academia', type: 'Anime', score: 7, progress: '113 Eps', cover: 'bg-green-500', status: 'Completed' },
    { title: 'Sword Art Online', type: 'Anime', score: 6, progress: '25 Eps', cover: 'bg-blue-400', status: 'Completed' },
  ],
};

const GAMING_DATA = {
  steam: {
    user: 'AugustElliott',
    level: 42,
    gamesCount: 184,
    topPlayed: [
      { name: 'Elden Ring', hours: 124, icon: 'bg-yellow-700' },
      { name: 'Overwatch 2', hours: 400, icon: 'bg-orange-500' },
    ],
  },
  retro: {
    user: 'AugustElliott',
    points: 4520,
    hardcorePoints: 1200,
    recentMastery: 'Final Fantasy VII (PS1)',
  },
};

const TRACKS = [
  {
    title: 'Momentum',
    artist: 'Colin Cherry',
    duration: '2:45',
    lyrics: ['Process initialized...', "Can't stop the motion now", 'Building up the pressure', 'Watching it all break down'],
  },
  {
    title: 'Static Void',
    artist: 'Colin Cherry',
    duration: '3:12',
    lyrics: ['(Waiting for input...)', 'Lost in the noise', 'Signal decaying'],
  },
];

const useDraggable = (initialPosition) => {
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (!e.target.closest('.window-header')) return;
    setIsDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Constrain window to viewport boundaries so it doesn't get lost
        const newX = Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 100));
        const newY = Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 100));
        setPosition({ x: newX, y: newY });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return { position, handleMouseDown };
};

const useTime = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
};

const OSContext = createContext(null);

const OSProvider = ({ children }) => {
  const [bootState, setBootState] = useState('off');
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openWindow = (appId, component, title, icon, initialProps = {}) => {
    if (windows.find((w) => w.id === appId)) {
      focusWindow(appId);
      return;
    }
    const newWindow = {
      id: appId,
      component,
      title,
      icon,
      props: initialProps,
      minimized: false,
      zIndex: windows.length + 1,
      position: { x: isMobile ? 0 : 50 + windows.length * 30, y: isMobile ? 0 : 50 + windows.length * 30 },
    };
    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(appId);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };
  
  const minimizeWindow = (id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1, minimized: false } : w));
    });
  };

  return (
    <OSContext.Provider
      value={{ bootState, setBootState, windows, openWindow, closeWindow, minimizeWindow, focusWindow, activeWindowId, isMobile }}
    >
      {children}
    </OSContext.Provider>
  );
};

const useOS = () => useContext(OSContext);

const TerminalApp = () => {
  const [history, setHistory] = useState(['Colin Cherry Interactive Shell v2.4', 'Connected to Oracle Cloud Instance (Ubuntu)', "Type 'help' for commands."]);
  const [input, setInput] = useState('');
  const [telemetry, setTelemetry] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await fetch('https://129.80.222.26:3000/metrics/');
        if (!response.ok) throw new Error('Bad response');
        const data = await response.json();
        setTelemetry(data);
      } catch (err) {
        setTelemetry({ error: true });
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = `guest@cherry-os:~$ ${input}`;
      switch (cmd) {
        case 'help':
          output += '\nCommands: whoami, ls, clear, reboot, telemetry';
          break;
        case 'whoami':
          output += '\nColin Cherry | IT Pro | Producer | Gamer';
          break;
        case 'ls':
          output += '\nresume.pdf  beats/  projects/  anime_list.json';
          break;
        case 'telemetry':
          if (telemetry && !telemetry.error) {
            output += `\nCPU: ${telemetry.cpu}% | MEM: ${telemetry.mem}% | Uptime: ${Math.floor(telemetry.uptime / 3600)}h ${Math.floor((telemetry.uptime % 3600) / 60)}m`;
          } else {
            output += '\nTelemetry data unavailable. Host unreachable or connection refused.';
          }
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'reboot':
          window.location.reload();
          return;
        default:
          if (cmd) output += `\nError: Command '${cmd}' not recognized.`;
      }
      setHistory((prev) => [...prev, output]);
      setInput('');
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="bg-[#0c0c0c] text-green-500 font-mono text-sm h-full p-4 flex flex-col cursor-text" onClick={(e) => e.stopPropagation()}>
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center mt-2 border-t border-gray-800 pt-2">
        <span className="mr-2 text-yellow-500">guest@cherry-os:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none flex-1 text-green-400 focus:ring-0"
          autoFocus
        />
      </div>
    </div>
  );
};

const MySongsApp = () => {
  const [currentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-[#111] text-white h-full flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-black pointer-events-none" />
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 z-10">
        <div className="w-48 h-48 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 flex items-center justify-center relative overflow-hidden group">
          <div className={`absolute inset-0 bg-yellow-500/20 ${isPlaying ? 'animate-pulse' : ''}`} />
          <Disc size={64} className={`text-yellow-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{currentTrack.title}</h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">{currentTrack.artist}</p>
          <p className="text-xs text-gray-500">{currentTrack.duration}</p>
        </div>
        <div className="w-full max-w-xs bg-black/40 p-4 rounded-lg h-32 overflow-y-auto text-center text-xs font-mono text-gray-300 scrollbar-hide border border-gray-800">
          {currentTrack.lyrics.map((l, i) => (
            <p key={i} className="py-1">
              {l}
            </p>
          ))}
        </div>
      </div>
      <div className="h-20 bg-[#0a0a0a] border-t border-gray-800 z-10 flex items-center justify-center space-x-8">
        <button className="hover:text-yellow-500 transition-colors" aria-label="Previous track">
          <SkipForward size={20} className="rotate-180" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-black hover:bg-yellow-500 shadow-[0_0_15px_rgba(218,165,32,0.4)] transition-all transform hover:scale-105"
          aria-label="Play or pause"
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
        </button>
        <button className="hover:text-yellow-500 transition-colors" aria-label="Next track">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};

const WatchLogApp = () => {
  const { user, catalogue } = ANIME_DATA;
  const [filter, setFilter] = useState('Anime');
  const filteredList = catalogue.filter((item) => item.type === filter).sort((a, b) => b.score - a.score);

  return (
    <div className="bg-[#121212] h-full flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${user.avatar} rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg`}>A</div>
            <div>
              <h2 className="text-white font-bold leading-none">{user.name}</h2>
              <span className="text-[10px] text-gray-400 font-mono">MyAniList.co</span>
            </div>
          </div>
          <div className="flex space-x-4 text-center">
            <div>
              <div className="text-yellow-500 font-bold text-sm">{filter === 'Anime' ? user.stats.animeCount : user.stats.mangaCount}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-wide">Entries</div>
            </div>
            <div>
              <div className="text-green-400 font-bold text-sm">{user.stats.meanScore}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-wide">Mean</div>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-black/40 rounded-lg">
          <button
            onClick={() => setFilter('Anime')}
            className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded text-xs font-bold transition-all ${filter === 'Anime' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Clapperboard size={14} />
            <span>Anime</span>
          </button>
          <button
            onClick={() => setFilter('Manga')}
            className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded text-xs font-bold transition-all ${filter === 'Manga' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <BookOpen size={14} />
            <span>Manga</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
            <Search size={32} />
            <span className="text-xs">No entries found for {filter}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredList.map((show, i) => (
              <div key={i} className="bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-hidden group hover:border-yellow-500/50 transition-all flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div className={`absolute inset-0 ${show.cover} group-hover:scale-105 transition-transform duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-yellow-500 text-black px-2 py-1 rounded font-bold text-xs shadow-lg">
                    <Star size={10} fill="black" />
                    <span>{show.score}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-white/10">{show.progress}</div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center">
                  <h3 className="text-xs font-bold text-white leading-tight mb-1 truncate">{show.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${show.status === 'Completed' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <span className="text-[10px] text-gray-500 uppercase">{show.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GameCenterApp = () => (
  <div className="bg-[#0f0f0f] h-full flex flex-col font-sans text-gray-200" onClick={(e) => e.stopPropagation()}>
    <div className="flex border-b border-gray-800">
      <div className="flex-1 p-3 text-center border-b-2 border-blue-500 bg-gray-800/30">
        <span className="text-xs font-bold">STEAM / PC</span>
      </div>
      <div className="flex-1 p-3 text-center text-gray-500">RETRO</div>
      <div className="flex-1 p-3 text-center text-gray-500">XBOX</div>
    </div>
    <div className="flex-1 p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
            <Gamepad2 size={24} className="text-blue-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{GAMING_DATA.steam.user}</h2>
            <p className="text-xs text-blue-400">
              Level {GAMING_DATA.steam.level} • {GAMING_DATA.steam.gamesCount} Games
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase">Top Played</h3>
        {GAMING_DATA.steam.topPlayed.map((game) => (
          <div key={game.name} className="flex items-center bg-gray-800/40 p-3 rounded-lg border border-gray-700">
            <div className={`w-12 h-12 rounded ${game.icon} mr-4 shadow-lg`} />
            <div className="flex-1">
              <h4 className="font-bold text-sm">{game.name}</h4>
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-sm font-mono text-gray-300">{game.hours}h</div>
              <div className="text-[10px] text-gray-500">Playtime</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-yellow-500">RETROACHIEVEMENTS</span>
          <span className="text-xs font-mono text-yellow-400">{GAMING_DATA.retro.user}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Hardcore Points: {GAMING_DATA.retro.hardcorePoints}</span>
          <span className="text-white font-bold">Mastered: {GAMING_DATA.retro.recentMastery}</span>
        </div>
      </div>
    </div>
  </div>
);

const StudioRackApp = () => (
  <div className="bg-[#1a1a1a] h-full flex flex-col text-gray-300 font-sans" onClick={(e) => e.stopPropagation()}>
    <div className="h-10 bg-black flex items-center px-4 justify-between border-b border-gray-800">
      <span className="text-xs text-gray-500 font-bold tracking-widest">FL STUDIO 21 // COLIN CHERRY</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {Object.entries(VST_LIST).map(([category, plugins]) => (
        <div key={category}>
          <h4 className="text-[10px] font-bold text-yellow-600 mb-2 uppercase tracking-widest">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {plugins.map((plugin) => (
              <div key={plugin} className="bg-black/40 border border-gray-800 p-2 rounded text-xs hover:border-yellow-600/50 hover:text-yellow-100 transition-colors cursor-default">
                {plugin}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WindowFrame = memo(({ window: win }) => {
  const { closeWindow, focusWindow, minimizeWindow, isMobile, activeWindowId } = useOS();
  const { position, handleMouseDown } = useDraggable(win.position);
  if (win.minimized) return null;

  return (
    <div
      className={`absolute shadow-2xl overflow-hidden flex flex-col bg-[#0f0f0f] border ${activeWindowId === win.id ? 'border-yellow-500/60' : 'border-gray-700/50'} backdrop-blur-md pointer-events-auto ${isMobile ? 'inset-0 !top-0 !left-0 !w-full !h-full rounded-none' : 'w-[550px] h-[450px] rounded-xl'}`}
      style={!isMobile ? { left: position.x, top: position.y, zIndex: win.zIndex } : { zIndex: win.zIndex + 999 }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="h-9 bg-[#1a1a1a]/90 border-b border-gray-800 flex items-center justify-between px-3 window-header cursor-grab active:cursor-grabbing select-none"
        onMouseDown={!isMobile ? handleMouseDown : undefined}
      >
        <div className="flex items-center space-x-2 pointer-events-none">
          <win.icon size={14} className="text-yellow-500" />
          <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">{win.title}</span>
        </div>
        <div className="flex items-center space-x-2" onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => minimizeWindow(win.id)} className="hover:bg-gray-700 p-1 rounded transition-colors">
            <Minus size={14} className="text-gray-400" />
          </button>
          <button onClick={() => closeWindow(win.id)} className="hover:bg-red-900/50 hover:text-red-400 p-1 rounded transition-colors">
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <win.component {...win.props} />
      </div>
    </div>
  );
});

const DesktopIcon = memo(({ icon: Icon, label, onClick }) => (
  <div className="flex flex-col items-center justify-center w-32 gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group active:scale-95 pointer-events-auto" onClick={(e) => { e.stopPropagation(); onClick(); }}>
    <div className="w-20 h-20 bg-gradient-to-b from-gray-800 to-black rounded-2xl shadow-xl flex items-center justify-center border border-gray-700 group-hover:border-yellow-500/50 transition-colors relative">
      <Icon size={40} className="text-yellow-500" />
    </div>
    <span className="text-sm text-gray-200 text-center font-semibold tracking-wide bg-black/40 px-3 py-1 rounded-full">{label}</span>
  </div>
));

const Taskbar = () => {
  const { windows, focusWindow, minimizeWindow, activeWindowId, setBootState } = useOS();
  const time = useTime();

  const handleTaskbarClick = (id) => {
    if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="h-14 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-between px-4 fixed bottom-0 w-full z-[9999] pointer-events-auto">
      <div className="flex items-center space-x-4">
        <button onClick={() => setBootState('locked')} className="bg-yellow-600 hover:bg-yellow-500 text-black p-2 rounded-lg transition-colors">
          <LayoutGrid size={20} />
        </button>
        <div className="flex space-x-2">
          {windows.map((win) => (
            <button key={win.id} onClick={() => handleTaskbarClick(win.id)} className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${win.minimized || activeWindowId !== win.id ? 'bg-transparent text-gray-500 hover:bg-white/5' : 'bg-gray-800 text-yellow-500'}`}>
              <win.icon size={18} />
              <span className="text-xs font-bold hidden lg:block">{win.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-4 text-gray-500">
          <Wifi size={16} />
          <Battery size={16} />
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-200">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-[10px] text-gray-500 font-mono tracking-widest">{time.toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

const MobileNav = () => {
  const { setBootState } = useOS();
  return (
    <div className="h-20 bg-black/90 backdrop-blur-xl border-t border-gray-800 flex items-center justify-around px-4 fixed bottom-0 w-full z-[9999] md:hidden pb-4 pointer-events-auto">
      <button onClick={() => setBootState('locked')} className="flex flex-col items-center space-y-1 text-gray-500 hover:text-white">
        <Power size={20} />
        <span className="text-[10px]">Lock</span>
      </button>
      <div className="flex flex-col items-center text-yellow-500">
        <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-600">
          <LayoutGrid size={24} />
        </div>
      </div>
      <button onClick={() => window.location.reload()} className="flex flex-col items-center space-y-1 text-gray-500 hover:text-white">
        <Activity size={20} />
        <span className="text-[10px]">Reset</span>
      </button>
    </div>
  );
};

const Desktop = () => {
  const { openWindow, isMobile, windows } = useOS();
  const APPS = [
    { id: 'songs', title: 'My Songs', icon: Headphones, component: MySongsApp },
    { id: 'watch', title: 'Watch Log', icon: Tv, component: WatchLogApp },
    { id: 'games', title: 'Game Center', icon: Gamepad2, component: GameCenterApp },
    { id: 'studio', title: 'Studio Rack', icon: Sliders, component: StudioRackApp },
    { id: 'term', title: 'Terminal', icon: Terminal, component: TerminalApp },
  ];

  return (
    <div className="h-screen w-screen bg-[#050505] overflow-hidden relative font-sans select-none">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 p-6 md:p-10 grid grid-cols-3 md:flex md:flex-col md:flex-wrap md:h-[calc(100vh-80px)] gap-8 content-start items-start">
        {APPS.map((app) => (
          <DesktopIcon key={app.id} icon={app.icon} label={app.title} onClick={() => openWindow(app.id, app.component, app.title, app.icon)} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="relative w-full h-full pointer-events-none">
          {windows.map((win) => (
            <WindowFrame key={win.id} window={win} />
          ))}
        </div>
      </div>
      {isMobile ? <MobileNav /> : <Taskbar />}
    </div>
  );
};

const LockScreen = () => {
  const { setBootState } = useOS();
  return (
    <div onClick={() => setBootState('desktop')} className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365723-49cfae96c698?q=80&w=2600&auto=format&fit=crop')] bg-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-700" />
      <div className="z-10 text-center space-y-4">
        <div className="w-32 h-32 rounded-full border-2 border-yellow-500/50 flex items-center justify-center mb-6"><User size={48} className="text-yellow-500" /></div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">CHERRY OS</h1>
        <p className="text-gray-400 font-mono text-sm tracking-[0.3em] animate-pulse">TOUCH TO INITIALIZE</p>
      </div>
    </div>
  );
};

const BootScreen = () => {
  const { setBootState } = useOS();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, p + Math.floor(Math.random() * 10));
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) setBootState('locked');
  }, [progress, setBootState]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center font-mono">
      <div className="w-64 space-y-2">
        <div className="flex justify-between text-xs text-green-500">
          <span>BOOT_LOADER</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  const { bootState } = useOS();
  if (bootState === 'off') return <BootScreen />;
  if (bootState === 'locked') return <LockScreen />;
  if (bootState === 'desktop') return <Desktop />;
  return <BootScreen />;
};

export default function App() {
  return (
    <OSProvider>
      <MainContent />
    </OSProvider>
  );
}
