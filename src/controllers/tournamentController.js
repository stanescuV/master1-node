import * as tournamentService from '../services/tournamentService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * GET /api/tournaments
 * List tournaments with filters & pagination
 */
export const getAll = asyncHandler(async (req, res) => {
  const result = await tournamentService.findAll(req.query)
  res.json(response.success(result))
})

/**
 * GET /api/tournaments/:id
 * Get tournament by ID
 */
export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const tournament = await tournamentService.findById(id)
  res.json(response.success(tournament))
})

/**
 * POST /api/tournaments
 * Create a tournament (ORGANIZER / ADMIN)
 */
export const create = asyncHandler(async (req, res) => {
  const tournament = await tournamentService.create(req.user.userId, req.body)
  res.status(201).json(response.created(tournament))
})

/**
 * PUT /api/tournaments/:id
 * Update a tournament
 */
export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const tournament = await tournamentService.update(id, req.user.userId, req.body)
  res.json(response.success(tournament))
})

/**
 * DELETE /api/tournaments/:id
 * Delete a tournament
 */
export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await tournamentService.remove(id, req.user.userId)
  res.status(204).send()
})

/**
 * PATCH /api/tournaments/:id/status
 * Update tournament status
 */
export const updateStatus = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const tournament = await tournamentService.updateStatus(
    id,
    req.user,
    req.body.status
  )
  res.json(response.success(tournament))
})
