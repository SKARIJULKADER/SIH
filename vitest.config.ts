import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Unit tests target the pure logic in src/api and server (no browser needed).
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})