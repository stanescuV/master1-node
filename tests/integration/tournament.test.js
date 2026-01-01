import request from 'supertest'
import app from '../../src/app.js'
import { prisma } from '../setup.js'

describe('Tournament Integration Tests', () => {
  let organizerToken
  let playerToken
  let organizerId
  let playerId

  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Clean all tables before each test
    await prisma.registration.deleteMany()
    await prisma.tournament.deleteMany()
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()

    // Create organizer user
    const organizerData = {
      email: 'organizer@test.com',
      username: 'organizer',
      password: 'P@ssw0rd',
      role: 'ORGANIZER',
    }

    const organizerRegister = await request(app)
      .post('/api/auth/register')
      .send(organizerData)

    organizerId = organizerRegister.body.data.id

    const organizerLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: organizerData.email,
        password: organizerData.password,
      })

    organizerToken = organizerLogin.body.data.token

    // Create player user
    const playerData = {
      email: 'player@test.com',
      username: 'player',
      password: 'P@ssw0rd',
      role: 'PLAYER',
    }

    const playerRegister = await request(app)
      .post('/api/auth/register')
      .send(playerData)

    playerId = playerRegister.body.data.id

    const playerLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: playerData.email,
        password: playerData.password,
      })

    playerToken = playerLogin.body.data.token
  })

  describe('Tournament Creation and Management', () => {
    it('should create a tournament as organizer', async () => {
      const tournamentData = {
        name: 'Summer Championship',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send(tournamentData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data.name).toBe(tournamentData.name)
      expect(response.body.data.status).toBe('DRAFT')
      expect(response.body.data.organizerId).toBe(organizerId)

      // Verify in database
      const tournament = await prisma.tournament.findUnique({
        where: { id: response.body.data.id },
      })
      expect(tournament).toBeTruthy()
      expect(tournament.name).toBe(tournamentData.name)
    })

    it('should not allow player to create tournament', async () => {
      const tournamentData = {
        name: 'Test Tournament',
        game: 'Counter-Strike',
        format: 'TEAM',
        maxParticipants: 8,
        prizePool: 500,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${playerToken}`)
        .send(tournamentData)
        .expect(403)

      expect(response.body.error).toBeTruthy()
    })
  })

  describe('Tournament Registration Flow', () => {
    it('should complete full tournament registration flow', async () => {
      // Step 1: Create tournament
      const tournamentData = {
        name: 'Registration Test Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const createResponse = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send(tournamentData)
        .expect(201)

      const tournamentId = createResponse.body.data.id

      // Step 2: Update tournament status to OPEN
      const updateStatusResponse = await request(app)
        .patch(`/api/tournaments/${tournamentId}/status`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ status: 'OPEN' })
        .expect(200)

      expect(updateStatusResponse.body.data.status).toBe('OPEN')

      // Step 3: Player registers to tournament
      const registerResponse = await request(app)
        .post(`/api/tournaments/${tournamentId}/register`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send({})
        .expect(201)

      expect(registerResponse.body.success).toBe(true)
      expect(registerResponse.body.data.status).toBe('PENDING')
      expect(registerResponse.body.data.playerId).toBe(playerId)
      expect(registerResponse.body.data.tournamentId).toBe(tournamentId)

      const registrationId = registerResponse.body.data.id

      // Step 4: Organizer confirms registration
      const confirmResponse = await request(app)
        .patch(`/api/tournaments/${tournamentId}/registrations/${registrationId}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ status: 'CONFIRMED' })
        .expect(200)

      expect(confirmResponse.body.success).toBe(true)
      expect(confirmResponse.body.data.status).toBe('CONFIRMED')
      expect(confirmResponse.body.data.confirmedAt).toBeTruthy()

      // Step 5: Verify registration in database
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
      })
      expect(registration).toBeTruthy()
      expect(registration.status).toBe('CONFIRMED')
      expect(registration.confirmedAt).toBeTruthy()
    })

    it('should get all registrations for a tournament', async () => {
      // Create and open tournament
      const tournamentData = {
        name: 'List Registrations Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const createResponse = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send(tournamentData)

      const tournamentId = createResponse.body.data.id

      await request(app)
        .patch(`/api/tournaments/${tournamentId}/status`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ status: 'OPEN' })

      // Register player
      await request(app)
        .post(`/api/tournaments/${tournamentId}/register`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send({})

      // Get all registrations
      const response = await request(app)
        .get(`/api/tournaments/${tournamentId}/registrations`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].playerId).toBe(playerId)
    })
  })

  describe('Tournament Listing and Filtering', () => {
    it('should list all tournaments with pagination', async () => {
      // Create multiple tournaments
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post('/api/tournaments')
          .set('Authorization', `Bearer ${organizerToken}`)
          .send({
            name: `Tournament ${i}`,
            game: 'Valorant',
            format: 'SOLO',
            maxParticipants: 16,
            prizePool: 1000 * i,
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          })
      }

      const response = await request(app)
        .get('/api/tournaments?page=1&limit=10')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.data).toBeInstanceOf(Array)
      expect(response.body.data.data.length).toBe(3)
      expect(response.body.data.total).toBe(3)
      expect(response.body.data.page).toBe(1)
    })

    it('should filter tournaments by status', async () => {
      // Create draft tournament
      await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          name: 'Draft Tournament',
          game: 'Valorant',
          format: 'SOLO',
          maxParticipants: 16,
          prizePool: 1000,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        })

      const response = await request(app)
        .get('/api/tournaments?status=DRAFT')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.data).toBeInstanceOf(Array)
      expect(response.body.data.data.every(t => t.status === 'DRAFT')).toBe(true)
    })
  })
})
