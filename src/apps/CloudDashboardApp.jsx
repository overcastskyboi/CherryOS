import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowLeft, Shield, DollarSign, Server, 
  AlertTriangle, CheckCircle, Database, Globe, Lock,
  TrendingUp, RefreshCcw, HardDrive, Box, Zap
} from 'lucide-react';

const CloudDashboardApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    oci: { status: 'checking', latency: 0 },
    steam: { status: 'checking', latency: 0 },
    anilist: { status: 'checking', latency: 0 },
    pokeapi: { status: 'checking', latency: 0 },
  });

  const [storageData, setStorageData] = useState([]);

  const API_ENDPOINTS = useMemo(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    // Robust path joining that preserves the protocol
    const getTargetUrl = (target) => {
      const origin = window.location.origin;
      const combined = `${origin}${baseUrl}${target}`.replace(/([^:]\/)\/+/g, "$1");
      return combined;
    };
    
    return {
      oci: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/healthcheck.txt",
      steam: getTargetUrl("data/mirror/steam.json"),
      anilist: getTargetUrl("data/mirror/anilist.json"),
      pokeapi: "https://pokeapi.co/api/v2/pokemon/pikachu",
    };
  }, []);

  const checkApiHealth = useCallback(async () => {
    setLoading(true);
    const statuses = {};
    
    for (const [name, url] of Object.entries(API_ENDPOINTS)) {
      const startTime = Date.now();
      try {
        // Use GET for pokeapi as it often blocks HEAD requests
        const method = name === 'pokeapi' ? 'GET' : 'GET';
        const response = await fetch(url, { 
          method, 
          mode: 'cors',
          cache: 'no-cache'
        });
        const latency = Date.now() - startTime;
        
        if (response.ok) {
          statuses[name] = { status: 'healthy', latency };
        } else {
          console.warn(`Health check failed for ${name} (${url}): ${response.status}`);
          statuses[name] = { status: 'degraded', latency: 0 };
        }
      } catch (error) {
        console.error(`Health check error for ${name}:`, error);
        statuses[name] = { status: 'down', latency: 0 };
      }
    }
    setApiStatus(statuses);
    setLoading(false);
  }, [API_ENDPOINTS]);
  
  const fetchStorageInfo = useCallback(async () => {
    setStorageData([
      { name: 'music_manifest.json', size: '10.8 KB', type: 'JSON', status: 'Healthy' },
      { name: 'collection.csv', size: '89.2 KB', type: 'CSV', status: 'Synced' },
      { name: 'healthcheck.txt', size: '83 B', type: 'TXT', status: 'Live' },
      { name: 'cherryos:latest', size: '142 MB', type: 'Docker Image', status: 'Active' }
    ]);
  }, []);

  useEffect(() => {
    checkApiHealth();
    fetchStorageInfo();
  }, [checkApiHealth, fetchStorageInfo]);

  const overallStatus = useMemo(() => {
    const statuses = Object.values(apiStatus).map(s => s.status);
    if (statuses.some(s => s === 'down')) return { text: 'Critical Outage', color: 'text-red-500', pulse: 'bg-red-500' };
    if (statuses.some(s => s === 'degraded')) return { text: 'Degraded Performance', color: 'text-yellow-500', pulse: 'bg-yellow-500' };
    if (statuses.every(s => s === 'healthy')) return { text: 'All Systems Operational', color: 'text-emerald-500', pulse: 'bg-emerald-500' };
    return { text: 'Checking Status...', color: 'text-gray-500', pulse: 'bg-gray-500' };
  }, [apiStatus]);

  const StatusIndicator = ({ status }) => {
    if (status === 'healthy') return <CheckCircle size={14} className="text-emerald-500" />;
    if (status === 'degraded') return <AlertTriangle size={14} className="text-yellow-500" />;
    if (status === 'down') return <AlertTriangle size={14} className="text-red-500" />;
    return <RefreshCcw size={14} className="animate-spin text-gray-500" />;
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-elegant">
      <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden border-white/10">
        <div className={`absolute top-0 right-0 p-8 opacity-10 ${overallStatus.color}`}><Activity size={120} /></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Core Integrity</span>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mt-2">{overallStatus.text}</h2>
          <div className="flex items-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${overallStatus.pulse} animate-pulse`} />
            <span className="text-[10px] font-mono text-gray-500 tracking-widest">US-ASHBURN-1 • REAL-TIME MONITOR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(apiStatus).map(([name, data]) => (
          <div key={name} className="glass-card p-6 rounded-[2rem] space-y-4 group hover:bg-white/[0.02] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-white uppercase tracking-widest">{name} API</span>
              <StatusIndicator status={data.status} />
            </div>
            <div className="text-2xl font-black text-white tracking-tighter italic">
              {data.status === 'healthy' ? `${data.latency}ms` : '---'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-8 animate-elegant">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 border-l-2 border-cyan-500 pl-4">
          <HardDrive size={16} className="text-cyan-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Containers</h2>
        </div>
        <button onClick={fetchStorageInfo} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
          <RefreshCcw size={14} className={loading ? 'animate-spin' : 'text-cyan-500'} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {storageData.map((obj, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-cyan-500">
                <Box size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-white uppercase tracking-tight">{obj.name}</h4>
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">{obj.type} // {obj.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{obj.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-gray-100 flex flex-col font-sans pb-20 relative overflow-hidden">
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-cyan-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">OCI Console</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Infrastructure Hub // v2.5.2</p>
          </div>
        </div>
        
        <nav className="hidden md:flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}>
            System Health
          </button>
          <button onClick={() => setActiveTab('storage')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'storage' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}>
            Object Monitor
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' ? renderOverview() : renderStorage()}
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center bg-black/40 border-t border-white/5 text-gray-700">
        <span className="text-[8px] font-mono uppercase tracking-widest">Tenancy_ID: idg3nfddgypd</span>
        <button onClick={checkApiHealth} className="flex items-center gap-2 hover:text-white transition-colors">
          <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500' : overallStatus.pulse} animate-pulse`} />
          <span className="text-[8px] font-mono uppercase tracking-widest italic">{loading ? 'Probing Endpoints...' : 'Refresh Status'}</span>
        </button>
      </footer>
    </div>
  );
};

export default CloudDashboardApp;
