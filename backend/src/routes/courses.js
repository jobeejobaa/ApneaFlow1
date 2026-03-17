// ============================================================
// ROUTES COURS
//
// GET    /api/courses        → Liste de tous les cours
// GET    /api/courses/:id    → Un cours par son ID
// POST   /api/courses        → Créer un cours (instructeur)
// PUT    /api/courses/:id    → Modifier un cours (instructeur)
// DELETE /api/courses/:id    → Supprimer un cours (instructeur)
// ============================================================

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireInstructor } from '../middleware/auth.js'

const router = Router()

// Toutes les routes nécessitent d'être connecté
router.use(authenticate)

// Schéma Zod pour la création/modification d'un cours
const courseSchema = z.object({
  title: z.enum(['INITIATION', 'AIDA1', 'AIDA2', 'AIDA3', 'AIDA4', 'AIDA_INSTRUCTEUR']),
  descriptionFr: z.string().max(1000).optional(),
  descriptionEn: z.string().max(1000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Format d\'heure invalide (HH:MM)'),
  location: z.enum(['PISCINE', 'MER', 'BLUE_HOLE']),
  type: z.enum([
    'STATIQUE',
    'DYNAMIQUE_PALMES_OU_SANS_PALMES',
    'PROFONDEUR_PALMES_OU_SANS_PALMES',
    'IMMERSION_LIBRE',
    'POIDS_VARIABLE',
    'NO_LIMITS',
  ]),
  capacity: z.number().int().min(1).max(10).optional().default(4),
})

// ---- LISTE DES COURS ----
// GET /api/courses
// Paramètres optionnels : ?level=AIDA2&location=PISCINE&upcoming=true
router.get('/', async (req, res) => {
  try {
    const { level, location, upcoming } = req.query

    // Construire le filtre dynamiquement
    const where = {}
    if (level && level !== 'all') where.title = level
    if (location && location !== 'all') where.location = location
    if (upcoming === 'true') {
      // Filtrer les cours à venir (date >= aujourd'hui)
      const today = new Date().toISOString().split('T')[0]
      where.date = { gte: today }
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        enrollments: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })

    res.json(courses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- UN COURS PAR ID ----
// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        enrollments: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (!course) {
      return res.status(404).json({ error: 'Cours introuvable.' })
    }

    res.json(course)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- CRÉER UN COURS ----
// POST /api/courses (instructeur seulement)
router.post('/', requireInstructor, async (req, res) => {
  try {
    const data = courseSchema.parse(req.body)

    const course = await prisma.course.create({
      data: {
        ...data,
        createdById: req.user.id, // L'instructeur connecté est l'auteur
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { enrollments: true } },
      },
    })

    res.status(201).json(course)
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- MODIFIER UN COURS ----
// PUT /api/courses/:id (instructeur seulement)
router.put('/:id', requireInstructor, async (req, res) => {
  try {
    // Vérifier que le cours existe et appartient à cet instructeur
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    })

    if (!course) {
      return res.status(404).json({ error: 'Cours introuvable.' })
    }

    if (course.createdById !== req.user.id) {
      return res.status(403).json({ error: 'Tu ne peux modifier que tes propres cours.' })
    }

    const data = courseSchema.partial().parse(req.body) // .partial() = tous les champs optionnels

    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data,
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { enrollments: true } },
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

// ---- SUPPRIMER UN COURS ----
// DELETE /api/courses/:id (instructeur seulement)
router.delete('/:id', requireInstructor, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    })

    if (!course) {
      return res.status(404).json({ error: 'Cours introuvable.' })
    }

    if (course.createdById !== req.user.id) {
      return res.status(403).json({ error: 'Tu ne peux supprimer que tes propres cours.' })
    }

    // Supprime aussi les inscriptions (cascade dans Prisma schema)
    await prisma.course.delete({ where: { id: req.params.id } })

    res.json({ message: 'Cours supprimé.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

export default router
