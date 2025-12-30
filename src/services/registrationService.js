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

  let playerId = null
  let teamId = null

  if (tournament.format === 'SOLO') {
    playerId = user.userId
  } else if (tournament.format === 'TEAM') {
    if (!data.teamId) {
      throw Object.assign(new Error('Inscription TEAM requiert une équipe'), { status: 400 })
    }

    const team = await prisma.team.findUnique({ where: { id: data.teamId } })
    if (!team || team.captainId !== user.userId) {
      throw Object.assign(new Error('Seul le capitaine peut inscrire son équipe'), { status: 403 })
    }

    teamId = data.teamId
  }

  const whereConditions = { tournamentId }
  if (playerId) {
    whereConditions.playerId = playerId
  } else if (teamId) {
    whereConditions.teamId = teamId
  }

  const existing = await prisma.registration.findFirst({
    where: whereConditions,
  })

  if (existing) {
    throw Object.assign(new Error('Déjà inscrit à ce tournoi'), { status: 409 })
  }

  return prisma.registration.create({
    data: {
      tournamentId,
      playerId,
      teamId,
      status: 'PENDING',
      registeredAt: new Date(),
    },
  })
}

export const update = async (id, user, data) => {
  const registration = await prisma.registration.findUnique({
    where: { id },
    include: { tournament: true }
  })

  if (!registration) {
    throw Object.assign(new Error('Inscription introuvable'), { status: 404 })
  }

  if (user.role !== 'ADMIN' && registration.tournament.organizerId !== user.userId) {
    throw Object.assign(new Error('Accès interdit'), { status: 403 })
  }

  if (registration.status !== 'PENDING') {
    throw Object.assign(new Error('Seules les inscriptions en attente peuvent être modifiées'), { status: 409 })
  }

  return prisma.registration.update({
    where: { id },
    data: {
      status: data.status,
      confirmedAt: data.status === 'CONFIRMED' ? new Date() : null,
    },
  })
}

export const remove = async (id, user) => {
  const registration = await prisma.registration.findUnique({
    where: { id },
    include: { player: true, team: true }
  })

  if (!registration) {
    throw Object.assign(new Error('Inscription introuvable'), { status: 404 })
  }

  const isOwner = registration.playerId === user.userId ||
                  (registration.team && registration.team.captainId === user.userId)

  if (!isOwner) {
    throw Object.assign(new Error('Accès interdit'), { status: 403 })
  }

  if (registration.status !== 'PENDING') {
    throw Object.assign(new Error('Seules les inscriptions en attente peuvent être supprimées'), { status: 409 })
  }

  await prisma.registration.delete({ where: { id } })
}
