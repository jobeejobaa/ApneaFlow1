import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Le proxy redirige tous les appels /api vers le backend Express
    // Comme ça en dev, pas besoin de CORS : le navigateur croit que tout vient du même serveur
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // Dossier de sortie lors du build prod (sera servi par Express)
  build: {
    outDir: 'dist',
  },
})
