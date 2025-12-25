import * as teamService from '../services/teamService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * GET /api/teams
 * List all teams
 */
export const getAll = asyncHandler(async (req, res) => {
  const teams = await teamService.findAll()
  res.json(response.success(teams))
})

/**
 * GET /api/teams/:id
 * Get team by ID
 */
export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const team = await teamService.findById(id)
  res.json(response.success(team))
})

/**
 * POST /api/teams
 * Create a team (authenticated user becomes captain)
 */
export const create = asyncHandler(async (req, res) => {
  const team = await teamService.create(req.user.userId, req.body)
  res.status(201).json(response.created(team))
})

/**
 * PUT /api/teams/:id
 * Update a team (captain only)
 */
export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const team = await teamService.update(id, req.user.userId, req.body)
  res.json(response.success(team))
})

/**
 * DELETE /api/teams/:id
 * Delete a team (captain only)
 */
export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await teamService.remove(id, req.user.userId)
  res.status(204).send()
})
