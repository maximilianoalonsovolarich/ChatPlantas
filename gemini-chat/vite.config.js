// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Redirige todas las solicitudes desde /api al servidor Express en el puerto 5000
    },
  },
});
