import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@c': path.resolve(__dirname, 'src/components')
    }
  },
  base: '/',
  plugins: [vue()],
  define: {
    'process.env': {}
  }
})
