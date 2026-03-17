// ============================================================
// main.jsx — Point d'entrée React
//
// C'est ici que React "monte" dans le DOM.
// On enveloppe l'app avec :
//   BrowserRouter → gestion des URLs
//   AuthProvider  → état de connexion global
//   ToastProvider → notifications globales
// ============================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { LangProvider } from './context/LangContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* LangProvider en premier : les autres contextes peuvent en avoir besoin */}
      <LangProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>
)
