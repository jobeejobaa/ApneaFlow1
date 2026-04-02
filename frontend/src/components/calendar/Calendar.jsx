// ============================================================
// Calendar — Composant calendrier mensuel
// ============================================================
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

export default function Calendar({ courses = [], onSelectDate, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { t } = useLang()

  // Les noms de mois et de jours viennent du contexte de langue (FR ou EN)
  const MONTH_NAMES = t('calendar.months')
  const DAY_NAMES   = t('calendar.days')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Premier jour du mois (0=dim, 1=lun...) → offset pour commencer à lundi
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const changeMonth = (delta) => {
    setCurrentDate(d => {
      const newDate = new Date(d)
      newDate.setMonth(newDate.getMonth() + delta)
      return newDate
    })
  }

  // Cours du mois — indexés par date de session "YYYY-MM-DD"
  // Un cours avec plusieurs sessions apparaît sur chacune de ses dates
  const coursesByDate = courses.reduce((acc, course) => {
    const sessions = Array.isArray(course.sessions) ? course.sessions : []
    sessions.forEach(({ date }) => {
      if (!acc[date]) acc[date] = []
      if (!acc[date].find(c => c.id === course.id)) {
        acc[date].push(course)
      }
    })
    return acc
  }, {})

  const buildDateStr = (day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <div>
      {/* En-tête : mois + navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">
          {Array.isArray(MONTH_NAMES) ? MONTH_NAMES[month] : ''} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {Array.isArray(DAY_NAMES) && DAY_NAMES.map(d => (
          <div key={d} className="text-center text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-2">
        {/* Cases vides pour l'offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Jours du mois */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = buildDateStr(day)
          const hasCourses = Boolean(coursesByDate[dateStr])
          const isSelected = selectedDate === dateStr

          return (
            <button
              key={day}
              onClick={() => onSelectDate?.(dateStr, coursesByDate[dateStr] ?? [])}
              className={`calendar-day text-sm ${isSelected ? 'active' : ''} ${hasCourses ? 'has-event' : ''}`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
