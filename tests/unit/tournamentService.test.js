import * as tournamentService from '../../src/services/tournamentService.js'
import * as authService from '../../src/services/authService.js'
import { prisma } from '../setup.js'

describe('TournamentService Unit Tests', () => {
  let organizer
  let player
  let organizerUser
  let playerUser

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
    organizer = await authService.register({
      email: 'organizer@test.com',
      username: 'organizer',
      password: 'P@ssw0rd',
      role: 'ORGANIZER',
    })

    organizerUser = {
      userId: organizer.id,
      role: 'ORGANIZER',
    }

    // Create player user
    player = await authService.register({
      email: 'player@test.com',
      username: 'player',
      password: 'P@ssw0rd',
      role: 'PLAYER',
    })

    playerUser = {
      userId: player.id,
      role: 'PLAYER',
    }
  })

  describe('create', () => {
    it('should create a tournament with DRAFT status', async () => {
      const tournamentData = {
        name: 'Test Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      }

      const tournament = await tournamentService.create(organizer.id, tournamentData)

      expect(tournament).toBeTruthy()
      expect(tournament.name).toBe(tournamentData.name)
      expect(tournament.status).toBe('DRAFT')
      expect(tournament.organizerId).toBe(organizer.id)
      expect(tournament).toHaveProperty('id')
    })

    it('should create tournament with correct data', async () => {
      const tournamentData = {
        name: 'Summer Cup',
        game: 'Counter-Strike',
        format: 'TEAM',
        maxParticipants: 8,
        prizePool: 2000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      }

      const tournament = await tournamentService.create(organizer.id, tournamentData)

      expect(tournament.game).toBe(tournamentData.game)
      expect(tournament.format).toBe(tournamentData.format)
      expect(tournament.maxParticipants).toBe(tournamentData.maxParticipants)
      expect(tournament.prizePool).toBe(tournamentData.prizePool)
    })
  })

  describe('findAll', () => {
    beforeEach(async () => {
      // Create multiple tournaments
      await tournamentService.create(organizer.id, {
        name: 'Tournament 1',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })

      await tournamentService.create(organizer.id, {
        name: 'Tournament 2',
        game: 'Counter-Strike',
        format: 'TEAM',
        maxParticipants: 8,
        prizePool: 2000,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      })
    })

    it('should return all tournaments with pagination', async () => {
      const result = await tournamentService.findAll({ page: 1, limit: 10 })

      expect(result).toBeTruthy()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result.data).toBeInstanceOf(Array)
      expect(result.data.length).toBe(2)
      expect(result.total).toBe(2)
      expect(result.page).toBe(1)
    })

    it('should filter tournaments by status', async () => {
      const result = await tournamentService.findAll({ status: 'DRAFT' })

      expect(result.data).toBeInstanceOf(Array)
      expect(result.data.every(t => t.status === 'DRAFT')).toBe(true)
    })

    it('should filter tournaments by game', async () => {
      const result = await tournamentService.findAll({ game: 'Valorant' })

      expect(result.data).toBeInstanceOf(Array)
      expect(result.data.length).toBe(1)
      expect(result.data[0].game).toBe('Valorant')
    })

    it('should filter tournaments by format', async () => {
      const result = await tournamentService.findAll({ format: 'TEAM' })

      expect(result.data).toBeInstanceOf(Array)
      expect(result.data.length).toBe(1)
      expect(result.data[0].format).toBe('TEAM')
    })

    it('should respect pagination limit', async () => {
      const result = await tournamentService.findAll({ page: 1, limit: 1 })

      expect(result.data.length).toBe(1)
      expect(result.total).toBe(2)
    })
  })

  describe('findById', () => {
    let tournamentId

    beforeEach(async () => {
      const tournament = await tournamentService.create(organizer.id, {
        name: 'Find By ID Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
      tournamentId = tournament.id
    })

    it('should find tournament by id', async () => {
      const tournament = await tournamentService.findById(tournamentId)

      expect(tournament).toBeTruthy()
      expect(tournament.id).toBe(tournamentId)
      expect(tournament.name).toBe('Find By ID Tournament')
    })

    it('should throw 404 error for non-existent tournament', async () => {
      const nonExistentId = 99999

      try {
        await tournamentService.findById(nonExistentId)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Tournoi non trouvé')
        expect(error.status).toBe(404)
      }
    })
  })

  describe('update', () => {
    let tournamentId

    beforeEach(async () => {
      const tournament = await tournamentService.create(organizer.id, {
        name: 'Update Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
      tournamentId = tournament.id
    })

    it('should update tournament by organizer', async () => {
      const updateData = {
        name: 'Updated Tournament Name',
        prizePool: 2000,
      }

      const updated = await tournamentService.update(tournamentId, organizerUser, updateData)

      expect(updated).toBeTruthy()
      expect(updated.name).toBe(updateData.name)
      expect(updated.prizePool).toBe(updateData.prizePool)
    })

    it('should not allow non-organizer to update tournament', async () => {
      const updateData = {
        name: 'Hacked Name',
      }

      try {
        await tournamentService.update(tournamentId, playerUser, updateData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Accès interdit')
        expect(error.status).toBe(403)
      }
    })

    it('should not allow updating completed tournament', async () => {
      // Update tournament to COMPLETED status
      await prisma.tournament.update({
        where: { id: tournamentId },
        data: { status: 'COMPLETED' },
      })

      const updateData = {
        name: 'Should Not Update',
      }

      try {
        await tournamentService.update(tournamentId, organizerUser, updateData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Tournoi non modifiable')
        expect(error.status).toBe(409)
      }
    })
  })

  describe('updateStatus', () => {
    let tournamentId

    beforeEach(async () => {
      const tournament = await tournamentService.create(organizer.id, {
        name: 'Status Update Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
      tournamentId = tournament.id
    })

    it('should update tournament status', async () => {
      const updated = await tournamentService.updateStatus(tournamentId, organizerUser, 'OPEN')

      expect(updated).toBeTruthy()
      expect(updated.status).toBe('OPEN')
    })

    it('should not allow non-organizer to update status', async () => {
      try {
        await tournamentService.updateStatus(tournamentId, playerUser, 'OPEN')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Accès interdit')
        expect(error.status).toBe(403)
      }
    })
  })

  describe('remove', () => {
    let tournamentId

    beforeEach(async () => {
      const tournament = await tournamentService.create(organizer.id, {
        name: 'Delete Tournament',
        game: 'Valorant',
        format: 'SOLO',
        maxParticipants: 16,
        prizePool: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
      tournamentId = tournament.id
    })

    it('should delete tournament without confirmed registrations', async () => {
      await tournamentService.remove(tournamentId, organizerUser)

      // Verify tournament is deleted
      const tournaments = await prisma.tournament.findMany({
        where: { id: tournamentId },
      })
      expect(tournaments.length).toBe(0)
    })

    it('should not allow non-organizer to delete tournament', async () => {
      try {
        await tournamentService.remove(tournamentId, playerUser)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Accès interdit')
        expect(error.status).toBe(403)
      }
    })

    it('should not delete tournament with confirmed registrations', async () => {
      // Create a confirmed registration
      await prisma.registration.create({
        data: {
          tournamentId,
          playerId: player.id,
          status: 'CONFIRMED',
        },
      })

      try {
        await tournamentService.remove(tournamentId, organizerUser)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Impossible de supprimer')
        expect(error.status).toBe(409)
      }
    })
  })
})
