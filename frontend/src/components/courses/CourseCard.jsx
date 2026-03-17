// ============================================================
// CourseCard — Carte d'un cours (vue grille)
// ============================================================
import { Clock, Calendar, User, Check } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Location, CourseType, formatDateShort } from '../../utils/labels'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../hooks/useLang'

// Sous-composant : avatars des places (pleines ou vides)
function PlacesRow({ enrolled, capacity }) {
  const { t } = useLang()
  return (
    <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-4">
      <div className="flex -space-x-2">
        {Array.from({ length: capacity }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center
              ${i < enrolled
                ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
                : 'bg-white/5 border-dashed border-white/20'
              }`}
          >
            {i < enrolled && <User className="w-3 h-3 text-white" />}
          </div>
        ))}
      </div>
      <span className={`text-sm font-medium ${enrolled >= capacity ? 'text-red-400' : 'text-cyan-300'}`}>
        {enrolled >= capacity
          ? t('courseCard.full')
          : `${enrolled}/${capacity} ${t('courseCard.places')}`
        }
      </span>
    </div>
  )
}

export default function CourseCard({ course, isEnrolled, onEnroll, onDelete }) {
  const { user } = useAuth()
  const { t, lang } = useLang()
  const isInstructor = user?.role === 'INSTRUCTEUR'
  const loc = Location[course.location] ?? { label: course.location, colorClass: '' }
  const enrolled = course._count?.enrollments ?? course.enrollments?.length ?? 0
  const isFull = enrolled >= course.capacity
  const isOwner = course.createdById === user?.id

  // Icône de lieu (dynamique selon la valeur)
  const LocationIcon = () => {
    const icons = { PISCINE: '🏊', MER: '⚓', BLUE_HOLE: '🔵' }
    return <span className="text-sm">{icons[course.location] ?? '📍'}</span>
  }

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col animate-fade-in">
      {/* En-tête : badge niveau + heure */}
      <div className="flex justify-between items-start mb-4">
        <Badge level={course.title} />
        <div className="flex items-center gap-2 text-cyan-300 text-sm">
          <Clock className="w-4 h-4" />
          {course.time}
        </div>
      </div>

      {/* Titre + description */}
      <h3 className="text-xl font-serif font-bold mb-2">
        {t(`courseTypes.${course.type}`) !== `[courseTypes.${course.type}]`
          ? t(`courseTypes.${course.type}`)
          : (CourseType[course.type] ?? course.type)
        }
      </h3>
      <p className="text-cyan-200 text-sm mb-4 flex-grow line-clamp-2">
        {(lang === 'fr' ? course.descriptionFr : course.descriptionEn) || t('courseCard.noDesc')}
      </p>

      {/* Infos */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-cyan-400" />
          {formatDateShort(course.date)}
        </div>
        <div className={`flex items-center gap-2 text-sm ${loc.colorClass}`}>
          <LocationIcon />
          {t(`locations.${course.location}`) !== `[locations.${course.location}]`
            ? t(`locations.${course.location}`)
            : loc.label
          }
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-cyan-400" />
          {course.createdBy?.name ?? t('courseCard.instructor')}
        </div>
      </div>

      {/* Places */}
      <PlacesRow enrolled={enrolled} capacity={course.capacity} />

      {/* Bouton d'action selon contexte */}
      {isEnrolled ? (
        <Button variant="ghost" disabled className="w-full border border-green-500/30 text-green-300 bg-green-500/10">
          <Check className="w-5 h-5" /> {t('courses.enrolled')}
        </Button>
      ) : isFull ? (
        <Button variant="danger" disabled className="w-full cursor-not-allowed">
          {t('courses.full')}
        </Button>
      ) : !isInstructor ? (
        <Button variant="primary" className="w-full" onClick={() => onEnroll?.(course)}>
          {t('courses.enroll')}
        </Button>
      ) : isOwner ? (
        <Button variant="danger" className="w-full" onClick={() => onDelete?.(course.id)}>
          {t('courses.delete')}
        </Button>
      ) : null}
    </div>
  )
}
