import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 New content available, click on reload button to update.')
  },
  onOfflineReady() {
    console.log('✅ PWA App ready to work offline')
  },
  onRegisterError(error) {
    console.error('❌ SW registration failed:', error)
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
