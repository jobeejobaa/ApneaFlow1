// ============================================================
// LandingPage — Page d'accueil publique (sans authentification)
//
// Structure :
//   1. Navbar publique (logo + LangToggle + bouton Se connecter)
//   2. Section intro "Une plateforme dédiée à l'apnée"
//   3. Hero carousel avec images de fond
//   4. Section "Découvrir l'apnée"
//   5. CTA final
//
// Images à placer dans : frontend/public/assets/
//   - blue-hole-from-above.jpg
//   - reef-at-the-blue-hole.jpg
//   - freediving-gear.jpg
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Waves, ChevronLeft, ChevronRight, Anchor, Wind, Users } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import Footer from '../components/layout/Footer'
import OceanBackground from '../components/ui/OceanBackground'
import { useMeta } from '../hooks/useMeta'

// ---- Toggle langue (dupliqué ici car la Navbar complète n'est pas chargée) ----
function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:bg-white/10 transition-all"
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className="text-base">{lang === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
      <span className="text-cyan-200 uppercase text-xs font-medium">{lang}</span>
    </button>
  )
}

// ---- Données du carousel ----
const SLIDES = [
  {
    id: 1,
    titleKey:    'landing.slide1Title',
    subtitleKey: 'landing.slide1Subtitle',
    imageUrl:    '/assets/blue-hole-from-above.jpg',
    // Couleur de fallback si l'image n'est pas encore uploadée
    fallback:    'from-blue-900 via-cyan-900 to-slate-900',
  },
  {
    id: 2,
    titleKey:    'landing.slide2Title',
    subtitleKey: 'landing.slide2Subtitle',
    imageUrl:    '/assets/reef-at-the-blue-hole.jpg',
    fallback:    'from-teal-900 via-blue-900 to-slate-900',
  },
  {
    id: 3,
    titleKey:    'landing.slide3Title',
    subtitleKey: 'landing.slide3Subtitle',
    imageUrl:    '/assets/freediving-gear.jpg',
    fallback:    'from-slate-800 via-blue-900 to-cyan-900',
  },
]

// ---- Icônes pour les 3 features cards ----
const FEATURES = [
  { icon: Anchor,      key: 'slide1' },
  { icon: Wind,        key: 'slide2' },
  { icon: Users,       key: 'slide3' },
]

export default function LandingPage() {
  useMeta('Accueil', "Apnea Flow — Trouvez un instructeur d'apnée certifié AIDA, inscrivez-vous à des cours et progressez en apnée libre.")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imgError, setImgError]         = useState({})
  const { t } = useLang()
  const timerRef = useRef(null)

  // Auto-avancement du carousel
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length)
    }, 6000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  // Changer de slide manuellement (reset le timer)
  const goTo = (index) => {
    clearInterval(timerRef.current)
    setCurrentSlide(index)
    startTimer()
  }

  const slide = SLIDES[currentSlide]
  const hasImage = !imgError[slide.id]

  return (
    <OceanBackground>
      <div className="min-h-screen flex flex-col">

        {/* ── Navbar publique ── */}
        <nav className="glass-panel sticky top-0 z-40 px-6 py-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-cyan-200">Apnea Flow</span>
            </Link>
            {/* Droite : langue + CTA */}
            <div className="flex items-center gap-3">
              <LangToggle />
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-white/20 text-cyan-200 text-sm font-semibold hover:bg-white/10 transition-all hidden sm:block"
              >
                {t('landing.signin')}
              </Link>
              <Link
                to="/login?mode=register"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                {t('landing.signup')}
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Contenu principal ── */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-10">

          {/* Section intro */}
          <section className="glass-card rounded-2xl p-8 text-center animate-fade-in">
            <h2 className="text-3xl font-serif font-bold text-white mb-5">{t('landing.introTitle')}</h2>
            <p className="text-cyan-200 mb-3 max-w-3xl mx-auto leading-relaxed">{t('landing.introPara1')}</p>
            <p className="text-cyan-200 max-w-3xl mx-auto leading-relaxed">{t('landing.introPara2')}</p>
          </section>

          {/* ── Hero carousel ── */}
          <section
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ minHeight: 380 }}
            aria-label="Mise en avant des cours d'apnée"
          >
            {/* Fond image (avec fallback gradient si pas d'image) */}
            {hasImage ? (
              <img
                key={slide.imageUrl}
                src={slide.imageUrl}
                alt=""
                onError={() => setImgError(prev => ({ ...prev, [slide.id]: true }))}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.fallback}`} />
            )}

            {/* Overlay gradient sombre pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-slate-900/10" />

            {/* Contenu slide */}
            <div
              className="relative z-10 flex flex-col justify-end p-8 md:p-12"
              style={{ minHeight: 380 }}
            >
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
                ApneaFlow Dahab
              </p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white drop-shadow-lg animate-fade-in">
                {t(slide.titleKey)}
              </h1>
              <p className="text-cyan-200 mb-7 max-w-lg leading-relaxed animate-fade-in">
                {t(slide.subtitleKey)}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg"
                >
                  {t('landing.ctaPrimary')}
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-full glass-card text-white font-semibold hover:bg-white/10 transition-all border border-white/20"
                >
                  {t('landing.ctaSecondary')}
                </Link>
              </div>
            </div>

            {/* Flèches navigation */}
            <button
              onClick={() => goTo((currentSlide - 1 + SLIDES.length) % SLIDES.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all z-10"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo((currentSlide + 1) % SLIDES.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all z-10"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Aller au visuel ${i + 1}`}
                  aria-pressed={i === currentSlide}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'bg-cyan-400 w-7'
                      : 'bg-white/40 w-2.5 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* 3 feature cards (résumé des slides) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, key }, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex flex-col gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-serif font-bold text-lg text-white">{t(`landing.${key}Title`)}</h3>
                <p className="text-cyan-200 text-sm leading-relaxed">{t(`landing.${key}Subtitle`)}</p>
              </div>
            ))}
          </div>

          {/* Section Découvrir l'apnée */}
          <section className="glass-card rounded-2xl p-8 text-center animate-fade-in">
            <h2 className="text-3xl font-serif font-bold text-white mb-6">{t('landing.discoverTitle')}</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-left">
              <p className="text-cyan-200 leading-relaxed">{t('landing.discoverPara1')}</p>
              <p className="text-cyan-200 leading-relaxed">{t('landing.discoverPara2')}</p>
              <p className="text-cyan-200 leading-relaxed">{t('landing.discoverPara3')}</p>
            </div>
          </section>

          {/* ── CTA final ── */}
          <section className="text-center pb-12">
            <Link
              to="/login"
              className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/20"
            >
              {t('landing.ctaPrimary')} 🌊
            </Link>
            <p className="text-cyan-200/60 text-sm mt-4">
              {t('landing.ctaSecondary')} →{' '}
              <Link to="/login" className="text-cyan-400 hover:text-white transition-colors underline">
                {t('landing.signin')}
              </Link>
            </p>
          </section>

        </main>
        <Footer />
      </div>
    </OceanBackground>
  )
}
