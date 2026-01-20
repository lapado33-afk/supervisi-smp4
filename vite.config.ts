import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Memberikan nilai default string kosong jika API_KEY belum diatur agar app tidak crash
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
