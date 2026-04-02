// ============================================================
// DashboardPage — Vue d'accueil après connexion
// ============================================================
import { Link } from 'react-router-dom'
import { Award, CalendarCheck, Users, TrendingUp, ArrowRight, Package } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../hooks/useLang'
import { useEnrollments } from '../hooks/useEnrollments'
import { useCourses } from '../hooks/useCourses'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { useMeta } from '../hooks/useMeta'

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-cyan-200">{label}</div>
    </div>
  )
}

function EnrollmentItem({ enrollment }) {
  const { t } = useLang()
  const course = enrollment.course
  if (!course) return null

  return (
    <div className="glass rounded-xl p-4 hover:bg-white/10 transition-all">
      <div className="flex justify-between items-start mb-2">
        <Badge level={course.title} />
        <span className="text-cyan-300 text-xs">{course.sessions?.[0]?.time}</span>
      </div>
      <h4 className="font-semibold mb-1 text-sm">
        {(course.types ?? []).map(tp =>
          t(`courseTypes.${tp}`) !== `[courseTypes.${tp}]` ? t(`courseTypes.${tp}`) : tp
        ).join(' · ')}
      </h4>
      <div className="flex items-center gap-3 text-xs text-cyan-200">
        <span>
          {t(`locations.${course.location}`) !== `[locations.${course.location}]`
            ? t(`locations.${course.location}`) : course.location}
          {' — '}
          {new Date(course.sessions?.[0]?.date).toLocaleDateString()}
        </span>
        {enrollment.withEquipment && (
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" /> {t('dashboard.withEquip')}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  useMeta('Tableau de bord', 'Votre espace Apnea Flow — suivez vos inscriptions, cours à venir et activités.')
  const { user } = useAuth()
  const { t } = useLang()
  const { enrollments, loading: loadingEnroll } = useEnrollments()
  const { courses } = useCourses()

  const today = new Date().toISOString().split('T')[0]
  const upcoming = enrollments.filter(e =>
    Array.isArray(e.course?.sessions) && e.course.sessions.some(s => s.date >= today)
  )

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">
            {t('dashboard.greeting')} <span className="text-cyan-300">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-cyan-200 text-lg">{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/courses"
          className="hidden md:flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-medium transition-all">
          {t('dashboard.findCourse')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Award}         value={enrollments.length} label={t('dashboard.statEnroll')}    color="bg-cyan-500/20 text-cyan-400" />
        <StatCard icon={CalendarCheck} value={upcoming.length}    label={t('dashboard.statUpcoming')}  color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Users}         value={courses.length}     label={t('dashboard.statAvailable')} color="bg-indigo-500/20 text-indigo-400" />
        <StatCard icon={TrendingUp}
          value={user?.role === 'INSTRUCTEUR' ? t('dashboard.rolePro') : t('dashboard.roleEleve')}
          label={t('dashboard.statRole')} color="bg-teal-500/20 text-teal-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mes inscriptions */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold">{t('dashboard.myEnrollments')}</h2>
            <Link to="/calendar" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
              {t('dashboard.viewCalendar')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingEnroll ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8 text-cyan-200">
              <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('dashboard.noEnrollments')}</p>
              <Link to="/courses" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300 text-sm">
                {t('dashboard.browse')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map(e => <EnrollmentItem key={e.id} enrollment={e} />)}
            </div>
          )}
        </div>

        {/* Profil rapide */}
        <div className="glass-card rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4 border-4 border-white/10 text-4xl">
              🤿
            </div>
            <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
            <p className="text-cyan-200 text-sm mb-4">{user?.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user?.role === 'INSTRUCTEUR'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}>
              {user?.role}
            </span>
          </div>
          <Link to="/profile"
            className="block w-full text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all text-sm font-medium">
            {t('dashboard.editProfile')}
          </Link>
        </div>
      </div>
    </div>
  )
}
