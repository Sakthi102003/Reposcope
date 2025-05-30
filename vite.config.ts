import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'stream', 'util', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['@octokit/rest'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui'
            }
            if (id.includes('recharts')) {
              return 'vendor-charts'
            }
            return 'vendor-others'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    watch: {
      usePolling: true,
    },
  }
}) 