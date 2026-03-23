// ============================================================
// Navbar — Barre de navigation + toggle langue FR/EN
// ============================================================
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Waves, LayoutDashboard, CalendarDays, BookOpen,
  PlusCircle, User, LogOut, Menu, X, Users, MessageSquare
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../hooks/useLang'
import { requestsAPI } from '../../services/api'

// Bouton toggle langue
function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:bg-white/10 transition-all"
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className="text-base">{lang === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
      <span className="text-cyan-200 uppercase text-xs font-medium">{lang}</span>
    </button>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Badge notification : nb de demandes en attente (instructeurs uniquement)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (user?.role !== 'INSTRUCTEUR') return

    const fetch = () =>
      requestsAPI.getPendingCount()
        .then(({ count }) => setPendingCount(count))
        .catch(() => {})

    fetch()
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetch, 30_000)
    return () => clearInterval(interval)
  }, [user])

  const closeMenu = () => setMenuOpen(false)

  const navLinkClass = (path) =>
    `flex items-center gap-3 font-medium transition-colors ${
      location.pathname === path ? 'text-white' : 'text-cyan-200 hover:text-white'
    }`

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link to="/dashboard" onClick={closeMenu}
        className={`${navLinkClass('/dashboard')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'}`}>
        <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
      </Link>
      <Link to="/calendar" onClick={closeMenu}
        className={`${navLinkClass('/calendar')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'}`}>
        <CalendarDays className="w-4 h-4" /> {t('nav.calendar')}
      </Link>
      <Link to="/courses" onClick={closeMenu}
        className={`${navLinkClass('/courses')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'}`}>
        <BookOpen className="w-4 h-4" /> {t('nav.courses')}
      </Link>
      <Link to="/instructors" onClick={closeMenu}
        className={`${navLinkClass('/instructors')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'}`}>
        <Users className="w-4 h-4" /> {t('nav.instructors')}
      </Link>
      <Link to="/requests" onClick={closeMenu}
        className={`${navLinkClass('/requests')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'} relative`}>
        <MessageSquare className="w-4 h-4" />
        {t('nav.requests')}
        {pendingCount > 0 && (
          <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </Link>
      {user?.role === 'INSTRUCTEUR' && (
        <Link to="/create" onClick={closeMenu}
          className={`${navLinkClass('/create')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'}`}>
          <PlusCircle className="w-4 h-4" /> {t('nav.create')}
        </Link>
      )}
      <Link to="/profile" onClick={closeMenu}
        className={`${navLinkClass('/profile')} ${mobile ? 'text-base py-3 border-b border-white/10' : 'text-sm'}`}>
        <User className="w-4 h-4" /> {t('nav.profile')}
      </Link>
    </>
  )

  return (
    <>
      <nav className="glass-panel sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-cyan-200">Apnea Flow</span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Droite */}
          <div className="flex items-center gap-3">
            {/* Toggle langue — visible partout (desktop + mobile) */}
            <LangToggle />

            {/* Badge rôle — desktop seulement */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full glass-card">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-cyan-200">{user?.role}</span>
            </div>

            {/* Avatar + dropdown — desktop seulement */}
            <div className="hidden md:block relative group">
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border border-white/20 hover:border-cyan-400 transition-all">
                <User className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-12 w-48 glass-panel rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/profile" className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> {t('nav.profile')}
                </Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-300 rounded-lg text-sm flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> {t('nav.logout')}
                </button>
              </div>
            </div>

            {/* Burger — mobile seulement */}
            <button
              className="md:hidden w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/10 transition-all"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden glass-panel relative z-30 px-6 py-4 border-t border-white/10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg">
              🤿
            </div>
            <div>
              <div className="font-medium text-sm">{user?.name}</div>
              <div className="text-xs text-cyan-200">{user?.role}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <NavLinks mobile />
          </div>
          <button
            onClick={() => { logout(); closeMenu() }}
            className="mt-4 pt-4 border-t border-white/10 w-full flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-base font-medium"
          >
            <LogOut className="w-4 h-4" /> {t('nav.logout')}
          </button>
        </div>
      )}
    </>
  )
}
