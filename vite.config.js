import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 모든 인터페이스(127.0.0.1 포함)에서 접근 가능하도록 설정
  },
})
