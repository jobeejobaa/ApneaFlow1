// ============================================================
// CreateCoursePage — Formulaire de création d'un cours (instructeur)
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import { coursesAPI } from '../services/api'
import { useToast } from '../hooks/useToast'
import { useLang } from '../hooks/useLang'
import { useMeta } from '../hooks/useMeta'

// Champ de formulaire réutilisable
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-cyan-200 mb-2 text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

export default function CreateCoursePage() {
  useMeta('Créer un cours', 'Créez et publiez un nouveau cours d\'apnée pour vos élèves sur Apnea Flow.')
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { t } = useLang()
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    title: 'INITIATION',
    descriptionFr: '',
    descriptionEn: '',
    date: today,
    time: '10:00',
    location: 'PISCINE',
    type: 'STATIQUE',
    capacity: 4,
  })

  // Mise à jour générique d'un champ
  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await coursesAPI.create({ ...form, capacity: Number(form.capacity) })
      addToast(t('create.successMsg'))
      navigate('/courses')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-serif font-bold">{t('create.title')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label={t('create.level')}>
            <select value={form.title} onChange={set('title')} className="ocean-input w-full px-4 py-3 rounded-xl" required>
              <option value="INITIATION">{t('courseNames.INITIATION')}</option>
              <option value="AIDA1">{t('courseNames.AIDA1')}</option>
              <option value="AIDA2">{t('courseNames.AIDA2')}</option>
              <option value="AIDA3">{t('courseNames.AIDA3')}</option>
              <option value="AIDA4">{t('courseNames.AIDA4')}</option>
              <option value="AIDA_INSTRUCTEUR">{t('courseNames.AIDA_INSTRUCTEUR')}</option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t('create.date')}>
              <input type="date" value={form.date} onChange={set('date')} className="ocean-input w-full px-4 py-3 rounded-xl" required />
            </Field>
            <Field label={t('create.time')}>
              <input type="time" value={form.time} onChange={set('time')} className="ocean-input w-full px-4 py-3 rounded-xl" required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t('create.location')}>
              <select value={form.location} onChange={set('location')} className="ocean-input w-full px-4 py-3 rounded-xl" required>
                <option value="PISCINE">{t('locations.PISCINE')}</option>
                <option value="MER">{t('locations.MER')}</option>
                <option value="BLUE_HOLE">{t('locations.BLUE_HOLE')}</option>
              </select>
            </Field>
            <Field label={t('create.type')}>
              <select value={form.type} onChange={set('type')} className="ocean-input w-full px-4 py-3 rounded-xl" required>
                <option value="STATIQUE">{t('courseTypes.STATIQUE')}</option>
                <option value="DYNAMIQUE_PALMES_OU_SANS_PALMES">{t('courseTypes.DYNAMIQUE_PALMES_OU_SANS_PALMES')}</option>
                <option value="PROFONDEUR_PALMES_OU_SANS_PALMES">{t('courseTypes.PROFONDEUR_PALMES_OU_SANS_PALMES')}</option>
                <option value="IMMERSION_LIBRE">{t('courseTypes.IMMERSION_LIBRE')}</option>
                <option value="POIDS_VARIABLE">{t('courseTypes.POIDS_VARIABLE')}</option>
                <option value="NO_LIMITS">{t('courseTypes.NO_LIMITS')}</option>
              </select>
            </Field>
          </div>

          {/* Descriptions bilingues côte à côte */}
          <div>
            <p className="text-cyan-200 mb-3 text-sm font-medium">
              {t('create.descSection')}
              <span className="ml-2 text-xs text-slate-400">{t('create.descHint')}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2">{t('create.descFrLabel')}</label>
                <textarea
                  value={form.descriptionFr}
                  onChange={set('descriptionFr')}
                  rows={4}
                  className="ocean-input w-full px-4 py-3 rounded-xl resize-none text-sm"
                  placeholder={t('create.descFrPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">{t('create.descEnLabel')}</label>
                <textarea
                  value={form.descriptionEn}
                  onChange={set('descriptionEn')}
                  rows={4}
                  className="ocean-input w-full px-4 py-3 rounded-xl resize-none text-sm"
                  placeholder={t('create.descEnPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Info places — fixé à 4 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <div className="font-medium">{t('create.capacity')}</div>
              <div className="text-sm text-cyan-200">{t('create.capacityHint')}</div>
            </div>
            <div className="text-2xl font-bold text-cyan-400">4</div>
          </div>

          <Button type="submit" variant="gradient" loading={loading} className="w-full py-4">
            <Check className="w-5 h-5" /> {t('create.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}
