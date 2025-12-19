// import prisma from "./src/config/prisma.js";


// //test pour verifier si tout marche et je n'ai pas foutu en l'air la base de donnée
// async function main() {
//   console.log("🚀 Prisma test started");

//   // 1️⃣ Create users
//   const captain = await prisma.user.create({
//     data: {
//       email: "captain@test.com",
//       username: "captain",
//       password: "hashed_password",
//       role: "PLAYER",
//     },
//   });

//   const member = await prisma.user.create({
//     data: {
//       email: "member@test.com",
//       username: "member",
//       password: "hashed_password",
//       role: "PLAYER",
//     },
//   });

//   console.log("✅ Users created");

//   // 2️⃣ Create a team with a captain
//   const team = await prisma.team.create({
//     data: {
//       name: "Alpha Team",
//       tag: "ALPHA",
//       captainId: captain.id,
//     },
//   });

//   console.log("✅ Team created");

//   // 3️⃣ Assign member to the team
//   await prisma.user.update({
//     where: { id: member.id },
//     data: {
//       teamId: team.id,
//     },
//   });

//   console.log("✅ Member added to team");

//   // 4️⃣ Create a tournament
//   const tournament = await prisma.tournament.create({
//     data: {
//       name: "Winter Cup",
//       game: "CS2",
//       format: "TEAM",
//       maxParticipants: 16,
//       prizePool: 1000,
//       startDate: new Date("2025-12-01"),
//       endDate: new Date("2025-12-05"),
//       status: "OPEN",
//       registersAsTeam: true,
//       organizerId: captain.id,
//     },
//   });

//   console.log("✅ Tournament created");

//   // 5️⃣ Register the team for the tournament
//   await prisma.registration.create({
//     data: {
//       tournamentId: tournament.id,
//       teamId: team.id,
//       status: "PENDING",
//     },
//   });

//   console.log("✅ Team registered");

//   // 6️⃣ Fetch the team with all relations
//   const result = await prisma.team.findUnique({
//     where: { id: team.id },
//     include: {
//       captain: true,
//       members: true,
//       registrations: {
//         include: {
//           tournament: true,
//         },
//       },
//     },
//   });

//   console.log("📦 Final result:");
//   console.dir(result, { depth: null });
// }

// main()
//   .catch((error) => {
//     console.error("❌ Prisma test failed:", error);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import prisma from "./src/config/prisma.js";

// Test READ : récupérer tous les users
async function main() {
  console.log("📖 Prisma READ test started");

  const users = await prisma.user.findMany();

  console.log(`👥 ${users.length} user(s) found`);
  console.dir(users, { depth: null });
}

main()
  .catch((error) => {
    console.error("❌ Prisma READ test failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
