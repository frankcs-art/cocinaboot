import React from 'react';
import { BrainCircuit, Loader2, Sparkles, ShoppingCart, Truck, MessageCircle } from 'lucide-react';
import { Supplier } from '../types';

interface OrdersProps {
  suppliers: Supplier[];
  suggestion: string | null;
  onClearSuggestion: () => void;
  getDailySuggestion: () => void;
  onConfirmOrder: () => void;
  isLoading: boolean;
}

export const Orders: React.FC<OrdersProps> = ({ suppliers, suggestion, onClearSuggestion, getDailySuggestion, onConfirmOrder, isLoading }) => {
  return (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-left-4 duration-500 pb-10">
      {!suggestion ? (
        <div className="bg-zinc-900 border border-emerald-500/20 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10 shadow-3xl overflow-hidden relative">
          <div className="relative z-10 max-w-xl text-center lg:text-left">
             <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/10 text-emerald-400 rounded-xl md:rounded-2xl flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <BrainCircuit size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">Logística Predictiva</h3>
             </div>
             <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-lg">Analizamos el consumo promedio y el stock actual para generar una sugerencia de compra que elimine el desperdicio.</p>
             <button 
               onClick={getDailySuggestion}
               disabled={isLoading}
               className="mt-6 md:mt-10 w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl md:rounded-3xl font-black text-base md:text-lg transition-all shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3"
             >
               {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
               Generar Orden IA
             </button>
          </div>
          <div className="relative z-10 w-full lg:w-96 bg-black/40 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-3xl shadow-2xl">
             <h4 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 md:mb-6 text-center">Eficiencia de Costes</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs md:text-sm"><span className="text-slate-400 font-bold">Bodegas Selectas</span> <span className="text-emerald-400 font-black">-15%</span></div>
                <div className="flex justify-between items-center text-xs md:text-sm"><span className="text-slate-400 font-bold">Huerta Real</span> <span className="text-emerald-400 font-black">+12%</span></div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4 md:mt-6"><div className="bg-emerald-500 h-full w-[80%]"></div></div>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full"></div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-emerald-500/40 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-3xl relative animate-in zoom-in-95 duration-500">
           <div className="flex justify-between items-center mb-6 md:mb-10">
              <div className="flex items-center gap-3 md:gap-4">
                <Sparkles className="text-emerald-400" size={24} />
                <h4 className="text-xl md:text-3xl font-black text-white">Plan de Abastecimiento</h4>
              </div>
              <button onClick={onClearSuggestion} className="p-2 md:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-500 hover:text-white">✕</button>
           </div>
           <div className="prose prose-invert max-w-none bg-black/40 p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 shadow-inner leading-relaxed text-slate-300 font-medium overflow-y-auto max-h-[300px] md:max-h-[500px] custom-scrollbar text-xs md:text-base whitespace-pre-wrap">
              {/* ✅ SECURITY: Render AI suggestions as plain text with whitespace-pre-wrap instead of dangerouslySetInnerHTML to prevent XSS */}
              {suggestion}
           </div>
           <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-6">
              <button 
                onClick={onConfirmOrder}
                className="flex-1 bg-emerald-500 py-4 md:py-6 rounded-xl md:rounded-3xl text-black font-black text-base md:text-xl hover:bg-emerald-400 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                 <ShoppingCart size={20} /> Confirmar Pedido
              </button>
              <button className="flex-1 bg-white/5 py-4 md:py-6 rounded-xl md:rounded-3xl text-white font-black text-base md:text-xl hover:bg-white/10 transition-all border border-white/10 active:scale-95 flex items-center justify-center">
                 Albarán Digital
              </button>
           </div>
        </div>
      )}

      {/* Grid of suppliers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {suppliers.map(s => (
          <div key={s.id} className="bg-zinc-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:border-emerald-500/20 transition-all group shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 md:mb-10">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform border border-white/5 shrink-0">
                <Truck className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-right">
                <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Fiabilidad</p>
                <p className="text-xl md:text-2xl font-black text-emerald-400">{s.reliability}%</p>
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-black text-white mb-2 truncate">{s.name}</h4>
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-8 md:mb-12 truncate">{s.category}</p>
            <div className="space-y-3 md:space-y-4">
              <button 
                onClick={() => window.open(`https://wa.me/${s.phone}`, '_blank')}
                className="w-full py-4 md:py-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl md:rounded-3xl text-emerald-400 font-black text-[10px] md:text-xs hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 md:gap-3"
              >
                <MessageCircle size={16} /> Pedido WhatsApp
              </button>
              <button className="w-full py-4 md:py-5 bg-black/40 border border-white/5 rounded-xl md:rounded-3xl text-slate-500 font-black text-[10px] md:text-xs hover:text-white hover:border-white/10 transition-all">Ver Historial</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
