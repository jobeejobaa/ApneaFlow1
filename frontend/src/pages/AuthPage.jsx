// ============================================================
// AuthPage — Page de connexion / inscription
// ============================================================
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Waves, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useLang } from '../hooks/useLang'
import Button from '../components/ui/Button'
import OceanBackground from '../components/ui/OceanBackground'

// Toggle langue sur la page auth (pas de Navbar ici)
function AuthLangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:bg-white/10 transition-all"
    >
      <span>{lang === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
      <span className="text-cyan-200 uppercase text-xs font-medium">{lang}</span>
    </button>
  )
}

export default function AuthPage() {
  // Si l'URL contient ?mode=register, on ouvre directement l'onglet inscription
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  )
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('eleve@apnea.fr')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [role, setRole] = useState('ELEVE')

  const { login, register } = useAuth()
  const { addToast } = useToast()
  const { t } = useLang()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(email, password)
      addToast(`Bienvenue, ${res.user.name} !`)
      navigate('/dashboard')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register(name, regEmail, regPassword, role)
      addToast(`Bienvenue, ${res.user.name} !`)
      navigate('/dashboard')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OceanBackground className="flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-8 w-full max-w-md animate-fade-in">
        {/* Toggle langue */}
        <AuthLangToggle />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center pulse-glow">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">Apnea Flow</h1>
          <p className="text-cyan-200">{t('auth.subtitle')}</p>
        </div>

        {/* Connexion */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder={t('auth.emailLabel')} value={email}
              onChange={e => setEmail(e.target.value)} className="ocean-input w-full px-4 py-3 rounded-xl" required />
            <input type="password" placeholder={t('auth.passwordLabel')} value={password}
              onChange={e => setPassword(e.target.value)} className="ocean-input w-full px-4 py-3 rounded-xl" required />

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              <LogIn className="w-4 h-4" /> {t('auth.loginBtn')}
            </Button>

            {/* Comptes de démo */}
            <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-400">
              <p className="font-medium text-cyan-300 mb-1">{t('auth.demoTitle')}</p>
              <p className="cursor-pointer hover:text-cyan-300 py-0.5"
                onClick={() => { setEmail('eleve@apnea.fr'); setPassword('password') }}>
                📘 {t('auth.demoEleve')} : eleve@apnea.fr / password
              </p>
              <p className="cursor-pointer hover:text-cyan-300 py-0.5"
                onClick={() => { setEmail('instructeur@apnea.fr'); setPassword('password') }}>
                🎓 {t('auth.demoInstructor')} : instructeur@apnea.fr / password
              </p>
            </div>

            <p className="text-center text-sm text-slate-400">
              {t('auth.noAccount')}{' '}
              <button type="button" onClick={() => setMode('register')} className="text-cyan-400 hover:text-cyan-300">
                {t('auth.signUp')}
              </button>
            </p>
          </form>
        )}

        {/* Inscription */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder={t('auth.nameLabel')} value={name}
              onChange={e => setName(e.target.value)} className="ocean-input w-full px-4 py-3 rounded-xl" required />
            <input type="email" placeholder={t('auth.emailLabel')} value={regEmail}
              onChange={e => setRegEmail(e.target.value)} className="ocean-input w-full px-4 py-3 rounded-xl" required />
            <input type="password" placeholder={t('auth.passwordHint')} value={regPassword}
              onChange={e => setRegPassword(e.target.value)} className="ocean-input w-full px-4 py-3 rounded-xl" required />
            <select value={role} onChange={e => setRole(e.target.value)} className="ocean-input w-full px-4 py-3 rounded-xl">
              <option value="ELEVE">{t('auth.roleEleve')}</option>
              <option value="INSTRUCTEUR">{t('auth.roleInstructor')}</option>
            </select>

            <Button type="submit" variant="gradient" loading={loading} className="w-full">
              <UserPlus className="w-4 h-4" /> {t('auth.registerBtn')}
            </Button>

            <p className="text-center text-sm text-slate-400">
              {t('auth.alreadyAccount')}{' '}
              <button type="button" onClick={() => setMode('login')} className="text-cyan-400 hover:text-cyan-300">
                {t('auth.signIn')}
              </button>
            </p>
          </form>
        )}
      </div>
    </OceanBackground>
  )
}
