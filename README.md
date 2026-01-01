# Guide de Test de l'API

## Démarrage Rapide

1. Installation : `npm i`
2. Commandes Prisma : `npx prisma generate` `npx prixma migrate dev` `npx prisma db seed` 
Optionnel Vérifier : `npx prisma studio`
La db devrait avoir des données à l'intérieur
3. Allumer le serveur : `npm start` j'ai créé la commande
3. Ouvrir Swagger : `http://localhost:3000/api-docs`

---

## Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@tournament.com` | `P@ssw0rd` | ADMIN |
| `organizer@tournament.com` | `P@ssw0rd` | ORGANIZER |
| `player1@tournament.com` | `P@ssw0rd` | PLAYER (Capitaine Équipe 1) |
| `player2@tournament.com` | `P@ssw0rd` | PLAYER |
| `player3@tournament.com` | `P@ssw0rd` | PLAYER (Capitaine Équipe 2) |

---

## Comment Utiliser Swagger

### 1. Obtenir un Token
- Trouver `POST /api/auth/login`
- Cliquer sur "Try it out"
- Entrer :
```json
{
  "email": "admin@tournament.com",
  "password": "P@ssw0rd"
}
```
- Cliquer sur "Execute"
- Copier la valeur `token` de la réponse

### 2. Autoriser
- Cliquer sur le bouton "Authorize" (🔒 en haut à droite)
- Coller votre token
- Cliquer sur "Authorize" → "Close"

### 3. Tester les Endpoints
- Maintenant tous les endpoints protégés fonctionnent
- Cliquer sur n'importe quel endpoint → "Try it out" → Remplir les paramètres → "Execute"

---

## Authentification

### Enregistrer un Nouvel Utilisateur
`POST /api/auth/register`
```json
{
  "email": "user@mail.com",
  "username": "username",
  "password": "P@ssw0rd",
  "role": "PLAYER"
}
```

### Connexion
`POST /api/auth/login`
```json
{
  "email": "admin@tournament.com",
  "password": "P@ssw0rd"
}
```
→ Copier le `token`

### Obtenir le Profil
`GET /api/auth/profile`
→ Nécessite une autorisation

---

## Tournois

### Lister Tous
`GET /api/tournaments`
- Filtres optionnels : `?status=OPEN&format=TEAM&page=1&limit=10`

### Obtenir par ID
`GET /api/tournaments/1`

### Créer (ORGANIZER/ADMIN)
`POST /api/tournaments`
```json
{
  "name": "Winter Cup 2026",
  "game": "Valorant",
  "format": "SOLO",
  "maxParticipants": 16,
  "prizePool": 1000,
  "startDate": "2026-06-01T18:00:00.000Z",
  "endDate": "2026-06-03T20:00:00.000Z"
}
```
→ Créé avec le statut `DRAFT`

### Mettre à Jour (Propriétaire/ADMIN)
`PUT /api/tournaments/1`
```json
{
  "name": "Updated Name",
  "game": "Valorant",
  "format": "SOLO",
  "maxParticipants": 32,
  "prizePool": 2000,
  "startDate": "2026-06-01T18:00:00.000Z"
}
```

### Mettre à Jour le Statut (Propriétaire/ADMIN)
`PATCH /api/tournaments/1/status`
```json
{
  "status": "OPEN"
}
```
Statuts : `DRAFT`, `OPEN`, `ONGOING`, `COMPLETED`, `CANCELED`

### Supprimer (Propriétaire/ADMIN)
`DELETE /api/tournaments/1`
→ Impossible de supprimer s'il y a des inscriptions CONFIRMED

---

## Équipes

### Lister Toutes
`GET /api/teams`

### Obtenir par ID
`GET /api/teams/1`

### Créer (PLAYER)
`POST /api/teams`
```json
{
  "name": "My Team",
  "tag": "MYTM"
}
```
→ Vous devenez capitaine (tag : 3-5 caractères)

### Mettre à Jour (Capitaine Seulement)
`PUT /api/teams/1`
```json
{
  "name": "Updated Team",
  "tag": "UPDT"
}
```

### Supprimer (Capitaine Seulement)
`DELETE /api/teams/1`
→ Impossible de supprimer si l'équipe a des inscriptions actives

---

## Inscriptions

### Lister pour un Tournoi
`GET /api/tournaments/1/registrations`

### S'inscrire à un Tournoi SOLO
`POST /api/tournaments/1/register`
```json
{}
```
→ Vous êtes automatiquement inscrit

### Inscrire une ÉQUIPE à un Tournoi (Capitaine Seulement)
`POST /api/tournaments/2/register`
```json
{
  "teamId": 1
}
```
→ Votre équipe est inscrite

### Confirmer une Inscription (Organizer/ADMIN)
`PATCH /api/tournaments/1/registrations/2`
```json
{
  "status": "CONFIRMED"
}
```
Statuts : `CONFIRMED`, `REJECTED`, `WITHDRAWN`

### Retirer une Inscription
`DELETE /api/tournaments/1/registrations/2`
→ Fonctionne uniquement pour les inscriptions `PENDING`

---

## Flux de Test Complet

**1. Se connecter en tant qu'organisateur**
- `POST /api/auth/login`
- Utiliser : `organizer@tournament.com` / `P@ssw0rd`
- Copier le token → Cliquer sur Authorize

**2. Créer un tournoi**
- `POST /api/tournaments`
- Définir name, game, format=SOLO, etc.
- Noter l'`id` dans la réponse

**3. Ouvrir le tournoi**
- `PATCH /api/tournaments/{id}/status`
- Définir le statut à `OPEN`

**4. Se connecter en tant que joueur**
- `POST /api/auth/login`
- Utiliser : `player1@tournament.com` / `P@ssw0rd`
- Copier le token → Cliquer sur Authorize

**5. S'inscrire au tournoi**
- `POST /api/tournaments/{id}/register`
- Body : `{}`
- Noter l'`id` de l'inscription

**6. Confirmer l'inscription**
- Se reconnecter en tant qu'organisateur
- `PATCH /api/tournaments/{tournamentId}/registrations/{id}`
- Définir le statut à `CONFIRMED`

---

## Règles d'Autorisation

| Action | Qui Peut le Faire |
|--------|-------------------|
| Créer un Tournoi | ORGANIZER, ADMIN |
| Mettre à Jour un Tournoi | Propriétaire du Tournoi, ADMIN |
| Supprimer un Tournoi | Propriétaire du Tournoi, ADMIN |
| Créer une Équipe | N'importe quel PLAYER |
| Mettre à Jour une Équipe | Capitaine de l'équipe seulement |
| Supprimer une Équipe | Capitaine de l'équipe seulement |
| Inscription SOLO | N'importe quel PLAYER |
| Inscription ÉQUIPE | Capitaine de l'équipe seulement |
| Confirmer une Inscription | Propriétaire du Tournoi, ADMIN |
| Retirer une Inscription | Propriétaire de l'inscription seulement |

---

## Codes d'Erreur

| Code | Signification |
|------|---------------|
| 400 | Mauvaise requête / Erreur de validation |
| 401 | Non authentifié / Token invalide |
| 403 | Interdit / Pas de permission |
| 404 | Non trouvé |
| 409 | Conflit / Violation de règle métier |