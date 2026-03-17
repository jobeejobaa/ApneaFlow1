// ============================================================
// CourseFilters — Filtres niveau + lieu pour la page Cours
// ============================================================
export default function CourseFilters({ level, location, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={level}
        onChange={e => onChange({ level: e.target.value, location })}
        className="ocean-input px-4 py-2 rounded-lg text-sm"
      >
        <option value="all">Tous niveaux</option>
        <option value="INITIATION">Initiation</option>
        <option value="AIDA1">AIDA 1</option>
        <option value="AIDA2">AIDA 2</option>
        <option value="AIDA3">AIDA 3</option>
        <option value="AIDA4">AIDA 4</option>
        <option value="AIDA_INSTRUCTEUR">Instructeur</option>
      </select>

      <select
        value={location}
        onChange={e => onChange({ level, location: e.target.value })}
        className="ocean-input px-4 py-2 rounded-lg text-sm"
      >
        <option value="all">Tous lieux</option>
        <option value="PISCINE">Piscine</option>
        <option value="MER">Mer</option>
        <option value="BLUE_HOLE">Blue Hole</option>
      </select>
    </div>
  )
}
