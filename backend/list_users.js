
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, email: true, role: true }
  });
  console.log('Users:', JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
