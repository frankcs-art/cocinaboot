import React from 'react';
import { ChefHat, LayoutDashboard, Package, Truck, MessageSquare, Camera, History, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
  >
    <span className={active ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}>{icon}</span>
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <ChefHat className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black tracking-tight text-white leading-none">Blanquita<span className="text-emerald-500">IA</span></span>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Cocina Inteligente</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">General</p>
        <NavItem active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} icon={<LayoutDashboard size={18} />} label="Panel de Control" />
        <NavItem active={activeTab === 'inventory'} onClick={() => onTabChange('inventory')} icon={<Package size={18} />} label="Inventario" />
        <NavItem active={activeTab === 'usage'} onClick={() => onTabChange('usage')} icon={<History size={18} />} label="Consumo Diario" />

        <p className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inteligencia</p>
        <NavItem active={activeTab === 'chat'} onClick={() => onTabChange('chat')} icon={<MessageSquare size={18} />} label="Asistente IA" />
        <NavItem active={activeTab === 'scan'} onClick={() => onTabChange('scan')} icon={<Camera size={18} />} label="Visión Artificial" />

        <p className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logística</p>
        <NavItem active={activeTab === 'orders'} onClick={() => onTabChange('orders')} icon={<Truck size={18} />} label="Proveedores" />
      </nav>

      <div className="p-4 md:p-6 m-4 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">JD</div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-slate-100 text-sm truncate">Chef Karen A.</p>
            <p className="text-slate-500 text-xs truncate">Administrador</p>
          </div>
          <button className="text-slate-600 hover:text-purple-400 transition-colors p-1"><LogOut size={16} /></button>
        </div>
      </div>
    </>
  );
};
