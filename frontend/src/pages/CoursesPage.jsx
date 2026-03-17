// ============================================================
// CoursesPage — Liste et filtrage de tous les cours
// ============================================================
import { useState } from 'react'
import { SearchX } from 'lucide-react'
import CourseCard from '../components/courses/CourseCard'
import CourseFilters from '../components/courses/CourseFilters'
import EnrollModal from '../components/enrollments/EnrollModal'
import Spinner from '../components/ui/Spinner'
import { useCourses } from '../hooks/useCourses'
import { useEnrollments } from '../hooks/useEnrollments'
import { useToast } from '../hooks/useToast'
import { coursesAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../hooks/useLang'

export default function CoursesPage() {
  const [filters, setFilters] = useState({ level: 'all', location: 'all' })
  const [selectedCourse, setSelectedCourse] = useState(null) // cours pour le modal

  const { courses, loading, error, refetch } = useCourses(filters)
  const { enrollments, refetch: refetchEnrollments, isEnrolled } = useEnrollments()
  const { addToast } = useToast()
  const { user } = useAuth()
  const { t } = useLang()

  const handleDelete = async (courseId) => {
    if (!confirm(t('courses.confirmDelete'))) return
    try {
      await coursesAPI.delete(courseId)
      addToast(t('courses.deleted'))
      refetch()
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleEnrollSuccess = () => {
    refetch()
    refetchEnrollments()
  }

  return (
    <div className="animate-fade-in">
      {/* Header + Filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">{t('courses.title')}</h2>
          <p className="text-cyan-200">{t('courses.subtitle')}</p>
        </div>
        <CourseFilters
          level={filters.level}
          location={filters.location}
          onChange={setFilters}
        />
      </div>

      {/* États */}
      {loading && (
        <div className="flex justify-center py-16"><Spinner size={48} /></div>
      )}

      {error && (
        <div className="text-center py-12 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="col-span-full text-center py-12 text-cyan-200">
          <SearchX className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>{t('courses.noResult')}</p>
        </div>
      )}

      {/* Grille des cours */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={isEnrolled(course.id)}
              onEnroll={setSelectedCourse}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal d'inscription */}
      {selectedCourse && (
        <EnrollModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  )
}
