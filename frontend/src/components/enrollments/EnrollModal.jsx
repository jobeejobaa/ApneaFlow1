// ============================================================
// EnrollModal — Modal de confirmation d'inscription
// ============================================================
import { useState } from 'react'
import { X, Package } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Location, CourseType, formatDateShort, firstSession } from '../../utils/labels'
import { enrollmentsAPI } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { useLang } from '../../hooks/useLang'

export default function EnrollModal({ course, onClose, onSuccess }) {
  const [withEquipment, setWithEquipment] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const { t } = useLang()

  if (!course) return null

  const loc = Location[course.location] ?? { label: course.location }
  const session0 = firstSession(course)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await enrollmentsAPI.enroll(course.id, withEquipment)
      addToast(t('modal.successMsg'))
      onSuccess?.()
      onClose()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Overlay semi-transparent */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenu — stopPropagation pour ne pas fermer en cliquant à l'intérieur */}
      <div
        className="glass-panel rounded-2xl p-6 w-full max-w-md animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold">{t('modal.title')}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Détails du cours */}
        <div className="p-4 rounded-xl bg-white/5 mb-4">
          <div className="flex justify-between items-start mb-2">
            <Badge level={course.title} />
            <span className="text-sm text-cyan-300">{session0.time}</span>
          </div>
          <div className="font-semibold mb-1">
            {(course.types ?? []).map(tp =>
              t(`courseTypes.${tp}`) !== `[courseTypes.${tp}]`
                ? t(`courseTypes.${tp}`)
                : (CourseType[tp] ?? tp)
            ).join(' · ')}
          </div>
          <div className="text-sm text-cyan-200 mb-2">
            {t(`locations.${course.location}`) !== `[locations.${course.location}]`
              ? t(`locations.${course.location}`)
              : loc.label
            }
          </div>
          {/* Liste de toutes les sessions */}
          <div className="space-y-0.5">
            {(course.sessions ?? []).map((s, i) => (
              <div key={i} className="text-xs text-cyan-300">
                Séance {i + 1} — {formatDateShort(s.date)} à {s.time}
              </div>
            ))}
          </div>
        </div>

        {/* Toggle équipement */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="font-medium text-sm">{t('modal.equipLabel')}</div>
              <div className="text-xs text-cyan-200">{t('modal.equipHint')}</div>
            </div>
          </div>
          <button
            className={`equip-toggle ${withEquipment ? 'active' : ''}`}
            onClick={() => setWithEquipment(v => !v)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {t('modal.cancel')}
          </Button>
          <Button variant="primary" className="flex-1" loading={loading} onClick={handleConfirm}>
            {t('modal.confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
