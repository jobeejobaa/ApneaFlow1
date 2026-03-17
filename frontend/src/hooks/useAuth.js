// ============================================================
// useAuth — Custom hook pour accéder au AuthContext
//
// Pourquoi un custom hook plutôt que useContext directement ?
// 1. Plus court à écrire dans les composants
// 2. Erreur claire si utilisé hors du AuthProvider
// 3. On peut ajouter de la logique partagée ici plus tard
//
// Usage dans un composant :
//   const { user, login, logout } = useAuth()
// ============================================================

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un <AuthProvider>')
  }

  return context
}
