import { prisma } from "./prisma/prisma"

async function main() {
  console.log("🔌 Testing Prisma connection...")

  // CREATE
  const user = await prisma.testUser.create({
    data: {},
  })
  console.log("✅ Created TestUser:", user)

  // READ
  const users = await prisma.testUser.findMany()
  console.log("📦 All TestUsers:", users)

  // DELETE (cleanup)
  await prisma.testUser.delete({
    where: { id: user.id },
  })
  console.log("🧹 Cleaned up test user")
}

main()
  .catch((error) => {
    console.error("❌ Prisma test failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log("🔌 Prisma disconnected")
  })
