// ============================================================
// useMeta — Met à jour le titre et la meta description par page
// Usage : useMeta('Titre de la page', 'Description courte...')
// ============================================================
import { useEffect } from 'react'

export function useMeta(title, description) {
  useEffect(() => {
    // Titre de l'onglet
    document.title = title ? `${title} · Apnea Flow` : 'Apnea Flow'

    // Meta description
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (tag) tag.setAttribute('content', description)
    }
  }, [title, description])
}
