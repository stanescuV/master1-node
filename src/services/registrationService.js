import prisma from '../config/prisma.js'

export const findAll = async tournamentId => {
  return prisma.registration.findMany({
    where: { tournamentId },
    include: { player: true, team: true },
  })
}

export const create = async (tournamentId, user, data) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  })

  if (!tournament || tournament.status !== 'OPEN') {
    throw Object.assign(new Error('Tournoi non ouvert'), { status: 409 })
  }

  if (tournament.format === 'SOLO' && !data.playerId) {
    throw Object.assign(new Error('Inscription SOLO requiert un joueur'), { status: 400 })
  }

  if (tournament.format === 'TEAM' && !data.teamId) {
    throw Object.assign(new Error('Inscription TEAM requiert une équipe'), { status: 400 })
  }

  const existing = await prisma.registration.findFirst({
    where: {
      tournamentId,
      OR: [{ playerId: data.playerId }, { teamId: data.teamId }],
    },
  })

  if (existing) {
    throw Object.assign(new Error('Déjà inscrit à ce tournoi'), { status: 409 })
  }

  return prisma.registration.create({
    data: {
      tournamentId,
      playerId: data.playerId,
      teamId: data.teamId,
      status: 'PENDING',
      registeredAt: new Date(),
    },
  })
}

export const update = async (id, user, data) => {
  const registration = await prisma.registration.findUnique({ where: { id } })

  if (!registration) {
    throw Object.assign(new Error('Inscription introuvable'), { status: 404 })
  }

  return prisma.registration.update({
    where: { id },
    data,
  })
}

export const remove = async (id, user) => {
  const registration = await prisma.registration.findUnique({ where: { id } })

  if (!registration || registration.status !== 'PENDING') {
    throw Object.assign(new Error('Suppression impossible'), { status: 409 })
  }

  await prisma.registration.delete({ where: { id } })
}
