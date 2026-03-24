// ============================================================
// Footer — Bas de page présent sur toutes les pages
// Contient : copyright, liens Mentions légales & RGPD
// Auteur : Johanna Delfieux Watts
// ============================================================
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Copyright */}
        <p className="text-slate-400 text-sm text-center sm:text-left">
          © {year} <span className="text-cyan-400 font-medium">Apnea Flow</span>
          {' '}— Johanna Delfieux Watts. Tous droits réservés.
        </p>

        {/* Liens légaux */}
        <nav aria-label="Liens légaux" className="flex items-center gap-6">
          <Link
            to="/mentions-legales"
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Mentions légales
          </Link>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <Link
            to="/rgpd"
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Politique de confidentialité (RGPD)
          </Link>
        </nav>

      </div>
    </footer>
  )
}
