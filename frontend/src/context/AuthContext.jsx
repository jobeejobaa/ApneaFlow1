// ============================================================
// AUTH CONTEXT — Gestion globale de l'authentification
//
// Le Context React permet de partager des données entre
// tous les composants sans avoir à les passer en "props drilling"
// (passer les props de parent en parent en parent...).
//
// Ce contexte expose :
//   - user       → l'utilisateur connecté (ou null)
//   - login()    → connecter un utilisateur
//   - logout()   → déconnecter
//   - register() → créer un compte
//   - loading    → true pendant le chargement initial
// ============================================================

import { createContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

// 1. Créer le contexte (valeur par défaut = null)
export const AuthContext = createContext(null)

// 2. Provider = composant qui "enveloppe" l'app et fournit le contexte
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true pendant la vérification du token stocké

  // Au démarrage : vérifier si un token est déjà sauvegardé
  useEffect(() => {
    const storedToken = localStorage.getItem('apnea_token')
    const storedUser = localStorage.getItem('apnea_user')

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        // Si le JSON est corrompu, on nettoie
        localStorage.removeItem('apnea_token')
        localStorage.removeItem('apnea_user')
      }
    }
    setLoading(false)
  }, [])

  // ---- LOGIN ----
  const login = async (email, password) => {
    const res = await authAPI.login(email, password)
    // Stocker le token et l'user dans localStorage (persiste après rechargement)
    localStorage.setItem('apnea_token', res.token)
    localStorage.setItem('apnea_user', JSON.stringify(res.user))
    setUser(res.user)
    return res
  }

  // ---- REGISTER ----
  const register = async (name, email, password, role) => {
    const res = await authAPI.register(name, email, password, role)
    localStorage.setItem('apnea_token', res.token)
    localStorage.setItem('apnea_user', JSON.stringify(res.user))
    setUser(res.user)
    return res
  }

  // ---- LOGOUT ----
  const logout = () => {
    localStorage.removeItem('apnea_token')
    localStorage.removeItem('apnea_user')
    setUser(null)
  }

  // ---- METTRE À JOUR L'USER (après modification du profil) ----
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('apnea_user', JSON.stringify(newUser))
  }

  // La valeur fournie à tous les composants enfants
  const value = { user, loading, login, logout, register, updateUser }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
