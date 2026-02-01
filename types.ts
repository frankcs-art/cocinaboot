
export enum OrderStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export type UnitType = 'KG' | 'L' | 'PZ';

export interface InventoryBatch {
  entryDate: string;
  quantity: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: UnitType;
  minThreshold: number;
  expiryDate?: string;
  lastUpdated: string;
  pricePerUnit: number;
  batchInfo?: InventoryBatch[];
  location: string;
  isPerishable: boolean;
  image?: string;
}

export interface UsageHistory {
  id: string;
  itemId: string;
  itemName: string;
  date: string;
  quantityConsumed: number;
  unit: UnitType;
  type: 'Consumo' | 'Merma';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  reliability: number; // 0-100
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
