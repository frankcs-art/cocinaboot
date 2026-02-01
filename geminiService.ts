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
    const model = useThinking ? 'gemini-2.0-flash-thinking-exp-01-21' : 'gemini-1.5-flash';
    
    const inventoryContext = `Inventario Actual: ${JSON.stringify(inventory)}`;
    const systemInstruction = `
### ROL: JULES (Logística Integral Blanquita-IA)
Eres el sistema de control de suministros y analítica predictiva de cocina. Tu objetivo es el "Desperdicio Cero" y la continuidad operativa total. No gestionas dinero, solo volúmenes, flujos y tiempos.

### LOGICA DE PREDICCIÓN
Calcula el pedido basándote en: (CPD * Días de cobertura deseada) - Stock Actual + Margen de Error (10%).
Si hay "Día de alta demanda", aumenta la predicción de perecederos en un 30%.

### ESTRUCTURA DE RESPUESTA (PROTOCOLO OBLIGATORIO)
Mantén un formato técnico y visual. Ejemplo:
MOVIMIENTO REGISTRADO: [Producto] | -[Cantidad] | Motivo: [Consumo/Merma]
ESTADO ACTUAL: [🟢/🟡/🔴]
ALERTA: [Si aplica]
PREDICCIÓN: "Basado en el ritmo actual, el producto [X] se agotará en [N] horas."
PEDIDO SUGERIDO: [Proveedor] -> [Producto] -> [Cantidad a Pedir] -> [Ubicación]

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

  static async suggestDailyOrders(inventory: InventoryItem[], usageHistory: UsageHistory[], isHighDemand: boolean): Promise<string> {
    const ai = await this.getClient();
    const model = 'gemini-2.0-flash-thinking-exp-01-21';
    
    const prompt = `Analiza los siguientes datos operativos para generar PEDIDOS SUGERIDOS:
    - Inventario: ${JSON.stringify(inventory)}
    - Historial de Gasto: ${JSON.stringify(usageHistory)}
    - Alta Demanda Actual: ${isHighDemand}
    
    TAREA:
    1. Calcula el CPD por producto.
    2. Usa la fórmula: (CPD * 3 días) - Stock Actual + 10% margen.
    3. Si isHighDemand es true, aplica +30% a perecederos.
    4. Genera la lista consolidada: [Proveedor] -> [Producto] -> [Cantidad a Pedir] -> [Ubicación].
    
    Responde siguiendo el Protocolo Jules.`;

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
    const model = 'gemini-1.5-flash';
    
    const prompt = `Actúa como Jules - Escáner de Logística. Extrae del albarán/imagen:
    - Producto.
    - Cantidad y Unidad (KG, L, PZ).
    - Caducidad.
    
    Formato Jules técnico.`;

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
