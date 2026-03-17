// ============================================================
// MIDDLEWARE D'AUTHENTIFICATION JWT
//
// Un middleware = une fonction qui s'exécute AVANT ton handler de route.
// Ici, on vérifie que le token JWT est valide avant de laisser passer.
//
// Comment ça marche :
// 1. Le client envoie : Authorization: Bearer <token>
// 2. On extrait le token
// 3. On le vérifie avec jwt.verify()
// 4. Si OK → on ajoute req.user et on passe à la suite (next())
// 5. Si KO → on renvoie une erreur 401 (non autorisé)
// ============================================================

import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  // 1. Récupérer le header Authorization
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Token manquant. Connecte-toi d\'abord.',
    })
  }

  // 2. Extraire le token (après "Bearer ")
  const token = authHeader.split(' ')[1]

  try {
    // 3. Vérifier et décoder le token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Attacher les infos de l'utilisateur à la requête
    // Maintenant dans chaque route protégée tu auras accès à req.user
    req.user = payload

    next() // Passe au prochain middleware ou à la route
  } catch (err) {
    return res.status(401).json({
      error: 'Token invalide ou expiré. Reconnecte-toi.',
    })
  }
}

// Middleware pour vérifier le rôle INSTRUCTEUR
export function requireInstructor(req, res, next) {
  if (req.user.role !== 'INSTRUCTEUR') {
    return res.status(403).json({
      error: 'Accès refusé. Cette action nécessite le rôle INSTRUCTEUR.',
    })
  }
  next()
}

// Middleware pour vérifier le rôle ELEVE
export function requireEleve(req, res, next) {
  if (req.user.role !== 'ELEVE') {
    return res.status(403).json({
      error: 'Accès refusé. Cette action est réservée aux élèves.',
    })
  }
  next()
}
