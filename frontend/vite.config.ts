
import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: "https://edufinance-backend-8s2g.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
    

  },
});
