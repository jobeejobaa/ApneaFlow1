// ============================================================
// CalendarPage — Vue calendrier avec détail du jour sélectionné
// ============================================================
import { useState } from 'react'
import { CalendarX } from 'lucide-react'
import Calendar from '../components/calendar/Calendar'
import CourseCard from '../components/courses/CourseCard'
import EnrollModal from '../components/enrollments/EnrollModal'
import Spinner from '../components/ui/Spinner'
import { useCourses } from '../hooks/useCourses'
import { useEnrollments } from '../hooks/useEnrollments'
import { formatDate } from '../utils/labels'
import { useLang } from '../hooks/useLang'
import { useMeta } from '../hooks/useMeta'

export default function CalendarPage() {
  useMeta('Calendrier', 'Visualisez vos cours d\'apnée en calendrier mensuel et gérez votre planning de formation.')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDayCourses, setSelectedDayCourses] = useState([])
  const [courseForModal, setCourseForModal] = useState(null)
  const { t } = useLang()

  // On récupère TOUS les cours (sans filtre upcoming pour voir le mois entier)
  const { courses, loading, refetch } = useCourses()
  const { isEnrolled, refetch: refetchEnrollments } = useEnrollments()

  const handleSelectDate = (dateStr, dayCourses) => {
    setSelectedDate(dateStr)
    setSelectedDayCourses(dayCourses)
  }

  const handleEnrollSuccess = () => {
    refetch()
    refetchEnrollments()
    // Mettre à jour la liste du jour sélectionné
    if (selectedDate) {
      const updated = courses.filter(c =>
        Array.isArray(c.sessions) && c.sessions.some(s => s.date === selectedDate)
      )
      setSelectedDayCourses(updated)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendrier */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          {loading ? (
            <div className="flex justify-center py-16"><Spinner size={48} /></div>
          ) : (
            <Calendar
              courses={courses}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
        </div>

        {/* Panel détail du jour */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-serif font-bold mb-4">
            {selectedDate
              ? formatDate(selectedDate)
              : t('calendar.selectTitle')
            }
          </h3>

          {!selectedDate && (
            <div className="text-center py-12 text-cyan-200">
              <CalendarX className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('calendar.selectHint')}</p>
            </div>
          )}

          {selectedDate && selectedDayCourses.length === 0 && (
            <div className="text-center py-12 text-cyan-200">
              <CalendarX className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('calendar.noCourses')}</p>
            </div>
          )}

          {selectedDate && selectedDayCourses.length > 0 && (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {selectedDayCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled(course.id)}
                  onEnroll={setCourseForModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {courseForModal && (
        <EnrollModal
          course={courseForModal}
          onClose={() => setCourseForModal(null)}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  )
}
