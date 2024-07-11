import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/apis': {
        target: 'https://bhadradritemple.telangana.gov.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apis/, ''),
        secure: false, // This can be true or false depending on your SSL certificate
      },
    },
  },
  plugins: [react()],
});
