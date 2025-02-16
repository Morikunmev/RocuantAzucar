import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Directorio de salida para los archivos construidos
    assetsDir: "assets", // Directorio para assets
  },
  base: "/", // Importante para el routing
  server: {
    port: 5173, // Puerto de desarrollo
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
