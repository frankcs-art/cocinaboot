import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, ChefHat, MessageSquare, Loader2, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  onSend: (msg: string) => void;
  isLoading: boolean;
  isThinking: boolean;
  setIsThinking: (t: boolean) => void;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSend, isLoading, isThinking, setIsThinking }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { 
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-220px)] bg-zinc-900 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="bg-black/60 px-6 md:px-10 py-4 md:py-8 text-white flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 gap-4">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500 rounded-xl md:rounded-3xl flex items-center justify-center shadow-2xl shrink-0"><BrainCircuit size={24} className="text-black" /></div>
          <div>
            <h4 className="font-black text-base md:text-xl">IA De Cocina</h4>
            <div className="flex items-center gap-2 mt-0.5 md:mt-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span><p className="text-[8px] md:text-[10px] text-emerald-500 uppercase font-bold tracking-widest">En línea</p></div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
           <button 
             onClick={() => onSend("Sugiéreme una receta para menú hoy basada en mi stock actual")}
             className="px-3 md:px-5 py-2 md:py-3 bg-white/5 hover:bg-white/10 text-[9px] md:text-xs font-black rounded-lg md:rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2"
           >
             <ChefHat size={14}/> <span className="hidden sm:inline">Receta Sugerida</span><span className="sm:hidden">Receta</span>
           </button>
           <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
           <div className="flex items-center gap-2 md:gap-4">
              <span className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">IA Pro</span>
              <button
                onClick={() => setIsThinking(!isThinking)}
                className={`w-10 md:w-14 h-5 md:h-7 rounded-full relative transition-all duration-300 ${isThinking ? 'bg-emerald-500' : 'bg-slate-800'}`}
                role="switch"
                aria-checked={isThinking}
                aria-label="IA Pro"
              >
                <div className={`absolute top-0.5 md:top-1 w-4 md:w-5 h-4 md:h-5 bg-white rounded-full transition-all shadow-lg ${isThinking ? 'left-5 md:left-8' : 'left-0.5 md:left-1'}`} />
              </button>
           </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 p-6 md:p-10 overflow-y-auto space-y-6 md:space-y-8 custom-scrollbar bg-black/20">
        {messages.length === 0 && (
          <div className="text-center py-10 md:py-20">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-white/5">
              <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-slate-800" />
            </div>
            <p className="font-black text-xl md:text-2xl text-slate-400 tracking-tight px-4">Centro de Inteligencia Gastronómica</p>
            <p className="text-slate-600 max-w-xs mx-auto mt-2 md:mt-4 font-medium text-xs md:text-sm px-4">Consulta costes, auditorías de stock y control de albaranes.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] px-5 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[2.5rem] text-sm md:text-base shadow-2xl leading-relaxed font-medium ${m.role === 'user' ? 'bg-emerald-600 text-black rounded-tr-none' : 'bg-zinc-800 text-slate-200 rounded-tl-none border border-white/5'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 px-5 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[2.5rem] rounded-tl-none border border-white/5 flex items-center gap-3 md:gap-4 text-slate-500 italic text-xs md:text-sm">
              <Loader2 className="animate-spin text-emerald-500" size={16} /> 
              {isThinking ? "Calculando algoritmos..." : "Analizando..."}
            </div>
          </div>
        )}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if(input.trim() && !isLoading) { onSend(input); setInput(''); } }} className="p-4 md:p-10 bg-black/40 border-t border-white/5 flex gap-3 md:gap-6">
        <input 
          type="text" 
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl px-4 md:px-8 py-3 md:py-5 outline-none font-bold text-sm md:text-lg focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-700 transition-all" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-12 md:w-20 bg-emerald-500 text-black rounded-xl md:rounded-3xl hover:bg-emerald-400 transition-all shadow-2xl flex items-center justify-center active:scale-90 disabled:opacity-50 shrink-0"
          aria-label="Enviar mensaje"
        >
          <Send className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      </form>
    </div>
  );
};
