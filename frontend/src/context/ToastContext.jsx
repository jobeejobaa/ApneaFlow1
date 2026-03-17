// ============================================================
// TOAST CONTEXT — Système de notifications global
//
// Permet d'afficher des messages de succès/erreur depuis
// n'importe quel composant de l'app via useToast().
// ============================================================

import { createContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // useCallback mémorise la fonction pour éviter des re-renders inutiles
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])

    // Supprimer automatiquement après 3 secondes
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Zone d'affichage des toasts — fixée en bas à droite */}
      <div className="fixed bottom-8 right-8 space-y-3 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="glass-panel px-5 py-4 rounded-xl flex items-center gap-3 animate-fade-in min-w-[280px]"
          >
            {toast.type === 'error'
              ? <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              : <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            }
            <span className="text-sm flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
