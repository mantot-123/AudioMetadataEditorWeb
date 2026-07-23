import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/all-files': 'http://127.0.0.1:5000',
      '/read-metadata': 'http://127.0.0.1:5000',
      '/apply-metadata': 'http://127.0.0.1:5000',
      '/rename-file': 'http://127.0.0.1:5000',
      '/get-file': 'http://127.0.0.1:5000',
      '/browse-metadata': 'http://127.0.0.1:5000',
      '/browse-art': 'http://127.0.0.1:5000',
      '/get-album-art': 'http://127.0.0.1:5000',
      '/apply-album-art': 'http://127.0.0.1:5000'
    },
  },
})
