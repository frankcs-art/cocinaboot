import React from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  return (
    <div className="bg-rose-500 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 relative z-50">
      <WifiOff size={14} />
      <span>Modo Offline: Algunos cambios no se guardarán hasta recuperar la conexión.</span>
    </div>
  );
};
