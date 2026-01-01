import * as authService from '../../src/services/authService.js'
import { prisma } from '../setup.js'

describe('AuthService Unit Tests', () => {
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
  })

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'testPassword123'
      const hashedPassword = await authService.hashPassword(password)

      expect(hashedPassword).toBeTruthy()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(0)
    })

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123'
      const hash1 = await authService.hashPassword(password)
      const hash2 = await authService.hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123'
      const hashedPassword = await authService.hashPassword(password)

      const isMatch = await authService.comparePassword(password, hashedPassword)

      expect(isMatch).toBe(true)
    })

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword456'
      const hashedPassword = await authService.hashPassword(password)

      const isMatch = await authService.comparePassword(wrongPassword, hashedPassword)

      expect(isMatch).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'PLAYER',
      }

      const token = authService.generateToken(user)

      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should generate different tokens for different users', () => {
      const user1 = { id: 1, email: 'user1@example.com', role: 'PLAYER' }
      const user2 = { id: 2, email: 'user2@example.com', role: 'ADMIN' }

      const token1 = authService.generateToken(user1)
      const token2 = authService.generateToken(user2)

      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'PLAYER',
      }

      const token = authService.generateToken(user)
      const decoded = authService.verifyToken(token)

      expect(decoded).toBeTruthy()
      expect(decoded.userId).toBe(user.id)
      expect(decoded.role).toBe(user.role)
    })

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here'

      expect(() => authService.verifyToken(invalidToken)).toThrow()
    })
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      const user = await authService.register(userData)

      expect(user).toBeTruthy()
      expect(user.email).toBe(userData.email)
      expect(user.username).toBe(userData.username)
      expect(user.role).toBe(userData.role)
      expect(user).not.toHaveProperty('password') // Password should be excluded

      // Verify user exists in database
      const dbUser = await prisma.user.findUnique({
        where: { email: userData.email },
      })
      expect(dbUser).toBeTruthy()
    })

    it('should throw error when email already exists', async () => {
      const userData = {
        email: 'duplicate@example.com',
        username: 'user1',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      // Create first user
      await authService.register(userData)

      // Try to create second user with same email
      const duplicateData = {
        ...userData,
        username: 'user2',
      }

      await expect(authService.register(duplicateData)).rejects.toThrow('email')
    })

    it('should throw error when username already exists', async () => {
      const userData = {
        email: 'user1@example.com',
        username: 'duplicate',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      // Create first user
      await authService.register(userData)

      // Try to create second user with same username
      const duplicateData = {
        email: 'user2@example.com',
        username: 'duplicate',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      await expect(authService.register(duplicateData)).rejects.toThrow()
    })

    it('should hash password before storing', async () => {
      const userData = {
        email: 'hashtest@example.com',
        username: 'hashuser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      await authService.register(userData)

      const dbUser = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      expect(dbUser.password).not.toBe(userData.password)
      expect(dbUser.password).toBeTruthy()
    })
  })

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await authService.register({
        email: 'logintest@example.com',
        username: 'loginuser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      })
    })

    it('should login with valid credentials', async () => {
      const result = await authService.login('logintest@example.com', 'P@ssw0rd')

      expect(result).toBeTruthy()
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
      expect(result.user.email).toBe('logintest@example.com')
      expect(result.user).not.toHaveProperty('password')
      expect(typeof result.token).toBe('string')
    })

    it('should throw error with invalid email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'P@ssw0rd')
      ).rejects.toThrow('Email ou mot de passe incorrect')
    })

    it('should throw error with invalid password', async () => {
      await expect(
        authService.login('logintest@example.com', 'WrongPassword')
      ).rejects.toThrow('Email ou mot de passe incorrect')
    })
  })

  describe('getUserById', () => {
    let userId

    beforeEach(async () => {
      const user = await authService.register({
        email: 'getbyid@example.com',
        username: 'getbyiduser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      })
      userId = user.id
    })

    it('should get user by id successfully', async () => {
      const user = await authService.getUserById(userId)

      expect(user).toBeTruthy()
      expect(user.id).toBe(userId)
      expect(user.email).toBe('getbyid@example.com')
      expect(user).not.toHaveProperty('password')
    })

    it('should throw 404 error for non-existent user', async () => {
      const nonExistentId = 99999

      try {
        await authService.getUserById(nonExistentId)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Utilisateur non trouvé')
        expect(error.status).toBe(404)
      }
    })
  })
})
