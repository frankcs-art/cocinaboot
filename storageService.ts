/**
 * Storage Service - Gestión de persistencia con IndexedDB + LocalStorage
 * Maneja: Inventario, Historial, Chat, Suppliers, Preferencias y Telemetría Jules
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
  STATE_SNAPSHOTS: 'jules_state_snapshots',
};

class StorageService {
  /**
   * Inicializa el servicio de almacenamiento
   */
  static async init(): Promise<void> {
    try {
      await initDB();
      Logger.success('Storage Service initialized [OP Mode]');
    } catch (error) {
      Logger.error('Error initializing storage', error);
    }
  }

  // ============ SNAPSHOT SYSTEM (OP DEBUG) ============
  static createSnapshot(inventory: InventoryItem[], reason: string): void {
    try {
      const snapshots = this.getSnapshots();
      const newSnapshot = {
        timestamp: new Date().toISOString(),
        reason,
        itemCount: inventory.length,
        totalStock: inventory.reduce((acc, i) => acc + i.quantity, 0),
        // Guardamos solo un resumen para no saturar LocalStorage
        summary: inventory.map(i => ({ id: i.id, q: i.quantity }))
      };

      snapshots.unshift(newSnapshot);
      // Mantener solo los últimos 10 snapshots
      localStorage.setItem(STORAGE_KEYS.STATE_SNAPSHOTS, JSON.stringify(snapshots.slice(0, 10)));
      Logger.debug(`Snapshot created: ${reason}`, newSnapshot);
    } catch (error) {
      Logger.error('Error creating snapshot', error);
    }
  }

  static getSnapshots(): any[] {
    const data = localStorage.getItem(STORAGE_KEYS.STATE_SNAPSHOTS);
    return data ? JSON.parse(data) : [];
  }

  // ============ INVENTARIO ============
  static async saveInventoryData(items: InventoryItem[]): Promise<void> {
    try {
      await saveInventory(items);
      this.updateLastSync();
      // Snapshot automático en guardados significativos
      if (Math.random() > 0.8) { // 20% de probabilidad para no saturar
          this.createSnapshot(items, 'Auto-sync');
      }
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
      Logger.success(`Recorded usage: ${usage.itemName} | -${usage.quantityConsumed} | ${usage.type}`);
    } catch (error) {
      Logger.error('Error recording usage', error);
    }
  }

  // ============ CHAT (LocalStorage) ============
  static saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (error) {
      Logger.error('Error saving chat messages', error);
    }
  }

  static loadChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  // ============ SYNC ============
  private static updateLastSync(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  static getLastSync(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Never';
  }

  // ============ DIAGNOSTIC Jules ============
  static async getDiagnosticSummary(): Promise<any> {
    const inventory = await this.loadInventoryData();
    const snapshots = this.getSnapshots();
    const lastSync = this.getLastSync();

    return {
      status: '🟢 OPERATIVO',
      version: 'Jules 1.0.4-OP',
      lastSync,
      inventoryHealth: {
        totalItems: inventory.length,
        criticalItems: inventory.filter(i => i.quantity <= i.minThreshold).length,
        totalBatches: inventory.reduce((acc, i) => acc + (i.batchInfo?.length || 0), 0)
      },
      storageMetrics: {
        lsSize: JSON.stringify(localStorage).length,
        snapshots: snapshots.length
      }
    };
  }

  // ============ SUPPLIERS ============
  static async saveSuppliersData(suppliers: Supplier[]): Promise<void> {
    try {
      await saveSuppliers(suppliers);
    } catch (error) {
      Logger.error('Error saving suppliers', error);
    }
  }

  static async loadSuppliersData(): Promise<Supplier[]> {
    try {
      return await getSuppliers();
    } catch (error) {
      return [];
    }
  }

  // ============ PREFERENCES ============
  static saveUserPreferences(prefs: any): void {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
  }

  static getUserPreferences(): any {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  }

  // ============ UTILS ============
  static clearChatMessages(): void {
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  }

  static async printFullDebugInfo(): Promise<void> {
    const diagnostic = await this.getDiagnosticSummary();
    Logger.group('Jules System Diagnostic');
    Logger.info('Core Status', diagnostic.status);
    Logger.info('Inventory Health', diagnostic.inventoryHealth);
    Logger.info('Storage Metrics', diagnostic.storageMetrics);
    Logger.info('Snapshots', this.getSnapshots());
    Logger.printHistory();
    Logger.groupEnd();
  }
}

export default StorageService;
