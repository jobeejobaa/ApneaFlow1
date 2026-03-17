// ============================================================
// Layout — Enveloppe toutes les pages protégées
// Contient : fond animé + Navbar + zone de contenu
// ============================================================
import { useEffect, useRef } from 'react'
import Navbar from './Navbar'

export default function Layout({ children }) {
  const bubblesRef = useRef(null)

  // Créer les bulles animées une seule fois
  useEffect(() => {
    const container = bubblesRef.current
    if (!container || container.children.length > 0) return

    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('div')
      bubble.className = 'bubble'
      const size = Math.random() * 40 + 10
      bubble.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        animation-delay:${Math.random() * 15}s;
        animation-duration:${Math.random() * 10 + 10}s;
      `
      container.appendChild(bubble)
    }
  }, [])

  return (
    <div className="ocean-bg text-slate-100 overflow-x-hidden min-h-screen">
      {/* Vagues de fond */}
      <div className="waves">
        <div className="wave" />
        <div className="wave" />
        <div className="wave" />
      </div>

      {/* Bulles flottantes */}
      <div ref={bubblesRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Contenu par-dessus les effets (z-index > 0) */}
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
