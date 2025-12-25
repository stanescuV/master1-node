import prisma from '../config/prisma.js'

export const findAll = async ({ status, game, format, page = 1, limit = 10 }) => {
  const where = {}

  if (status) where.status = status
  if (game) where.game = game
  if (format) where.format = format

  const tournaments = await prisma.tournament.findMany({
    where,
    skip: (page - 1) * limit,
    take: Number(limit),
    orderBy: { startDate: 'asc' },
  })

  const total = await prisma.tournament.count({ where })

  return { data: tournaments, total, page: Number(page) }
}

export const findById = async id => {
  const tournament = await prisma.tournament.findUnique({
    where: { id },
  })

  if (!tournament) {
    const error = new Error('Tournoi non trouvé')
    error.status = 404
    throw error
  }

  return tournament
}

export const create = async (userId, data) => {
  return prisma.tournament.create({
    data: {
      ...data,
      organizerId: userId,
      status: 'DRAFT',
    },
  })
}

export const update = async (id, userId, data) => {
  const tournament = await findById(id)

  if (['COMPLETED', 'CANCELLED'].includes(tournament.status)) {
    const error = new Error('Tournoi non modifiable')
    error.status = 409
    throw error
  }

  return prisma.tournament.update({
    where: { id },
    data,
  })
}

export const remove = async (id, userId) => {
  const tournament = await findById(id)

  const confirmed = await prisma.registration.count({
    where: { tournamentId: id, status: 'CONFIRMED' },
  })

  if (confirmed > 0) {
    const error = new Error('Impossible de supprimer un tournoi avec inscriptions confirmées')
    error.status = 409
    throw error
  }

  await prisma.tournament.delete({ where: { id } })
}

export const updateStatus = async (id, user, status) => {
  const tournament = await findById(id)

  if (status === 'OPEN' && tournament.startDate <= new Date()) {
    throw Object.assign(new Error('La date de début doit être future'), { status: 400 })
  }

  return prisma.tournament.update({
    where: { id },
    data: { status },
  })
}
