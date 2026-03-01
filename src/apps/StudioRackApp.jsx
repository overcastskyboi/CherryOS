import { ArrowLeft, ExternalLink, Music, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VST_LIST, VST_DETAILS } from '../data/constants';
import LazyImage from '../components/LazyImage';

const StudioRackApp = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] flex flex-col text-gray-300 font-sans pb-20" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/5 rounded-full text-blue-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Studio Rack</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">Production Signal Chain</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-500 uppercase">Engine Active</span>
        </div>
      </div>

      <main className="flex-1 p-6 md:p-12 space-y-12 max-w-7xl mx-auto w-full">
        {/* Featured Plugins Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-l-2 border-blue-500 pl-4">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Featured Hardware & FX</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {VST_DETAILS.map((vst) => (
              <div key={vst.name} className="group bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-2xl flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <LazyImage 
                    src={vst.image} 
                    alt={vst.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest">
                      {vst.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white uppercase italic group-hover:text-blue-400 transition-colors mb-2">
                    {vst.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                    {vst.blurb}
                  </p>
                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <a 
                      href={vst.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Learn More <ExternalLink size={12} />
                    </a>
                    <Info size={16} className="text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Library List (Compact) */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-2 border-gray-700 pl-4">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Complete VST Library</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {Object.entries(VST_LIST).map(([category, plugins]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Music size={14} />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{category}</h4>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 flex flex-wrap gap-2">
                  {plugins.map((plugin) => (
                    <div 
                      key={plugin} 
                      className="bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold text-gray-400 hover:border-blue-500/20 hover:text-blue-300 transition-all cursor-default"
                    >
                      {plugin}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile-Safe Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-40 md:hidden">
        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Studio Engine v2.1.0</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default StudioRackApp;
