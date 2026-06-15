import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import Planos from './pages/Planos/index.jsx'
import './styles/design-system.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Planos />
    </HelmetProvider>
  </StrictMode>,
)
