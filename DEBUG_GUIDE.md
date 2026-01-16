# 🍽️ Blanquita IA - Sistema Inteligente de Gestión de Delicatessen

## 🎯 Nuevas Características Agregadas

### ✅ **Base de Datos NoSQL (IndexedDB)**
- Persistencia automática de inventario
- Historial de consumo sincronizado
- Datos de proveedores almacenados localmente
- Sincronización inteligente con debounce

### ✅ **Almacenamiento Persistente**
- **StorageService**: Gestión centralizada de datos
  - IndexedDB para datos estructurados (inventario, historial)
  - LocalStorage para chat y preferencias
  - Métodos de import/export de datos

### ✅ **Sistema de Logging Avanzado**
- **Logger Service**: Logging con colores y niveles
  - DEBUG, INFO, SUCCESS, WARNING, ERROR
  - Historial de logs en memoria
  - Acceso desde consola de navegador

### ✅ **Debug Mejorado**
- Botón Settings en header → Debug Info completo
- Console coloreado con emojis
- Historial de eventos
- Información de sincronización

## 🚀 Cómo Usar

### Instalación
```bash
npm install
cp .env.example .env.local  # Agregar GEMINI_API_KEY
npm run dev  # Inicia en http://localhost:3000
```

### Debug en Navegador
1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Haz clic en el botón ⚙️ Settings en el header
4. Los logs aparecerán coloreados en la consola

### Comandos de Debug (en Console)
```javascript
// Ver info completa
StorageService.printFullDebugInfo()

// Ver historial de logs
Logger.printHistory()

// Limpiar datos (DEBUG MODE)
localStorage.clear()
indexedDB.deleteDatabase('blanquita_db')

// Ver estadísticas
StorageService.getLastSync()
```

## 📁 Estructura de Archivos Nuevos

```
src/
├── storageService.ts       # Gestión de persistencia
├── logger.ts               # Sistema de logging
├── indexedDBService.ts     # Base de datos NoSQL
├── App.tsx                 # Componente principal (actualizado)
└── types.ts                # Tipos TypeScript
```

## 🔧 Características Técnicas

### StorageService
```typescript
// Guardar inventario
await StorageService.saveInventoryData(items)

// Cargar inventario
const items = await StorageService.loadInventoryData()

// Chat persistente
StorageService.saveChatMessages(messages)
const msgs = StorageService.loadChatMessages()
```

### Logger
```typescript
// Diferentes niveles de log
Logger.debug('Mensaje')
Logger.info('Información')
Logger.success('Éxito')
Logger.warning('Advertencia')
Logger.error('Error', errorObj)

// Grupos
Logger.group('Mi Grupo')
Logger.info('Info dentro del grupo')
Logger.groupEnd()
```

### IndexedDB
```typescript
// Operaciones principales
await initDB()
await saveInventory(items)
const items = await getInventory()
await recordUsageHistory(usage)
```

## 📊 Datos Sincronizados

| Dato | Almacenamiento | Persistencia |
|------|-----------------|-------------|
| Inventario | IndexedDB | Permanente |
| Historial de Consumo | IndexedDB | Permanente |
| Proveedores | IndexedDB | Permanente |
| Chat | LocalStorage | Permanente |
| Preferencias | LocalStorage | Permanente |
| Logs | Memoria | Sesión |

## 🎨 Sistema de Logging con Colores

```
✅ SUCCESS   (Verde)
❌ ERROR     (Rojo)
⚠️  WARNING   (Naranja)
ℹ️  INFO      (Azul)
🔧 DEBUG     (Púrpura)
```

## 🐛 Problemas Solucionados

- ✅ Import `verify` sin usar eliminado
- ✅ Puerto incorrecto en launch.json (3002 → 3000)
- ✅ Base de datos debounced para evitar múltiples guardados
- ✅ Fechas mock actualizadas
- ✅ Chat persistente entre sesiones
- ✅ Logging centralizado y coloreado
- ✅ Debug info accesible desde UI

## 🔮 Próximas Mejoras Sugeridas

- [ ] Export/Import de datos en JSON
- [ ] Backup automático en la nube
- [ ] Analytics de consumo
- [ ] Alertas por email
- [ ] PWA con sincronización offline
- [ ] API REST para multi-dispositivo

## 📞 Soporte

Para ver logs detallados, abre DevTools y ejecuta:
```javascript
StorageService.printFullDebugInfo()
Logger.printHistory()
```

---

**Versión:** 1.1.0  
**Última actualización:** 16 de enero de 2026
