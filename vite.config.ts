import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite para 1000kb para silenciar avisos de bibliotecas grandes como Recharts
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Estratégia de split de código para melhorar o carregamento e cache
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Agrupa bibliotecas de visualização
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Agrupa ícones
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Agrupa core (react, supabase, etc)
            return 'vendor-core';
          }
        }
      }
    }
  }
})