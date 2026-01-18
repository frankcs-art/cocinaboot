import React from 'react';
import { Camera } from 'lucide-react';

export const Scanner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-10 md:space-y-16 animate-in zoom-in-95 duration-700 p-6">
    <div className="relative">
      <div className="w-48 h-48 md:w-64 md:h-64 bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center text-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative group cursor-pointer transition-all hover:border-emerald-500/60 hover:bg-emerald-500/20">
        <Camera strokeWidth={1} className="w-16 h-16 md:w-[100px] md:h-[100px] group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] md:blur-[150px] rounded-full -z-10 animate-pulse"></div>
    </div>
    <div className="text-center max-w-2xl">
      <h3 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight px-4">Escáner <span className="text-emerald-500">IA</span> Gastronómico</h3>
      <p className="text-slate-500 mt-4 md:mt-8 text-base md:text-xl font-medium leading-relaxed px-4">Analiza albaranes, etiquetas y stock real con visión artificial.</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md md:max-w-none px-4">
      <label className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black px-6 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black cursor-pointer transition-all shadow-xl flex items-center justify-center gap-3 md:gap-4 active:scale-95 text-sm md:text-lg">
        <Camera size={20} /> Iniciar Captura
        <input type="file" className="hidden" accept="image/*" />
      </label>
      <button className="flex-1 px-6 md:px-14 py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl md:rounded-[2.5rem] font-black text-sm md:text-lg transition-all active:scale-95">Ver Galería</button>
    </div>
  </div>
);
