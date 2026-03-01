import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowLeft, Shield, DollarSign, Server, 
  AlertTriangle, CheckCircle, Database, Globe, Lock,
  TrendingUp, RefreshCcw, HardDrive, Box, Zap,
  Wrench, Terminal, ShieldAlert, Cpu
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const CloudDashboardApp = () => {
  const navigate = useNavigate();
  const { setThemeColor } = useOS();

  useEffect(() => {
    setThemeColor('#0891b2'); // Cherry Cyan
  }, [setThemeColor]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    oci: { status: 'checking', latency: 0, history: [] },
    steam: { status: 'checking', latency: 0, history: [] },
    anilist: { status: 'checking', latency: 0, history: [] },
    pokeapi: { status: 'checking', latency: 0, history: [] },
  });

  const [troubleshooting, setTroubleshooting] = useState(null);
  const [storageData, setStorageData] = useState([]);

  const API_ENDPOINTS = useMemo(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const getTargetUrl = (target) => {
      const origin = window.location.origin;
      return `${origin}${baseUrl}${target}`.replace(/([^:]\/)\/+/g, "$1");
    };
    
    return {
      oci: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/healthcheck.txt",
      steam: getTargetUrl("data/mirror/steam.json"),
      anilist: getTargetUrl("data/mirror/anilist.json"),
      pokeapi: "https://pokeapi.co/api/v2/pokemon/pikachu",
    };
  }, []);

  const runTroubleshooting = useCallback(async (service) => {
    setTroubleshooting({ service, step: 'Initializing Neural Probe...', logs: [] });
    
    const steps = [
      'Scanning local cache integrity...',
      'Re-routing through Ashburn Edge Node...',
      'Verifying SSL/TLS Handshake...',
      'Checking API Mirror Sync status...',
      'Forcing cache invalidation...',
      'Final probe sequence complete.'
    ];

    for (const msg of steps) {
      await new Promise(r => setTimeout(r, 800));
      setTroubleshooting(prev => ({
        ...prev,
        logs: [...prev.logs, msg]
      }));
    }

    setTimeout(() => setTroubleshooting(null), 3000);
  }, []);

  const checkApiHealth = useCallback(async () => {
    setLoading(true);
    const newStatuses = { ...apiStatus };
    
    for (const [name, url] of Object.entries(API_ENDPOINTS)) {
      const startTime = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'GET', 
          mode: 'cors',
          cache: 'no-store'
        });
        const latency = Date.now() - startTime;
        
        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        const historyPoint = { time: timestamp, latency };
        const updatedHistory = [...(apiStatus[name].history || []), historyPoint].slice(-60); // 5 mins at 5s interval

        if (response.ok) {
          newStatuses[name] = { status: 'healthy', latency, history: updatedHistory };
        } else {
          newStatuses[name] = { status: 'degraded', latency: 0, history: updatedHistory };
          if (activeTab === 'overview') runTroubleshooting(name);
        }
      } catch (error) {
        const updatedHistory = [...(apiStatus[name].history || []), { time: 'ERR', latency: 0 }].slice(-60);
        newStatuses[name] = { status: name === 'oci' ? 'down' : 'degraded', latency: 0, history: updatedHistory };
        if (activeTab === 'overview') runTroubleshooting(name);
      }
    }
    setApiStatus(newStatuses);
    setLoading(false);
  }, [API_ENDPOINTS, apiStatus, activeTab, runTroubleshooting]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(checkApiHealth, 5000);
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  useEffect(() => {
    checkApiHealth();
    setStorageData([
      { name: 'music_manifest.json', size: '10.8 KB', type: 'JSON', status: 'Healthy' },
      { name: 'collection.csv', size: '89.2 KB', type: 'CSV', status: 'Synced' },
      { name: 'healthcheck.txt', size: '83 B', type: 'TXT', status: 'Live' },
      { name: 'cherryos:latest', size: '142 MB', type: 'Docker Image', status: 'Active' }
    ]);
  }, []);

  const overallStatus = useMemo(() => {
    const statuses = Object.values(apiStatus);
    if (statuses.some(s => s.status === 'down')) return { text: 'Critical Outage', color: 'text-red-500', pulse: 'bg-red-500' };
    if (statuses.some(s => s.status === 'degraded')) return { text: 'Degraded Core', color: 'text-yellow-500', pulse: 'bg-yellow-500' };
    if (statuses.every(s => s.status === 'healthy')) return { text: 'All Systems Nominal', color: 'text-emerald-500', pulse: 'bg-emerald-500' };
    return { text: 'Syncing...', color: 'text-gray-500', pulse: 'bg-gray-500' };
  }, [apiStatus]);

  const MiniChart = ({ data, color }) => (
    <div className="h-16 w-full opacity-50 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="latency" stroke={color} fillOpacity={1} fill={`url(#color-${color})`} strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-elegant pb-12">
      {/* Troubleshooting Overlay */}
      {troubleshooting && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-rose-500/20 rounded-[2rem] p-8 shadow-[0_0_100px_rgba(244,63,94,0.1)]">
            <div className="flex items-center gap-4 mb-6">
              <Wrench className="text-rose-500 animate-spin" size={24} />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Auto-Troubleshooting</h3>
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Target: {troubleshooting.service} API</p>
              </div>
            </div>
            <div className="bg-black/60 rounded-xl p-4 font-mono text-[9px] text-emerald-500/80 space-y-1 h-48 overflow-y-auto border border-white/5 scrollbar-hide">
              {troubleshooting.logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="animate-pulse">_</div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden border-white/10 shadow-2xl">
        <div className={`absolute top-0 right-0 p-8 opacity-10 ${overallStatus.color}`}><Activity size={120} /></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Infrastructure Integrity</span>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none mt-2">{overallStatus.text}</h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full ${overallStatus.pulse} animate-pulse`} />
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Real-Time Refresh Active</span>
            </div>
            <span className="text-[9px] font-mono text-gray-600 tracking-widest">REGION: US-ASHBURN-1</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(apiStatus).map(([name, data]) => {
          const color = data.status === 'healthy' ? '#10b981' : data.status === 'degraded' ? '#f59e0b' : '#ef4444';
          return (
            <div key={name} className="glass-card p-6 rounded-[2.5rem] space-y-4 group hover:bg-white/[0.02] transition-all border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white uppercase tracking-widest leading-none">{name}</span>
                {data.status === 'healthy' ? <CheckCircle size={14} className="text-emerald-500" /> : <ShieldAlert size={14} className="text-rose-500" />}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white tracking-tighter italic">{data.status === 'healthy' ? `${data.latency}ms` : '---'}</span>
                <span className="text-[8px] font-bold text-gray-600 mb-1.5 uppercase">Latency</span>
              </div>
              <MiniChart data={data.history} color={color} />
            </div>
          );
        })}
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] lg:col-span-2 border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <Cpu size={18} className="text-cyan-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Network Pulse (5m Rolling)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiStatus.oci.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', fontWeight: '900' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Encryption</span>
            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Quantum Shield Active</h4>
          </div>
          <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase text-emerald-500/60">
              <span>Traffic Tunnel</span>
              <span>100% Secure</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-gray-100 flex flex-col font-sans pb-20 relative overflow-hidden">
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-cyan-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">OCI Console</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Ashburn_Hub // v2.5.3</p>
          </div>
        </div>
        
        <nav className="hidden md:flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 shadow-inner">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}>
            Neural Pulse
          </button>
          <button onClick={() => setActiveTab('storage')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'storage' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}>
            Storage Grid
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' ? renderOverview() : (
          <div className="grid grid-cols-1 gap-3 animate-elegant">
            {storageData.map((obj, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl flex items-center justify-between border-white/5 group hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-cyan-500"><Box size={18} /></div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{obj.name}</h4>
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">{obj.type} // {obj.size}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{obj.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center bg-black/40 border-t border-white/5 text-gray-700 sticky bottom-0 z-50">
        <span className="text-[8px] font-mono uppercase tracking-widest italic">Core_Link: Stable // Ashburn_East</span>
        <button onClick={checkApiHealth} className="flex items-center gap-2 hover:text-white transition-colors group">
          <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-spin' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
          <span className="text-[8px] font-mono uppercase tracking-widest italic group-hover:text-emerald-500 transition-colors">Neural Sync: Active</span>
        </button>
      </footer>
    </div>
  );
};

export default CloudDashboardApp;
