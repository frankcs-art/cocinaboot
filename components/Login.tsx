
import React, { useState } from 'react';
import { ChefHat, Chrome, Loader2, Sparkles } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import Logger from '../logger';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      Logger.success('User logged in successfully with Google');
    } catch (err: any) {
      Logger.error('Login error', err);
      setError('Error al iniciar sesión. Por favor, verifica tu conexión o configuración de Firebase.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 relative z-10 shadow-3xl animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl">
            <ChefHat className="text-white" size={40} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Blanquita<span className="text-emerald-500">IA</span></h1>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Cocina Inteligente & Logística</p>
          </div>

          <div className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Sparkles size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Sistema Jules Activo</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Accede al control total de suministros, analítica predictiva y gestión de mermas.
            </p>
          </div>

          {error && (
            <div className="w-full bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 text-xs font-bold">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-sm hover:bg-slate-200 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
                Iniciar Sesión con Google
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Uso restringido a personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
};
