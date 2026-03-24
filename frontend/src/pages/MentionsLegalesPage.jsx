// ============================================================
// MentionsLegalesPage — Informations légales obligatoires
// ============================================================
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import OceanBackground from '../components/ui/OceanBackground'

export default function MentionsLegalesPage() {
  return (
    <OceanBackground>
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Retour */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Mentions légales</h1>
        <p className="text-slate-400 text-sm mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

        <div className="space-y-10">

          {/* Éditeur */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">1. Éditeur du site</h2>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><span className="text-slate-400">Nom :</span> Johanna Delfieux Watts</li>
              <li><span className="text-slate-400">Projet :</span> Apnea Flow — Plateforme de gestion de cours d'apnée</li>
              <li><span className="text-slate-400">Statut :</span> Projet pédagogique — Titre Professionnel Développeur Web et Web Mobile</li>
            </ul>
          </section>

          {/* Hébergement */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">2. Hébergement</h2>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><span className="text-slate-400">Hébergeur :</span> Railway (backend) / Vercel (frontend)</li>
              <li><span className="text-slate-400">Adresse :</span> San Francisco, CA, États-Unis</li>
            </ul>
          </section>

          {/* Propriété intellectuelle */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">3. Propriété intellectuelle</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              L'ensemble du contenu présent sur ce site (code source, design, textes, logos) est la propriété
              exclusive de Johanna Delfieux Watts. Toute reproduction, distribution ou utilisation sans
              autorisation préalable est strictement interdite.
            </p>
          </section>

          {/* Responsabilité */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">4. Limitation de responsabilité</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ce site est un projet de formation. L'éditeur s'efforce de maintenir les informations
              à jour mais ne saurait être tenu responsable des erreurs, omissions ou indisponibilités.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">5. Contact</h2>
            <p className="text-slate-300 text-sm">
              Pour toute question relative à ce site, vous pouvez contacter l'éditrice via{' '}
              <a
                href="mailto:johannadelfieux@gmail.com"
                className="text-cyan-400 hover:underline"
              >
                johannadelfieux@gmail.com
              </a>
            </p>
          </section>

        </div>

        {/* Lien RGPD */}
        <p className="mt-10 text-center text-slate-400 text-sm">
          Consultez également notre{' '}
          <Link to="/rgpd" className="text-cyan-400 hover:underline">
            Politique de confidentialité (RGPD)
          </Link>
        </p>

      </div>
    </OceanBackground>
  )
}
