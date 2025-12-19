import prisma from '../config/prisma.js'

/**
 * Count total games
 * @returns {Promise<number>}
 */
export const count = () => {
  return prisma.game.count()
}

/**
 * Get all games with filters and pagination
 * @param {Object} filters - Optional filters
 * @param {string} [filters.genre] - Filter by genre
 * @param {number} [filters.limit] - Max number of results
 * @param {number} [filters.offset] - Pagination offset
 * @returns {Promise<{ total: number, count: number, games: Array }>}
 */
export const findAll = async (filters = {}) => {
  const limit = parseInt(filters.limit) || 10
  const offset = parseInt(filters.offset) || 0

  const where = {}
  if (filters.genre) {
    where.genre = filters.genre
  }

  const [total, games] = await Promise.all([
    prisma.game.count({ where }),
    prisma.game.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ])

  return { total, count: games.length, games }
}

/**
 * Get all games without pagination (for views)
 * @returns {Promise<Array>}
 */
export const findAllSimple = () => {
  return prisma.game.findMany({
    orderBy: { name: 'asc' },
  })
}

/**
 * Get a game by its ID
 * @param {number} id - Game ID
 * @returns {Promise<Object>}
 * @throws {Error} If game not found (status 404)
 */
export const findById = async id => {
  const game = await prisma.game.findUnique({ where: { id } })

  if (!game) {
    const error = new Error('Game not found')
    error.status = 404
    throw error
  }

  return game
}

/**
 * Create a new game
 * @param {Object} data - Game data
 * @returns {Promise<Object>} Created game
 */
export const create = data => {
  return prisma.game.create({ data })
}

/**
 * Update a game
 * @param {number} id - Game ID
 * @param {Object} data - New data
 * @returns {Promise<Object>} Updated game
 * @throws {Error} If game not found (status 404)
 */
export const update = async (id, data) => {
  await findById(id)

  return prisma.game.update({
    where: { id },
    data,
  })
}

/**
 * Delete a game
 * @param {number} id - Game ID
 * @returns {Promise<void>}
 * @throws {Error} If game not found (status 404)
 */
export const remove = async id => {
  await findById(id)

  await prisma.game.delete({ where: { id } })
}
