import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Globe, Database, Activity, X } from 'lucide-react';

const StatusPill = ({ label, icon: Icon, state, latency }) => {
  const colors = {
    online: 'text-green-500 bg-green-500/10 border-green-500/20',
    checking: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 animate-pulse',
    offline: 'text-red-500 bg-red-500/10 border-red-500/20',
    error: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    demo: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${colors[state] || colors.offline}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black uppercase">{state}</span>
        {latency > 0 && <span className="text-[8px] font-mono opacity-60">{latency}ms</span>}
      </div>
    </div>
  );
};

const SystemHealth = ({ onClose }) => {
  const [status, setStatus] = useState({
    oci: { state: 'checking', latency: 0 },
    proxy: { state: 'checking', latency: 0 },
    storage: { state: 'checking', used: '...' }
  });

  const checkConnectivity = useCallback(async () => {
    // Check OCI
    const startOci = Date.now();
    try {
      const res = await fetch('https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/healthcheck.txt', { method: 'HEAD', cache: 'no-store' });
      setStatus(prev => ({ ...prev, oci: { state: res.ok ? 'online' : 'error', latency: Date.now() - startOci } }));
    } catch {
      setStatus(prev => ({ ...prev, oci: { state: 'offline', latency: 0 } }));
    }

    // Check Proxy
    const startProxy = Date.now();
    const PROXY_URL = import.meta.env.VITE_PROXY_URL;
    if (PROXY_URL) {
      try {
        const res = await fetch(`${PROXY_URL}/health`, { method: 'GET' });
        setStatus(prev => ({ ...prev, proxy: { state: res.ok ? 'online' : 'restricted', latency: Date.now() - startProxy } }));
      } catch {
        setStatus(prev => ({ ...prev, proxy: { state: 'offline', latency: 0 } }));
      }
    } else {
      setStatus(prev => ({ ...prev, proxy: { state: 'demo', latency: 0 } }));
    }
  }, [setStatus]); // Dependency on setStatus, which is stable

  useEffect(() => {
    const init = async () => {
      await checkConnectivity();
    };
    init();

    const interval = setInterval(checkConnectivity, 30000);
    return () => clearInterval(interval);
  }, [checkConnectivity]); // Dependency on checkConnectivity

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[1000] animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck size={20} className="text-yellow-500" />
          <h2 className="text-sm font-black uppercase tracking-tighter italic">Core Integrity</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <StatusPill label="OCI Storage" icon={Database} state={status.oci.state} latency={status.oci.latency} />
        <StatusPill label="Secure Proxy" icon={Globe} state={status.proxy.state} latency={status.proxy.latency} />
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-600 uppercase tracking-widest">
          <span>System Status</span>
          <div className="flex items-center gap-1 text-green-500/50">
            <Activity size={10} />
            <span>Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;