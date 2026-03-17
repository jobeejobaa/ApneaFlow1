// ============================================================
// LABELS — Dictionnaires de traduction des enums
// Ces enums viennent du backend (Prisma schema).
// On les traduit ici pour l'affichage côté frontend.
// ============================================================

export const CourseName = {
  INITIATION:       'Initiation',
  AIDA1:            'AIDA 1',
  AIDA2:            'AIDA 2',
  AIDA3:            'AIDA 3',
  AIDA4:            'AIDA 4',
  AIDA_INSTRUCTEUR: 'AIDA Instructeur',
}

export const Location = {
  PISCINE:   { label: 'Piscine',    icon: 'Waves',     colorClass: 'text-cyan-400'   },
  MER:       { label: 'Mer',        icon: 'Anchor',    colorClass: 'text-sky-400'    },
  BLUE_HOLE: { label: 'Blue Hole',  icon: 'CircleDot', colorClass: 'text-indigo-400' },
}

export const CourseType = {
  STATIQUE:                           'Statique',
  DYNAMIQUE_PALMES_OU_SANS_PALMES:    'Dynamique',
  PROFONDEUR_PALMES_OU_SANS_PALMES:   'Profondeur',
  IMMERSION_LIBRE:                    'Immersion libre',
  POIDS_VARIABLE:                     'Poids variable',
  NO_LIMITS:                          'No Limits',
}

// Badge CSS class selon le niveau
export const levelBadgeClass = (title) => {
  const key = title?.toLowerCase().replace('_', '')
  return `badge-${key}`
}

// Formater une date ISO en français
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

export const formatDateShort = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR')
