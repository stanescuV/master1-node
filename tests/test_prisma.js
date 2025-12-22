import prisma from '../src/config/prisma.js';

// Test READ : récupérer tous les users
async function main() {
  console.log('📖 Prisma READ test started');

  const users = await prisma.user.findMany();

  console.log(`👥 ${users.length} user(s) found`);
  console.dir(users, { depth: null });
}

main()
  .catch((error) => {
    console.error('❌ Prisma READ test failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
