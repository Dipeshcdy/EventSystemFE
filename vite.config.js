import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://93.127.167.240:5001',  
        changeOrigin: true,                    
        secure: false,                        
      },
    }
  }
});
