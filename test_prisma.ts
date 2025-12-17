import {prisma} from "./prisma/prisma"

//test pour verifier si tout marche et je n'ai pas foutu en l'air la base de donnée
async function main() {
  console.log("🚀 Prisma test started");

  // 1️⃣ Create users
  const captain = await prisma.user.create({
    data: {
      email: "captain@test.com",
      username: "captain",
      password: "hashed_password",
      role: "USER",
    },
  });

  const member = await prisma.user.create({
    data: {
      email: "member@test.com",
      username: "member",
      password: "hashed_password",
      role: "USER",
    },
  });

  console.log("✅ Users created");

  // 2️⃣ Create team with captain
  const team = await prisma.team.create({
    data: {
      name: "Alpha Team",
      tag: "ALPHA",
      captainId: captain.id,
    },
  });

  console.log("✅ Team created");

  // 3️⃣ Add member to team
  await prisma.user.update({
    where: { id: member.id },
    data: {
      teamId: team.id,
    },
  });

  console.log("✅ Member added to team");

  // 4️⃣ Create tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: "Winter Cup",
      game: "CS2",
      format: "TEAM",
      maxParticipants: 16,
      prizePool: 1000,
      startDate: new Date("2025-12-01"),
      endDate: new Date("2025-12-05"),
      status: "UPCOMING",
      registersAsTeam: true,
      organizerId: captain.id,
    },
  });

  console.log("✅ Tournament created");

  // 5️⃣ Register team
  const registration = await prisma.registration.create({
    data: {
      tournamentId: tournament.id,
      teamId: team.id,
      status: "PENDING",
    },
  });

  console.log("✅ Team registered");

  // 6️⃣ Fetch everything with relations
  const result = await prisma.team.findUnique({
    where: { id: team.id },
    include: {
      captain: true,
      members: true,
      registrations: {
        include: {
          tournament: true,
        },
      },
    },
  });

  console.log("📦 Final result:");
  console.dir(result, { depth: null });
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
