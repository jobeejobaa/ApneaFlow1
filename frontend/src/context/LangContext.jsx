// ============================================================
// LANG CONTEXT — Internationalisation (i18n) maison
//
// Principe :
//   1. On stocke toutes les traductions dans un objet `translations`
//   2. Le contexte expose la langue courante + la fonction t('clé')
//   3. t('nav.dashboard') → cherche translations[lang]['nav']['dashboard']
//   4. La langue est sauvegardée en localStorage (persiste après reload)
//
// Usage dans n'importe quel composant :
//   const { t, lang, setLang } = useLang()
//   <h1>{t('dashboard.title')}</h1>
// ============================================================

import { createContext, useState } from 'react'

export const LangContext = createContext(null)

// ---- DICTIONNAIRE DE TRADUCTIONS ----
const translations = {
  fr: {
    nav: {
      dashboard:  'Dashboard',
      calendar:   'Calendrier',
      courses:    'Cours',
      create:     'Créer',
      profile:    'Profil',
      logout:     'Déconnexion',
    },

    auth: {
      subtitle:       'Plongez dans l\'expérience',
      emailLabel:     'Email',
      passwordLabel:  'Mot de passe',
      loginBtn:       'Se connecter',
      registerBtn:    'Créer mon compte',
      nameLabel:      'Nom complet',
      passwordHint:   'Mot de passe (min. 6 caractères)',
      roleLabel:      'Rôle',
      roleEleve:      'Élève',
      roleInstructor: 'Instructeur',
      noAccount:      'Pas de compte ?',
      signUp:         'S\'inscrire',
      alreadyAccount: 'Déjà inscrit ?',
      signIn:         'Se connecter',
      demoTitle:      'Comptes de démo :',
      demoEleve:      'Élève',
      demoInstructor: 'Instructeur',
    },

    dashboard: {
      greeting:       'Bonjour,',
      subtitle:       'Prêt à explorer les profondeurs ?',
      findCourse:     'Trouver un cours',
      statEnroll:     'Inscriptions',
      statUpcoming:   'À venir',
      statAvailable:  'Cours dispo',
      statRole:       'Rôle',
      myEnrollments:  'Mes inscriptions',
      viewCalendar:   'Calendrier',
      editProfile:    'Modifier le profil',
      noEnrollments:  'Aucune inscription active',
      browse:         'Parcourir les cours →',
      roleEleve:      'Élève',
      rolePro:        'Pro',
      withEquip:      'Équipement',
    },

    courses: {
      title:          'Cours disponibles',
      subtitle:       'Trouvez votre prochaine session',
      allLevels:      'Tous niveaux',
      allLocations:   'Tous lieux',
      enroll:         'S\'inscrire',
      enrolled:       'Inscrit',
      full:           'Complet',
      delete:         'Supprimer ce cours',
      noResult:       'Aucun cours ne correspond à vos critères',
      confirmDelete:  'Supprimer ce cours définitivement ?',
      deleted:        'Cours supprimé',
    },

    calendar: {
      selectHint:   'Cliquez sur un jour pour voir les cours',
      selectTitle:  'Sélectionnez une date',
      noCourses:    'Aucun cours ce jour',
      months: ['Janvier','Février','Mars','Avril','Mai','Juin',
               'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      days: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    },

    create: {
      title:           'Nouveau cours',
      level:           'Niveau',
      date:            'Date',
      time:            'Heure',
      location:        'Lieu',
      type:            'Type',
      descSection:     'Description',
      descFrLabel:     '🇫🇷 Description (français)',
      descEnLabel:     '🇬🇧 Description (english)',
      descHint:        'Optionnel — prérequis, matériel, objectifs',
      descFrPlaceholder: 'Détails du cours, prérequis, etc.',
      descEnPlaceholder: 'Course details, prerequisites, etc.',
      capacity:        'Places disponibles',
      capacityHint:    'Maximum 4 élèves par cours',
      submit:          'Créer le cours',
      successMsg:      'Cours créé avec succès !',
    },

    profile: {
      title:        'Modifier le profil',
      nameLabel:    'Nom complet',
      emailLabel:   'Email',
      bioLabel:     'Bio',
      bioPlaceholder: 'Parlez-nous de votre parcours en apnée...',
      save:         'Sauvegarder',
      cancel:       'Annuler',
      dangerZone:   'Zone de danger',
      logout:       'Se déconnecter',
      successMsg:   'Profil mis à jour !',
    },

    modal: {
      title:        'Confirmer l\'inscription',
      equipLabel:   'J\'apporte mon équipement',
      equipHint:    'Monopalme, palmes, lest...',
      confirm:      'Confirmer',
      cancel:       'Annuler',
      successMsg:   'Inscription confirmée !',
    },

    courseCard: {
      instructor:   'Instructeur',
      places:       'places',
      full:         'Complet',
      noDesc:       'Aucune description.',
    },

    locations: {
      PISCINE:   'Piscine',
      MER:       'Mer',
      BLUE_HOLE: 'Blue Hole',
    },

    courseTypes: {
      STATIQUE:                         'Statique',
      DYNAMIQUE_PALMES_OU_SANS_PALMES:  'Dynamique',
      PROFONDEUR_PALMES_OU_SANS_PALMES: 'Profondeur',
      IMMERSION_LIBRE:                  'Immersion libre',
      POIDS_VARIABLE:                   'Poids variable',
      NO_LIMITS:                        'No Limits',
    },

    courseNames: {
      INITIATION:       'Initiation',
      AIDA1:            'AIDA 1',
      AIDA2:            'AIDA 2',
      AIDA3:            'AIDA 3',
      AIDA4:            'AIDA 4',
      AIDA_INSTRUCTEUR: 'AIDA Instructeur',
    },

    general: {
      withEquipment:    'Avec équipement',
      withoutEquipment: 'Sans équipement',
      loading:          'Chargement...',
    },

    landing: {
      signin:       'Se connecter',
      signup:       'S\'inscrire',
      introTitle:   'Une plateforme dédiée à l\'apnée',
      introPara1:   'Notre plateforme met en relation des instructeurs d\'apnée qualifiés et des élèves souhaitant découvrir ou progresser dans cette discipline.',
      introPara2:   'Grâce à un système de réservation simple et rapide, chacun peut trouver un cours adapté à son niveau — débutant, intermédiaire ou avancé — et réserver facilement une séance avec un instructeur.',
      slide1Title:    'Apnée au Blue Hole',
      slide1Subtitle: 'Découvrez le spot mythique de Dahab dans un cadre sécurisé.',
      slide2Title:    'Reefs et vie sous-marine',
      slide2Subtitle: 'Plongez au milieu des coraux et des bancs de poissons colorés.',
      slide3Title:    'Sessions encadrées en petit groupe',
      slide3Subtitle: 'Encadrement par instructeurs certifiés, matériel adapté et ambiance conviviale.',
      ctaPrimary:   'Réserve ton premier cours',
      ctaSecondary: 'Inscris-toi',
      discoverTitle: 'Découvrir l\'apnée',
      discoverPara1: 'L\'apnée est une discipline qui consiste à retenir sa respiration pour évoluer sous l\'eau, sans équipement de plongée respiratoire. Accessible à tous, elle permet de découvrir le monde sous-marin d\'une manière calme et naturelle, en se concentrant sur la respiration, la relaxation et le contrôle du corps.',
      discoverPara2: 'Au-delà de l\'aspect sportif, l\'apnée apporte de nombreux bienfaits. Elle aide à mieux gérer le stress grâce aux techniques de respiration, améliore la concentration et favorise une profonde sensation de détente. Beaucoup de pratiquants décrivent leurs premières immersions comme une expérience unique de calme et de connexion avec l\'eau.',
      discoverPara3: 'Que vous soyez simplement curieux ou que vous souhaitiez développer une nouvelle compétence, prendre un premier cours d\'apnée est souvent le début d\'une aventure passionnante. Avec l\'accompagnement d\'un instructeur qualifié, vous apprendrez à respirer efficacement, à vous relaxer et à découvrir en toute sécurité vos premières sensations sous l\'eau.',
    },
  },

  // ================================================================
  en: {
    nav: {
      dashboard:  'Dashboard',
      calendar:   'Calendar',
      courses:    'Courses',
      create:     'Create',
      profile:    'Profile',
      logout:     'Logout',
    },

    auth: {
      subtitle:       'Dive into the experience',
      emailLabel:     'Email',
      passwordLabel:  'Password',
      loginBtn:       'Sign in',
      registerBtn:    'Create account',
      nameLabel:      'Full name',
      passwordHint:   'Password (min. 6 characters)',
      roleLabel:      'Role',
      roleEleve:      'Student',
      roleInstructor: 'Instructor',
      noAccount:      'No account?',
      signUp:         'Sign up',
      alreadyAccount: 'Already registered?',
      signIn:         'Sign in',
      demoTitle:      'Demo accounts:',
      demoEleve:      'Student',
      demoInstructor: 'Instructor',
    },

    dashboard: {
      greeting:       'Hello,',
      subtitle:       'Ready to explore the depths?',
      findCourse:     'Find a course',
      statEnroll:     'Enrollments',
      statUpcoming:   'Upcoming',
      statAvailable:  'Available',
      statRole:       'Role',
      myEnrollments:  'My enrollments',
      viewCalendar:   'Calendar',
      editProfile:    'Edit profile',
      noEnrollments:  'No active enrollments',
      browse:         'Browse courses →',
      roleEleve:      'Student',
      rolePro:        'Pro',
      withEquip:      'Equipment',
    },

    courses: {
      title:          'Available courses',
      subtitle:       'Find your next session',
      allLevels:      'All levels',
      allLocations:   'All locations',
      enroll:         'Enroll',
      enrolled:       'Enrolled',
      full:           'Full',
      delete:         'Delete course',
      noResult:       'No courses match your criteria',
      confirmDelete:  'Permanently delete this course?',
      deleted:        'Course deleted',
    },

    calendar: {
      selectHint:   'Click on a day to see courses',
      selectTitle:  'Select a date',
      noCourses:    'No courses this day',
      months: ['January','February','March','April','May','June',
               'July','August','September','October','November','December'],
      days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    },

    create: {
      title:           'New course',
      level:           'Level',
      date:            'Date',
      time:            'Time',
      location:        'Location',
      type:            'Type',
      descSection:     'Description',
      descFrLabel:     '🇫🇷 Description (français)',
      descEnLabel:     '🇬🇧 Description (english)',
      descHint:        'Optional — prerequisites, equipment, goals',
      descFrPlaceholder: 'Détails du cours, prérequis, etc.',
      descEnPlaceholder: 'Course details, prerequisites, etc.',
      capacity:        'Available spots',
      capacityHint:    'Maximum 4 students per course',
      submit:          'Create course',
      successMsg:      'Course created successfully!',
    },

    profile: {
      title:        'Edit profile',
      nameLabel:    'Full name',
      emailLabel:   'Email',
      bioLabel:     'Bio',
      bioPlaceholder: 'Tell us about your freediving journey...',
      save:         'Save',
      cancel:       'Cancel',
      dangerZone:   'Danger zone',
      logout:       'Sign out',
      successMsg:   'Profile updated!',
    },

    modal: {
      title:        'Confirm enrollment',
      equipLabel:   'I\'ll bring my own equipment',
      equipHint:    'Monofin, fins, weights...',
      confirm:      'Confirm',
      cancel:       'Cancel',
      successMsg:   'Enrollment confirmed!',
    },

    courseCard: {
      instructor:   'Instructor',
      places:       'spots',
      full:         'Full',
      noDesc:       'No description.',
    },

    locations: {
      PISCINE:   'Pool',
      MER:       'Sea',
      BLUE_HOLE: 'Blue Hole',
    },

    courseTypes: {
      STATIQUE:                         'Static',
      DYNAMIQUE_PALMES_OU_SANS_PALMES:  'Dynamic',
      PROFONDEUR_PALMES_OU_SANS_PALMES: 'Depth',
      IMMERSION_LIBRE:                  'Free immersion',
      POIDS_VARIABLE:                   'Variable weight',
      NO_LIMITS:                        'No Limits',
    },

    courseNames: {
      INITIATION:       'Initiation',
      AIDA1:            'AIDA 1',
      AIDA2:            'AIDA 2',
      AIDA3:            'AIDA 3',
      AIDA4:            'AIDA 4',
      AIDA_INSTRUCTEUR: 'AIDA Instructor',
    },

    general: {
      withEquipment:    'With equipment',
      withoutEquipment: 'Without equipment',
      loading:          'Loading...',
    },

    landing: {
      signin:       'Sign in',
      signup:       'Sign up',
      introTitle:   'A platform dedicated to freediving',
      introPara1:   'Our platform connects qualified freediving instructors with students who want to discover or improve in this discipline.',
      introPara2:   'With a simple and fast booking system, everyone can find a course suited to their level — beginner, intermediate, or advanced — and easily book a session with an instructor.',
      slide1Title:    'Freediving at the Blue Hole',
      slide1Subtitle: 'Discover the mythical spot of Dahab in a safe environment.',
      slide2Title:    'Reefs and marine life',
      slide2Subtitle: 'Dive among corals and colorful schools of fish.',
      slide3Title:    'Small group guided sessions',
      slide3Subtitle: 'Guided by certified instructors, with adapted equipment and a friendly atmosphere.',
      ctaPrimary:   'Book your first course',
      ctaSecondary: 'Sign up',
      discoverTitle: 'Discover freediving',
      discoverPara1: 'Freediving is a discipline that consists of holding your breath to move underwater, without respiratory diving equipment. Accessible to all, it allows you to discover the underwater world in a calm and natural way, focusing on breathing, relaxation and body control.',
      discoverPara2: 'Beyond the sporting aspect, freediving brings many benefits. It helps to better manage stress through breathing techniques, improves concentration and promotes a deep feeling of relaxation. Many practitioners describe their first dives as a unique experience of calm and connection with water.',
      discoverPara3: 'Whether you are simply curious or want to develop a new skill, taking a first freediving course is often the beginning of a fascinating adventure. With the guidance of a qualified instructor, you will learn to breathe efficiently, relax and safely discover your first underwater sensations.',
    },
  },
}

// ---- PROVIDER ----
export function LangProvider({ children }) {
  // Lire la langue sauvegardée, sinon 'fr' par défaut
  const [lang, setLangState] = useState(
    () => localStorage.getItem('apnea_lang') || 'fr'
  )

  const setLang = (newLang) => {
    localStorage.setItem('apnea_lang', newLang)
    setLangState(newLang)
  }

  // Fonction de traduction : t('nav.dashboard') → 'Dashboard'
  // Supporte la notation pointée pour naviguer dans l'objet
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    // Si la clé n'existe pas, afficher la clé pour débugger facilement
    return value ?? `[${key}]`
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}
