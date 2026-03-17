// ============================================================
// ROUTES INSCRIPTIONS
//
// GET    /api/enrollments/my      → Mes inscriptions
// POST   /api/enrollments         → S'inscrire à un cours (élève)
// DELETE /api/enrollments/:courseId → Se désinscrire (élève)
// GET    /api/enrollments/course/:courseId → Élèves inscrits (instructeur)
// ============================================================

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireInstructor } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

const enrollSchema = z.object({
  courseId: z.string().uuid('ID de cours invalide'),
  withEquipment: z.boolean().optional().default(false),
})

// ---- MES INSCRIPTIONS ----
// GET /api/enrollments/my
router.get('/my', async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            createdBy: { select: { id: true, name: true } },
            _count: { select: { enrollments: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(enrollments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- S'INSCRIRE ----
// POST /api/enrollments
router.post('/', async (req, res) => {
  try {
    // Seuls les élèves peuvent s'inscrire
    if (req.user.role !== 'ELEVE') {
      return res.status(403).json({
        error: 'Les instructeurs ne peuvent pas s\'inscrire à des cours.',
      })
    }

    const data = enrollSchema.parse(req.body)

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
      include: { _count: { select: { enrollments: true } } },
    })

    if (!course) {
      return res.status(404).json({ error: 'Cours introuvable.' })
    }

    // Vérifier s'il reste de la place
    if (course._count.enrollments >= course.capacity) {
      return res.status(409).json({ error: 'Ce cours est complet.' })
    }

    // Vérifier que l'élève n'est pas déjà inscrit
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: req.user.id, courseId: data.courseId },
      },
    })

    if (existing) {
      return res.status(409).json({ error: 'Tu es déjà inscrit à ce cours.' })
    }

    // Créer l'inscription
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId: data.courseId,
        withEquipment: data.withEquipment,
      },
      include: {
        course: {
          include: {
            createdBy: { select: { id: true, name: true } },
          },
        },
      },
    })

    res.status(201).json(enrollment)
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- SE DÉSINSCRIRE ----
// DELETE /api/enrollments/:courseId
router.delete('/:courseId', async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: req.params.courseId,
        },
      },
    })

    if (!enrollment) {
      return res.status(404).json({ error: 'Inscription introuvable.' })
    }

    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: req.params.courseId,
        },
      },
    })

    res.json({ message: 'Désinscription effectuée.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- ÉLÈVES D'UN COURS (instructeur) ----
// GET /api/enrollments/course/:courseId
router.get('/course/:courseId', requireInstructor, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: req.params.courseId },
      include: {
        user: {
          select: { id: true, name: true, email: true, bio: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json(enrollments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

export default router
