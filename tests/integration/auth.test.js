import request from 'supertest'
import app from '../../src/app.js'
import { prisma } from '../setup.js'

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Clean all tables before each test (order matters for foreign keys)
    await prisma.registration.deleteMany()
    await prisma.tournament.deleteMany()
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data.email).toBe(newUser.email)
      expect(response.body.data.username).toBe(newUser.username)
      expect(response.body.data.role).toBe(newUser.role)
      expect(response.body.data).not.toHaveProperty('password')

      // Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { email: newUser.email },
      })
      expect(user).toBeTruthy()
      expect(user.email).toBe(newUser.email)
    })

    it('should not register user with duplicate email', async () => {
      const user = {
        email: 'duplicate@example.com',
        username: 'user1',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      // Create first user
      await request(app).post('/api/auth/register').send(user).expect(201)

      // Try to create second user with same email
      const duplicateUser = {
        ...user,
        username: 'user2',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('email')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return token', async () => {
      // First register a user
      const userData = {
        email: 'logintest@example.com',
        username: 'loginuser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      await request(app).post('/api/auth/register').send(userData)

      // Now login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBeTruthy()
    })
  })

  describe('GET /api/auth/profile', () => {
    it('should get profile with valid token', async () => {
      // Register and login
      const userData = {
        email: 'profile@example.com',
        username: 'profileuser',
        password: 'P@ssw0rd',
        role: 'PLAYER',
      }

      await request(app).post('/api/auth/register').send(userData)

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })

      const token = loginResponse.body.data.token

      // Get profile
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.email).toBe(userData.email)
      expect(response.body.data.username).toBe(userData.username)
      expect(response.body.data).not.toHaveProperty('password')
    })

    it('should not get profile without token', async () => {
      const response = await request(app).get('/api/auth/profile').expect(401)

      expect(response.body.error).toBeTruthy()
    })
  })
})
