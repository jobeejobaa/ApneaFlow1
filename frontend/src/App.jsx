// ============================================================
// App.jsx — Routeur principal de l'application
//
// React Router v6 gère la navigation côté client (SPA).
// On définit ici :
//   - Les routes publiques (accès sans être connecté)
//   - Les routes protégées (redirige vers /login si pas connecté)
//   - Les routes réservées aux instructeurs
// ============================================================
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'

// Pages
import AuthPage       from './pages/AuthPage'
import DashboardPage  from './pages/DashboardPage'
import CoursesPage    from './pages/CoursesPage'
import CalendarPage   from './pages/CalendarPage'
import CreateCoursePage from './pages/CreateCoursePage'
import ProfilePage    from './pages/ProfilePage'

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
    return <Navigate to="/" replace />
  }

  // Tout est OK → on rend la page dans le Layout
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<AuthPage />} />

      {/* Routes protégées — nécessitent d'être connecté */}
      <Route path="/" element={
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

      {/* Route réservée aux instructeurs */}
      <Route path="/create" element={
        <ProtectedRoute requiredRole="INSTRUCTEUR">
          <CreateCoursePage />
        </ProtectedRoute>
      } />

      {/* Toute URL inconnue → dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
