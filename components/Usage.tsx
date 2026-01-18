import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { InventoryItem, UsageHistory } from '../types';

interface UsageProps {
  usage: UsageHistory[];
  inventory: InventoryItem[];
  onRecordUsage: (id: string, q: number) => void;
}

export const Usage: React.FC<UsageProps> = ({ usage, inventory, onRecordUsage }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [q, setQ] = useState(1);

  return (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-left-4 duration-500 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1 bg-zinc-900 border border-white/5 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] h-fit">
          <h3 className="text-xl md:text-2xl font-black text-white mb-6">Nuevo Registro</h3>
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Ingrediente</label>
              <select 
                className="w-full bg-white/5 border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="">Selecciona...</option>
                {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.quantity} {i.unit})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Cantidad Consumida</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-300 focus:outline-none text-sm"
                value={q}
                onChange={(e) => setQ(Number(e.target.value))}
              />
            </div>
            <button 
              onClick={() => { if(selectedItem) { onRecordUsage(selectedItem, q); setSelectedItem(''); } }}
              className="w-full bg-emerald-500 py-4 md:py-5 rounded-xl md:rounded-3xl text-black font-black text-xs md:text-sm hover:bg-emerald-400 transition-all shadow-xl active:scale-95"
            >
              Registrar Gasto
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 md:space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl md:text-2xl font-black text-white">Historial</h3>
              <button className="p-2.5 bg-white/5 rounded-xl text-slate-500"><Filter size={16}/></button>
           </div>
           
           <div className="bg-zinc-900/50 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
             {/* Desktop Usage Table */}
             <div className="hidden sm:block overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-white/2">
                     <tr>
                        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Fecha</th>
                        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Producto</th>
                        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Cantidad</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {usage.map(u => (
                        <tr key={u.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 md:px-10 py-5 md:py-6 text-xs text-slate-500 font-bold">{new Date(u.date).toLocaleDateString()}</td>
                          <td className="px-6 md:px-10 py-5 md:py-6 text-sm font-black text-white">{u.itemName}</td>
                          <td className="px-6 md:px-10 py-5 md:py-6 text-right font-black text-emerald-400">-{u.quantityConsumed} {u.unit}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>

             {/* Mobile Usage List */}
             <div className="sm:hidden divide-y divide-white/5">
                {usage.map(u => (
                  <div key={u.id} className="p-4 flex justify-between items-center bg-zinc-900/30">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white truncate">{u.itemName}</p>
                      <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">{new Date(u.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-black text-rose-400">-{u.quantityConsumed} {u.unit}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
