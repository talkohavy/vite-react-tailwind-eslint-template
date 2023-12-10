import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: `${process.cwd()}/src`, // <--- where the index.html is located. defaults to `process.cwd()`.
  plugins: [react()],
  publicDir: './public', // default is "public". The location of the public dir relative to the index.html file.
  server: {
    open: true,
    port: 3000,
    strictPort: true,
  },
});
