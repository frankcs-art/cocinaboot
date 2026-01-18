import React from 'react';
import { Check, Bell, AlertTriangle, Info } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsProps {
  notifications: AppNotification[];
  markAllAsRead: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, markAllAsRead }) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Centro de Alertas</h3>
          <p className="text-slate-500 mt-1 md:mt-2 text-sm font-medium uppercase tracking-wide">Notificaciones de stock mínimo</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="px-4 md:px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold text-emerald-400 border border-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Check size={16} /> Marcar todo como leído
        </button>
      </div>

      <div className="space-y-3 md:space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-zinc-900/50 p-12 md:p-20 text-center rounded-[2rem] md:rounded-[3rem] border border-white/5">
            <Bell size={40} className="mx-auto text-slate-800 mb-6" />
            <p className="text-slate-500 font-bold">No hay alertas activas.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all flex items-start gap-4 md:gap-6 ${n.isRead ? 'bg-zinc-900/30 border-white/5 opacity-60' : 'bg-zinc-900 border-emerald-500/20 shadow-xl'}`}>
               <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${n.type === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                  {n.type === 'critical' ? <AlertTriangle size={20} /> : <Info size={20} />}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-base md:text-xl font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest shrink-0">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-slate-400 mt-1 md:mt-2 text-xs md:text-sm leading-relaxed">{n.message}</p>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
