import prisma from '../src/config/prisma.js'
import bcrypt from 'bcrypt'

async function main() {
  console.log('🌱 Seeding tournament database...')

  // Password
  const hashedPassword = await bcrypt.hash('P@ssw0rd', 10)

  // CLEAN DATABASE (order matters)
  await prisma.registration.deleteMany()
  await prisma.team.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.user.deleteMany()

  // USERS
  const usersData = [
    {
      email: 'admin@tournament.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
    {
      email: 'organizer@tournament.com',
      username: 'organizer1',
      password: hashedPassword,
      role: 'ORGANIZER',
    },
    {
      email: 'player1@tournament.com',
      username: 'player1',
      password: hashedPassword,
      role: 'PLAYER',
    },
    {
      email: 'player2@tournament.com',
      username: 'player2',
      password: hashedPassword,
      role: 'PLAYER',
    },
    {
      email: 'player3@tournament.com',
      username: 'player3',
      password: hashedPassword,
      role: 'PLAYER',
    },
  ]

  await prisma.user.createMany({ data: usersData })
  console.log(`👤 Created ${usersData.length} users (password: P@ssw0rd)`)

  const users = await prisma.user.findMany()

  const organizer = users.find(u => u.username === 'organizer1')
  const player1 = users.find(u => u.username === 'player1')
  const player2 = users.find(u => u.username === 'player2')
  const player3 = users.find(u => u.username === 'player3')

  // TEAMS
  const teamAlpha = await prisma.team.create({
    data: {
      name: 'Alpha Squad',
      tag: 'ALPHA',
      captainId: player1.id,
      members: {
        connect: [
          { id: player1.id },
          { id: player2.id },
        ],
      },
    },
  })

  const teamBeta = await prisma.team.create({
    data: {
      name: 'Beta Force',
      tag: 'BETA',
      captainId: player3.id,
      members: {
        connect: [{ id: player3.id }],
      },
    },
  })

  console.log('👥 Created teams')

  // TOURNAMENTS
  const now = new Date()

  const soloTournament = await prisma.tournament.create({
    data: {
      name: 'Solo Championship',
      game: 'Valorant',
      format: 'SOLO',
      maxParticipants: 16,
      prizePool: 500,
      startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),
      status: 'OPEN',
      organizerId: organizer.id,
    },
  })

  const teamTournament = await prisma.tournament.create({
    data: {
      name: 'Team Masters Cup',
      game: 'Counter-Strike 2',
      format: 'TEAM',
      maxParticipants: 8,
      prizePool: 1500,
      startDate: new Date(now.getTime() + 72 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 96 * 60 * 60 * 1000),
      status: 'OPEN',
      organizerId: organizer.id,
    },
  })

  console.log('🏆 Created tournaments')

  // REGISTRATIONS
  const registrations = [
    // SOLO
    {
      tournamentId: soloTournament.id,
      playerId: player1.id,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
    {
      tournamentId: soloTournament.id,
      playerId: player2.id,
      status: 'PENDING',
    },

    // TEAM
    {
      tournamentId: teamTournament.id,
      teamId: teamAlpha.id,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
    {
      tournamentId: teamTournament.id,
      teamId: teamBeta.id,
      status: 'PENDING',
    },
  ]

  await prisma.registration.createMany({ data: registrations })
  console.log(`📝 Created ${registrations.length} registrations`)

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
