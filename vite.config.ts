import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  root: `${process.cwd()}/src`, // <--- defaults to process.cwd(). where the index.html is located.
  plugins: [react()],
  publicDir: './public', // defaults to "public". The location of the public dir relative to the index.html file.
  server: {
    open: true,
    port: 3000,
    strictPort: true,
  },
});
