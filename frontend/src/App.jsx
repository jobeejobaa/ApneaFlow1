// ============================================================
// App.jsx — Routeur principal de l'application
//
// React Router v6 gère la navigation côté client (SPA).
// On définit ici :
//   - Les routes publiques (accès sans être connecté)
//   - Les routes protégées (redirige vers /login si pas connecté)
//   - Les routes réservées aux instructeurs
//
// ARCHITECTURE DES ROUTES :
//   /          → LandingPage (public) — redirige vers /dashboard si déjà connecté
//   /login     → AuthPage (public)
//   /dashboard → DashboardPage (protégé)
//   /courses   → CoursesPage (protégé)
//   /calendar  → CalendarPage (protégé)
//   /profile   → ProfilePage (protégé)
//   /create    → CreateCoursePage (instructeur uniquement)
// ============================================================
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'

// Pages
import LandingPage      from './pages/LandingPage'
import AuthPage         from './pages/AuthPage'
import DashboardPage    from './pages/DashboardPage'
import CoursesPage      from './pages/CoursesPage'
import CalendarPage     from './pages/CalendarPage'
import CreateCoursePage  from './pages/CreateCoursePage'
import ProfilePage       from './pages/ProfilePage'
import InstructeursPage  from './pages/InstructeursPage'

// ---- COMPOSANT ROUTE LANDING (intelligente) ----
// Affiche LandingPage si non connecté, redirige vers /dashboard si connecté
function LandingRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="ocean-bg min-h-screen flex items-center justify-center">
        <Spinner size={48} />
      </div>
    )
  }

  // Déjà connecté → aller directement au dashboard
  if (user) return <Navigate to="/dashboard" replace />

  // Pas connecté → afficher la landing page
  return <LandingPage />
}

// ---- COMPOSANT ROUTE PROTÉGÉE ----
// Redirige vers /login si l'utilisateur n'est pas connecté
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  // Pendant la vérification du token stocké → spinner
  if (loading) {
    return (
      <div className="ocean-bg min-h-screen flex items-center justify-center">
        <Spinner size={48} />
      </div>
    )
  }

  // Pas connecté → redirection vers la page de login
  if (!user) return <Navigate to="/login" replace />

  // Rôle insuffisant → redirection vers le dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  // Tout est OK → on rend la page dans le Layout
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      {/* Page d'accueil publique — smart : redirige vers /dashboard si connecté */}
      <Route path="/" element={<LandingRoute />} />

      {/* Route publique */}
      <Route path="/login" element={<AuthPage />} />

      {/* Routes protégées — nécessitent d'être connecté */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />

      <Route path="/courses" element={
        <ProtectedRoute><CoursesPage /></ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute><CalendarPage /></ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      } />

      <Route path="/instructors" element={
        <ProtectedRoute><InstructeursPage /></ProtectedRoute>
      } />

      {/* Route réservée aux instructeurs */}
      <Route path="/create" element={
        <ProtectedRoute requiredRole="INSTRUCTEUR">
          <CreateCoursePage />
        </ProtectedRoute>
      } />

      {/* Toute URL inconnue → landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
