# API Testing Guide

## Quick Start

1. Start server: `npm start`
2. Seed database: `node prisma/seed.js`
3. Open Swagger: `http://localhost:3000/api-docs`

---

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@tournament.com` | `P@ssw0rd` | ADMIN |
| `organizer@tournament.com` | `P@ssw0rd` | ORGANIZER |
| `player1@tournament.com` | `P@ssw0rd` | PLAYER (Captain Team 1) |
| `player2@tournament.com` | `P@ssw0rd` | PLAYER |
| `player3@tournament.com` | `P@ssw0rd` | PLAYER (Captain Team 2) |

---

## How to Use Swagger

### 1. Get a Token
- Find `POST /api/auth/login`
- Click "Try it out"
- Enter:
```json
{
  "email": "admin@tournament.com",
  "password": "P@ssw0rd"
}
```
- Click "Execute"
- Copy the `token` value from response

### 2. Authorize
- Click the "Authorize" button (🔒 top right)
- Paste your token
- Click "Authorize" → "Close"

### 3. Test Endpoints
- Now all protected endpoints work
- Click any endpoint → "Try it out" → Fill params → "Execute"

---

## Authentication

### Register New User
`POST /api/auth/register`
```json
{
  "email": "user@mail.com",
  "username": "username",
  "password": "P@ssw0rd",
  "role": "PLAYER"
}
```

### Login
`POST /api/auth/login`
```json
{
  "email": "admin@tournament.com",
  "password": "P@ssw0rd"
}
```
→ Copy the `token`

### Get Profile
`GET /api/auth/profile`
→ Requires authorization

---

## Tournaments

### List All
`GET /api/tournaments`
- Optional filters: `?status=OPEN&format=TEAM&page=1&limit=10`

### Get by ID
`GET /api/tournaments/1`

### Create (ORGANIZER/ADMIN)
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
→ Created with status `DRAFT`

### Update (Owner/ADMIN)
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

### Update Status (Owner/ADMIN)
`PATCH /api/tournaments/1/status`
```json
{
  "status": "OPEN"
}
```
Statuses: `DRAFT`, `OPEN`, `ONGOING`, `COMPLETED`, `CANCELED`

### Delete (Owner/ADMIN)
`DELETE /api/tournaments/1`
→ Can't delete if has CONFIRMED registrations

---

## Teams

### List All
`GET /api/teams`

### Get by ID
`GET /api/teams/1`

### Create (PLAYER)
`POST /api/teams`
```json
{
  "name": "My Team",
  "tag": "MYTM"
}
```
→ You become captain (tag: 3-5 chars)

### Update (Captain Only)
`PUT /api/teams/1`
```json
{
  "name": "Updated Team",
  "tag": "UPDT"
}
```

### Delete (Captain Only)
`DELETE /api/teams/1`
→ Can't delete if team has active registrations

---

## Registrations

### List for Tournament
`GET /api/tournaments/1/registrations`

### Register for SOLO Tournament
`POST /api/tournaments/1/register`
```json
{}
```
→ You're auto-registered

### Register TEAM for Tournament (Captain Only)
`POST /api/tournaments/2/register`
```json
{
  "teamId": 1
}
```
→ Your team is registered

### Confirm Registration (Organizer/ADMIN)
`PATCH /api/tournaments/1/registrations/2`
```json
{
  "status": "CONFIRMED"
}
```
Statuses: `CONFIRMED`, `REJECTED`, `WITHDRAWN`

### Withdraw Registration
`DELETE /api/tournaments/1/registrations/2`
→ Only works for `PENDING` registrations

---

## Complete Test Flow

**1. Login as organizer**
- `POST /api/auth/login`
- Use: `organizer@tournament.com` / `P@ssw0rd`
- Copy token → Click Authorize

**2. Create tournament**
- `POST /api/tournaments`
- Set name, game, format=SOLO, etc.
- Note the `id` in response

**3. Open tournament**
- `PATCH /api/tournaments/{id}/status`
- Set status to `OPEN`

**4. Login as player**
- `POST /api/auth/login`
- Use: `player1@tournament.com` / `P@ssw0rd`
- Copy token → Click Authorize

**5. Register for tournament**
- `POST /api/tournaments/{id}/register`
- Body: `{}`
- Note the registration `id`

**6. Confirm registration**
- Login as organizer again
- `PATCH /api/tournaments/{tournamentId}/registrations/{id}`
- Set status to `CONFIRMED`

---

## Authorization Rules

| Action | Who Can Do It |
|--------|---------------|
| Create Tournament | ORGANIZER, ADMIN |
| Update Tournament | Tournament Owner, ADMIN |
| Delete Tournament | Tournament Owner, ADMIN |
| Create Team | Any PLAYER |
| Update Team | Team Captain only |
| Delete Team | Team Captain only |
| Register SOLO | Any PLAYER |
| Register TEAM | Team Captain only |
| Confirm Registration | Tournament Owner, ADMIN |
| Withdraw Registration | Registration Owner only |

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / Validation error |
| 401 | Not authenticated / Invalid token |
| 403 | Forbidden / No permission |
| 404 | Not found |
| 409 | Conflict / Business rule violation |