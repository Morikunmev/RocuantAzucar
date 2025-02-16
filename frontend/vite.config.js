import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Añadimos configuración de rollup para optimizar el build
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Aseguramos que los assets se manejen correctamente
        assetFileNames: "assets/[name].[hash].[ext]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js"
      }
    }
  },
  // Aseguramos que la base sea relativa para que funcione en cualquier ruta
  base: "",
  server: {
    port: 5173,
    // Configuración más robusta del proxy
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
    },
    // Añadimos configuración para manejar el historial de navegación
    historyApiFallback: true
  },
  // Añadimos configuración para el manejo de rutas en producción
  preview: {
    port: 5173,
    historyApiFallback: true
  }
});