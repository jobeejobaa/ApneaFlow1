# 🌊 Apnea Flow

Plateforme fullstack de gestion de cours d'apnée, mettant en relation des **instructeurs certifiés** et des **élèves** souhaitant progresser dans la discipline.

---

## ✨ Fonctionnalités

### Pour les élèves
- Parcourir les cours disponibles avec filtres (niveau, lieu, à venir)
- S'inscrire / se désinscrire d'un cours
- Consulter les fiches des instructeurs (bio, photo, cours proposés)
- Envoyer une **demande de cours privé** à un instructeur (niveau, lieu, date, heure, message libre)
- Suivre l'état de ses demandes (en attente / acceptée / refusée)
- Visualiser ses cours dans un calendrier interactif

### Pour les instructeurs
- Créer, modifier et supprimer des cours
- Consulter la liste des élèves inscrits à chaque cours
- Recevoir et traiter les demandes de cours privés (accepter / refuser)
- Voir sur son profil : **cours à venir** avec taux de remplissage + **liste complète de ses élèves**
- Badge de notification en temps réel dans la navbar (polling toutes les 30s)

### Commun aux deux rôles
- Authentification sécurisée par JWT (inscription / connexion)
- Modification du profil : nom, bio, **photo de profil JPG** (upload sans dépendance externe)
- Interface bilingue **Français / English** avec toggle instantané
- Design glassmorphism responsive (mobile & desktop)

---

## 🛠 Stack technique

### Backend
| Outil | Version | Rôle |
|---|---|---|
| Node.js + Express | 4.18 | Serveur API REST |
| Prisma | 5.10 | ORM (requêtes BDD typées) |
| PostgreSQL | — | Base de données relationnelle |
| jsonwebtoken | 9.0 | Authentification stateless (JWT) |
| bcryptjs | 2.4 | Hachage des mots de passe |
| Zod | 3.22 | Validation des données entrantes |

### Frontend
| Outil | Version | Rôle |
|---|---|---|
| React | 18.3 | Interface utilisateur |
| React Router | 6.22 | Navigation SPA (client-side routing) |
| Vite | 5.1 | Bundler et serveur de développement |
| Tailwind CSS | 3.4 | Styles utilitaires |
| lucide-react | 0.383 | Bibliothèque d'icônes |

---

## 🗂 Structure du projet

```
apneaflowk/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Modèles BDD (User, Course, Enrollment, CourseRequest)
│   ├── src/
│   │   ├── index.js              # Point d'entrée Express + middlewares
│   │   ├── lib/prisma.js         # Client Prisma singleton
│   │   ├── middleware/auth.js    # Vérification JWT + contrôle des rôles
│   │   ├── routes/
│   │   │   ├── auth.js           # /api/auth — inscription & connexion
│   │   │   ├── users.js          # /api/users — profils & stats instructeur
│   │   │   ├── courses.js        # /api/courses — gestion des cours
│   │   │   ├── enrollments.js    # /api/enrollments — inscriptions
│   │   │   └── requests.js       # /api/requests — demandes de cours privés
│   │   └── seed.js               # Données de démo
│   └── uploads/                  # Photos de profil (gitignorées)
│
└── frontend/
    └── src/
        ├── pages/                # 9 pages React
        ├── components/           # Composants réutilisables (Navbar, Layout, UI)
        ├── context/              # AuthContext, LangContext, ToastContext
        ├── hooks/                # useAuth, useLang, useToast...
        └── services/api.js       # Fonctions centralisées d'appel API
```

---

## 🗃 Modèle de données

```
User          → id, name, email, password, role, bio, photoUrl
Course        → id, title, date, time, location, type, capacity, createdById
Enrollment    → userId ↔ courseId (unique), withEquipment
CourseRequest → studentId → instructorId, title, location, date, time, message, status
```

**Enums :**
- `Role` : `ELEVE` | `INSTRUCTEUR`
- `CourseName` : `INITIATION` | `AIDA1` | `AIDA2` | `AIDA3` | `AIDA4` | `AIDA_INSTRUCTEUR`
- `Location` : `PISCINE` | `MER` | `BLUE_HOLE`
- `CourseType` : `STATIQUE` | `DYNAMIQUE` | `PROFONDEUR` | `IMMERSION_LIBRE` | `POIDS_VARIABLE` | `NO_LIMITS`
- `RequestStatus` : `PENDING` | `ACCEPTED` | `REFUSED`

---

## 🚀 Installation & lancement

### Prérequis
- Node.js ≥ 18
- PostgreSQL (en local ou via un service cloud)

### 1. Cloner le dépôt

```bash
git clone https://github.com/jobeejobaa/ApneaFlow1.git
cd ApneaFlow1
```

### 2. Configurer l'environnement backend

```bash
cd backend
cp .env.example .env
```

Éditer le fichier `.env` :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/apnea_flow"
JWT_SECRET="une-chaine-tres-longue-et-aleatoire"
PORT=3001
```

### 3. Installer les dépendances et initialiser la base de données

```bash
# Backend
cd backend
npm install
npx prisma db push      # Crée les tables dans PostgreSQL
node src/seed.js        # Insère des données de démo (optionnel)

# Frontend
cd ../frontend
npm install
```

### 4. Lancer en développement

```bash
# Terminal 1 — API backend
cd backend && npm run dev

# Terminal 2 — Interface frontend
cd frontend && npm run dev
```

- Frontend : **http://localhost:5173**
- API : **http://localhost:3001**

---

## 📡 Référence API

### Authentification
| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Créer un compte (name, email, password, role) |
| `POST` | `/api/auth/login` | Se connecter — retourne un JWT |
| `GET` | `/api/auth/me` | Profil de l'utilisateur connecté |

### Utilisateurs
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/users/me` | Mon profil complet + inscriptions | Tous |
| `PUT` | `/api/users/me` | Modifier nom et bio | Tous |
| `POST` | `/api/users/me/photo` | Uploader une photo de profil (JPG) | Tous |
| `GET` | `/api/users/me/instructor-stats` | Cours à venir + liste des élèves | Instructeur |
| `GET` | `/api/users/instructors` | Liste de tous les instructeurs | Tous |
| `GET` | `/api/users/instructors/:id` | Fiche détaillée d'un instructeur + ses cours | Tous |

### Cours
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/courses` | Lister les cours (filtres : level, location, upcoming) | Tous |
| `GET` | `/api/courses/:id` | Détails d'un cours | Tous |
| `POST` | `/api/courses` | Créer un cours | Instructeur |
| `PUT` | `/api/courses/:id` | Modifier un cours | Instructeur (propriétaire) |
| `DELETE` | `/api/courses/:id` | Supprimer un cours | Instructeur (propriétaire) |

### Inscriptions
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/enrollments/my` | Mes inscriptions | Tous |
| `POST` | `/api/enrollments` | S'inscrire à un cours | Élève |
| `DELETE` | `/api/enrollments/:courseId` | Se désinscrire | Élève |
| `GET` | `/api/enrollments/course/:courseId` | Élèves inscrits à un cours | Instructeur |

### Demandes de cours privés
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/requests` | Envoyer une demande à un instructeur | Élève |
| `GET` | `/api/requests/sent` | Mes demandes envoyées | Élève |
| `GET` | `/api/requests/received` | Demandes reçues | Instructeur |
| `GET` | `/api/requests/pending-count` | Nombre de demandes en attente | Instructeur |
| `PATCH` | `/api/requests/:id` | Accepter ou refuser une demande | Instructeur |

---

## 🧪 Comptes de démo

Après avoir exécuté `node src/seed.js` :

| Rôle | Email | Mot de passe |
|---|---|---|
| Élève | `eleve@apnea.fr` | `password` |
| Instructeur | `instructeur@apnea.fr` | `password` |

---

## 🌍 Déploiement (Railway)

Le projet est configuré pour [Railway](https://railway.app) via `railway.toml`.

1. Créer un nouveau projet sur Railway
2. Ajouter un plugin **PostgreSQL**
3. Définir les variables d'environnement (`DATABASE_URL`, `JWT_SECRET`, `PORT`)
4. Connecter le dépôt GitHub — Railway lance le build automatiquement

---

## 📜 Scripts disponibles

```bash
# Backend
npm run dev          # Serveur de développement (nodemon)
npm start            # Serveur de production
npx prisma db push   # Synchroniser le schéma avec la BDD
npx prisma studio    # Interface graphique de la BDD

# Frontend
npm run dev          # Serveur de développement Vite
npm run build        # Build de production (génère frontend/dist/)
npm run preview      # Prévisualiser le build de production
```

---

## 📄 Licence

MIT
