import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { digisparkServerPlugin } from './server/routes'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), digisparkServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
})
