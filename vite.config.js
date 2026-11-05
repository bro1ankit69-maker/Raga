import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In development, forward /api calls to the Express server (npm run api)
    proxy: { '/api': 'http://localhost:5000' },
  },
})
