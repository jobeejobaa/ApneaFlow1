// ============================================================
// InstructeursPage — Liste des instructeurs avec détail au clic
//
// Structure :
//   - Grille de cartes (photo + nom + nb de cours)
//   - Clic sur une carte → panneau latéral de détail
//     (bio, cours à venir, date d'inscription)
// ============================================================
import { useState, useEffect } from 'react'
import { Users, X, BookOpen, MapPin, Calendar, Clock } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import { usersAPI } from '../services/api'
import { useLang } from '../hooks/useLang'
import { CourseName, Location } from '../utils/labels'
import { formatDate } from '../utils/labels'

export default function InstructeursPage() {
  const { t } = useLang()

  // ---- État de la liste ----
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- État du panneau de détail ----
  const [selected, setSelected]       = useState(null)  // instructeur sélectionné (résumé)
  const [detail, setDetail]           = useState(null)  // détail complet (avec cours)
  const [detailLoading, setDetailLoading] = useState(false)

  // ---- Charger la liste au montage ----
  useEffect(() => {
    usersAPI.getInstructors()
      .then(setInstructors)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // ---- Ouvrir le panneau de détail ----
  const handleSelect = async (instructor) => {
    // Si on reclique sur le même → fermer
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
                  selected?.id === instructor.id
                    ? 'border-cyan-400/60 bg-white/10'
                    : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-2 border-white/20 overflow-hidden flex-shrink-0">
                    {instructor.photoUrl ? (
                      <img
                        src={instructor.photoUrl}
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🤿</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-lg leading-tight truncate">
                      {instructor.name}
                    </h3>
                    <span className="text-xs text-pink-300 font-medium">
                      INSTRUCTEUR
                    </span>
                  </div>
                </div>

                {/* Bio courte */}
                {instructor.bio && (
                  <p className="text-cyan-200 text-sm line-clamp-2 mb-3">
                    {instructor.bio}
                  </p>
                )}

                {/* Compteur cours */}
                <div className="flex items-center gap-1.5 text-xs text-cyan-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {instructor._count?.coursesCreated ?? 0} {t('instructors.courses')}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* ---- Panneau de détail ---- */}
        {selected && (
          <div className="w-full sm:w-80 lg:w-96 flex-shrink-0 glass-card rounded-2xl p-6 animate-fade-in">

            {/* Header du panneau */}
            <div className="flex justify-between items-start mb-5">
              <h2 className="font-serif font-bold text-xl text-white pr-2">
                {selected.name}
              </h2>
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
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🤿</span>
              )}
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size={32} />
              </div>
            ) : detail ? (
              <>
                {/* Bio */}
                {detail.bio ? (
                  <p className="text-cyan-200 text-sm leading-relaxed mb-5 text-center">
                    {detail.bio}
                  </p>
                ) : (
                  <p className="text-white/30 text-sm text-center italic mb-5">
                    {t('instructors.noBio')}
                  </p>
                )}

                {/* Divider */}
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
                      <div
                        key={course.id}
                        className="bg-white/5 rounded-xl p-3 border border-white/10"
                      >
                        <p className="font-semibold text-sm text-white mb-1">
                          {CourseName[course.title] ?? course.title}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-cyan-200">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(course.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {Location[course.location]?.label ?? course.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Date d'inscription */}
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
    </div>
  )
}
