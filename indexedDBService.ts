import { InventoryItem, UsageHistory, Supplier } from './types';

const DB_NAME = 'blanquita_db';
const DB_VERSION = 1;

// Store names
const STORES = {
  INVENTORY: 'inventory',
  USAGE_HISTORY: 'usageHistory',
  SUPPLIERS: 'suppliers',
  SETTINGS: 'settings',
  PENDING_ACTIONS: 'pendingActions'
};

let db: IDBDatabase | null = null;

/**
 * Inicializa la conexión a IndexedDB
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Crear store de inventario
      if (!database.objectStoreNames.contains(STORES.INVENTORY)) {
        const inventoryStore = database.createObjectStore(STORES.INVENTORY, {
          keyPath: 'id',
        });
        inventoryStore.createIndex('category', 'category', { unique: false });
        inventoryStore.createIndex('name', 'name', { unique: false });
      }

      // Crear store de historial de uso
      if (!database.objectStoreNames.contains(STORES.USAGE_HISTORY)) {
        const usageStore = database.createObjectStore(STORES.USAGE_HISTORY, {
          keyPath: 'id',
          autoIncrement: true,
        });
        usageStore.createIndex('itemId', 'itemId', { unique: false });
        usageStore.createIndex('date', 'date', { unique: false });
      }

      // Crear store de proveedores
      if (!database.objectStoreNames.contains(STORES.SUPPLIERS)) {
        database.createObjectStore(STORES.SUPPLIERS, { keyPath: 'id' });
      }

      // Crear store de configuración
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      // Crear store de acciones pendientes (offline)
      if (!database.objectStoreNames.contains(STORES.PENDING_ACTIONS)) {
        database.createObjectStore(STORES.PENDING_ACTIONS, { 
            keyPath: 'id',
            autoIncrement: true 
        });
      }
    };
  });
};

/**
 * Guarda todos los items del inventario
 */
export const saveInventory = async (
  items: InventoryItem[]
): Promise<void> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.INVENTORY], 'readwrite');
  const store = transaction.objectStore(STORES.INVENTORY);

  // Limpiar store anterior
  store.clear();

  // Insertar nuevos items
  for (const item of items) {
    store.add(item);
  }

  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
};

/**
 * Obtiene todo el inventario
 */
export const getInventory = async (): Promise<InventoryItem[]> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.INVENTORY], 'readonly');
  const store = transaction.objectStore(STORES.INVENTORY);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as InventoryItem[]);
  });
};

/**
 * Obtiene un item específico del inventario
 */
export const getInventoryItem = async (
  itemId: string
): Promise<InventoryItem | undefined> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.INVENTORY], 'readonly');
  const store = transaction.objectStore(STORES.INVENTORY);

  return new Promise((resolve, reject) => {
    const request = store.get(itemId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as InventoryItem);
  });
};

/**
 * Actualiza un item del inventario
 */
export const updateInventoryItem = async (
  item: InventoryItem
): Promise<void> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.INVENTORY], 'readwrite');
  const store = transaction.objectStore(STORES.INVENTORY);

  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve();
  });
};

/**
 * Obtiene items por categoría
 */
export const getInventoryByCategory = async (
  category: string
): Promise<InventoryItem[]> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.INVENTORY], 'readonly');
  const store = transaction.objectStore(STORES.INVENTORY);
  const index = store.index('category');

  return new Promise((resolve, reject) => {
    const request = index.getAll(category);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as InventoryItem[]);
  });
};

/**
 * Registra un uso/consumo de un item
 */
export const recordUsageHistory = async (
  usage: UsageHistory
): Promise<number> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.USAGE_HISTORY], 'readwrite');
  const store = transaction.objectStore(STORES.USAGE_HISTORY);

  return new Promise((resolve, reject) => {
    const request = store.add(usage);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as number);
  });
};

/**
 * Obtiene el historial de uso de un item
 */
export const getUsageHistory = async (
  itemId: string
): Promise<UsageHistory[]> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.USAGE_HISTORY], 'readonly');
  const store = transaction.objectStore(STORES.USAGE_HISTORY);
  const index = store.index('itemId');

  return new Promise((resolve, reject) => {
    const request = index.getAll(itemId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as UsageHistory[]);
  });
};

/**
 * Obtiene el historial de uso en un rango de fechas (formato ISO string)
 */
export const getUsageHistoryByDateRange = async (
  startDate: string,
  endDate: string
): Promise<UsageHistory[]> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.USAGE_HISTORY], 'readonly');
  const store = transaction.objectStore(STORES.USAGE_HISTORY);
  const index = store.index('date');

  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.bound(startDate, endDate, false, false);
    const request = index.getAll(range);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as UsageHistory[]);
  });
};

/**
 * Guarda una configuración
 */
export const saveSetting = async (key: string, value: unknown): Promise<void> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.SETTINGS], 'readwrite');
  const store = transaction.objectStore(STORES.SETTINGS);

  return new Promise((resolve, reject) => {
    const request = store.put({ key, value });
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve();
  });
};

/**
 * Obtiene una configuración
 */
export const getSetting = async (key: string): Promise<unknown> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.SETTINGS], 'readonly');
  const store = transaction.objectStore(STORES.SETTINGS);

  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.value : null);
    };
  });
};

/**
 * Borra toda la base de datos
 */
export const clearDB = async (): Promise<void> => {
  const database = await initDB();
  const stores = [
    STORES.INVENTORY,
    STORES.USAGE_HISTORY,
    STORES.SUPPLIERS,
    STORES.SETTINGS,
  ];

  const transaction = database.transaction(stores, 'readwrite');

  for (const storeName of stores) {
    transaction.objectStore(storeName).clear();
  }

  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
};

/**
 * Exporta toda la base de datos como JSON
 */
export const exportDB = async (): Promise<Record<string, unknown>> => {
  const database = await initDB();
  const stores = [
    STORES.INVENTORY,
    STORES.USAGE_HISTORY,
    STORES.SUPPLIERS,
    STORES.SETTINGS,
  ];

  const exportData: Record<string, unknown> = {};

  for (const storeName of stores) {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    exportData[storeName] = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  return exportData;
};

/**
 * Guarda todos los suppliers
 */
export const saveSuppliers = async (suppliers: Supplier[]): Promise<void> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.SUPPLIERS], 'readwrite');
  const store = transaction.objectStore(STORES.SUPPLIERS);

  store.clear();

  for (const supplier of suppliers) {
    store.add(supplier);
  }

  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
};

/**
 * Obtiene todos los suppliers
 */
export const getSuppliers = async (): Promise<Supplier[]> => {
  const database = await initDB();
  const transaction = database.transaction([STORES.SUPPLIERS], 'readonly');
  const store = transaction.objectStore(STORES.SUPPLIERS);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Supplier[]);
  });
};

/**
 * Importa datos a la base de datos desde un JSON
 */
export const importDB = async (data: Record<string, unknown[]>): Promise<void> => {
  const database = await initDB();
  const stores = Object.keys(data);

  for (const storeName of stores) {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    store.clear();

    for (const item of data[storeName]) {
      store.add(item);
    }

    await new Promise((resolve, reject) => {
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve(null);
    });
  }
};

/**
 * Sync Strategy
 */
export const queueAction = async (actionType: string, payload: any) => {
    const database = await initDB();
    const transaction = database.transaction([STORES.PENDING_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    store.add({
        actionType,
        payload,
        timestamp: new Date().toISOString()
    });
};

export const syncPendingActions = async () => {
    const database = await initDB();
    const transaction = database.transaction([STORES.PENDING_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    // Get all pending actions
    const request = store.getAll();
    
    request.onsuccess = async () => {
        const actions = request.result;
        if (actions.length === 0) return;
        
        console.log(`🔄 Syncing ${actions.length} pending actions...`);
        
        // Mock sending to API
        // await api.sync(actions);
        
        // Clear queue after "success"
        store.clear();
        console.log('✅ Sync complete');
    };
};
