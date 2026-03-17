// ============================================================
// SEED — Données de test
//
// Ce script peuple la base de données avec des données de démo.
// Lance-le avec : node src/seed.js
// ============================================================

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌊 Début du seed...')

  // Nettoyer la base avant de re-seeder
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // ---- CRÉER LES UTILISATEURS ----
  const hashedPassword = await bcrypt.hash('password', 12)

  const eleve = await prisma.user.create({
    data: {
      name: 'Thomas Martin',
      email: 'eleve@apnea.fr',
      password: hashedPassword,
      role: 'ELEVE',
      bio: 'Passionné d\'apnée depuis 2 ans, je prépare mon AIDA 3.',
    },
  })

  const instructeur = await prisma.user.create({
    data: {
      name: 'Marie Dubois',
      email: 'instructeur@apnea.fr',
      password: hashedPassword,
      role: 'INSTRUCTEUR',
      bio: 'Instructrice AIDA 4 certifiée. 10 ans d\'expérience en apnée.',
    },
  })

  console.log('✅ Utilisateurs créés')
  console.log('   Élève     :', eleve.email, '/ password: password')
  console.log('   Instructeur:', instructeur.email, '/ password: password')

  // ---- CRÉER LES COURS ----
  const today = new Date()
  const addDays = (d, n) => {
    const date = new Date(d)
    date.setDate(date.getDate() + n)
    return date.toISOString().split('T')[0]
  }

  const courses = await prisma.course.createMany({
    data: [
      {
        title: 'INITIATION',
        descriptionFr: 'Première approche de l\'apnée, technique de respiration et relaxation. Idéal pour les débutants curieux de l\'apnée.',
        descriptionEn: 'First introduction to freediving, breathing techniques and relaxation. Perfect for beginners curious about freediving.',
        date: addDays(today, 7),
        time: '10:00',
        location: 'PISCINE',
        type: 'STATIQUE',
        capacity: 4,
        createdById: instructeur.id,
      },
      {
        title: 'AIDA2',
        descriptionFr: 'Perfectionnement technique, travail sur la descente libre et la fréquence cardiaque. Prérequis : AIDA 1 validé.',
        descriptionEn: 'Technical improvement, free descent work and heart rate management. Prerequisite: AIDA 1 certified.',
        date: addDays(today, 9),
        time: '14:00',
        location: 'MER',
        type: 'PROFONDEUR_PALMES_OU_SANS_PALMES',
        capacity: 4,
        createdById: instructeur.id,
      },
      {
        title: 'AIDA3',
        descriptionFr: 'Session de statique avancée et CO2 tables. Travail sur la gestion du manque d\'O2.',
        descriptionEn: 'Advanced static apnea session and CO2 tables. Focus on managing oxygen depletion.',
        date: addDays(today, 12),
        time: '09:00',
        location: 'PISCINE',
        type: 'DYNAMIQUE_PALMES_OU_SANS_PALMES',
        capacity: 4,
        createdById: instructeur.id,
      },
      {
        title: 'AIDA4',
        descriptionFr: 'Deep dive au Blue Hole. Techniques de poids variable et immersion libre. Expérience certifiée AIDA 3 requise.',
        descriptionEn: 'Deep dive at the Blue Hole. Variable weight and free immersion techniques. AIDA 3 certification required.',
        date: addDays(today, 15),
        time: '08:00',
        location: 'BLUE_HOLE',
        type: 'POIDS_VARIABLE',
        capacity: 4,
        createdById: instructeur.id,
      },
    ],
  })

  console.log('✅ Cours créés :', courses.count)

  // Récupérer les cours pour les inscriptions
  const allCourses = await prisma.course.findMany()
  const courseAida2 = allCourses.find(c => c.title === 'AIDA2')

  // ---- CRÉER UNE INSCRIPTION DE DÉMO ----
  await prisma.enrollment.create({
    data: {
      userId: eleve.id,
      courseId: courseAida2.id,
      withEquipment: true,
    },
  })

  console.log('✅ Inscription de démo créée')
  console.log('\n🚀 Seed terminé ! Lance le serveur avec : npm run dev\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
