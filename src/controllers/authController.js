import * as authService from '../services/authService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body)
  res.status(201).json(response.created(user))
})

/**
 * POST /api/auth/login
 * Login and get JWT token
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  res.json(response.success(result))
})

/**
 * GET /api/auth/profile
 * Get authenticated user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.userId)
  res.json(response.success(user))
})
