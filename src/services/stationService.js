import prisma from '../config/prisma.js'

/**
 * Count total stations
 * @returns {Promise<number>}
 */
export const count = () => {
  return prisma.station.count()
}

/**
 * Get all stations with filters and pagination
 * @param {Object} filters - Optional filters
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit] - Max number of results
 * @param {number} [filters.offset] - Pagination offset
 * @returns {Promise<{ total: number, count: number, stations: Array }>}
 */
export const findAll = async (filters = {}) => {
  const limit = parseInt(filters.limit) || 10
  const offset = parseInt(filters.offset) || 0

  const where = {}
  if (filters.status) {
    where.status = filters.status
  }

  const [total, stations] = await Promise.all([
    prisma.station.count({ where }),
    prisma.station.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ])

  return { total, count: stations.length, stations }
}

/**
 * Get all stations without pagination (for views)
 * @returns {Promise<Array>}
 */
export const findAllSimple = () => {
  return prisma.station.findMany({
    orderBy: { name: 'asc' },
  })
}

/**
 * Get a station by its ID
 * @param {number} id - Station ID
 * @returns {Promise<Object>}
 * @throws {Error} If station not found (status 404)
 */
export const findById = async id => {
  const station = await prisma.station.findUnique({ where: { id } })

  if (!station) {
    const error = new Error('Station not found')
    error.status = 404
    throw error
  }

  return station
}

/**
 * Create a new station
 * @param {Object} data - Station data
 * @returns {Promise<Object>} Created station
 */
export const create = data => {
  return prisma.station.create({ data })
}

/**
 * Update a station
 * @param {number} id - Station ID
 * @param {Object} data - New data
 * @returns {Promise<Object>} Updated station
 * @throws {Error} If station not found (status 404)
 */
export const update = async (id, data) => {
  await findById(id)

  return prisma.station.update({
    where: { id },
    data,
  })
}

/**
 * Delete a station
 * @param {number} id - Station ID
 * @returns {Promise<void>}
 * @throws {Error} If station not found (status 404)
 */
export const remove = async id => {
  await findById(id)

  await prisma.station.delete({ where: { id } })
}
