import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, Search, Menu, Settings, X
} from 'lucide-react';
import { InventoryItem, AppNotification, ChatMessage, UsageHistory } from './types';
import { GeminiService } from './geminiService';
import { initDB, saveInventory, getInventory, recordUsageHistory, syncPendingActions } from './indexedDBService';
import StorageService from './storageService';
import Logger from './logger';
import { INITIAL_INVENTORY, MOCK_USAGE, SUPPLIERS } from './constants';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAuth } from './hooks/useAuth';
import { OfflineBanner } from './components/OfflineBanner';
import { Login } from './components/Login';

// Component Imports
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Notifications } from './components/Notifications';
import { Usage } from './components/Usage';
import { VoiceControl } from './components/VoiceControl';

// Lazy loaded components
const Orders = React.lazy(() => import('./components/Orders').then(module => ({ default: module.Orders })));
const Chat = React.lazy(() => import('./components/Chat').then(module => ({ default: module.Chat })));
const Scanner = React.lazy(() => import('./components/Scanner').then(module => ({ default: module.Scanner })));

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'chat' | 'scan' | 'notifications' | 'usage'>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [usage, setUsage] = useState<UsageHistory[]>([]);
  const [isHighDemand, setIsHighDemand] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth State
  const { user, loading: authLoading, login, logout } = useAuth();

  // Stats
  const stats = useMemo(() => ({
    criticalItems: inventory.filter(i => i.quantity <= i.minThreshold).length,
    unreadNotifications: notifications.filter(n => !n.isRead).length
  }), [inventory, notifications]);

  // Sync notifications with inventory (Coverage Alerts + Min Threshold)
  useEffect(() => {
    const alerts: AppNotification[] = [];

    inventory.forEach(item => {
      // 1. Min Threshold Check
      if (item.quantity <= item.minThreshold) {
        alerts.push({
          id: `alert-min-${item.id}-${new Date().toDateString()}`,
          type: 'critical',
          title: 'Stock Crítico (Mínimo)',
          message: `El producto ${item.name} está por debajo del mínimo de seguridad (${item.quantity} ${item.unit} restantes).`,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      }

      // 2. Time Coverage Check (CPD Based)
      const itemUsage = usage.filter(u => u.itemId === item.id && u.type === 'Consumo');
      if (itemUsage.length > 0) {
        const uniqueDays = new Set(itemUsage.map(u => u.date)).size;
        const totalConsumed = itemUsage.reduce((acc, u) => acc + u.quantityConsumed, 0);
        let cpd = uniqueDays > 0 ? totalConsumed / uniqueDays : totalConsumed;

        // Ajuste de Eventos: +30% CPD para perecederos en Alta Demanda
        if (isHighDemand && item.isPerishable) {
          cpd = cpd * 1.3;
        }

        if (cpd > 0) {
          const coverageHours = (item.quantity / cpd) * 24;

          if (coverageHours < 12) {
            alerts.push({
              id: `alert-critical-time-${item.id}`,
              type: 'critical',
              title: '🔴 CRÍTICO: <12h',
              message: `El producto ${item.name} se agotará en menos de 12 horas (${coverageHours.toFixed(1)}h).`,
              timestamp: new Date().toISOString(),
              isRead: false
            });
          } else if (coverageHours < 48) {
            alerts.push({
              id: `alert-warning-time-${item.id}`,
              type: 'warning',
              title: '🟡 REABASTECER: <48h',
              message: `Stock de ${item.name} cubre menos de 48 horas (${(coverageHours/24).toFixed(1)}d).`,
              timestamp: new Date().toISOString(),
              isRead: false
            });
          }
        }
      }
    });
    setNotifications(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newAlerts = alerts.filter(a => !existingIds.has(a.id));
      return [...newAlerts, ...prev];
    });
  }, [inventory, isHighDemand, usage]);

  // Al cargar la app
  useEffect(() => {
    const loadData = async () => {
      Logger.info('App initializing...');
      await StorageService.init();
      const savedData = await StorageService.loadInventoryData();
      if (savedData.length > 0) {
        // Migración: Asegurar que los items tengan sus imágenes si están definidas en INITIAL_INVENTORY
        const migratedData = savedData.map(item => {
          if (!item.image) {
            const initialItem = INITIAL_INVENTORY.find(ii => ii.id === item.id);
            if (initialItem?.image) {
              return { ...item, image: initialItem.image };
            }
          }
          return item;
        });
        setInventory(migratedData);
        Logger.success('Loaded inventory from DB', { items: savedData.length });
      } else {
        // Cargar inventario inicial si está vacío
        setInventory(INITIAL_INVENTORY);
        await StorageService.saveInventoryData(INITIAL_INVENTORY);
        Logger.info('Seeded initial inventory');
      }
      const savedChat = StorageService.loadChatMessages();
      if (savedChat.length > 0) {
        setChatMessages(savedChat);
        Logger.success('Loaded chat messages', { messages: savedChat.length });
      }
      StorageService.printDebugInfo();
    };
    loadData();
  }, []);

  // Al guardar cambios (debounced para evitar múltiples guardados)
  useEffect(() => {
    const timer = setTimeout(() => {
      StorageService.saveInventoryData(inventory);
    }, 1000);
    return () => clearTimeout(timer);
  }, [inventory]);

  // Guardar chat cuando cambia
  useEffect(() => {
    if (chatMessages.length > 0) {
      StorageService.saveChatMessages(chatMessages);
    }
  }, [chatMessages]);

  const recordUsage = (itemId: string, quantity: number, type: 'Consumo' | 'Merma' = 'Consumo') => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || quantity <= 0) {
      console.warn('⚠️ Invalid usage record:', { itemId, quantity });
      return;
    }

    setInventory(prev => prev.map(i => {
      if (i.id !== itemId) return i;

      let remainingToConsume = quantity;
      const sortedBatches = [...(i.batchInfo || [])].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

      const newBatches = sortedBatches.map(batch => {
        if (remainingToConsume <= 0) return batch;
        const consumeFromThisBatch = Math.min(batch.quantity, remainingToConsume);
        remainingToConsume -= consumeFromThisBatch;
        return { ...batch, quantity: batch.quantity - consumeFromThisBatch };
      }).filter(batch => batch.quantity > 0);

      return {
        ...i,
        quantity: Math.max(0, i.quantity - quantity),
        lastUpdated: new Date().toISOString(),
        batchInfo: newBatches
      };
    }));

    const newEntry: UsageHistory = {
      id: Math.random().toString(36).substr(2, 9),
      itemId,
      itemName: item.name,
      date: new Date().toISOString().split('T')[0],
      quantityConsumed: quantity,
      unit: item.unit as any,
      type
    };
    setUsage(prev => [newEntry, ...prev]);
    StorageService.recordUsage(newEntry);
  };

  const addStock = (itemId: string, quantity: number, location?: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || quantity <= 0) return;

    setInventory(prev => prev.map(i => i.id === itemId ? {
      ...i,
      quantity: i.quantity + quantity,
      location: location || i.location,
      lastUpdated: new Date().toISOString(),
      batchInfo: [...(i.batchInfo || []), { entryDate: new Date().toISOString(), quantity }]
    } : i));
  };

  const deleteInventoryItem = (itemId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setInventory(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const getDailySuggestion = async () => {
    setIsLoading(true);
    try {
      const res = await GeminiService.suggestDailyOrders(inventory, usage, isHighDemand);
      setAiSuggestion(res);
      setActiveTab('orders');
    } catch (error) {
      setAiSuggestion("Error al generar la orden. Inténtalo de nuevo.");
      setActiveTab('orders');
    } finally {
      setIsLoading(false);
    }
  };

  const onChatSend = async (msg: string) => {
    if (!msg.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsLoading(true);
    try {
      const res = await GeminiService.chatWithInventory(msg, inventory, chatMessages, isThinking);
      setChatMessages(prev => [...prev, { role: 'model', text: res }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Error al procesar la consulta. Inténtalo de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const confirmOrder = () => {
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'success',
      title: 'Pedido Confirmado',
      message: 'La orden ha sido procesada y enviada a los proveedores.',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setAiSuggestion(null);
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleVoiceCommand = (command: string, transcript: string) => {
    if (command) {
      setActiveTab(command as any);
    }
  };

  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      syncPendingActions();
    }
  }, [isOnline]);

  if (authLoading) {
    return (
      <div className="flex h-screen bg-[#09090b] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Iniciando Blanquita IA...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {!isOnline && <OfflineBanner />}
      {/* Desktop Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col hidden lg:flex shrink-0 bg-black/20 backdrop-blur-3xl">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} user={user} onLogout={logout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#09090b] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} user={user} onLogout={logout} />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col bg-[#09090b] overflow-hidden relative">
        <header className="h-16 md:h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm md:text-xl font-bold text-white tracking-tight uppercase tracking-widest truncate max-w-[150px] md:max-w-none">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-white/5 border border-white/10 pl-12 pr-6 py-2 rounded-2xl text-sm w-40 md:w-80 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-slate-300 placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all relative ${activeTab === 'notifications' ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : ''}`}
            >
              <Bell size={20} />
              {stats.unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 md:top-3 md:right-3 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#09090b] flex items-center justify-center text-[8px] font-black text-white">
                  {stats.unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 space-y-6 md:space-y-10 custom-scrollbar">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          }>
            {activeTab === 'dashboard' && <Dashboard stats={stats} inventory={inventory} getDailySuggestion={getDailySuggestion} isLoading={isLoading} setTab={handleTabChange} isHighDemand={isHighDemand} setIsHighDemand={setIsHighDemand} />}
            {activeTab === 'inventory' && <Inventory inventory={inventory} usageHistory={usage} searchTerm={searchTerm} onRecordUsage={recordUsage} onAddStock={addStock} onDeleteItem={deleteInventoryItem} isHighDemand={isHighDemand} />}
            {activeTab === 'orders' && <Orders suppliers={SUPPLIERS} suggestion={aiSuggestion} onClearSuggestion={() => setAiSuggestion(null)} getDailySuggestion={getDailySuggestion} onConfirmOrder={confirmOrder} isLoading={isLoading} />}
            {activeTab === 'chat' && <Chat messages={chatMessages} onSend={onChatSend} isLoading={isLoading} isThinking={isThinking} setIsThinking={setIsThinking} />}
            {activeTab === 'scan' && <Scanner />}
            {activeTab === 'notifications' && <Notifications notifications={notifications} markAllAsRead={markAllAsRead} />}
            {activeTab === 'usage' && <Usage usage={usage} inventory={inventory} onRecordUsage={recordUsage} />}
          </React.Suspense>
        </div>
      </main>

      <VoiceControl onCommand={handleVoiceCommand} />
    </div>
  );
}

export default App;
