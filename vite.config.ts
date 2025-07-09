import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'public', dest: '.' }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/popup.html'),
        options: path.resolve(__dirname, 'src/options/options.html')
        // ❌ Remove background and content from here
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    sourcemap: false,
    // ✅ This enables .ts entry files (like background, content)
    lib: {
      entry: {
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/index.tsx')
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`
    }
  }
});
