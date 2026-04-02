// ============================================================
// CreateCoursePage — Formulaire de création d'un cours (instructeur)
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Check, X, Plus } from 'lucide-react'
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

// Liste des types de cours disponibles
const COURSE_TYPES = [
  { value: 'STATIQUE',                         label: 'Statique' },
  { value: 'DYNAMIQUE_PALMES_OU_SANS_PALMES',  label: 'Dynamique' },
  { value: 'PROFONDEUR_PALMES_OU_SANS_PALMES', label: 'Profondeur' },
  { value: 'IMMERSION_LIBRE',                  label: 'Immersion libre' },
  { value: 'POIDS_VARIABLE',                   label: 'Poids variable' },
  { value: 'NO_LIMITS',                        label: 'No Limits' },
]

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
    sessions: [{ date: today, time: '10:00' }],  // au moins 1 session
    location: 'PISCINE',
    types: ['STATIQUE'],   // tableau (multi-sélection)
    capacity: 4,
  })

  // Mise à jour générique d'un champ simple
  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  // Mettre à jour une session (date ou time) à l'index i
  const setSession = (index, field) => (e) => {
    setForm(prev => {
      const newSessions = [...prev.sessions]
      newSessions[index] = { ...newSessions[index], [field]: e.target.value }
      return { ...prev, sessions: newSessions }
    })
  }

  // Ajouter une session (reprend la date de la dernière par défaut)
  const addSession = () => {
    setForm(prev => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        { date: prev.sessions[prev.sessions.length - 1]?.date ?? today, time: '10:00' },
      ],
    }))
  }

  // Supprimer une session (minimum 1 obligatoire)
  const removeSession = (index) => {
    if (form.sessions.length <= 1) return
    setForm(prev => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }))
  }

  // Cocher / décocher un type de cours
  // Règle : au moins 1 type doit rester sélectionné
  const toggleType = (typeValue) => {
    setForm(prev => {
      const isSelected = prev.types.includes(typeValue)
      if (isSelected && prev.types.length === 1) return prev  // on garde au moins 1
      return {
        ...prev,
        types: isSelected
          ? prev.types.filter(t => t !== typeValue)
          : [...prev.types, typeValue],
      }
    })
  }

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

          {/* Niveau du cours */}
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

          {/* ---- SESSIONS — Dates et horaires (multi-dates) ---- */}
          <Field label="Dates et horaires" hint="Le cours peut se tenir sur plusieurs jours non consécutifs">
            <div className="space-y-2">
              {form.sessions.map((session, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* Numéro de séance */}
                  <span className="text-xs text-slate-500 w-5 text-right flex-shrink-0">{i + 1}.</span>
                  <input
                    type="date"
                    value={session.date}
                    onChange={setSession(i, 'date')}
                    className="ocean-input flex-1 px-4 py-3 rounded-xl"
                    required
                  />
                  <input
                    type="time"
                    value={session.time}
                    onChange={setSession(i, 'time')}
                    className="ocean-input px-4 py-3 rounded-xl w-28"
                    required
                  />
                  {/* Bouton supprimer — masqué si c'est la seule session */}
                  {form.sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSession(i)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                      title="Supprimer cette date"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {/* Bouton ajouter une date */}
              <button
                type="button"
                onClick={addSession}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mt-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter une date
              </button>
            </div>
          </Field>

          {/* Lieu */}
          <Field label={t('create.location')}>
            <select value={form.location} onChange={set('location')} className="ocean-input w-full px-4 py-3 rounded-xl" required>
              <option value="PISCINE">{t('locations.PISCINE')}</option>
              <option value="MER">{t('locations.MER')}</option>
              <option value="BLUE_HOLE">{t('locations.BLUE_HOLE')}</option>
            </select>
          </Field>

          {/* ---- TYPE DE COURS — Checkboxes multi-sélection ---- */}
          <Field label={t('create.type')} hint="Sélectionne un ou plusieurs types de pratique">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COURSE_TYPES.map(({ value, label }) => {
                const isChecked = form.types.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleType(value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isChecked
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-slate-300'
                    }`}
                  >
                    {/* Case à cocher personnalisée */}
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                      isChecked ? 'bg-cyan-400 border-cyan-400' : 'border-slate-500'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 text-slate-900" />}
                    </div>
                    {label}
                  </button>
                )
              })}
            </div>
          </Field>

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

          {/* ---- NOMBRE D'ÉLÈVES — Sélecteur 1 à 4 ---- */}
          <Field label={t('create.capacity')} hint={t('create.capacityHint')}>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, capacity: n }))}
                  className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                    form.capacity === n
                      ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-400/50 hover:text-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>

          <Button type="submit" variant="gradient" loading={loading} className="w-full py-4">
            <Check className="w-5 h-5" /> {t('create.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}
