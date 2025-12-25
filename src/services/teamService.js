import prisma from '../config/prisma.js'

export const findAll = async () => {
  return prisma.team.findMany({
    include: { captain: true },
  })
}

export const findById = async id => {
  const team = await prisma.team.findUnique({
    where: { id },
    include: { captain: true },
  })

  if (!team) {
    const error = new Error('Équipe non trouvée')
    error.status = 404
    throw error
  }

  return team
}

export const create = async (userId, data) => {
  return prisma.team.create({
    data: {
      name: data.name,
      tag: data.tag,
      captainId: userId,
    },
  })
}

export const update = async (id, userId, data) => {
  const team = await findById(id)

  if (team.captainId !== userId) {
    const error = new Error('Accès interdit')
    error.status = 403
    throw error
  }

  return prisma.team.update({
    where: { id },
    data,
  })
}

export const remove = async (id, userId) => {
  const team = await findById(id)

  if (team.captainId !== userId) {
    const error = new Error('Accès interdit')
    error.status = 403
    throw error
  }

  const activeRegistration = await prisma.registration.findFirst({
    where: {
      teamId: id,
      tournament: { status: { in: ['OPEN', 'ONGOING'] } },
    },
  })

  if (activeRegistration) {
    const error = new Error(
      'Impossible de supprimer une équipe inscrite à un tournoi actif'
    )
    error.status = 409
    throw error
  }

  await prisma.team.delete({ where: { id } })
}
