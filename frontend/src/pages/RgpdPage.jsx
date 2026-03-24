// ============================================================
// RgpdPage — Politique de confidentialité (RGPD)
// ============================================================
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import OceanBackground from '../components/ui/OceanBackground'
import { useMeta } from '../hooks/useMeta'

export default function RgpdPage() {
  useMeta('Politique de confidentialité', 'Politique de confidentialité RGPD d\'Apnea Flow — données collectées, droits et cookies.')
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

        <h1 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h1>
        <p className="text-slate-400 text-sm mb-2">Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679)</p>
        <p className="text-slate-400 text-sm mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

        <div className="space-y-10">

          {/* Responsable du traitement */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">1. Responsable du traitement</h2>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><span className="text-slate-400">Nom :</span> Johanna Delfieux Watts</li>
              <li><span className="text-slate-400">Email :</span>{' '}
                <a href="mailto:johannadelfieux@gmail.com" className="text-cyan-400 hover:underline">
                  johannadelfieux@gmail.com
                </a>
              </li>
            </ul>
          </section>

          {/* Données collectées */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">2. Données personnelles collectées</h2>
            <p className="text-slate-300 text-sm mb-3">
              Lors de votre inscription et utilisation de la plateforme, nous collectons les données suivantes :
            </p>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              <li>Nom complet</li>
              <li>Adresse e-mail</li>
              <li>Mot de passe (haché avec bcrypt — jamais stocké en clair)</li>
              <li>Photo de profil (optionnelle, format JPG)</li>
              <li>Biographie (optionnelle)</li>
              <li>Données liées aux cours (inscriptions, demandes, niveaux)</li>
            </ul>
          </section>

          {/* Finalité */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">3. Finalité du traitement</h2>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              <li>Création et gestion de votre compte utilisateur</li>
              <li>Mise en relation entre élèves et instructeurs d'apnée</li>
              <li>Gestion des inscriptions aux cours</li>
              <li>Traitement des demandes de cours privés</li>
            </ul>
          </section>

          {/* Durée de conservation */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">4. Durée de conservation</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Vos données sont conservées tant que votre compte est actif. Elles sont supprimées
              automatiquement en cas de suppression de votre compte, par effet de cascade dans la base
              de données (<code className="text-cyan-300 bg-white/10 px-1 rounded">onDelete: Cascade</code>).
            </p>
          </section>

          {/* Sécurité */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">5. Sécurité des données</h2>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              <li>Les mots de passe sont hachés avec <strong>bcryptjs</strong> (salt aléatoire)</li>
              <li>L'authentification est sécurisée par <strong>JSON Web Token (JWT)</strong></li>
              <li>Les échanges sont chiffrés via <strong>HTTPS</strong></li>
              <li>Aucun mot de passe n'est jamais renvoyé par l'API</li>
            </ul>
          </section>

          {/* Droits */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">6. Vos droits (RGPD)</h2>
            <p className="text-slate-300 text-sm mb-3">
              Conformément au RGPD, vous disposez des droits suivants concernant vos données :
            </p>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              <li><strong>Droit d'accès</strong> — consulter les données vous concernant</li>
              <li><strong>Droit de rectification</strong> — corriger vos informations depuis votre profil</li>
              <li><strong>Droit à l'effacement</strong> — supprimer votre compte et toutes vos données</li>
              <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> — vous opposer à un traitement</li>
            </ul>
            <p className="text-slate-300 text-sm mt-4">
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:johannadelfieux@gmail.com" className="text-cyan-400 hover:underline">
                johannadelfieux@gmail.com
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">7. Cookies</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ce site n'utilise pas de cookies de tracking. Seul un <strong>token JWT</strong> est
              stocké dans le <code className="text-cyan-300 bg-white/10 px-1 rounded">localStorage</code> de
              votre navigateur afin de maintenir votre session. Ce token est supprimé lors de la déconnexion.
            </p>
          </section>

          {/* Réclamation */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">8. Droit de réclamation</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
              auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :
              {' '}<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                www.cnil.fr
              </a>
            </p>
          </section>

        </div>

        {/* Lien Mentions légales */}
        <p className="mt-10 text-center text-slate-400 text-sm">
          Consultez également nos{' '}
          <Link to="/mentions-legales" className="text-cyan-400 hover:underline">
            Mentions légales
          </Link>
        </p>

      </div>
    </OceanBackground>
  )
}
