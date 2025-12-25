import * as registrationService from '../services/registrationService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * POST /api/tournaments/:tournamentId/register
 * Register to a tournament (SOLO or TEAM)
 */
export const create = asyncHandler(async (req, res) => {
  const tournamentId = parseInt(req.params.tournamentId)
  const registration = await registrationService.create(
    tournamentId,
    req.user,
    req.body
  )
  res.status(201).json(response.created(registration))
})

/**
 * GET /api/tournaments/:tournamentId/registrations
 * List tournament registrations
 */
export const getAll = asyncHandler(async (req, res) => {
  const tournamentId = parseInt(req.params.tournamentId)
  const registrations = await registrationService.findAll(tournamentId)
  res.json(response.success(registrations))
})

/**
 * PATCH /api/tournaments/:tournamentId/registrations/:id
 * Update registration status
 */
export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const registration = await registrationService.update(
    id,
    req.user,
    req.body
  )
  res.json(response.success(registration))
})

/**
 * DELETE /api/tournaments/:tournamentId/registrations/:id
 * Cancel registration
 */
export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await registrationService.remove(id, req.user)
  res.status(204).send()
})
