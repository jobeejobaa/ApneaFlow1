// ============================================================
// SERVICE API — Couche d'abstraction pour les appels HTTP
//
// Principe : toutes les communications avec le backend passent
// par ce fichier. Les composants ne font jamais de fetch() direct.
//
// Structure :
//   apiFetch()     → fonction de base (gère le token, les erreurs)
//   authAPI        → register, login
//   coursesAPI     → CRUD des cours
//   enrollmentsAPI → inscriptions
//   usersAPI       → profil
// ============================================================

// Récupérer le token JWT depuis le localStorage
const getToken = () => localStorage.getItem('apnea_token')

// ---- FONCTION DE BASE ----
// Toutes les requêtes passent par ici
async function apiFetch(endpoint, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Ajouter le token si on l'a (routes protégées)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  // Si le serveur renvoie une erreur, on la lance comme exception
  // pour pouvoir la catch dans les composants avec try/catch
  if (!response.ok) {
    throw new Error(data.error || `Erreur ${response.status}`)
  }

  return data
}

// ============================================================
// AUTH API
// ============================================================
export const authAPI = {
  // POST /api/auth/login
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // POST /api/auth/register
  register: (name, email, password, role) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  // GET /api/auth/me
  getMe: () => apiFetch('/auth/me'),
}

// ============================================================
// COURSES API
// ============================================================
export const coursesAPI = {
  // GET /api/courses?upcoming=true&level=AIDA2&location=PISCINE
  getAll: ({ level, location } = {}) => {
    const params = new URLSearchParams({ upcoming: 'true' })
    if (level && level !== 'all') params.set('level', level)
    if (location && location !== 'all') params.set('location', location)
    return apiFetch(`/courses?${params}`)
  },

  // GET /api/courses/:id
  getById: (id) => apiFetch(`/courses/${id}`),

  // POST /api/courses
  create: (data) =>
    apiFetch('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // DELETE /api/courses/:id
  delete: (id) =>
    apiFetch(`/courses/${id}`, { method: 'DELETE' }),
}

// ============================================================
// ENROLLMENTS API
// ============================================================
export const enrollmentsAPI = {
  // GET /api/enrollments/my
  getMy: () => apiFetch('/enrollments/my'),

  // POST /api/enrollments
  enroll: (courseId, withEquipment) =>
    apiFetch('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId, withEquipment }),
    }),

  // DELETE /api/enrollments/:courseId
  unenroll: (courseId) =>
    apiFetch(`/enrollments/${courseId}`, { method: 'DELETE' }),
}

// ============================================================
// USERS API
// ============================================================
export const usersAPI = {
  // GET /api/users/me (avec enrollments inclus)
  getMe: () => apiFetch('/users/me'),

  // PUT /api/users/me
  updateMe: (data) =>
    apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // POST /api/users/me/photo
  // Prend un objet File (depuis <input type="file">)
  // Le convertit en base64 puis l'envoie au serveur
  uploadPhoto: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          // reader.result = "data:image/jpeg;base64,/9j/4AAQ..."
          const result = await apiFetch('/users/me/photo', {
            method: 'POST',
            body: JSON.stringify({ photo: reader.result }),
          })
          resolve(result)
        } catch (err) {
          reject(err)
        }
      }

      reader.onerror = () => reject(new Error('Impossible de lire le fichier.'))

      // Convertir le fichier en base64 DataURL
      reader.readAsDataURL(file)
    })
  },
}
