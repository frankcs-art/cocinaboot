<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BlanquitaIA - Asistente de Cocina Inteligente

Sistema de gestión de inventario y asistente IA para cocinas profesionales, con control por voz y predicción de compras.

## Requisitos Previos

*   **Node.js**: Versión 18 o superior.
*   **Clave API de Gemini**: Necesaria para las funciones de IA.

## Instalación Local

Sigue estos pasos para ejecutar el proyecto en tu máquina:

1.  **Instalar dependencias**:
    Abre una terminal en la carpeta del proyecto y ejecuta:
    ```bash
    npm install
    ```

2.  **Configurar Variables de Entorno**:
    Asegúrate de tener un archivo `.env.local` en la raíz del proyecto con tu clave de API:
    ```
    VITE_GEMINI_API_KEY=tu_clave_api_aqui
    ```
    *(Nota: Revisa `.env.example` si necesitas una referencia)*

3.  **Ejecutar Servidor de Desarrollo**:
    Inicia la aplicación en modo desarrollo:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## Producción y PWA

Este proyecto ha sido configurado para producción como una Progressive Web App (PWA) segura.

### Ejecutar en Producción (Recomendado)

Utiliza el servidor Express incluido que gestiona compresión (Gzip/Brotli) y certificados SSL:

```bash
npm run build
npm start
```

*   **URL Segura**: `https://localhost:3000` (necesario para PWA/Service Worker)
*   **Redirección**: `http://localhost:8080` -> `https://localhost:3000`

### Características de Producción

*   **PWA**: Funciona sin conexión (Offline Mode) y es instalable.
*   **Sincronización**: Las acciones realizadas offline se guardan y sincronizan al recuperar la conexión.
*   **Rendimiento**:
    *   Compresión Brotli/Gzip.
    *   HTTP/2 (Multiplexing) activado.
    *   Code Splitting avanzado.

## Características Principales

*   **Dashboard**: Resumen de stock y valor del almacén.
*   **Inventario**: Gestión de productos con alertas de stock bajo y diseño "Luxury" optimizado.
*   **Control por Voz**: Comandos manos libres ("Inicio", "Inventario", "Chat").
*   **Chat IA**: Asistente culinario potenciado por Gemini.
*   **Escáner**: (Simulado) Entrada de datos visual.
*   **Offline First**: Accesible sin internet con banner de estado.

## Estructura del Proyecto

*   `src/App.tsx`: Componente raíz.
*   `src/components/`: Componentes modulares (Inventory, Dashboard, etc.).
*   `src/geminiService.ts`: Lógica de conexión con la IA.
*   `src/indexedDBService.ts`: Almacenamiento local de datos.

