import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking Latest Notifications...");
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  notifications.forEach((n, i) => {
    console.log(`\n[${i+1}] Notification ID: ${n.id}`);
    console.log(`   Title: ${n.title}`);
    console.log(`   Type: ${n.type}`);
    console.log(`   Metadata:`, JSON.stringify((n as any).metadata, null, 2));
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
