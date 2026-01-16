/**
 * Storage Service - Gestión de persistencia con IndexedDB + LocalStorage
 * Maneja: Inventario, Historial, Chat, Suppliers, Preferencias
 */

import { InventoryItem, UsageHistory, ChatMessage, Supplier } from './types';
import Logger from './logger';
import {
  initDB,
  saveInventory,
  getInventory,
  recordUsageHistory,
  getUsageHistory,
  saveSuppliers,
  getSuppliers,
} from './indexedDBService';

const STORAGE_KEYS = {
  CHAT_MESSAGES: 'blanquita_chat_messages',
  USER_PREFERENCES: 'blanquita_preferences',
  LAST_SYNC: 'blanquita_last_sync',
};

class StorageService {
  /**
   * Inicializa el servicio de almacenamiento
   */
  static async init(): Promise<void> {
    try {
      await initDB();
      Logger.success('Storage Service initialized');
    } catch (error) {
      Logger.error('Error initializing storage', error);
    }
  }

  // ============ INVENTARIO ============
  static async saveInventoryData(items: InventoryItem[]): Promise<void> {
    try {
      await saveInventory(items);
      this.updateLastSync();
      Logger.success(`Saved ${items.length} inventory items to DB`);
    } catch (error) {
      Logger.error('Error saving inventory', error);
    }
  }

  static async loadInventoryData(): Promise<InventoryItem[]> {
    try {
      const items = await getInventory();
      Logger.success(`Loaded ${items.length} inventory items from DB`);
      return items;
    } catch (error) {
      Logger.error('Error loading inventory', error);
      return [];
    }
  }

  // ============ HISTORIAL DE USO ============
  static async recordUsage(usage: UsageHistory): Promise<void> {
    try {
      await recordUsageHistory(usage);
      Logger.success(`Recorded usage for item: ${usage.itemName}`);
    } catch (error) {
      Logger.error('Error recording usage', error);
    }
  }

  static async getUsageForItem(itemId: string): Promise<UsageHistory[]> {
    try {
      const history = await getUsageHistory(itemId);
      Logger.success(`Loaded ${history.length} usage records for item ${itemId}`);
      return history;
    } catch (error) {
      Logger.error('Error getting usage history', error);
      return [];
    }
  }

  // ============ PROVEEDORES ============
  static async saveSuppliersData(suppliers: Supplier[]): Promise<void> {
    try {
      await saveSuppliers(suppliers);
      Logger.success(`Saved ${suppliers.length} suppliers to DB`);
    } catch (error) {
      Logger.error('Error saving suppliers', error);
    }
  }

  static async loadSuppliersData(): Promise<Supplier[]> {
    try {
      const suppliers = await getSuppliers();
      Logger.success(`Loaded ${suppliers.length} suppliers from DB`);
      return suppliers;
    } catch (error) {
      Logger.error('Error loading suppliers', error);
      return [];
    }
  }

  // ============ CHAT (LocalStorage) ============
  static saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
      Logger.success(`Saved ${messages.length} chat messages`);
    } catch (error) {
      Logger.error('Error saving chat messages', error);
    }
  }

  static loadChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (data) {
        const messages = JSON.parse(data) as ChatMessage[];
        Logger.success(`Loaded ${messages.length} chat messages`);
        return messages;
      }
      return [];
    } catch (error) {
      Logger.error('Error loading chat messages', error);
      return [];
    }
  }

  static clearChatMessages(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
      Logger.success('Chat messages cleared');
    } catch (error) {
      Logger.error('Error clearing chat', error);
    }
  }

  // ============ PREFERENCIAS ============
  static savePreferences(prefs: Record<string, unknown>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
      Logger.success('Preferences saved');
    } catch (error) {
      Logger.error('Error saving preferences', error);
    }
  }

  static loadPreferences(): Record<string, unknown> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (data) {
        const prefs = JSON.parse(data) as Record<string, unknown>;
        Logger.success('Preferences loaded');
        return prefs;
      }
      return {};
    } catch (error) {
      Logger.error('Error loading preferences', error);
      return {};
    }
  }

  // ============ SYNC ============
  private static updateLastSync(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  static getLastSync(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Never';
  }

  // ============ DEBUG ============
  static printDebugInfo(): void {
    Logger.group('Storage Debug Info');
    Logger.info('Last Sync', this.getLastSync());
    Logger.info('Chat Messages', this.loadChatMessages().length);
    Logger.info('Preferences', this.loadPreferences());
    Logger.info('LocalStorage Size', JSON.stringify(localStorage).length + ' bytes');
    Logger.groupEnd();
  }

  static async printFullDebugInfo(): Promise<void> {
    Logger.group('Full Debug Info');
    Logger.info('Last Sync', this.getLastSync());
    Logger.info('Chat Messages', this.loadChatMessages().length);
    const inventory = await this.loadInventoryData();
    const suppliers = await this.loadSuppliersData();
    Logger.info('Inventory Items', inventory.length);
    Logger.info('Suppliers', suppliers.length);
    Logger.info('LocalStorage Size', JSON.stringify(localStorage).length + ' bytes');
    Logger.printHistory();
    Logger.groupEnd();
  }
}

export default StorageService;
