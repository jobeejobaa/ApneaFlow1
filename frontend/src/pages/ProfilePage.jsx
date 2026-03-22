// ============================================================
// ProfilePage — Modification du profil utilisateur
// Inclut l'upload de photo de profil (JPG uniquement)
// ============================================================
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, LogOut, Camera, X, Upload } from 'lucide-react'
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
  const [photoLoading, setPhotoLoading] = useState(false)

  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')

  // État pour la prévisualisation de la nouvelle photo (avant upload)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [photoError, setPhotoError] = useState(null)

  // Référence vers l'input file (caché)
  const fileInputRef = useRef(null)

  // ---- Gestion de la sélection de fichier ----
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setPhotoError(null)

    if (!file) return

    // Vérifier le type (JPG uniquement)
    if (file.type !== 'image/jpeg') {
      setPhotoError('Seuls les fichiers JPG/JPEG sont acceptés.')
      return
    }

    // Vérifier la taille (5 Mo max)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('La photo dépasse 5 Mo. Choisissez une image plus légère.')
      return
    }

    setSelectedFile(file)

    // Créer une URL temporaire pour la prévisualisation
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)
  }

  // ---- Annuler la sélection ----
  const handleCancelPhoto = () => {
    setSelectedFile(null)
    setPhotoPreview(null)
    setPhotoError(null)
    // Réinitialiser l'input file
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ---- Uploader la photo ----
  const handleUploadPhoto = async () => {
    if (!selectedFile) return
    setPhotoLoading(true)
    try {
      const updated = await usersAPI.uploadPhoto(selectedFile)
      updateUser(updated)
      addToast('Photo de profil mise à jour !')
      setSelectedFile(null)
      setPhotoPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setPhotoLoading(false)
    }
  }

  // ---- Sauvegarder nom + bio ----
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await usersAPI.updateMe({ name, bio })
      updateUser(updated)
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

  // Photo à afficher : prévisualisation > photo actuelle > emoji
  const displayPhoto = photoPreview || user?.photoUrl

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Formulaire profil */}
      <div className="glass-card rounded-2xl p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ---- Zone Avatar + Upload ---- */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-4 border-white/20 overflow-hidden">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🤿</span>
                )}
              </div>

              {/* Bouton caméra au survol */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Changer la photo"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Si un fichier est sélectionné → boutons Confirmer / Annuler */}
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <p className="text-xs text-cyan-300 text-center max-w-[120px] truncate">
                  {selectedFile.name}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  loading={photoLoading}
                  onClick={handleUploadPhoto}
                  className="text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Envoyer
                </Button>
                <button
                  type="button"
                  onClick={handleCancelPhoto}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" /> Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-cyan-300 hover:text-cyan-100 transition-colors flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                Changer la photo
              </button>
            )}

            {/* Message d'erreur photo */}
            {photoError && (
              <p className="text-xs text-red-400 text-center max-w-[140px]">
                {photoError}
              </p>
            )}

            <p className="text-xs text-white/40 text-center max-w-[130px]">
              JPG uniquement · 5 Mo max
            </p>
          </div>

          {/* ---- Infos + Formulaire ---- */}
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
