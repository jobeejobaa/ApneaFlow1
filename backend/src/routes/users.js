// ============================================================
// ROUTES UTILISATEURS
//
// GET  /api/users/me        → Mon profil
// PUT  /api/users/me        → Modifier mon profil
// GET  /api/users           → Liste des utilisateurs (instructeur only)
// ============================================================

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireInstructor } from '../middleware/auth.js'

const router = Router()

// Toutes les routes nécessitent d'être connecté
router.use(authenticate)

// Schéma de mise à jour du profil
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  photoUrl: z.string().url().optional().nullable(),
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
