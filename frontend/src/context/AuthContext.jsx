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

// Helper : sauvegarde l'user SANS photoUrl (base64 trop lourde pour localStorage ~5MB)
// La photo reste dans le state React en mémoire, pas besoin de la persister
function saveUserToStorage(userData) {
  const { photoUrl, ...userWithoutPhoto } = userData
  localStorage.setItem('apnea_user', JSON.stringify(userWithoutPhoto))
}

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
    localStorage.setItem('apnea_token', res.token)
    saveUserToStorage(res.user)   // sans photoUrl
    setUser(res.user)             // avec photoUrl en mémoire
    return res
  }

  // ---- REGISTER ----
  const register = async (name, email, password, role) => {
    const res = await authAPI.register(name, email, password, role)
    localStorage.setItem('apnea_token', res.token)
    saveUserToStorage(res.user)   // sans photoUrl
    setUser(res.user)             // avec photoUrl en mémoire
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
    saveUserToStorage(newUser)    // sans photoUrl
  }

  // La valeur fournie à tous les composants enfants
  const value = { user, loading, login, logout, register, updateUser }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
