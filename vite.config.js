import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
        port: 3000, // Optional: Specify the port if you want to use the same port as CRA
      },
  };
});