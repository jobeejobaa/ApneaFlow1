// ============================================================
// CLIENT PRISMA — Singleton
// On crée une seule instance de PrismaClient pour toute l'app.
// Pourquoi ? Éviter d'ouvrir trop de connexions à la base.
// ============================================================

import { PrismaClient } from '@prisma/client'

// En développement, on garde l'instance dans le scope global
// pour éviter de recréer le client à chaque hot-reload de nodemon
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'], // Affiche les requêtes SQL dans la console (utile pour apprendre !)
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
