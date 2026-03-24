// ============================================================
// Layout — Enveloppe toutes les pages protégées
// Contient : OceanBackground + Navbar + zone de contenu + Footer
// ============================================================
import Navbar from './Navbar'
import Footer from './Footer'
import OceanBackground from '../ui/OceanBackground'

export default function Layout({ children }) {
  return (
    <OceanBackground>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </OceanBackground>
  )
}
