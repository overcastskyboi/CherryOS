import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowLeft, Shield, DollarSign, Server, 
  AlertTriangle, CheckCircle, Database, Globe, Lock,
  RefreshCw, TrendingUp
} from 'lucide-react';
import { useOS } from '../context/OSContext';

const CloudDashboardApp = () => {
  const navigate = useNavigate();
  const { isMobile } = useOS();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    latency: 0,
    uptime: 99.99,
    requests: 0,
    status: 'checking'
  });

  // Real-time Simulation Loop
  useEffect(() => {
    const fetchRealMetrics = async () => {
      const start = performance.now();
      try {
        await fetch('https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/healthcheck.txt', { method: 'HEAD', cache: 'no-store' });
        const latency = Math.round(performance.now() - start);
        setMetrics(prev => ({
          ...prev,
          latency,
          status: 'healthy',
          requests: prev.requests + Math.floor(Math.random() * 5) + 1
        }));
      } catch (e) {
        setMetrics(prev => ({ ...prev, status: 'degraded' }));
      }
    };

    fetchRealMetrics();
    const interval = setInterval(fetchRealMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
        activeTab === id 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50 shadow-lg shadow-blue-900/20' 
          : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      {!isMobile && <span>{label}</span>}
    </button>
  );

  const StatCard = ({ label, value, unit, icon: Icon, color, trend }) => (
    <div className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${color}`}>
        <Icon size={64} />
      </div>
      <div className="relative z-10">
        <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">{value}</span>
          <span className="text-xs text-gray-400 font-mono">{unit}</span>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-green-500">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Network Latency" 
          value={metrics.latency} 
          unit="ms" 
          icon={Activity} 
          color="text-green-500" 
          trend="-2% vs avg"
        />
        <StatCard 
          label="System Uptime" 
          value={metrics.uptime} 
          unit="%" 
          icon={Server} 
          color="text-blue-500" 
        />
        <StatCard 
          label="Total Requests" 
          value={(1420 + metrics.requests).toLocaleString()} 
          unit="req" 
          icon={Globe} 
          color="text-purple-500" 
          trend="+12% today"
        />
        <StatCard 
          label="Security Score" 
          value="A+" 
          unit="OWASP" 
          icon={Shield} 
          color="text-yellow-500" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900/50 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              Real-Time Traffic
            </h3>
            <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="h-48 flex items-end gap-1">
            {[...Array(40)].map((_, i) => {
              const height = Math.max(10, Math.random() * 100);
              return (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-600/20 hover:bg-blue-500 transition-colors rounded-t-sm"
                  style={{ height: `${height}%` }} 
                />
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Server size={16} className="text-purple-500" />
            Infrastructure
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-gray-400" />
                <div>
                  <div className="text-xs font-bold text-white">OCI Object Storage</div>
                  <div className="text-[10px] text-gray-500">us-ashburn-1</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-500 font-bold">ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400" />
                <div>
                  <div className="text-xs font-bold text-white">Edge CDN</div>
                  <div className="text-[10px] text-gray-500">Global Anycast</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-500 font-bold">ACTIVE</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-400" />
                <div>
                  <div className="text-xs font-bold text-white">Secret Vault</div>
                  <div className="text-[10px] text-gray-500">Key Management</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                <span className="text-[10px] text-yellow-500 font-bold">PROTECTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCost = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wide">Public Demo Mode</h4>
          <p className="text-xs text-yellow-200/70 mt-1">
            Billing data displayed below is simulated for portfolio demonstration purposes. 
            Actual OCI billing details are private.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Estimated Monthly Spend</h3>
          <div className="space-y-4">
            {[
              { label: 'Compute Instances', val: 0, max: 100 },
              { label: 'Object Storage', val: 45, max: 100 },
              { label: 'Networking (Outbound)', val: 12, max: 100 },
              { label: 'Serverless Functions', val: 28, max: 100 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-mono">${item.val}.00</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Total Forecast</span>
              <span className="text-xl font-black text-green-400">$85.00</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Budget Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
              <CheckCircle size={18} className="text-green-500" />
              <div>
                <div className="text-xs font-bold text-white">Free Tier Limit</div>
                <div className="text-[10px] text-green-400">Usage within limits</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 border border-white/5 rounded-xl opacity-50">
              <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
              <div>
                <div className="text-xs font-bold text-gray-400">Forecast Threshold</div>
                <div className="text-[10px] text-gray-600">Not configured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0b0c10] text-gray-100 min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f1115]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-blue-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              OCI Console
            </h1>
            <p className="text-[10px] font-mono text-gray-500 tracking-widest">US-ASHBURN-1 â€¢ {metrics.status.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <TabButton id="overview" label="Overview" icon={Activity} />
          <TabButton id="cost" label="Cost Analysis" icon={DollarSign} />
          <TabButton id="security" label="Security" icon={Shield} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'cost' && renderCost()}
          {activeTab === 'security' && (
            <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 animate-in zoom-in-95">
              <Shield size={64} className="text-green-500 opacity-20" />
              <h2 className="text-2xl font-bold text-white">Zero Trust Architecture</h2>
              <p className="max-w-md text-gray-500 text-sm">
                All endpoints are secured via strict Content Security Policy (CSP) and serverless proxy verification. 
                Vulnerability scanning is automated via GitHub Actions.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-bold uppercase">SonarJS Enabled</span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase">CSP Strict</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudDashboardApp;
