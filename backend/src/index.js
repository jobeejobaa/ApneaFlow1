// ============================================================
// POINT D'ENTRÉE DU SERVEUR EXPRESS
//
// C'est ici que tout commence. Ce fichier :
// 1. Configure Express et ses middlewares
// 2. Branche les routes
// 3. Lance le serveur sur le port défini
// ============================================================

import 'dotenv/config'           // Charge les variables d'environnement depuis .env
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import des routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import courseRoutes from './routes/courses.js'
import enrollmentRoutes from './routes/enrollments.js'
import requestRoutes from './routes/requests.js'

const app = express()
const PORT = process.env.PORT || 3001

// __dirname n'existe pas en ES Modules → on le reconstruit
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Chemin vers le build React (frontend/dist/)
// Créé par "npm run build" dans le dossier frontend
const FRONTEND_DIST = join(__dirname, '../../frontend/dist')

// ---- MIDDLEWARES GLOBAUX ----

// CORS : utile si tu appelles l'API depuis un autre port (ex: React dev server)
// En dev, on accepte tout pour simplifier la vie
app.use(cors({
  origin: true,   // Accepte toutes les origines en développement
  credentials: true,
}))

// Parse le body JSON des requêtes (limite à 25 Mo pour les photos base64)
app.use(express.json({ limit: '25mb' }))

// Log basique de chaque requête (utile pour débugger)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`)
  next()
})

// ---- UPLOADS PHOTOS DE PROFIL ----
// Ce dossier contient les photos uploadées par les utilisateurs
// Accessible via GET /uploads/user-xxx-timestamp.jpg
const UPLOADS_DIR = join(__dirname, '../uploads')
app.use('/uploads', express.static(UPLOADS_DIR))

// ---- FRONTEND STATIQUE (PRODUCTION) ----
// En dev : le frontend tourne sur Vite (port 5173)
// En prod : on build React (npm run build) puis Express sert le dossier dist/
import { existsSync } from 'fs'
if (existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST))
}

// ---- ROUTES API ----
// Toutes les routes commencent par /api/
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/requests', requestRoutes)

// Favicon
app.get('/favicon.ico', (req, res) => res.status(204).end())

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Apnea Flow API fonctionne !', timestamp: new Date().toISOString() })
})

// SPA fallback (prod uniquement) : toute URL non-API renvoie index.html
// Nécessaire pour React Router — sinon un refresh sur /courses donne 404
if (existsSync(FRONTEND_DIST)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(FRONTEND_DIST, 'index.html'))
    }
  })
}

// ---- GESTION D'ERREURS GLOBALE ----
// Ce middleware capture toutes les erreurs non gérées
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err)
  res.status(500).json({
    error: 'Erreur interne du serveur.',
    ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
  })
})

// ---- DÉMARRAGE ----
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   🌊 Apnea Flow API démarrée                     ║
  ║                                                  ║
  ║   DEV  → Frontend Vite : http://localhost:5173   ║
  ║   API  → http://localhost:${PORT}/api              ║
  ║   PROD → npm run build puis http://localhost:${PORT}║
  ╚══════════════════════════════════════════════════╝
  `)
})
