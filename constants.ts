import { InventoryItem, UsageHistory, Supplier } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
// IBÉRICOS (Categoría: 'Ibéricos')
{ id: '1', name: 'Jamón Ibérico 5J', category: 'Ibéricos', quantity: 4.2, unit: 'piezas', minThreshold: 2, lastUpdated: new Date().toISOString(), pricePerUnit: 45.50 },
{ id: '6', name: 'Lomo Embuchado de Bellota', category: 'Ibéricos', quantity: 15, unit: 'unidades', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 18.00 },
{ id: '7', name: 'Chorizo de Cantimpalos', category: 'Ibéricos', quantity: 20, unit: 'unidades', minThreshold: 10, lastUpdated: new Date().toISOString(), pricePerUnit: 12.50 },
{ id: '8', name: 'Salchichón de Vic', category: 'Ibéricos', quantity: 12, unit: 'unidades', minThreshold: 6, lastUpdated: new Date().toISOString(), pricePerUnit: 14.00 },
{ id: '9', name: 'Morcilla de Burgos', category: 'Ibéricos', quantity: 30, unit: 'unidades', minThreshold: 15, lastUpdated: new Date().toISOString(), pricePerUnit: 10.50 },
// ACEITES (Categoría: 'Aceites')
{ id: '2', name: 'AOVE Picual Premium', category: 'Aceites', quantity: 45, unit: 'L', minThreshold: 20, lastUpdated: new Date().toISOString(), pricePerUnit: 8.50 },
{ id: '10', name: 'Aceite de Oliva Arbequina', category: 'Aceites', quantity: 25, unit: 'L', minThreshold: 10, lastUpdated: new Date().toISOString(), pricePerUnit: 9.00 },
{ id: '11', name: 'Vinagre de Jerez DOP', category: 'Aceites', quantity: 10, unit: 'botellas', minThreshold: 4, lastUpdated: new Date().toISOString(), pricePerUnit: 6.50 },
// LÁCTEOS (Categoría: 'Lácteos')
{ id: '3', name: 'Queso Manchego DOP', category: 'Lácteos', quantity: 3, unit: 'ruedas', minThreshold: 1, lastUpdated: new Date().toISOString(), pricePerUnit: 28.00 },
{ id: '12', name: 'Queso Cabrales', category: 'Lácteos', quantity: 5, unit: 'kg', minThreshold: 2, lastUpdated: new Date().toISOString(), pricePerUnit: 32.00 },
{ id: '13', name: 'Queso Idiazábal Ahumado', category: 'Lácteos', quantity: 7, unit: 'kg', minThreshold: 3, lastUpdated: new Date().toISOString(), pricePerUnit: 24.00 },
{ id: '14', name: 'Queso Tetilla', category: 'Lácteos', quantity: 10, unit: 'unidades', minThreshold: 5, lastUpdated: new Date().toISOString(), pricePerUnit: 8.50 },
{ id: '15', name: 'Queso Mahón Curado', category: 'Lácteos', quantity: 4, unit: 'kg', minThreshold: 2, lastUpdated: new Date().toISOString(), pricePerUnit: 22.00 },
// PESCADOS / CONSERVAS (Categoría: 'Pescados')
{ id: '4', name: 'Bacalao Giraldo', category: 'Pescados', quantity: 18, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 18.50 },
{ id: '16', name: 'Anchoas del Cantábrico', category: 'Pescados', quantity: 50, unit: 'latas', minThreshold: 20, lastUpdated: new Date().toISOString(), pricePerUnit: 4.50 },
{ id: '17', name: 'Ventresca de Bonito', category: 'Pescados', quantity: 30, unit: 'latas', minThreshold: 15, lastUpdated: new Date().toISOString(), pricePerUnit: 5.50 },
{ id: '18', name: 'Mejillones en Escabeche', category: 'Pescados', quantity: 100, unit: 'latas', minThreshold: 40, lastUpdated: new Date().toISOString(), pricePerUnit: 2.50 },
{ id: '19', name: 'Pulpo Cocido Gallegos', category: 'Pescados', quantity: 15, unit: 'unidades', minThreshold: 6, lastUpdated: new Date().toISOString(), pricePerUnit: 12.00 },
// BODEGA (Categoría: 'Bodega')
{ id: '5', name: 'Vino Rioja Alta 890', category: 'Bodega', quantity: 12, unit: 'botellas', minThreshold: 4, lastUpdated: new Date().toISOString(), pricePerUnit: 15.50 },
{ id: '20', name: 'Vino Ribiera del Duero Reserva', category: 'Bodega', quantity: 24, unit: 'botellas', minThreshold: 10, lastUpdated: new Date().toISOString(), pricePerUnit: 18.00 },
{ id: '22', name: 'Cava Brut Nature', category: 'Bodega', quantity: 18, unit: 'botellas', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 9.50 },
{ id: '23', name: 'Vermut Rojo Artesano', category: 'Bodega', quantity: 12, unit: 'botellas', minThreshold: 5, lastUpdated: new Date().toISOString(), pricePerUnit: 7.00 },
{ id: '24', name: 'Sidra Natural Asturiana', category: 'Bodega', quantity: 48, unit: 'botellas', minThreshold: 20, lastUpdated: new Date().toISOString(), pricePerUnit: 3.50 },
// DESPENSA / LEGUMBRES (Categoría: 'Despensa')
{ id: '25', name: 'Arroz Bomba Valencia', category: 'Despensa', quantity: 50, unit: 'kg', minThreshold: 20, lastUpdated: new Date().toISOString(), pricePerUnit: 3.20 },
{ id: '26', name: 'Garbanzos de Fuentesaúco', category: 'Despensa', quantity: 20, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 4.50 },
{ id: '27', name: 'Lentejas de la Armuña', category: 'Despensa', quantity: 20, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 5.00 },
{ id: '28', name: 'Pimientos del Piquillo', category: 'Despensa', quantity: 40, unit: 'botes', minThreshold: 15, lastUpdated: new Date().toISOString(), pricePerUnit: 2.80 },
{ id: '29', name: 'Espárragos de Navarra', category: 'Despensa', quantity: 25, unit: 'latas', minThreshold: 10, lastUpdated: new Date().toISOString(), pricePerUnit: 3.50 },
{ id: '30', name: 'Azafrán en Hebra', category: 'Despensa', quantity: 100, unit: 'g', minThreshold: 40, lastUpdated: new Date().toISOString(), pricePerUnit: 0.50 },
{ id: '31', name: 'Pimentón de la Vera', category: 'Despensa', quantity: 15, unit: 'latas', minThreshold: 6, lastUpdated: new Date().toISOString(), pricePerUnit: 2.50 },
{ id: '32', name: 'Aceitunas Manzanilla', category: 'Despensa', quantity: 20, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 3.00 },
{ id: '33', name: 'Miel de la Alcarria', category: 'Despensa', quantity: 12, unit: 'botes', minThreshold: 5, lastUpdated: new Date().toISOString(), pricePerUnit: 8.50 },
// CARNES (categoria: 'Carnes')
{ id: '34', name: 'Entrecot de Ternera', category: 'Carnes', quantity: 10, unit: 'kg', minThreshold: 4, lastUpdated: new Date().toISOString(), pricePerUnit: 22.00 },
{ id: '40', name: 'Secreto Ibérico', category: 'Ibéricos', quantity: 12, unit: 'kg', minThreshold: 5, lastUpdated: new Date().toISOString(), pricePerUnit: 28.50 },
{ id: '41', name: 'Presa Ibérica', category: 'Ibéricos', quantity: 10, unit: 'kg', minThreshold: 4, lastUpdated: new Date().toISOString(), pricePerUnit: 26.00 },
{ id: '42', name: 'Pluma Ibérica', category: 'Ibéricos', quantity: 8, unit: 'kg', minThreshold: 3, lastUpdated: new Date().toISOString(), pricePerUnit: 24.50 },
// OTROS/REFRIGERADOS (Categoría: 'Varios')
{ id: '43', name: 'Tortilla de Patatas', category: 'Varios', quantity: 15, unit: 'unidades', minThreshold: 6, lastUpdated: new Date().toISOString(), pricePerUnit: 5.00 },
{ id: '44', name: 'Gazpacho Andaluz 1L', category: 'Varios', quantity: 40, unit: 'unidades', minThreshold: 15, lastUpdated: new Date().toISOString(), pricePerUnit: 2.50 },
{ id: '45', name: 'Salmorejo Cordobés 1L', category: 'Varios', quantity: 30, unit: 'unidades', minThreshold: 12, lastUpdated: new Date().toISOString(), pricePerUnit: 2.80 },
{ id: '46', name: 'Alioli Artesano', category: 'Varios', quantity: 20, unit: 'botes', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 3.20 },
{ id: '47', name: 'Croquetas de Jamón', category: 'Varios', quantity: 10, unit: 'bolsas', minThreshold: 4, lastUpdated: new Date().toISOString(), pricePerUnit: 6.50 },
{ id: '48', name: 'Chistorra de Arbizu', category: 'Ibéricos', quantity: 25, unit: 'unidades', minThreshold: 10, lastUpdated: new Date().toISOString(), pricePerUnit: 11.00 },
{ id: '49', name: 'Sobrasada de Mallorca', category: 'Ibéricos', quantity: 15, unit: 'piezas', minThreshold: 7, lastUpdated: new Date().toISOString(), pricePerUnit: 13.50 },
{ id: '50', name: 'Carne de Membrillo', category: 'Dulces', quantity: 20, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString(), pricePerUnit: 6.00 }
];

export const MOCK_USAGE: UsageHistory[] = [
  { id: 'h1', itemId: '1', itemName: 'Jamón Ibérico 5J', date: '2026-01-15', quantityConsumed: 0.2, unit: 'piezas' },
  { id: 'h2', itemId: '1', itemName: 'Jamón Ibérico 5J', date: '2026-01-14', quantityConsumed: 0.4, unit: 'piezas' },
  { id: 'h3', itemId: '4', itemName: 'Bacalao Giraldo', date: '2026-01-14', quantityConsumed: 5.5, unit: 'kg' },
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
