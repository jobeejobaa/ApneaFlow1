// ============================================================
// useLang — Custom hook pour accéder au LangContext
//
// Usage dans n'importe quel composant :
//   const { t, lang, setLang } = useLang()
//
//   t('nav.dashboard')   → 'Dashboard' (FR) ou 'Dashboard' (EN)
//   t('auth.loginBtn')   → 'Se connecter' (FR) ou 'Sign in' (EN)
//   lang                 → 'fr' ou 'en'
//   setLang('en')        → changer la langue
// ============================================================

import { useContext } from 'react'
import { LangContext } from '../context/LangContext'

export function useLang() {
  const context = useContext(LangContext)
  if (!context) throw new Error('useLang doit être dans un <LangProvider>')
  return context
}
