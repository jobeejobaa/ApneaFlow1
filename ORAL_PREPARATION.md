# 📋 Fiche de préparation à l'oral — Apnea Flow
> Bloc 01 — Développeur Web et Web Mobile
> Projet : **Apnea Flow** — Plateforme fullstack de gestion de cours d'apnée
> Stack : React 18 · Vite · Tailwind CSS · Node.js · Express · Prisma · PostgreSQL · JWT

---

## 🗂 Vue d'ensemble du projet en 30 secondes

> **À dire à l'oral :**
> *"Apnea Flow est une application web fullstack qui met en relation des instructeurs d'apnée et des élèves. Elle permet la gestion de cours, l'inscription, la visualisation en calendrier, l'envoi de demandes de cours privés entre élèves et instructeurs, et la gestion des profils avec photo. Le backend est une API REST en Node.js/Express avec une base PostgreSQL gérée par Prisma, et le frontend est une SPA React déployée avec Vite."*

---

## C1.a — Intégration HTML/CSS avec éditeur de code

### Ce que le jury attend
- Code conforme à une structure logique (maquette)
- Code commenté et indenté
- Balises sémantiques utilisées à bon escient
- Respect des normes W3C

### Ce que fait le projet

**Framework CSS : Tailwind CSS** — approche utility-first, chaque classe correspond à une propriété CSS précise.

```jsx
// Exemple : composant Button.jsx — sémantique + commentaire + classes Tailwind
export default function Button({ children, variant = 'primary', loading, ...props }) {
  return (
    <button
      className={`px-5 py-2.5 rounded-xl font-semibold transition-all
        ${variant === 'primary'
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400'
          : 'glass-card text-cyan-200 hover:bg-white/10'
        } disabled:opacity-50`}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  )
}
```

**Structure sémantique :**
- `<nav>` pour la barre de navigation
- `<main>` pour le contenu principal
- `<button>` pour toutes les actions (jamais un `<div>` cliquable)
- `<form>` avec `<label>` associés aux `<input>` via `htmlFor`
- `<h1>`, `<h2>`, `<h3>` hiérarchisés correctement dans chaque page

**Commentaires :** chaque fichier commence par un bloc de documentation :
```js
// ============================================================
// ROUTES UTILISATEURS
// GET  /api/users/me        → Mon profil
// PUT  /api/users/me        → Modifier mon profil
// POST /api/users/me/photo  → Uploader une photo de profil
// ============================================================
```

> **À dire à l'oral :**
> *"J'utilise Tailwind CSS comme framework CSS. Chaque composant est un fichier JSX isolé, commenté en tête de fichier. Les balises HTML sémantiques sont utilisées systématiquement : `<nav>`, `<main>`, `<form>`, `<button>`. Les classes CSS sont lisibles et descriptives grâce à la convention de Tailwind."*

---

## C1.b — Responsive Design (multi-résolutions)

### Ce que le jury attend
- Adaptation aux smartphones, tablettes, desktop
- Compatibilité navigateurs

### Ce que fait le projet

**Tailwind responsive prefixes** : `sm:`, `md:`, `lg:` appliqués systématiquement.

```jsx
// Navbar : menu burger sur mobile, liens horizontaux sur desktop
<div className="hidden md:flex items-center gap-6">  {/* desktop */}
  <NavLinks />
</div>
<button className="md:hidden ...">  {/* mobile uniquement */}
  <Menu />
</button>

// Grille de cours adaptative
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

**Points de rupture utilisés :**
| Breakpoint | Tailwind | Usage |
|---|---|---|
| Mobile < 640px | (défaut) | 1 colonne, menu burger |
| Tablette ≥ 640px | `sm:` | 2 colonnes |
| Desktop ≥ 1024px | `lg:` | 3 colonnes, panneau latéral |

**Menu mobile déroulant** : `Navbar.jsx` gère un état `menuOpen` qui affiche/masque le menu sur mobile avec une animation `animate-fade-in`.

> **À dire à l'oral :**
> *"Le responsive est géré nativement via les préfixes Tailwind. Sur mobile, la navbar se transforme en menu burger. Les grilles passent de 1 à 2 puis 3 colonnes selon la taille d'écran. Pas de media queries manuelles, tout est déclaratif dans les classes."*

---

## C1.c — Accessibilité

### Ce que le jury attend
- Attributs `alt` sur les images
- Navigation au clavier
- Informations non transmises par couleur seule
- Police pour dyslexiques (OpenDys)
- Attributs ARIA pour les lecteurs d'écran

### Ce que fait le projet ✅ / ⚠️

**✅ Implémenté :**

```jsx
// alt sur toutes les images
<img src={instructor.photoUrl} alt={instructor.name} className="..." />

// aria-label sur les boutons icônes
<button aria-label="Menu" onClick={() => setMenuOpen(v => !v)}>
  <Menu className="w-5 h-5" />
</button>

// Les statuts utilisent du TEXTE + couleur (pas seulement la couleur)
<span className="bg-yellow-500/20 text-yellow-300">En attente</span>
<span className="bg-green-500/20 text-green-300">Acceptée</span>
<span className="bg-red-500/20 text-red-300">Refusée</span>

// Navigation clavier : tous les éléments interactifs sont des <button> ou <a>
// → accessibles nativement avec Tab et Entrée
```

**⚠️ Points à améliorer (à mentionner honnêtement) :**
- La police **OpenDys** pour les dyslexiques n'est pas intégrée (amélioration possible via un toggle dans les paramètres)
- Les contrastes de couleur pourraient être renforcés dans certains composants sur fond foncé

> **À dire à l'oral :**
> *"J'ai veillé à ce que toutes les images aient un attribut `alt` descriptif. Les boutons sans texte ont un `aria-label`. Les informations d'état (en attente, acceptée, refusée) sont transmises par du texte ET une couleur, jamais uniquement par la couleur. La navigation au clavier est possible car j'utilise uniquement des éléments HTML natifs interactifs (`button`, `a`). Un point d'amélioration serait l'intégration de la police OpenDys."*

---

## C1.d — Architecture CSS réutilisable

### Ce que le jury attend
- Classes CSS nommées de façon pertinente
- Code organisé par thématiques
- Pas de répétitions

### Ce que fait le projet

**Classes utilitaires custom** dans `frontend/src/index.css` :

```css
/* ---- Thème : Fond océan ---- */
.ocean-bg {
  background: linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #0f172a 100%);
  min-height: 100vh;
}

/* ---- Thème : Composants glass-morphism ---- */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-panel {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* ---- Thème : Formulaires ---- */
.ocean-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
}
```

**Organisation par thématiques :**
- Fond/layout → `.ocean-bg`
- Cartes → `.glass-card`, `.glass-panel`
- Formulaires → `.ocean-input`
- Animations → `.animate-fade-in`, `.wave`
- Badges niveaux → `.badge-aida1`, `.badge-aida2`...

**Réutilisabilité** : `glass-card` est utilisé dans plus de 15 composants différents. Modifier cette seule classe change le rendu de toute l'application.

> **À dire à l'oral :**
> *"J'ai créé un système de classes custom organisées par thématiques dans index.css : les classes `glass-*` pour le design glassmorphism, `.ocean-input` pour tous les champs de formulaire, `.ocean-bg` pour le fond. Tailwind gère tout le reste. Cette approche évite les répétitions et centralise les décisions visuelles."*

---

## C1.e — Référencement naturel (SEO)

### Ce que le jury attend
- Balises meta uniques
- Hiérarchie des titres
- Navigation implémentée
- Attributs alt des images
- Favicon

### Ce que fait le projet

**`index.html`** — fichier racine de la SPA :
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Apnea Flow</title>
  <!-- favicon -->
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
</head>
```

**Navigation** : React Router v6 gère une navigation SPA sans rechargement de page.
Chaque route correspond à une URL distincte : `/`, `/dashboard`, `/courses`, `/calendar`, `/instructors`, `/requests`, `/profile`.

**Hiérarchie des titres** dans chaque page :
```jsx
<h1>Nos instructeurs</h1>          // Titre principal de page
  <h3>Cours proposés (3)</h3>      // Sous-section dans le panneau
```

**⚠️ Limite SPA à mentionner :**
*"Une SPA React a des limitations SEO natives : le contenu est rendu côté client (JavaScript). Pour une vraie indexation, il faudrait utiliser du SSR (Server-Side Rendering) avec Next.js. Dans le cadre de ce projet, c'est une architecture API + SPA, orientée application, pas un site vitrine."*

---

## C2.a — JavaScript interactif (ES6+)

### Ce que le jury attend
- Syntaxes ES6+ maîtrisées
- Manipulation du DOM
- Programmation événementielle
- Animations

### Ce que fait le projet

**Syntaxes ES6+ utilisées partout :**

```javascript
// Arrow functions
const handleSave = async (e) => { ... }

// Destructuring
const { user, logout, updateUser } = useAuth()
const { t } = useLang()

// Spread operator
const updated = { ...prev, status: 'ACCEPTED' }

// Template literals
const photoUrl = `/uploads/${filename}`

// async/await
const data = await usersAPI.getInstructors()

// Optional chaining
const count = instructor._count?.coursesCreated ?? 0

// Map (dédoublonnage des élèves)
const studentsMap = new Map()
studentsMap.set(enrollment.user.id, enrollment.user)

// Modules ES (import/export)
import { useState, useEffect, useRef } from 'react'
export default function ProfilePage() { ... }
```

**Hooks React (= programmation événementielle + gestion d'état) :**

```javascript
useState     // État local d'un composant
useEffect    // Effets de bord (fetch au montage, timer, cleanup)
useRef       // Référence directe sur un élément DOM (input file caché)
useCallback  // Mémoisation d'une fonction pour éviter les re-renders
useContext   // Consommation du contexte global (auth, lang, toast)
```

**Manipulation du DOM via React :**
```javascript
// Référence directe sur l'input file (pour le déclencher programmatiquement)
const fileInputRef = useRef(null)
fileInputRef.current?.click()  // Ouvre le sélecteur de fichier

// useEffect pour un polling (badge notification)
useEffect(() => {
  const interval = setInterval(() => {
    requestsAPI.getPendingCount().then(({ count }) => setPendingCount(count))
  }, 30_000)
  return () => clearInterval(interval)  // Cleanup au démontage
}, [user])
```

**Animations :**
- Carousel automatique toutes les 6 secondes (Landing Page) avec `setInterval`
- Transitions CSS via Tailwind (`transition-all`, `hover:scale-[1.02]`)
- Vagues animées (CSS keyframes dans `index.css`)
- `animate-fade-in` sur chaque apparition de panneau/modal

> **À dire à l'oral :**
> *"J'utilise intensivement l'ES6+ : arrow functions, destructuring, async/await, optional chaining, template literals. React est basé sur la programmation événementielle : les hooks `useState` et `useEffect` gèrent l'état et les effets. J'utilise `useRef` pour manipuler directement un élément DOM — l'input file caché que je déclenche programmatiquement."*

---

## C2.b — Validation des formulaires

### Ce que le jury attend
- Validation en temps réel côté client
- Messages d'erreur clairs
- Données validées avant envoi au serveur
- Validation côté serveur aussi

### Ce que fait le projet

**Validation frontend — exemples concrets :**

```javascript
// Upload photo : validation type + taille AVANT d'envoyer
const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file.type !== 'image/jpeg') {
    setPhotoError('Seuls les fichiers JPG/JPEG sont acceptés.')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    setPhotoError('La photo dépasse 5 Mo.')
    return
  }
  // Seulement ici on accepte le fichier
}

// Formulaire demande de cours : date minimum = demain
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
<input type="date" min={minDate} required />

// Textarea avec limite de caractères
<textarea maxLength={500} />

// Champ email avec validation HTML5 native
<input type="email" required />
```

**Validation backend — Zod (schémas typés) :**

```javascript
// Schéma de validation pour une demande de cours
const createRequestSchema = z.object({
  instructorId: z.string().uuid(),
  title:        z.enum(['INITIATION', 'AIDA1', 'AIDA2', 'AIDA3', 'AIDA4', 'AIDA_INSTRUCTEUR']),
  location:     z.enum(['PISCINE', 'MER', 'BLUE_HOLE']),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : YYYY-MM-DD'),
  time:         z.string().regex(/^\d{2}:\d{2}$/, 'Format attendu : HH:MM'),
  message:      z.string().max(500).optional(),
})

// Utilisé dans la route :
const data = createRequestSchema.parse(req.body)
// → Si invalide, Zod lance une ZodError automatiquement capturée
```

**Messages d'erreur retournés à l'utilisateur :**
```javascript
// Backend renvoie l'erreur Zod
if (err.name === 'ZodError') {
  return res.status(400).json({ error: err.errors[0].message })
}
// Frontend affiche via le système de Toast
addToast(err.message, 'error')
```

> **À dire à l'oral :**
> *"La validation est à deux niveaux. Côté client : vérification du type et du poids du fichier avant upload, date minimum sur le calendrier, champs required en HTML5. Côté serveur : Zod valide chaque champ entrant avec des schémas typés. Les erreurs remontent jusqu'au composant React via le système de Toast."*

---

## C2.c — Requêtes asynchrones (Fetch API)

### Ce que le jury attend
- Requêtes async/await fonctionnelles
- Pas de données sensibles exposées
- Réponses traitées et utilisées
- Erreurs gérées (sans crash)

### Ce que fait le projet

**Service API centralisé** (`frontend/src/services/api.js`) :

```javascript
// Fonction de base réutilisée par TOUTES les requêtes
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('apnea_token')

  const res = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  })

  const data = await res.json()

  // Gestion centralisée des erreurs HTTP
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)

  return data
}
```

**Requête asynchrone avec gestion d'erreur :**
```javascript
// Dans un composant React
useEffect(() => {
  usersAPI.getInstructors()         // Retourne une Promise
    .then(setInstructors)           // Succès → mise à jour du state
    .catch(err => setError(err.message))  // Erreur → affichage sans crash
    .finally(() => setLoading(false))     // Toujours → stop le spinner
}, [])
```

**Pas de données sensibles exposées :**
- Le **mot de passe** n'est jamais renvoyé par l'API (`password` absent de tous les `select` Prisma)
- Le **token JWT** est stocké en localStorage (côté client), jamais dans une réponse après le login
- Les **données personnelles** (email) ne sont accessibles que par l'utilisateur connecté lui-même

**Fluidité sans rechargement de page :**
Exemple : accepter une demande de cours met à jour l'état React localement sans refetch :
```javascript
const handleRespond = async (id, status) => {
  const updated = await requestsAPI.respond(id, status)
  // Mise à jour locale du state (pas de rechargement)
  setRequests(prev => prev.map(r => r.id === id ? { ...r, status: updated.status } : r))
}
```

> **À dire à l'oral :**
> *"Toutes les communications avec le serveur passent par la fonction `apiFetch` centralisée dans `api.js`. Elle gère automatiquement le token JWT, les erreurs HTTP, et le parsing JSON. Les composants utilisent async/await avec try/catch ou `.then().catch()`. La mise à jour de l'état React après une action se fait localement sans rechargement de page."*

---

## C2.d — Librairies externes

### Ce que le jury attend
- Librairies justifiées par une problématique
- Implémentation correcte
- Capacité à expliquer leur fonctionnement

### Les librairies du projet

| Librairie | Problématique résolue | Comment expliquer |
|---|---|---|
| **React 18** | Construire une UI dynamique par composants réutilisables | *"Système de rendu déclaratif : je décris ce que l'UI doit afficher selon l'état, React se charge du DOM"* |
| **React Router v6** | Navigation multi-pages sans rechargement (SPA) | *"`<Routes>` + `<Route>` définissent les URL. `useNavigate` pour la navigation programmatique"* |
| **Vite** | Bundler ultra-rapide en développement | *"Remplace Webpack. HMR instantané grâce aux modules ES natifs"* |
| **Tailwind CSS 3** | Styles utilitaires sans écrire de CSS custom | *"Classes directement dans le JSX. Pas de fichiers CSS par composant. Tree-shaking automatique"* |
| **lucide-react** | Bibliothèque d'icônes SVG optimisées | *"Import à la carte, chaque icône est un composant React"* |
| **Prisma** | ORM pour requêtes BDD type-safe | *"Schéma en `.prisma` → génère un client TypeScript. Requêtes en JavaScript, pas de SQL brut"* |
| **Zod** | Validation de schémas côté serveur | *"Déclare la forme attendue des données, parse et valide en une ligne"* |
| **jsonwebtoken** | Authentification stateless par token | *"Génère un JWT signé au login, vérifié à chaque requête protégée via le middleware"* |
| **bcryptjs** | Hachage irréversible des mots de passe | *"Jamais le mot de passe en clair en BDD. bcrypt ajoute un salt aléatoire contre les rainbow tables"* |

> **À dire à l'oral (exemple sur Prisma) :**
> *"Prisma résout le problème des requêtes SQL manuelles et des erreurs de typage. Je définis mes modèles dans un fichier `schema.prisma`, Prisma génère un client JavaScript avec l'autocomplétion complète. Une requête comme `prisma.course.findMany({ where: { date: { gte: today } } })` est lisible, sécurisée contre les injections SQL, et vérifiée au moment de l'écriture du code."*

---

## 💻 Commandes pour tester l'API en live

> **Pré-requis :** l'application doit être lancée (`npm run dev` dans backend/ et frontend/)
> **Base URL :** `http://localhost:3001`

### 0. Vérifier que l'API tourne

```bash
curl http://localhost:3001/api/health
```
**Réponse attendue :**
```json
{ "status": "ok", "message": "Apnea Flow API fonctionne !" }
```

---

### 1. Inscription d'un nouvel utilisateur

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Dupont",
    "email": "marie@test.fr",
    "password": "motdepasse123",
    "role": "ELEVE"
  }'
```

---

### 2. Connexion → récupérer le token JWT

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"eleve@apnea.fr","password":"password"}'
```
**Réponse :**
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9...", "user": { "id": "...", "role": "ELEVE" } }
```

**Stocker le token pour les requêtes suivantes :**
```bash
# Linux/Mac
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"eleve@apnea.fr","password":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo $TOKEN  # Vérifier que le token est bien récupéré
```

---

### 3. Voir son profil (requête authentifiée)

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Lister tous les cours

```bash
# Tous les cours
curl http://localhost:3001/api/courses \
  -H "Authorization: Bearer $TOKEN"

# Seulement les cours à venir
curl "http://localhost:3001/api/courses?upcoming=true" \
  -H "Authorization: Bearer $TOKEN"

# Filtrer par niveau
curl "http://localhost:3001/api/courses?level=AIDA2" \
  -H "Authorization: Bearer $TOKEN"

# Filtrer par lieu
curl "http://localhost:3001/api/courses?location=PISCINE" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. S'inscrire à un cours

```bash
# Récupérer l'ID d'un cours d'abord
COURSE_ID="id-du-cours-ici"

curl -X POST http://localhost:3001/api/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"courseId\": \"$COURSE_ID\", \"withEquipment\": true}"
```

---

### 6. Voir mes inscriptions

```bash
curl http://localhost:3001/api/enrollments/my \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7. Lister les instructeurs

```bash
curl http://localhost:3001/api/users/instructors \
  -H "Authorization: Bearer $TOKEN"
```

---

### 8. Envoyer une demande de cours privé (élève → instructeur)

```bash
# Récupérer l'ID d'un instructeur d'abord
INSTRUCTEUR_ID="id-instructeur-ici"

curl -X POST http://localhost:3001/api/requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"instructorId\": \"$INSTRUCTEUR_ID\",
    \"title\": \"AIDA2\",
    \"location\": \"PISCINE\",
    \"date\": \"2026-06-15\",
    \"time\": \"10:00\",
    \"message\": \"Bonjour, je suis débutant et souhaite progresser en AIDA2.\"
  }"
```

---

### 9. Voir mes demandes envoyées (élève)

```bash
curl http://localhost:3001/api/requests/sent \
  -H "Authorization: Bearer $TOKEN"
```

---

### 10. Se connecter en tant qu'instructeur et voir ses demandes reçues

```bash
# Connexion instructeur
TOKEN_INSTRUCT=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructeur@apnea.fr","password":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Voir les demandes reçues
curl http://localhost:3001/api/requests/received \
  -H "Authorization: Bearer $TOKEN_INSTRUCT"

# Voir le compteur de demandes en attente (badge navbar)
curl http://localhost:3001/api/requests/pending-count \
  -H "Authorization: Bearer $TOKEN_INSTRUCT"
```

---

### 11. Accepter ou refuser une demande (instructeur)

```bash
REQUEST_ID="id-de-la-demande"

# Accepter
curl -X PATCH "http://localhost:3001/api/requests/$REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN_INSTRUCT" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACCEPTED"}'

# Refuser
curl -X PATCH "http://localhost:3001/api/requests/$REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN_INSTRUCT" \
  -H "Content-Type: application/json" \
  -d '{"status": "REFUSED"}'
```

---

### 12. Test de validation — données incorrectes

```bash
# Essai avec un rôle invalide → doit retourner une erreur 400
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.fr","password":"123","role":"ADMIN"}'

# Essai sans token → doit retourner 401
curl http://localhost:3001/api/users/me

# Essai d'un élève pour créer un cours → doit retourner 403
curl -X POST http://localhost:3001/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"AIDA1","date":"2026-06-01","time":"10:00","location":"PISCINE","type":"STATIQUE","capacity":4}'
```

---

### 13. Stats instructeur (profil)

```bash
curl http://localhost:3001/api/users/me/instructor-stats \
  -H "Authorization: Bearer $TOKEN_INSTRUCT"
```

---

### 14. Modifier son profil

```bash
curl -X PUT http://localhost:3001/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Marie Martin", "bio": "Passionnée d'\''apnée depuis 5 ans."}'
```

---

## 🎯 Questions pièges & réponses préparées

**Q : Pourquoi React plutôt que du JavaScript vanilla ?**
> *"React me permet de découper l'interface en composants réutilisables avec leur propre état. Sans React, gérer dynamiquement une liste de cours avec filtres, un système de notifications et plusieurs contextes (auth, langue, toast) en vanilla JS serait complexe et difficile à maintenir."*

**Q : Comment fonctionne l'authentification JWT ?**
> *"Au login, le serveur génère un token JWT signé avec une clé secrète. Ce token contient l'ID, l'email et le rôle de l'utilisateur. À chaque requête protégée, le client envoie ce token dans le header `Authorization: Bearer`. Le middleware vérifie la signature et injecte l'utilisateur dans `req.user`."*

**Q : Pourquoi Prisma plutôt que des requêtes SQL directes ?**
> *"Prisma offre l'autocomplétion, la validation des types au moment du développement, et protège contre les injections SQL. Le schéma `.prisma` est la source de vérité unique pour la BDD. `prisma db push` synchronise automatiquement."*

**Q : C'est quoi le glassmorphism ?**
> *"C'est un effet visuel qui simule du verre dépoli : fond semi-transparent + `backdrop-filter: blur()`. J'ai créé des classes réutilisables `.glass-card` et `.glass-panel` qui appliquent cet effet sur tout le projet."*

**Q : Comment gères-tu les erreurs API ?**
> *"Deux niveaux : côté serveur, chaque route a un bloc try/catch qui retourne une réponse JSON avec le bon code HTTP. Côté client, `apiFetch` lance une exception si `res.ok` est faux. Les composants attrapent cette exception et affichent un message via le système de Toast."*

**Q : Pourquoi base64 pour les photos au lieu de FormData/multer ?**
> *"npm était restreint dans mon environnement, je ne pouvais pas installer multer. J'ai contourné en convertissant l'image en base64 côté client via l'API native `FileReader`, puis en l'envoyant comme du JSON classique. Le serveur décode le base64 et écrit le fichier avec le module `fs` natif de Node.js."*

---

## 📊 Récapitulatif des critères couverts

| Critère | Couvert | Points forts à mentionner |
|---|---|---|
| C1.a HTML/CSS | ✅ | Tailwind, balises sémantiques, composants commentés |
| C1.b Responsive | ✅ | Préfixes `sm:` `md:` `lg:`, menu burger mobile |
| C1.c Accessibilité | ⚠️ | `alt`, `aria-label`, texte + couleur — OpenDys manquant |
| C1.d Architecture CSS | ✅ | Classes `.glass-*`, `.ocean-*` réutilisables et thématisées |
| C1.e SEO | ⚠️ | Meta tags, React Router, limite SPA à expliquer |
| C2.a JavaScript ES6+ | ✅ | Hooks, async/await, Map, destructuring, events |
| C2.b Validation | ✅ | Frontend (type/taille/required) + Backend Zod |
| C2.c Async/Fetch | ✅ | `apiFetch` centralisé, try/catch, pas de données sensibles |
| C2.d Librairies | ✅ | 9 librairies justifiées et explicables |
