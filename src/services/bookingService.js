import prisma from '../config/prisma.js'

/**
 * Count total bookings
 * @returns {Promise<number>}
 */
export const count = () => {
  return prisma.booking.count()
}

/**
 * Get all users (for booking form select)
 * @returns {Promise<Array>}
 */
export const getAllUsers = () => {
  return prisma.user.findMany({
    select: { id: true, username: true, email: true },
    orderBy: { username: 'asc' },
  })
}

/**
 * Get all bookings with filters and pagination
 * @param {Object} filters - Optional filters
 * @param {number} [filters.userId] - Filter by user ID
 * @param {number} [filters.stationId] - Filter by station ID
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit] - Max number of results
 * @param {number} [filters.offset] - Pagination offset
 * @returns {Promise<{ total: number, count: number, bookings: Array }>}
 */
export const findAll = async (filters = {}) => {
  const limit = parseInt(filters.limit) || 10
  const offset = parseInt(filters.offset) || 0

  const where = {}
  if (filters.userId) {
    where.userId = parseInt(filters.userId)
  }
  if (filters.stationId) {
    where.stationId = parseInt(filters.stationId)
  }
  if (filters.status) {
    where.status = filters.status
  }

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { startTime: 'asc' },
      include: {
        user: { select: { id: true, username: true, email: true } },
        station: { select: { id: true, name: true, status: true } },
      },
    }),
  ])

  return { total, count: bookings.length, bookings }
}

/**
 * Get all bookings without pagination (for views)
 * @returns {Promise<Array>}
 */
export const findAllSimple = () => {
  return prisma.booking.findMany({
    orderBy: { startTime: 'asc' },
    include: {
      user: { select: { id: true, username: true } },
      station: { select: { id: true, name: true } },
    },
  })
}

/**
 * Get a booking by its ID
 * @param {number} id - Booking ID
 * @returns {Promise<Object>}
 * @throws {Error} If booking not found (status 404)
 */
export const findById = async id => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, email: true } },
      station: { select: { id: true, name: true, status: true } },
    },
  })

  if (!booking) {
    const error = new Error('Booking not found')
    error.status = 404
    throw error
  }

  return booking
}

/**
 * Check if a station is available for the given time range
 * @param {number} stationId - Station ID
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {number} [excludeBookingId] - Booking ID to exclude (for updates)
 * @returns {Promise<boolean>}
 */
export const isStationAvailable = async (
  stationId,
  startTime,
  endTime,
  excludeBookingId = null
) => {
  const where = {
    stationId,
    status: { not: 'cancelled' },
    OR: [
      {
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    ],
  }

  if (excludeBookingId) {
    where.id = { not: excludeBookingId }
  }

  const conflictingBooking = await prisma.booking.findFirst({ where })
  return !conflictingBooking
}

/**
 * Create a new booking
 * @param {Object} data - Booking data
 * @returns {Promise<Object>} Created booking
 * @throws {Error} If station is not available (status 409)
 */
export const create = async data => {
  const available = await isStationAvailable(
    data.stationId,
    data.startTime,
    data.endTime
  )

  if (!available) {
    const error = new Error(
      'La station est déjà réservée pour ce créneau horaire'
    )
    error.status = 409
    throw error
  }

  return prisma.booking.create({
    data,
    include: {
      user: { select: { id: true, username: true } },
      station: { select: { id: true, name: true } },
    },
  })
}

/**
 * Update a booking
 * @param {number} id - Booking ID
 * @param {Object} data - New data
 * @returns {Promise<Object>} Updated booking
 * @throws {Error} If booking not found (status 404) or station not available (status 409)
 */
export const update = async (id, data) => {
  await findById(id)

  if (data.stationId || data.startTime || data.endTime) {
    const booking = await prisma.booking.findUnique({ where: { id } })
    const stationId = data.stationId || booking.stationId
    const startTime = data.startTime || booking.startTime
    const endTime = data.endTime || booking.endTime

    const available = await isStationAvailable(
      stationId,
      startTime,
      endTime,
      id
    )

    if (!available) {
      const error = new Error(
        'La station est déjà réservée pour ce créneau horaire'
      )
      error.status = 409
      throw error
    }
  }

  return prisma.booking.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, username: true } },
      station: { select: { id: true, name: true } },
    },
  })
}

/**
 * Delete a booking
 * @param {number} id - Booking ID
 * @returns {Promise<void>}
 * @throws {Error} If booking not found (status 404)
 */
export const remove = async id => {
  await findById(id)

  await prisma.booking.delete({ where: { id } })
}
