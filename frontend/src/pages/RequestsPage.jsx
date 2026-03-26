// ============================================================
// RequestsPage — Demandes de cours privées
//
// Vue ÉLÈVE      : liste de ses demandes envoyées + statuts
// Vue INSTRUCTEUR: demandes reçues + boutons Accepter / Refuser
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, Check, X, MapPin, Calendar, Clock3, BookOpen } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import { requestsAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { CourseName, Location, formatDate } from '../utils/labels'
import { useMeta } from '../hooks/useMeta'

// ---- Badge de statut ----
function StatusBadge({ status }) {
  const config = {
    PENDING:  { label: 'En attente', classes: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    ACCEPTED: { label: 'Acceptée',   classes: 'bg-green-500/20  text-green-300  border-green-500/30'  },
    REFUSED:  { label: 'Refusée',    classes: 'bg-red-500/20    text-red-300    border-red-500/30'    },
  }
  const { label, classes } = config[status] ?? config.PENDING
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {label}
    </span>
  )
}

// ---- Carte d'une demande (partagée entre les deux vues) ----
function RequestCard({ request, isInstructor, onRespond }) {
  const [responding, setResponding] = useState(false)

  const handle = async (status) => {
    setResponding(true)
    await onRespond(request.id, status)
    setResponding(false)
  }

  const person = isInstructor ? request.student : request.instructor

  return (
    <div className={`glass-card rounded-2xl p-5 border transition-all ${
      request.status === 'PENDING' && isInstructor
        ? 'border-cyan-400/30'
        : 'border-transparent'
    }`}>
      {/* Header : avatar + nom + statut */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border border-white/20 overflow-hidden flex-shrink-0">
            {person?.photoUrl ? (
              <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">🤿</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{person?.name}</p>
            <p className="text-xs text-cyan-300">
              {isInstructor ? 'Élève' : 'Instructeur'}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Détails du cours souhaité */}
      <div className="bg-white/5 rounded-xl p-3 space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-sm text-white">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="font-medium">{CourseName[request.title] ?? request.title}</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 text-xs text-cyan-200">
            <Calendar className="w-3 h-3" /> {formatDate(request.date)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-cyan-200">
            <Clock3 className="w-3 h-3" /> {request.time}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-cyan-200">
            <MapPin className="w-3 h-3" /> {Location[request.location]?.label ?? request.location}
          </span>
        </div>
      </div>

      {/* Message libre */}
      {request.message && (
        <p className="text-sm text-cyan-100 italic border-l-2 border-cyan-500/40 pl-3 mb-3">
          « {request.message} »
        </p>
      )}

      {/* Date d'envoi */}
      <p className="text-xs text-white/30 mb-3">
        Envoyée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
      </p>

      {/* Boutons réponse (instructeur + demande en attente uniquement) */}
      {isInstructor && request.status === 'PENDING' && (
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => handle('ACCEPTED')}
            disabled={responding}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-all text-sm font-medium disabled:opacity-50"
          >
            {responding ? <Spinner size={14} /> : <Check className="w-4 h-4" />}
            Accepter
          </button>
          <button
            onClick={() => handle('REFUSED')}
            disabled={responding}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all text-sm font-medium disabled:opacity-50"
          >
            {responding ? <Spinner size={14} /> : <X className="w-4 h-4" />}
            Refuser
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Composant principal
// ============================================================
export default function RequestsPage() {
  useMeta('Demandes de cours', 'Envoyez ou gérez vos demandes de cours privés entre élèves et instructeurs d\'apnée.')
  const { user } = useAuth()
  const { addToast } = useToast()
  const isInstructor = user?.role === 'INSTRUCTEUR'

  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL') // ALL | PENDING | ACCEPTED | REFUSED

  const fetchRequests = useCallback(async () => {
    try {
      const data = isInstructor
        ? await requestsAPI.getReceived()
        : await requestsAPI.getSent()
      setRequests(data)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [isInstructor])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // ---- Répondre à une demande (instructeur) ----
  const handleRespond = async (id, status) => {
    try {
      const updated = await requestsAPI.respond(id, status)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: updated.status } : r))
      addToast(status === 'ACCEPTED' ? 'Demande acceptée ✓' : 'Demande refusée')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  // ---- Filtrage ----
  const filtered = filter === 'ALL'
    ? requests
    : requests.filter(r => r.status === filter)

  const counts = {
    ALL:      requests.length,
    PENDING:  requests.filter(r => r.status === 'PENDING').length,
    ACCEPTED: requests.filter(r => r.status === 'ACCEPTED').length,
    REFUSED:  requests.filter(r => r.status === 'REFUSED').length,
  }

  // ---- Rendu ----
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyan-400" />
          {isInstructor ? 'Demandes reçues' : 'Mes demandes'}
        </h1>
        <p className="text-cyan-200 mt-1 text-sm">
          {isInstructor
            ? 'Acceptez ou refusez les demandes de cours privés'
            : 'Suivez l\'état de vos demandes envoyées aux instructeurs'}
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { key: 'ALL',      label: 'Toutes' },
          { key: 'PENDING',  label: 'En attente' },
          { key: 'ACCEPTED', label: 'Acceptées' },
          { key: 'REFUSED',  label: 'Refusées' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === key
                ? 'bg-cyan-500/30 text-white border-cyan-400/50'
                : 'glass-card text-cyan-200 border-transparent hover:border-white/20'
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({counts[key]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-cyan-200">
            {filter === 'ALL'
              ? isInstructor
                ? 'Aucune demande reçue pour le moment.'
                : 'Tu n\'as encore envoyé aucune demande. Visite la page des instructeurs !'
              : 'Aucune demande dans cette catégorie.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              isInstructor={isInstructor}
              onRespond={handleRespond}
            />
          ))}
        </div>
      )}
    </div>
  )
}
