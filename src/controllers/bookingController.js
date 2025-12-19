import * as bookingService from '../services/bookingService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as response from '../utils/responseHelper.js'

/**
 * GET /api/bookings
 * List all bookings with filters and pagination
 */
export const getAll = asyncHandler(async (req, res) => {
  const result = await bookingService.findAll(req.query)
  res.json(response.success(result))
})

/**
 * GET /api/bookings/:id
 * Get a booking by its ID
 */
export const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const booking = await bookingService.findById(id)
  res.json(response.success(booking))
})

/**
 * POST /api/bookings
 * Create a new booking
 */
export const create = asyncHandler(async (req, res) => {
  const booking = await bookingService.create(req.body)
  res.status(201).json(response.created(booking))
})

/**
 * PUT /api/bookings/:id
 * Update a booking
 */
export const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  const booking = await bookingService.update(id, req.body)
  res.json(response.success(booking))
})

/**
 * DELETE /api/bookings/:id
 * Delete a booking
 */
export const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id)
  await bookingService.remove(id)
  res.status(204).send()
})
