import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/goit-advancedjs-hw-04/', 
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
      },
    },
  },
});
