// ============================================================
// ProfilePage — Modification du profil utilisateur
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, LogOut } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { usersAPI } from '../services/api'
import { useLang } from '../hooks/useLang'

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const { addToast } = useToast()
  const { t } = useLang()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await usersAPI.updateMe({ name, bio })
      updateUser(updated)   // Met à jour le contexte + localStorage
      addToast(t('profile.successMsg'))
      navigate('/')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Formulaire profil */}
      <div className="glass-card rounded-2xl p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-4 border-white/20 text-6xl flex-shrink-0">
            🤿
          </div>

          {/* Infos + form */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-1">{user?.name}</h2>
                <p className="text-cyan-200">{user?.email}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                user?.role === 'INSTRUCTEUR'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {user?.role}
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-200 mb-2 text-sm">{t('profile.nameLabel')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="ocean-input w-full px-4 py-3 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cyan-200 mb-2 text-sm">{t('profile.emailLabel')}</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="ocean-input w-full px-4 py-3 rounded-xl opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-cyan-200 mb-2 text-sm">{t('profile.bioLabel')}</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="ocean-input w-full px-4 py-3 rounded-xl resize-none"
                  placeholder={t('profile.bioPlaceholder')}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary" loading={loading}>
                  {t('profile.save')}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                  {t('profile.cancel')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="glass-card rounded-2xl p-6 border border-red-500/20">
        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {t('profile.dangerZone')}
        </h3>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" /> {t('profile.logout')}
        </button>
      </div>
    </div>
  )
}
