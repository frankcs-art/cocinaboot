import React, { useState, useMemo } from 'react';
import { Plus, Filter, ArrowUpDown, PlusCircle, History, Trash2, Minus, X, Clock } from 'lucide-react';
import { InventoryItem, UsageHistory } from '../types';
import { CATEGORY_THEMES } from '../constants';

interface InventoryProps {
  inventory: InventoryItem[];
  coverageData: Record<string, { cpd: number; coverage: number }>;
  searchTerm: string;
  onRecordUsage: (itemId: string, quantity: number) => void;
  onAddStock: (itemId: string, quantity: number, location: string) => void;
  onDeleteItem: (itemId: string) => void;
  isHighDemand: boolean;
}

const InventoryRow: React.FC<{ item: InventoryItem; coverage: number; onSelect: any; onDelete: (id: string) => void }> = React.memo(({ item, coverage, onSelect, onDelete }) => (
  <tr className="hover:bg-white/2 transition-colors group">
    <td className="px-14 py-12">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-3xl border flex items-center justify-center text-xl font-black transition-transform group-hover:scale-110 shrink-0 overflow-hidden ${CATEGORY_THEMES[item.category] || CATEGORY_THEMES.Default}`}>
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            item.name[0]
          )}
        </div>
        <div>
          <p className="font-black text-white text-lg leading-none truncate max-w-[200px]">{item.name}</p>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">{item.category} • {item.location}</p>
        </div>
      </div>
    </td>
    <td className="px-14 py-12 text-center">
       <p className="text-xl font-black text-white">{item.quantity} <span className="text-slate-500 font-medium text-sm uppercase">{item.unit}</span></p>
       {coverage < 999 && (
         <p className="text-[10px] text-slate-500 font-bold mt-1">Cubre: {coverage.toFixed(1)} días</p>
       )}
    </td>
    <td className="px-14 py-12">
      {coverage < 0.5 ? (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase rounded-full border border-rose-500/20">
           <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div> 🔴 CRÍTICO
        </span>
      ) : coverage < 2 ? (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase rounded-full border border-yellow-500/20">
           <div className="w-2 h-2 bg-yellow-500 rounded-full"></div> 🟡 REABASTECER
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 🟢 ÓPTIMO
        </span>
      )}
    </td>
    <td className="px-14 py-12 text-right whitespace-nowrap">
      <button 
        onClick={() => onSelect(item)}
        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all mr-3"
      >
        <Clock size={18} />
      </button>
      <button 
        onClick={() => onDelete(item.id)}
        className="p-3 bg-white/5 hover:bg-rose-500/10 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
));

export const Inventory: React.FC<InventoryProps> = ({ inventory, coverageData, searchTerm, onRecordUsage, onAddStock, onDeleteItem, isHighDemand }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [usageValue, setUsageValue] = useState(1);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'expiry'>('name');

  const categories = useMemo(() => {
    const cats = new Set(inventory.map(i => i.category));
    return ['All', ...Array.from(cats)];
  }, [inventory]);

  const processedInventory = useMemo(() => {
    let result = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterCategory !== 'All') {
      result = result.filter(i => i.category === filterCategory);
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      if (sortBy === 'expiry') return (a.expiryDate || '9999').localeCompare(b.expiryDate || '9999');
      return 0;
    });
  }, [inventory, searchTerm, filterCategory, sortBy]);

  const handleAddStockClick = () => {
    const name = prompt("Nombre o ID del producto:");
    const item = inventory.find(i => i.name === name || i.id === name);
    if (!item) return alert("Producto no encontrado");
    const q = Number(prompt(`Cantidad a añadir (${item.unit}):`));
    const loc = prompt("Ubicación:", item.location);
    if (q > 0) onAddStock(item.id, q, loc || item.location);
  };

  return (
    <div className="space-y-12 md:space-y-20 animate-in slide-in-from-right-4 duration-500 pb-10">
      <div className="bg-zinc-900 border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
        <div className="p-6 md:p-10 border-b border-white/20 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white">Logística de Suministros</h3>
              <p className="text-slate-500 text-xs md:text-sm mt-0.5 md:mt-1">Control PEPS y Predictivo</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="flex items-center gap-2 bg-white/5 px-3 md:px-4 py-2.5 rounded-xl border border-white/20">
                <Filter size={14} className="text-slate-500 shrink-0" />
                <select 
                  className="bg-transparent text-slate-300 text-[10px] md:text-xs font-bold outline-none cursor-pointer w-full"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat} className="bg-[#09090b]">{cat}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white/5 px-3 md:px-4 py-2.5 rounded-xl border border-white/20">
                <ArrowUpDown size={14} className="text-slate-500 shrink-0" />
                <select 
                  className="bg-transparent text-slate-300 text-[10px] md:text-xs font-bold outline-none cursor-pointer w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="name" className="bg-[#09090b]">Nombre</option>
                  <option value="quantity" className="bg-[#09090b]">Cantidad</option>
                  <option value="expiry" className="bg-[#09090b]">Caducidad</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddStockClick}
              className="hidden sm:flex px-6 py-2.5 md:py-3 bg-emerald-500 text-black rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs hover:bg-emerald-400 transition-all shadow-lg active:scale-95 items-center justify-center gap-2"
            >
              <PlusCircle size={16} /> Alta Recurso
            </button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="bg-white/2">
                <th className="px-14 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Producto</th>
                <th className="px-14 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Stock / Cobertura</th>
                <th className="px-14 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Estatus</th>
                <th className="px-14 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="">
              {processedInventory.map(item => (
                <InventoryRow key={item.id} item={item} coverage={coverageData[item.id]?.coverage ?? 999} onSelect={setSelectedItem} onDelete={onDeleteItem} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-white/20">
          {processedInventory.map(item => (
            <div key={item.id} className="p-5 space-y-4 hover:bg-white/2 transition-colors group active:bg-white/5" onClick={() => setSelectedItem(item)}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-lg font-black shrink-0 overflow-hidden ${CATEGORY_THEMES[item.category] || CATEGORY_THEMES.Default}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.name[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-base leading-tight truncate">{item.name}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{item.category} • {item.location}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-white">{item.quantity} <span className="text-slate-500 font-medium text-xs uppercase tracking-tight">{item.unit}</span></p>
                    {(coverageData[item.id]?.coverage ?? 999) < 999 && <p className="text-[9px] font-bold text-slate-500 mt-1">{(coverageData[item.id]?.coverage ?? 999).toFixed(1)} días</p>}
                </div>
              </div>
              <div className="flex justify-between items-center">
                  {(coverageData[item.id]?.coverage ?? 999) < 0.5 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase rounded-lg border border-rose-500/20">
                     <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div> 🔴 CRÍTICO
                  </span>
                  ) : (coverageData[item.id]?.coverage ?? 999) < 2 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase rounded-lg border border-yellow-500/20">
                     <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> 🟡 REABASTECER
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-lg border border-emerald-500/20">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 🟢 ÓPTIMO
                  </span>
                )}
                 <div className="flex gap-2">
                    <button className="p-2 bg-white/5 rounded-xl text-slate-400"><History size={16}/></button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                      className="p-2 bg-rose-500/10 rounded-xl text-rose-500 active:scale-95"
                    >
                      <Trash2 size={16}/>
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border-t sm:border border-white/20 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] p-8 md:p-10 shadow-3xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6 md:mb-8">
               <h4 className="text-xl md:text-2xl font-black text-white">Registrar Consumo</h4>
               <button onClick={() => setSelectedItem(null)} className="text-slate-600 hover:text-white transition-colors p-1"><X size={24}/></button>
            </div>
            <div className="space-y-6 md:space-y-8">
               <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl md:rounded-3xl border border-white/20">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg font-black shrink-0 overflow-hidden ${CATEGORY_THEMES[selectedItem.category] || CATEGORY_THEMES.Default}`}>
                    {selectedItem.image ? (
                      <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedItem.name[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{selectedItem.name}</p>
                    <p className="text-xs text-slate-500">Stock: {selectedItem.quantity} {selectedItem.unit}</p>
                  </div>
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex justify-between items-center">
                    <span>Cantidad a descontar ({selectedItem.unit})</span>
                 </label>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setUsageValue(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white active:scale-90"
                    >
                      <Minus size={20} />
                    </button>
                    <input 
                      type="number" 
                      className="flex-1 bg-white/5 border border-white/20 px-4 py-3 rounded-xl text-center text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={usageValue}
                      onChange={(e) => setUsageValue(Number(e.target.value))}
                    />
                    <button 
                      onClick={() => setUsageValue(prev => prev + 1)}
                      className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white active:scale-90"
                    >
                      <Plus size={20} />
                    </button>
                 </div>
               </div>
               <button 
                onClick={() => { onRecordUsage(selectedItem.id, usageValue); setSelectedItem(null); setUsageValue(1); }}
                className="w-full bg-emerald-500 py-4 md:py-5 rounded-2xl md:rounded-3xl text-black font-black text-base md:text-lg hover:bg-emerald-400 transition-all shadow-xl active:scale-95"
               >
                 Confirmar Operación
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
