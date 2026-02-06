import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import Logger from '../logger';

interface VoiceControlProps {
  onCommand: (command: string, transcript: string) => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
      Logger.info('Voice recognition started');
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto restart if it was supposed to be listening (unless manually stopped, but simplification for now)
      // For a robust implementation, we'd handle "intentional stop" vs "timeout stop"
    };

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.toLowerCase().trim();
      Logger.info('Voice detected', { transcript });
      
      onCommand(identifyCommand(transcript), transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCommand]);

  const identifyCommand = (text: string): string => {
    if (text.includes('inicio') || text.includes('panel') || text.includes('dashboard')) return 'dashboard';
    if (text.includes('inventario') || text.includes('stock')) return 'inventory';
    if (text.includes('chat') || text.includes('asistente') || text.includes('ayuda')) return 'chat';
    if (text.includes('pedidos') || text.includes('proveedores')) return 'orders';
    if (text.includes('escanear') || text.includes('cámara')) return 'scan';
    return '';
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleListening}
        aria-label={isListening ? "Detener reconocimiento de voz" : "Iniciar reconocimiento de voz"}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${
          isListening 
            ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_50px_rgba(244,63,94,0.5)] scale-110' 
            : 'bg-emerald-500 text-black hover:scale-105'
        }`}
      >
        {isListening ? (
          <div className="relative">
             <Activity className="animate-spin" size={24} />
             <div className="absolute inset-0 flex items-center justify-center">
               <Mic size={16} fill="white" />
             </div>
          </div>
        ) : (
          <MicOff size={24} />
        )}
      </button>
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in">
           Escuchando comandos...
        </div>
      )}
    </div>
  );
};
