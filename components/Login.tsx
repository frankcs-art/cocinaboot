import React from 'react';
import { ChefHat, LogIn, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl text-center space-y-10">
          {/* Logo Area */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-bounce-slow">
              <ChefHat className="text-white" size={42} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
                Blanquita<span className="text-emerald-500">IA</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Cocina Inteligente</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-200">Bienvenido de nuevo</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Inicia sesión para gestionar tu inventario con el poder de la inteligencia artificial.
            </p>
          </div>

          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-4 bg-white text-black py-5 rounded-2xl font-black text-lg transition-all hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                <span>Continuar con Google</span>
              </>
            )}
            <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10"></div>
          </button>

          <div className="pt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <Sparkles size={12} className="text-emerald-500" />
            <span>Powered by Gemini 1.5 Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
