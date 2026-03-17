// ============================================================
// ROUTES D'AUTHENTIFICATION
//
// POST /api/auth/register → Créer un compte
// POST /api/auth/login    → Se connecter et recevoir un JWT
// GET  /api/auth/me       → Récupérer son profil (token requis)
// ============================================================

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// ---- SCHÉMAS DE VALIDATION ZOD ----
// Zod vérifie que les données reçues sont correctes avant de toucher la BDD

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
  role: z.enum(['ELEVE', 'INSTRUCTEUR']).optional().default('ELEVE'),
})

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

// ---- REGISTER ----
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // 1. Valider les données avec Zod
    const data = registerSchema.parse(req.body)

    // 2. Vérifier que l'email n'est pas déjà pris
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' })
    }

    // 3. Hasher le mot de passe (JAMAIS stocker en clair !)
    // bcrypt.hash(password, saltRounds) — 12 rounds = bon équilibre sécurité/perfo
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // 4. Créer l'utilisateur en BDD
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
      // select = choisir quels champs retourner (ne jamais renvoyer le mot de passe !)
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        photoUrl: true,
        createdAt: true,
      },
    })

    // 5. Générer un JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Le token expire dans 7 jours
    )

    res.status(201).json({ user, token })
  } catch (err) {
    // Zod envoie une ZodError si la validation échoue
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- LOGIN ----
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // 1. Valider
    const data = loginSchema.parse(req.body)

    // 2. Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (!user) {
      // Même message pour email introuvable et mauvais mdp → sécurité
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' })
    }

    // 3. Comparer le mot de passe avec le hash
    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' })
    }

    // 4. Générer le JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. Retourner user (sans le password) + token
    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword, token })
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message })
    }
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

// ---- ME ----
// GET /api/auth/me — Récupérer son propre profil (route protégée)
router.get('/me', authenticate, async (req, res) => {
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
        // On compte aussi les stats
        _count: {
          select: {
            enrollments: true,
            coursesCreated: true,
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur.' })
  }
})

export default router
