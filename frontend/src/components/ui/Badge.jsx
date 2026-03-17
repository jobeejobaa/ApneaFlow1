// ============================================================
// Badge — Affiche le niveau d'un cours avec le bon gradient
// ============================================================
import { CourseName, levelBadgeClass } from '../../utils/labels'

export default function Badge({ level, className = '' }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${levelBadgeClass(level)} ${className}`}>
      {CourseName[level] ?? level}
    </span>
  )
}
