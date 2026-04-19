import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-scroll-area', '@radix-ui/react-separator', '@radix-ui/react-avatar', '@radix-ui/react-label', '@radix-ui/react-slot', '@radix-ui/react-switch'],
          'vendor-maps': ['leaflet', 'react-leaflet'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
