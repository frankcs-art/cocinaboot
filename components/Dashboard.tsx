import React from 'react';
import { Sparkles, Loader2, BrainCircuit, ShoppingBag, AlertTriangle, PieChart, ArrowUpRight, Filter, Calendar } from 'lucide-react';
import { InventoryItem } from '../types';

interface DashboardProps {
  stats: {
    criticalItems: number;
    unreadNotifications: number;
  };
  inventory: InventoryItem[];
  getDailySuggestion: () => void;
  isLoading: boolean;
  setTab: (tab: string) => void;
  isHighDemand: boolean;
  setIsHighDemand: (val: boolean) => void;
}

const MetricCard: React.FC<{ title: string; value: any; icon: React.ReactNode; trend: string; color?: string }> = ({ title, value, icon, trend, color }) => (
  <div className="bg-zinc-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/20 flex flex-col justify-between shadow-xl h-full group hover:border-emerald-500/30 transition-all">
    <div className="flex justify-between items-start">
       <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">{title}</span>
       <div className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <div className="mt-2 md:mt-4">
      <p className={`text-2xl md:text-4xl font-black ${color || 'text-white'}`}>{value}</p>
      <p className="text-[9px] md:text-[10px] font-bold text-slate-500 mt-1 md:mt-2 uppercase tracking-wide">{trend}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ stats, inventory, getDailySuggestion, isLoading, setTab, isHighDemand, setIsHighDemand }) => {
  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/20 relative overflow-hidden flex flex-col justify-between shadow-2xl">
           <div className="relative z-10 max-w-lg">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full mb-4 md:mb-6 border border-emerald-500/20">
                <Sparkles size={12} /> Jules - IA Logística
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">Gestión Predictiva "Desperdicio Cero"</h3>
              <p className="text-slate-500 mt-2 md:mt-4 text-sm md:text-base font-medium leading-relaxed">Analizamos tu flujo operativo en tiempo real para garantizar continuidad total.</p>
           </div>

           <div className="mt-6 md:mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isHighDemand ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-slate-500'}`}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">Ajuste de Eventos</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{isHighDemand ? 'Alta Demanda (+30% Perecederos)' : 'Operación Normal'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHighDemand(!isHighDemand)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isHighDemand ? 'bg-rose-500' : 'bg-zinc-700'}`}
                  role="switch"
                  aria-checked={isHighDemand}
                  aria-label="Alternar modo de alta demanda"
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHighDemand ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
           </div>

           <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 relative z-10">
             <button 
               onClick={getDailySuggestion}
               disabled={isLoading}
               className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all shadow-[0_15px_40px_-10px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3"
             >
               {isLoading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
               Generar Pedido Sugerido
             </button>
             <button 
                onClick={() => setTab('chat')}
                className="px-6 md:px-8 py-3.5 md:py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all border border-white/10 active:scale-95 flex items-center justify-center"
             >
               Consultar a Jules
             </button>
           </div>
           <div className="absolute top-[-50px] right-[-50px] w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          <MetricCard title="Total Productos" value={inventory.length} icon={<ShoppingBag className="text-emerald-400" />} trend="En inventario" />
          <MetricCard title="Estado Crítico" value={stats.criticalItems} icon={<AlertTriangle className="text-rose-500" />} trend="Acción Inmediata" color="text-rose-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-zinc-900/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/20 flex flex-col gap-3 md:gap-4">
           <div className="flex items-center justify-between">
              <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Continuidad Operativa</p>
              <PieChart size={16} className="text-emerald-500" />
           </div>
           <p className="text-2xl md:text-4xl font-black text-white">100%</p>
           <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full transition-all duration-1000"></div>
           </div>
        </div>
        <div className="bg-zinc-900/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/20 flex flex-col gap-3 md:gap-4">
           <div className="flex items-center justify-between">
              <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Optimización Stock</p>
              <ArrowUpRight size={16} className="text-indigo-400" />
           </div>
           <p className="text-2xl md:text-4xl font-black text-white">94%</p>
           <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide">Basado en PEPS</p>
        </div>
        <div className="bg-zinc-900/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/20 flex flex-col gap-3 md:gap-4 sm:col-span-2 md:col-span-1">
           <div className="flex items-center justify-between">
              <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Ratio de Mermas</p>
              <Filter size={16} className="text-rose-500" />
           </div>
           <p className="text-2xl md:text-4xl font-black text-white">0.8%</p>
           <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">Objetivo: Desperdicio Cero</p>
        </div>
      </div>
    </div>
  );
};
