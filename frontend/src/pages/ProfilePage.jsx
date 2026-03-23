// ============================================================
// ProfilePage — Modification du profil utilisateur
// Pour les INSTRUCTEURS : affiche aussi les cours à venir
// et les élèves déjà rencontrés sur la plateforme.
// ============================================================
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, LogOut, Camera, X, Upload,
  BookOpen, Users, MapPin, Calendar, Clock, GraduationCap
} from 'lucide-react'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { usersAPI } from '../services/api'
import { useLang } from '../hooks/useLang'
import { CourseName, Location, formatDate } from '../utils/labels'

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const { addToast } = useToast()
  const { t } = useLang()
  const navigate = useNavigate()

  const isInstructor = user?.role === 'INSTRUCTEUR'

  // ---- États du formulaire ----
  const [loading, setLoading]           = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [name, setName]                 = useState(user?.name ?? '')
  const [bio, setBio]                   = useState(user?.bio ?? '')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [photoError, setPhotoError]     = useState(null)
  const fileInputRef                    = useRef(null)

  // ---- Stats instructeur ----
  const [stats, setStats]           = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    if (!isInstructor) return
    setStatsLoading(true)
    usersAPI.getInstructorStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [isInstructor])

  // ---- Gestion photo ----
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setPhotoError(null)
    if (!file) return
    if (file.type !== 'image/jpeg') {
      setPhotoError('Seuls les fichiers JPG/JPEG sont acceptés.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('La photo dépasse 5 Mo.')
      return
    }
    setSelectedFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleCancelPhoto = () => {
    setSelectedFile(null)
    setPhotoPreview(null)
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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

  const displayPhoto = photoPreview || user?.photoUrl

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">

      {/* ======================================================
          CARTE PROFIL + FORMULAIRE
      ====================================================== */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ---- Avatar + Upload ---- */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-4 border-white/20 overflow-hidden">
                {displayPhoto
                  ? <img src={displayPhoto} alt="Photo de profil" className="w-full h-full object-cover" />
                  : <span className="text-6xl">🤿</span>
                }
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Changer la photo"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,image/jpeg"
              className="hidden" onChange={handleFileChange} />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <p className="text-xs text-cyan-300 text-center max-w-[120px] truncate">{selectedFile.name}</p>
                <Button type="button" variant="primary" loading={photoLoading}
                  onClick={handleUploadPhoto} className="text-xs px-3 py-1.5 flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Envoyer
                </Button>
                <button type="button" onClick={handleCancelPhoto}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" /> Annuler
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="text-xs text-cyan-300 hover:text-cyan-100 transition-colors flex items-center gap-1">
                <Camera className="w-3 h-3" /> Changer la photo
              </button>
            )}

            {photoError && <p className="text-xs text-red-400 text-center max-w-[140px]">{photoError}</p>}
            <p className="text-xs text-white/40 text-center max-w-[130px]">JPG uniquement · 5 Mo max</p>
          </div>

          {/* ---- Infos + Formulaire ---- */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-1">{user?.name}</h2>
                <p className="text-cyan-200">{user?.email}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isInstructor
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
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="ocean-input w-full px-4 py-3 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-cyan-200 mb-2 text-sm">{t('profile.emailLabel')}</label>
                  <input type="email" value={user?.email} disabled
                    className="ocean-input w-full px-4 py-3 rounded-xl opacity-50 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-cyan-200 mb-2 text-sm">{t('profile.bioLabel')}</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="ocean-input w-full px-4 py-3 rounded-xl resize-none"
                  placeholder={t('profile.bioPlaceholder')} />
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

      {/* ======================================================
          SECTIONS INSTRUCTEUR UNIQUEMENT
      ====================================================== */}
      {isInstructor && (
        <>
          {statsLoading ? (
            <div className="flex justify-center py-8"><Spinner size={36} /></div>
          ) : stats ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ---- Cours à venir ---- */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Cours à venir
                  <span className="ml-auto text-sm font-normal text-cyan-300 bg-white/5 px-2.5 py-0.5 rounded-full">
                    {stats.upcomingCourses.length}
                  </span>
                </h3>

                {stats.upcomingCourses.length === 0 ? (
                  <div className="text-center py-6">
                    <BookOpen className="w-10 h-10 text-white/10 mx-auto mb-2" />
                    <p className="text-white/40 text-sm">Aucun cours à venir pour le moment.</p>
                    <button onClick={() => navigate('/create')}
                      className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      + Créer un cours
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {stats.upcomingCourses.map(course => (
                      <div key={course.id}
                        className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-cyan-400/20 transition-colors">
                        {/* Titre + badge inscrits/capacité */}
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm text-white">
                            {CourseName[course.title] ?? course.title}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            course._count.enrollments >= course.capacity
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {course._count.enrollments}/{course.capacity}
                          </span>
                        </div>
                        {/* Infos date / lieu */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-cyan-200">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{formatDate(course.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{course.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{Location[course.location]?.label ?? course.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ---- Mes élèves ---- */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  Mes élèves
                  <span className="ml-auto text-sm font-normal text-cyan-300 bg-white/5 px-2.5 py-0.5 rounded-full">
                    {stats.students.length}
                  </span>
                </h3>

                {stats.students.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="w-10 h-10 text-white/10 mx-auto mb-2" />
                    <p className="text-white/40 text-sm">Aucun élève pour le moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {stats.students.map(student => (
                      <div key={student.id}
                        className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2.5 border border-white/10">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border border-white/20 overflow-hidden flex-shrink-0">
                          {student.photoUrl
                            ? <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                            : <span className="text-base">🤿</span>
                          }
                        </div>
                        {/* Nom */}
                        <p className="text-sm text-white font-medium truncate leading-tight">
                          {student.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </>
      )}

      {/* ======================================================
          ZONE DE DANGER
      ====================================================== */}
      <div className="glass-card rounded-2xl p-6 border border-red-500/20">
        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {t('profile.dangerZone')}
        </h3>
        <button onClick={handleLogout}
          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 transition-colors">
          <LogOut className="w-4 h-4" /> {t('profile.logout')}
        </button>
      </div>
    </div>
  )
}
