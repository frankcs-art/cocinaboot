import { InventoryItem, UsageHistory, Supplier } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
// IBÉRICOS (Categoría: 'Ibéricos')
{
  id: '1', name: 'Jamón Ibérico 5J', category: 'Ibéricos', quantity: 4.2, unit: 'PZ', minThreshold: 2,
  lastUpdated: new Date().toISOString(), pricePerUnit: 45.50, location: 'Cámara 1', isPerishable: true,
  batchInfo: [{ entryDate: '2026-01-10', quantity: 4.2 }]
},
{
  id: '6', name: 'Lomo Embuchado de Bellota', category: 'Ibéricos', quantity: 15, unit: 'PZ', minThreshold: 8,
  lastUpdated: new Date().toISOString(), pricePerUnit: 18.00, location: 'Cámara 1', isPerishable: true,
  batchInfo: [{ entryDate: '2026-01-12', quantity: 15 }]
},
// ACEITES (Categoría: 'Aceites')
{
  id: '2', name: 'AOVE Picual Premium', category: 'Aceites', quantity: 45, unit: 'L', minThreshold: 20,
  lastUpdated: new Date().toISOString(), pricePerUnit: 8.50, location: 'Almacén Seco', isPerishable: false,
  batchInfo: [{ entryDate: '2026-01-05', quantity: 45 }]
},
// LÁCTEOS (Categoría: 'Lácteos')
{
  id: '12', name: 'Queso Cabrales', category: 'Lácteos', quantity: 5, unit: 'KG', minThreshold: 2,
  lastUpdated: new Date().toISOString(), pricePerUnit: 32.00, location: 'Cámara 2', isPerishable: true,
  batchInfo: [{ entryDate: '2026-01-14', quantity: 5 }]
},
// PESCADOS / CONSERVAS (Categoría: 'Pescados')
{
  id: '4', name: 'Bacalao Giraldo', category: 'Pescados', quantity: 18, unit: 'KG', minThreshold: 8,
  lastUpdated: new Date().toISOString(), pricePerUnit: 18.50, location: 'Cámara 3', isPerishable: true,
  batchInfo: [{ entryDate: '2026-01-13', quantity: 18 }]
},
// DESPENSA / LEGUMBRES (Categoría: 'Despensa')
{
  id: '25', name: 'Arroz Bomba Valencia', category: 'Despensa', quantity: 50, unit: 'KG', minThreshold: 20,
  lastUpdated: new Date().toISOString(), pricePerUnit: 3.20, location: 'Almacén Seco', isPerishable: false,
  batchInfo: [{ entryDate: '2026-01-01', quantity: 50 }]
}
];

export const MOCK_USAGE: UsageHistory[] = [
  { id: 'h1', itemId: '1', itemName: 'Jamón Ibérico 5J', date: '2026-01-15', quantityConsumed: 0.2, unit: 'PZ', type: 'Consumo' },
  { id: 'h2', itemId: '1', itemName: 'Jamón Ibérico 5J', date: '2026-01-14', quantityConsumed: 0.4, unit: 'PZ', type: 'Consumo' },
  { id: 'h3', itemId: '4', itemName: 'Bacalao Giraldo', date: '2026-01-14', quantityConsumed: 5.5, unit: 'KG', type: 'Consumo' },
];

export const SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Bodegas Selectas', contact: 'pedidos@bodegas.es', phone: '34600112233', category: 'Bodega', reliability: 98 },
  { id: 's2', name: 'Distribución Gourmet', contact: 'info@gourmet.es', phone: '34655443322', category: 'Ibéricos', reliability: 95 },
  { id: 's3', name: 'Huerta Real', contact: 'ventas@huerta.es', phone: '34611223344', category: 'Perecederos', reliability: 92 },
];

export const CATEGORY_THEMES: Record<string, string> = {
  'Ibéricos': 'border-rose-500/30 bg-rose-500/5 text-rose-400',
  'Aceites': 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
  'Lácteos': 'border-blue-500/30 bg-blue-500/5 text-blue-400',
  'Pescados': 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
  'Bodega': 'border-purple-500/30 bg-purple-500/5 text-purple-400',
  'Verduras': 'border-green-500/30 bg-green-500/5 text-green-400',
  'Despensa': 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
  'Default': 'border-slate-500/30 bg-slate-500/5 text-slate-400'
};
