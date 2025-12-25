import { Router } from 'express'

import authRoutes from './authRoutes.js'
import tournamentRoutes from './tournamentRoutes.js'
import teamRoutes from './teamRoutes.js'
import registrationRoutes from './registrationRoutes.js'

const router = Router()

// Authentication
router.use('/auth', authRoutes)

// Tournaments
router.use('/tournaments', tournamentRoutes)

// Teams
router.use('/teams', teamRoutes)

// Registrations (nested under tournaments)
router.use('/tournaments', registrationRoutes)

export default router

