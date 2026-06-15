import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import Planos from './pages/Planos/index.jsx'
import Calculadora from './pages/Calculadora/index.jsx'
import './styles/design-system.css'
import './index.css'

const path = window.location.pathname.replace(/\/$/, '');
const App = path === '/calculadora' ? Calculadora : Planos;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
