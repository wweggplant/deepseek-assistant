// import dotenvFlow from 'dotenv-flow'
// dotenvFlow.config()
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        contentScript: resolve(__dirname, 'src/contentScript.ts'),
        'components/ShareDialog': './src/components/ShareDialog.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
        preserveModules: false
      }
    }
  },
  css: {}
})