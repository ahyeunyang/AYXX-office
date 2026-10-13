import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 설정 참고: https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
