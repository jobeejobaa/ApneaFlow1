# 🌊 Apnea Flow — Application de gestion de cours d'apnée

Projet fullstack : **Node.js + Express + Prisma + PostgreSQL + JWT + Zod**

---

## 🏗️ Architecture du projet

```
apnea-flow/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        ← Modèles de BDD (User, Course, Enrollment)
│   ├── src/
│   │   ├── index.js             ← Serveur Express (point d'entrée)
│   │   ├── lib/
│   │   │   └── prisma.js        ← Client Prisma (singleton)
│   │   ├── middleware/
│   │   │   └── auth.js          ← Vérification JWT + rôles
│   │   ├── routes/
│   │   │   ├── auth.js          ← /api/auth (login, register, me)
│   │   │   ├── courses.js       ← /api/courses (CRUD cours)
│   │   │   ├── enrollments.js   ← /api/enrollments (inscriptions)
│   │   │   └── users.js         ← /api/users (profil)
│   │   └── seed.js              ← Données de démo
│   ├── .env                     ← Variables d'environnement (NE PAS COMMITER)
│   └── package.json
└── frontend/
    └── index.html               ← App frontend (HTML/CSS/JS vanilla)
```

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL installé et en cours d'exécution

### Étape 1 — Configurer la base de données

Dans le fichier `backend/.env`, adapte l'URL de connexion :
```
DATABASE_URL="postgresql://TON_USER:TON_MOT_DE_PASSE@localhost:5432/apnea_flow"
```

Si ton user PostgreSQL est `postgres` sans mot de passe :
```
DATABASE_URL="postgresql://postgres@localhost:5432/apnea_flow"
```

### Étape 2 — Installer et initialiser

```bash
cd backend
npm install
npx prisma db push    # Crée les tables dans PostgreSQL
node src/seed.js      # Insère les données de démo
```

### Étape 3 — Lancer le backend

```bash
npm run dev
# Serveur disponible sur http://localhost:3001
```

### Étape 4 — Ouvrir le frontend

Ouvre simplement `frontend/index.html` dans ton navigateur.

> 💡 Pour éviter les problèmes CORS en dev, utilise l'extension "Live Server" dans VS Code (clic droit → Open with Live Server).

---

## 🔑 Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Élève | eleve@apnea.fr | password |
| Instructeur | instructeur@apnea.fr | password |

---

## 📡 Routes API

### Auth
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | /api/auth/register | Créer un compte |
| POST | /api/auth/login | Se connecter |
| GET | /api/auth/me | Mon profil (🔒 JWT) |

### Cours
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /api/courses | Liste des cours |
| GET | /api/courses/:id | Un cours |
| POST | /api/courses | Créer un cours (🔒 Instructeur) |
| PUT | /api/courses/:id | Modifier (🔒 Instructeur) |
| DELETE | /api/courses/:id | Supprimer (🔒 Instructeur) |

### Inscriptions
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /api/enrollments/my | Mes inscriptions (🔒 JWT) |
| POST | /api/enrollments | S'inscrire (🔒 Élève) |
| DELETE | /api/enrollments/:courseId | Se désinscrire (🔒 Élève) |

### Utilisateurs
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /api/users/me | Mon profil complet (🔒 JWT) |
| PUT | /api/users/me | Modifier mon profil (🔒 JWT) |
| GET | /api/users | Liste users (🔒 Instructeur) |

---

## 🧠 Concepts clés à retenir

**JWT (JSON Web Token)**
Après connexion, le serveur génère un token signé contenant `{ id, email, role }`.
Le client l'envoie dans chaque requête : `Authorization: Bearer <token>`.

**Prisma**
ORM qui génère du TypeScript/JS typé à partir du schéma. `prisma.user.findUnique()` = SELECT.

**Zod**
Bibliothèque de validation. Définit la "forme" attendue des données avant de les traiter.

**bcrypt**
Transforme un mot de passe en hash irréversible. On ne stocke jamais le mot de passe en clair.

**Middleware Express**
Fonction `(req, res, next)` qui s'exécute avant le handler. Le middleware `authenticate` vérifie le JWT.
