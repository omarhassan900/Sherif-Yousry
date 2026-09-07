import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ✅ FIX: Use import.meta.url instead of __dirname to prevent ESM errors in Vite 5+
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    
    // ✅ ADD: CSS and asset handling for tests (prevents "Unexpected token" errors)
    css: true,
    

    // ✅ ADD: Test Coverage Configuration
    coverage: {
      provider: 'v8', // 'v8' is faster and doesn't require Babel/SWC instrumentation
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts', 
        'src/main.tsx', 
        'src/vite-env.d.ts',
        'src/__tests__/**'
      ],
    },
  },
})