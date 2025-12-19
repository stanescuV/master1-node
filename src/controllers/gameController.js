import * as gameService from '../services/gameService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * GET /api/games
 * List all games with filters and pagination
 */
export const getAll = asyncHandler(async (req, res) => {
  const result = await gameService.findAll(req.query)
  res.json(response.success(result))
})

/**
 * GET /api/games/:id
 * Get a game by its ID
 */
export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const game = await gameService.findById(id)
  res.json(response.success(game))
})

/**
 * POST /api/games
 * Create a new game
 */
export const create = asyncHandler(async (req, res) => {
  const game = await gameService.create(req.body)
  res.status(201).json(response.created(game))
})

/**
 * PUT /api/games/:id
 * Update a game
 */
export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const game = await gameService.update(id, req.body)
  res.json(response.success(game))
})

/**
 * DELETE /api/games/:id
 * Delete a game
 */
export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await gameService.remove(id)
  res.status(204).send()
})
