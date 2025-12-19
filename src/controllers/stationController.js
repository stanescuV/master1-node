import * as stationService from '../services/stationService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * GET /api/stations
 * List all stations with filters and pagination
 */
export const getAll = asyncHandler(async (req, res) => {
  const result = await stationService.findAll(req.query)
  res.json(response.success(result))
})

/**
 * GET /api/stations/:id
 * Get a station by its ID
 */
export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const station = await stationService.findById(id)
  res.json(response.success(station))
})

/**
 * POST /api/stations
 * Create a new station
 */
export const create = asyncHandler(async (req, res) => {
  const station = await stationService.create(req.body)
  res.status(201).json(response.created(station))
})

/**
 * PUT /api/stations/:id
 * Update a station
 */
export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const station = await stationService.update(id, req.body)
  res.json(response.success(station))
})

/**
 * DELETE /api/stations/:id
 * Delete a station
 */
export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await stationService.remove(id)
  res.status(204).send()
})
