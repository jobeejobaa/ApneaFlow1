// ============================================================
// InstructeursPage — Liste des instructeurs avec détail au clic
//
// Structure :
//   - Grille de cartes (photo + nom + nb de cours)
//   - Clic sur une carte → panneau latéral de détail
//     (bio, cours à venir, date d'inscription)
//   - Bouton "Demander un cours" (élèves uniquement) → modal formulaire
// ============================================================
import { useState, useEffect } from 'react'
import { Users, X, BookOpen, MapPin, Calendar, Clock, MessageSquare, Send } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { usersAPI, requestsAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useLang } from '../hooks/useLang'
import { CourseName, Location } from '../utils/labels'
import { formatDate } from '../utils/labels'
import { useMeta } from '../hooks/useMeta'

// Options pour le formulaire de demande
const LEVELS = ['INITIATION', 'AIDA1', 'AIDA2', 'AIDA3', 'AIDA4', 'AIDA_INSTRUCTEUR']
const LOCATIONS = ['PISCINE', 'MER', 'BLUE_HOLE']

// ---- Modal de demande de cours ----
function RequestModal({ instructor, onClose, onSuccess }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title:    'AIDA2',
    location: 'PISCINE',
    date:     '',
    time:     '10:00',
    message:  '',
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date) return addToast('Merci de choisir une date.', 'error')

    setLoading(true)
    try {
      await requestsAPI.create({ instructorId: instructor.id, ...form })
      addToast('Demande envoyée à ' + instructor.name + ' !')
      onSuccess()
      onClose()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Date minimale = demain
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Demander un cours
            </h2>
            <p className="text-cyan-200 text-sm mt-0.5">à {instructor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-cyan-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Niveau */}
          <div>
            <label className="block text-cyan-200 text-sm mb-1.5">Niveau souhaité</label>
            <select
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="ocean-input w-full px-4 py-2.5 rounded-xl"
            >
              {LEVELS.map(l => (
                <option key={l} value={l}>{CourseName[l]}</option>
              ))}
            </select>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-cyan-200 text-sm mb-1.5">Lieu souhaité</label>
            <select
              value={form.location}
              onChange={e => set('location', e.target.value)}
              className="ocean-input w-full px-4 py-2.5 rounded-xl"
            >
              {LOCATIONS.map(l => (
                <option key={l} value={l}>{Location[l]?.label}</option>
              ))}
            </select>
          </div>

          {/* Date + Heure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-cyan-200 text-sm mb-1.5">Date</label>
              <input
                type="date"
                min={minDate}
                value={form.date}
                onChange={e => set('date', e.target.value)}
                required
                className="ocean-input w-full px-4 py-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-cyan-200 text-sm mb-1.5">Heure</label>
              <input
                type="time"
                value={form.time}
                onChange={e => set('time', e.target.value)}
                required
                className="ocean-input w-full px-4 py-2.5 rounded-xl"
              />
            </div>
          </div>

          {/* Message optionnel */}
          <div>
            <label className="block text-cyan-200 text-sm mb-1.5">
              Message <span className="text-white/30">(optionnel)</span>
            </label>
            <textarea
              value={form.message}
              onChange={e => set('message', e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Ex : débutant complet, disponible le matin..."
              className="ocean-input w-full px-4 py-2.5 rounded-xl resize-none text-sm"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="primary" loading={loading} className="flex-1 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Envoyer la demande
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Composant principal
// ============================================================
export default function InstructeursPage() {
  useMeta('Instructeurs', 'Découvrez tous les instructeurs d\'apnée certifiés AIDA disponibles sur Apnea Flow.')
  const { t } = useLang()
  const { user } = useAuth()
  const isEleve = user?.role === 'ELEVE'

  // ---- État de la liste ----
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- État du panneau de détail ----
  const [selected, setSelected]           = useState(null)
  const [detail, setDetail]               = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // ---- État du modal de demande ----
  const [requestTarget, setRequestTarget] = useState(null) // instructeur visé

  // ---- Charger la liste au montage ----
  useEffect(() => {
    usersAPI.getInstructors()
      .then(setInstructors)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // ---- Ouvrir le panneau de détail ----
  const handleSelect = async (instructor) => {
    if (selected?.id === instructor.id) {
      setSelected(null)
      setDetail(null)
      return
    }

    setSelected(instructor)
    setDetail(null)
    setDetailLoading(true)

    try {
      const full = await usersAPI.getInstructor(instructor.id)
      setDetail(full)
    } catch (err) {
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleClose = () => {
    setSelected(null)
    setDetail(null)
  }

  // ---- Rendu ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={40} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-400" />
          {t('instructors.title')}
        </h1>
        <p className="text-cyan-200 mt-1 text-sm">{t('instructors.subtitle')}</p>
      </div>

      {/* Layout : grille + panneau */}
      <div className="flex gap-6 items-start">

        {/* ---- Grille de cartes ---- */}
        <div className={`grid gap-4 transition-all duration-300 ${
          selected
            ? 'grid-cols-1 sm:grid-cols-2 flex-1'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full'
        }`}>
          {instructors.length === 0 ? (
            <div className="col-span-full glass-card rounded-2xl p-12 text-center text-cyan-200">
              {t('instructors.empty')}
            </div>
          ) : (
            instructors.map(instructor => (
              <button
                key={instructor.id}
                onClick={() => handleSelect(instructor)}
                className={`glass-card rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:border-cyan-400/40 border border-transparent w-full ${
                  selected?.id === instructor.id ? 'border-cyan-400/60 bg-white/10' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-2 border-white/20 overflow-hidden flex-shrink-0">
                    {instructor.photoUrl ? (
                      <img src={instructor.photoUrl} alt={instructor.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🤿</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-lg leading-tight truncate">
                      {instructor.name}
                    </h3>
                    <span className="text-xs text-pink-300 font-medium">INSTRUCTEUR</span>
                  </div>
                </div>

                {/* Bio courte */}
                {instructor.bio && (
                  <p className="text-cyan-200 text-sm line-clamp-2 mb-3">{instructor.bio}</p>
                )}

                {/* Compteur cours */}
                <div className="flex items-center gap-1.5 text-xs text-cyan-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{instructor._count?.coursesCreated ?? 0} {t('instructors.courses')}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* ---- Panneau de détail ---- */}
        {selected && (
          <div className="w-full sm:w-80 lg:w-96 flex-shrink-0 glass-card rounded-2xl p-6 animate-fade-in">

            {/* Header du panneau */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-serif font-bold text-xl text-white pr-2">{selected.name}</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-cyan-300" />
              </button>
            </div>

            {/* Photo grande */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-2 border-white/20 overflow-hidden mx-auto mb-4">
              {selected.photoUrl ? (
                <img src={selected.photoUrl} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🤿</span>
              )}
            </div>

            {/* Bouton "Demander un cours" — élèves uniquement */}
            {isEleve && (
              <button
                onClick={() => setRequestTarget(selected)}
                className="w-full mb-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Demander un cours
              </button>
            )}

            {detailLoading ? (
              <div className="flex justify-center py-8"><Spinner size={32} /></div>
            ) : detail ? (
              <>
                {/* Bio */}
                {detail.bio ? (
                  <p className="text-cyan-200 text-sm leading-relaxed mb-4 text-center">{detail.bio}</p>
                ) : (
                  <p className="text-white/30 text-sm text-center italic mb-4">{t('instructors.noBio')}</p>
                )}

                <div className="border-t border-white/10 mb-4" />

                {/* Cours créés */}
                <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {t('instructors.coursesList')} ({detail._count?.coursesCreated ?? 0})
                </h3>

                {detail.coursesCreated?.length === 0 ? (
                  <p className="text-white/40 text-sm italic">{t('instructors.noCourses')}</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {detail.coursesCreated.map(course => (
                      <div key={course.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="font-semibold text-sm text-white mb-1">
                          {CourseName[course.title] ?? course.title}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-cyan-200">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(course.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{Location[course.location]?.label ?? course.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/10 mt-4 pt-3">
                  <p className="text-xs text-white/30 text-center">
                    {t('instructors.memberSince')} {new Date(detail.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* ---- Modal de demande de cours ---- */}
      {requestTarget && (
        <RequestModal
          instructor={requestTarget}
          onClose={() => setRequestTarget(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}
