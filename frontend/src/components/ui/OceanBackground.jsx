// ============================================================
// OceanBackground — Fond animé réutilisable
// Contient : vagues + bulles flottantes
// Usage : envelopper n'importe quelle page avec ce composant
// ============================================================
import { useEffect, useRef } from 'react'

export default function OceanBackground({ children, className = '' }) {
  const bubblesRef = useRef(null)

  // Créer les bulles animées une seule fois au montage
  useEffect(() => {
    const container = bubblesRef.current
    if (!container || container.children.length > 0) return

    for (let i = 0; i < 80; i++) {
      const bubble = document.createElement('div')
      bubble.className = 'bubble'
      const size = Math.random() * 12 + 4
      // bottom aléatoire entre 0% et 100vh pour répartir les bulles sur tout l'écran
      const startBottom = Math.random() * 100
      bubble.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:${startBottom}vh;
        animation-delay:${Math.random() * 15}s;
        animation-duration:${Math.random() * 10 + 10}s;
      `
      container.appendChild(bubble)
    }
  }, [])

  return (
    <div className={`ocean-bg text-slate-100 overflow-x-hidden min-h-screen ${className}`}>
      {/* Vagues de fond */}
      <div className="waves">
        <div className="wave" />
        <div className="wave" />
        <div className="wave" />
      </div>

      {/* Bulles flottantes */}
      <div ref={bubblesRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Contenu par-dessus */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
