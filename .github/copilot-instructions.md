# Blanquita IA - AI Coding Agent Instructions

## Project Overview
Spanish delicatessen inventory management SPA built with React + TypeScript + Vite. Features AI-powered analysis using Google Gemini for inventory insights, order suggestions, and OCR product scanning. PWA with camera access for offline-capable product scanning.

## Architecture Patterns

### Core Data Flow
- **Inventory Management**: Real-time tracking with `InventoryItem[]` state in App.tsx
- **Usage Recording**: `recordUsage()` function updates inventory and logs consumption history
- **AI Integration**: All Gemini calls go through `GeminiService` class methods
- **Notifications**: Auto-generated alerts when items hit `minThreshold`

### Key Files Structure
- `App.tsx` (945 lines): Monolithic component containing all UI logic and state management
- `geminiService.ts`: Centralized AI service with 3 main methods:
  - `chatWithInventory()`: Spanish-language inventory analysis
  - `suggestDailyOrders()`: Consumption-based order recommendations
  - `analyzeKitchenImage()`: OCR extraction from product photos
- `types.ts`: Core interfaces (`InventoryItem`, `UsageHistory`, `Supplier`, etc.)

## Development Workflow

### Environment Setup
```bash
npm install
cp .env.example .env.local  # Add real GEMINI_API_KEY
npm run dev  # Runs on port 3000
```

### Build Commands
- `npm run build`: Production build with PWA assets
- `npm run preview`: Test production build locally

## Code Conventions

### Language & Tone
- **UI Language**: Spanish throughout (product names, categories, messages)
- **AI Responses**: Professional Spanish with sophisticated, analytical tone
- **Comments**: Mix of English (technical) and Spanish (business logic)

### Data Patterns
- **Categories**: Spanish delicatessen focus - Ibéricos, Aceites, Lácteos, Pescados, Bodega, Despensa, Carnes, Varios, Dulces
- **Units**: Mixed metric (kg, L, unidades) and imperial (piezas, botellas, latas, botes)
- **Mock Data**: Extensive hardcoded inventory in `INITIAL_INVENTORY` array
- **Color Theming**: Category-based color schemes in `CATEGORY_THEMES` object

### State Management
- **Local State**: All state managed in App.tsx with useState hooks
- **Data Sync**: Notifications auto-generated from inventory thresholds
- **Persistence**: No backend - all data is ephemeral (mock data resets on refresh)

## AI Integration Patterns

### Gemini API Usage
- **Model**: `gemini-3-pro-preview` for all features
- **Thinking Budget**: 16k for chat, 24k for suggestions, none for OCR
- **Error Handling**: Specific quota exceeded messages in Spanish
- **System Instructions**: Detailed Spanish prompts for inventory analysis focus

### Feature-Specific Logic
- **Chat Analysis**: Focus on expiry dates and excess stock only
- **Order Suggestions**: Cross-reference current stock, minimums, and consumption history
- **Image OCR**: Extract product name, quantity, expiry, supplier from photos

## PWA & Camera Features
- **Manifest**: Configured in `vite.config.ts` with Spanish app name
- **Camera Access**: `metadata.json` requests camera permission
- **Offline**: Workbox handles caching for JS/CSS/HTML/assets

## Common Tasks

### Adding New Inventory Items
1. Add to `INITIAL_INVENTORY` array with proper category/unit
2. Ensure `minThreshold` and `pricePerUnit` are set
3. Add category color theme if new category introduced

### Extending AI Features
1. Add new method to `GeminiService` class
2. Follow Spanish prompt pattern with professional tone
3. Handle quota errors consistently
4. Update App.tsx to call new method

### UI Modifications
- Use Lucide React icons (already imported extensively)
- Follow existing Tailwind CSS patterns
- Maintain mobile-responsive design
- Preserve Spanish text throughout

## Testing Considerations
- **Manual Testing**: Check camera access, PWA installation, offline functionality
- **AI Testing**: Verify Spanish responses, quota error handling
- **Data Validation**: Ensure inventory calculations work with mixed units

## Deployment Notes
- Built as static SPA deployable to any static host
- PWA manifest includes proper icons and metadata
- Environment variables handled via Vite's `loadEnv` and `define`