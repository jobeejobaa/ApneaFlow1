// ============================================================
// ROUTES DEMANDES DE COURS
//
// POST   /api/requests              → Élève envoie une demande
// GET    /api/requests/sent         → Élève voit ses demandes envoyées
// GET    /api/requests/received     → Instructeur voit les demandes reçues
// GET    /api/requests/pending-count → Nb de demandes en attente (badge navbar)
// PATCH  /api/requests/:id          → Instructeur accepte ou refuse
// ============================================================

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireInstructor } from '../middleware/auth.js'

const router = Router()

// Toutes les routes nécessitent d'être connecté
router.use(authenticate)

// Schéma de validation pour créer une demande
const createRequestSchema = z.object({
  instructorId: z.string().uuid(),
  title:        z.enum(['INITIATION', 'AIDA1', 'AIDA2', 'AIDA3', 'AIDA4', 'AIDA_INSTRUCTEUR']),
  location:     z.enum(['PISCINE', 'MER', 'BLUE_HOLE']),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : YYYY-MM-DD'),
  time:         z.string().regex(/^\d{2}:\d{2}$/, 'Format attendu : HH:MM'),
  message:      z.string().max(500).optional(),
})

// ---- CRÉER UNE DEMANDE (élève) ----
// POST /api/requests
router.post('/', async (req, res) => {
  try {
    // Seuls les élèves peuvent envoyer des demandes
    if (req.user.role !== 'ELEVE') {
      return res.status(403).json({ error: 'Seuls les élèves peuvent envoyer des demandes.' })
    }

    const data = createRequestSchema.parse(req.body)

    // Vérifier que l'instructeur existe bien
    const instructor = await prisma.user.findFirst({
      where: { id: data.instructorId, role: 'INSTRUCTEUR' },
      select: { id: true, name: true },
    })

    if (!instructor) {
      return res.status(404).json({ error: 'Instructeur introuvable.' })
    }

    // Vérifier qu'une demande identique n'est pas déjà en attente
    const existing = await prisma.courseRequest.findFirst({
      where: {
        studentId:    req.user.id,
        instructorId: data.instructorId,
        status:       'PENDING',
        date:         data.date,
        time:         data.time,
      },
    })

    if (existing) {
      return res.status(409).json({ error: 'Tu as déjà une demande en attente pour ce créneau.' })
    }

    const request = await prisma.courseRequest.create({
      data: {
        studentId:    req.user.id,
        instructorId: data.instructorId,
        title:        data.title,
        location:     data.location,
        date:         data.date,
        time:         data.time,
        message:      data.message,
      },
      include: {
        instructor: { select: { id: true, name: true, photoUrl: true } },
        student:    { select: { id: true, name: true, photoUrl: true } },
      },
    })

    res.status(201).json(request)
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- MES DEMANDES ENVOYÉES (élève) ----
// GET /api/requests/sent
router.get('/sent', async (req, res) => {
  try {
    const requests = await prisma.courseRequest.findMany({
      where: { studentId: req.user.id },
      include: {
        instructor: { select: { id: true, name: true, photoUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- DEMANDES REÇUES (instructeur) ----
// GET /api/requests/received
router.get('/received', async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTEUR') {
      return res.status(403).json({ error: 'Réservé aux instructeurs.' })
    }

    const requests = await prisma.courseRequest.findMany({
      where: { instructorId: req.user.id },
      include: {
        student: { select: { id: true, name: true, photoUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- BADGE NOTIFICATION : nb de demandes PENDING (instructeur) ----
// GET /api/requests/pending-count
router.get('/pending-count', async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTEUR') {
      return res.json({ count: 0 })
    }

    const count = await prisma.courseRequest.count({
      where: { instructorId: req.user.id, status: 'PENDING' },
    })

    res.json({ count })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- ACCEPTER OU REFUSER (instructeur) ----
// PATCH /api/requests/:id
router.patch('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTEUR') {
      return res.status(403).json({ error: 'Réservé aux instructeurs.' })
    }

    const { status } = req.body

    if (!['ACCEPTED', 'REFUSED'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide. Valeurs acceptées : ACCEPTED, REFUSED.' })
    }

    // Vérifier que la demande appartient bien à cet instructeur
    const request = await prisma.courseRequest.findFirst({
      where: { id: req.params.id, instructorId: req.user.id },
    })

    if (!request) {
      return res.status(404).json({ error: 'Demande introuvable.' })
    }

    if (request.status !== 'PENDING') {
      return res.status(409).json({ error: 'Cette demande a déjà été traitée.' })
    }

    const updated = await prisma.courseRequest.update({
      where: { id: req.params.id },
      data:  { status },
      include: {
        student: { select: { id: true, name: true, photoUrl: true } },
      },
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

export default router
