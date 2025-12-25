import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { registerSchema, loginSchema } from '../models/authSchema.js'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()

// Public
router.post(
  '/register',
  validate(registerSchema),
  authController.register
)

router.post(
  '/login',
  validate(loginSchema),
  authController.login
)

// Protected
router.get(
  '/profile',
  authenticate,
  authController.getProfile
)

export default router
