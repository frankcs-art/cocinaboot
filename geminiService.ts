import { InventoryItem, UsageHistory } from "./types";

export class GeminiService {
  private static async getClient() {
    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async chatWithInventory(
    message: string, 
    inventory: InventoryItem[], 
    history: {role: 'user' | 'model', text: string}[] = [],
    useThinking: boolean = false
  ): Promise<string> {
    const ai = await this.getClient();
    const model = 'gemini-3-pro-preview';
    
    const inventoryContext = `Inventario Actual: ${JSON.stringify(inventory)}`;
    const systemInstruction = `
### ROL
Actúa como un analista experto en gestión de inventarios.

### CRITERIOS DE ANÁLISIS
Focalízate exclusivamente en ítems que:
1. Estén próximos a caducar.
2. Presenten un exceso de stock.

### REGLAS DE COMUNICACIÓN (OBLIGATORIAS)
- **Idioma:** Responder SIEMPRE en español de España (neutro, sin modismos latinos).
- **Tono:** Sofisticado, profesional y analítico. Evita el lenguaje coloquial.
- **Enfoque:** Prioriza la precisión y la propuesta de soluciones estratégicas.

Contexto del inventario: ${inventoryContext}`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          thinkingConfig: useThinking ? { thinkingBudget: 16000 } : undefined
        },
      });

      return response.text || "No se pudo procesar el análisis.";
    } catch (error: any) {
      if (error.message && (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED'))) {
        return "Lo siento, se ha excedido el límite de uso de la API de IA. Por favor, inténtalo más tarde o considera actualizar tu plan.";
      }
      return "Error al procesar la consulta. Inténtalo de nuevo.";
    }
  }

  static async suggestDailyOrders(inventory: InventoryItem[], consumptionHistory: UsageHistory[]): Promise<string> {
    const ai = await this.getClient();
    const model = 'gemini-3-pro-preview';
    
    const prompt = `Analiza los siguientes datos operativos:
    - Inventario: ${JSON.stringify(inventory)}
    - Historial de Gasto Reciente: ${JSON.stringify(consumptionHistory)}
    
    TAREA:
    1. Detecta anomalías en el consumo (ej. gasto excesivo de aceite).
    2. Cruza el stock actual con el mínimo y el gasto promedio.
    3. Genera una orden de compra detallada para HOY.
    4. Proporciona un consejo de ahorro de costes basado en los precios unitarios.
    
    Responde en español con formato Markdown elegante.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          thinkingConfig: { thinkingBudget: 24000 }
        }
      });

      return response.text || "Sugerencia no disponible.";
    } catch (error: any) {
      if (error.message && (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED'))) {
        return "Lo siento, se ha excedido el límite de uso de la API de IA. Por favor, inténtalo más tarde o considera actualizar tu plan.";
      }
      return "Error al generar la sugerencia. Inténtalo de nuevo.";
    }
  }

  static async analyzeKitchenImage(base64Image: string, mimeType: string): Promise<string> {
    const ai = await this.getClient();
    const model = 'gemini-3-pro-preview';
    
    const prompt = `Actúa como un escáner inteligente OCR para cocinas. Extrae:
    - Nombre del producto.
    - Cantidad/Peso.
    - Fecha de caducidad si es visible.
    - Proveedor si es un albarán.
    
    Devuelve los datos estructurados en español.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: prompt }
          ]
        }
      });

      return response.text || "Análisis visual fallido.";
    } catch (error: any) {
      if (error.message && (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED'))) {
        return "Lo siento, se ha excedido el límite de uso de la API de IA. Por favor, inténtalo más tarde o considera actualizar tu plan.";
      }
      return "Error en el análisis visual. Inténtalo de nuevo.";
    }
  }
}
