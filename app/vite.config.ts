import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Reduce chunk warning threshold
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunking to split vendor libraries from app code
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Animation
          'motion': ['motion'],
          // Icons - only loaded when needed
          'lucide': ['lucide-react'],
          // Charts (only needed in admin)
          'charts': ['chart.js'],
          // Supabase
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
  // Cache dependencies for faster builds
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion', 'lucide-react', '@supabase/supabase-js'],
  },
});