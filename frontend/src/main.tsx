import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.tsx'

// STRATEGI JARINGAN: Vite Proxy
// Semua request /api diteruskan oleh Vite server (port 5173) ke backend (port 8000)
// secara internal di laptop → tidak ada CORS, tidak ada warning Dev Tunnels!
// Cukup pakai path relatif: axios.get('/api/...') → Vite meneruskan ke http://127.0.0.1:8000/api/...

// Interceptor: ubah semua URL hardcoded http://127.0.0.1:8000/api/... menjadi path /api/...
// Ini agar semua file yang masih pakai URL lama (useDashboard.ts, dll) tetap berfungsi
// tanpa perlu diubah satu per satu.
axios.interceptors.request.use(
  (config) => {
    if (config.url) {
      // Hapus prefix URL absolut dan biarkan path relatif yang diteruskan Vite
      config.url = config.url
        .replace(/^https?:\/\/127\.0\.0\.1:8000/, '')
        .replace(/^https?:\/\/localhost:8000/, '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

console.log('%c[CoffeeFinder Network]', 'color: #f97316; font-weight: bold;',
  'Mode: Vite Proxy → semua /api diteruskan ke backend port 8000 secara internal'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
