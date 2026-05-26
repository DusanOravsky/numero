import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { captureWebVitals } from './hooks/usePerformanceMetrics'
import { cleanupOldChats } from './engine/chatStorage'

captureWebVitals();
cleanupOldChats();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
