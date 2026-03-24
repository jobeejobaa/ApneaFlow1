// ============================================================
// ROUTES UTILISATEURS
//
// GET  /api/users/me        → Mon profil
// PUT  /api/users/me        → Modifier mon profil
// POST /api/users/me/photo  → Uploader une photo de profil (JPG)
// GET  /api/users           → Liste des utilisateurs (instructeur only)
// ============================================================

import { Router } from 'express'
import { z } from 'zod'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireInstructor } from '../middleware/auth.js'

const router = Router()

// Chemin vers le dossier uploads (à la racine du backend)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const UPLOADS_DIR = join(__dirname, '../../uploads')
// Créer le dossier s'il n'existe pas encore
mkdirSync(UPLOADS_DIR, { recursive: true })

// Toutes les routes nécessitent d'être connecté
router.use(authenticate)

// Schéma de mise à jour du profil
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  photoUrl: z.string().url().optional().nullable(),
})

// ---- STATS INSTRUCTEUR ----
// GET /api/users/me/instructor-stats
// Retourne :
//   - upcomingCourses : cours à venir (date >= aujourd'hui) avec nb inscrits / capacité
//   - students        : liste unique des élèves ayant déjà suivi un de ses cours
router.get('/me/instructor-stats', async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTEUR') {
      return res.status(403).json({ error: 'Réservé aux instructeurs.' })
    }

    const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

    // 1. Cours à venir (date >= aujourd'hui)
    const upcomingCourses = await prisma.course.findMany({
      where: {
        createdById: req.user.id,
        date: { gte: today },
      },
      select: {
        id: true,
        title: true,
        date: true,
        time: true,
        location: true,
        type: true,
        capacity: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { date: 'asc' },
    })

    // 2. Tous les élèves uniques inscrits à au moins un de ses cours (passés ou futurs)
    const coursesWithStudents = await prisma.course.findMany({
      where: { createdById: req.user.id },
      select: {
        enrollments: {
          select: {
            user: {
              select: { id: true, name: true, photoUrl: true },
            },
          },
        },
      },
    })

    // Dédoublonner les élèves par ID
    const studentsMap = new Map()
    for (const course of coursesWithStudents) {
      for (const enrollment of course.enrollments) {
        studentsMap.set(enrollment.user.id, enrollment.user)
      }
    }

    res.json({
      upcomingCourses,
      students: Array.from(studentsMap.values()),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- MON PROFIL ----
// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        photoUrl: true,
        createdAt: true,
        enrollments: {
          include: {
            course: true, // Inclure les détails du cours
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { enrollments: true, coursesCreated: true },
        },
      },
    })

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- MODIFIER MON PROFIL ----
// PUT /api/users/me
router.put('/me', async (req, res) => {
  try {
    const data = updateProfileSchema.parse(req.body)

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        photoUrl: true,
        updatedAt: true,
      },
    })

    res.json(updated)
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- UPLOAD PHOTO DE PROFIL ----
// POST /api/users/me/photo
// Body : { photo: "data:image/jpeg;base64,..." }
router.post('/me/photo', async (req, res) => {
  try {
    const { photo } = req.body

    // Vérifications de base
    if (!photo || typeof photo !== 'string') {
      return res.status(400).json({ error: 'Aucune photo reçue.' })
    }

    // Vérifier que c'est bien un JPEG en base64
    if (!photo.startsWith('data:image/jpeg;base64,') && !photo.startsWith('data:image/jpg;base64,')) {
      return res.status(400).json({ error: 'Seuls les fichiers JPG/JPEG sont acceptés.' })
    }

    // Extraire la partie base64 pure (sans le préfixe "data:image/jpeg;base64,")
    const base64Data = photo.split(',')[1]

    // Vérification de la taille (~15 Mo max ; base64 est ~33% plus grand que le fichier réel)
    const sizeInBytes = Buffer.byteLength(base64Data, 'base64')
    if (sizeInBytes > 15 * 1024 * 1024) {
      return res.status(400).json({ error: 'La photo dépasse la limite de 15 Mo.' })
    }

    // Nom de fichier unique basé sur l'ID user + timestamp
    const filename = `user-${req.user.id}-${Date.now()}.jpg`
    const filepath = join(UPLOADS_DIR, filename)

    // Écrire le fichier sur le disque
    writeFileSync(filepath, base64Data, 'base64')

    // Chemin accessible via HTTP
    const photoUrl = `/uploads/${filename}`

    // Mettre à jour la BDD
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { photoUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        photoUrl: true,
        updatedAt: true,
      },
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur lors de l\'upload.' })
  }
})

// ---- LISTE DES INSTRUCTEURS (accessible à tous les utilisateurs connectés) ----
// GET /api/users/instructors
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTEUR' },
      select: {
        id: true,
        name: true,
        bio: true,
        photoUrl: true,
        createdAt: true,
        _count: {
          select: { coursesCreated: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    res.json(instructors)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- PROFIL D'UN INSTRUCTEUR PAR ID (accessible à tous les utilisateurs connectés) ----
// GET /api/users/instructors/:id
router.get('/instructors/:id', async (req, res) => {
  try {
    const instructor = await prisma.user.findFirst({
      where: { id: req.params.id, role: 'INSTRUCTEUR' },
      select: {
        id: true,
        name: true,
        bio: true,
        photoUrl: true,
        createdAt: true,
        coursesCreated: {
          select: {
            id: true,
            title: true,
            type: true,
            location: true,
            date: true,
            time: true,
            capacity: true,
          },
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { coursesCreated: true },
        },
      },
    })

    if (!instructor) {
      return res.status(404).json({ error: 'Instructeur introuvable.' })
    }

    res.json(instructor)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- LISTE DES UTILISATEURS (instructeur) ----
// GET /api/users
router.get('/', requireInstructor, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

export default router
