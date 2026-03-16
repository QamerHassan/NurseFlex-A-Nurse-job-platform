const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugData() {
    try {
        console.log("--- DEBUGGING DATA ---");

        // 1. Users count
        const userCount = await prisma.user.count();
        console.log(`Total Users: ${userCount}`);

        // 2. Users without profiles
        const usersWithoutProfile = await prisma.user.findMany({
            where: { profile: { is: null } },
            select: { email: true, id: true }
        });
        console.log(`Users without profiles: ${usersWithoutProfile.length}`);
        usersWithoutProfile.forEach(u => console.log(`- Missing Profile: ${u.email} (ID: ${u.id})`));

        // 3. Google accounts
        const googleAccounts = await prisma.account.findMany({
            include: { user: true }
        });
        console.log(`Google Accounts: ${googleAccounts.length}`);
        googleAccounts.forEach(acc => {
            if (acc.user) {
                console.log(`- Google User: ${acc.user.email} (Provider: ${acc.provider})`);
            } else {
                console.log(`- Orphaned Google Account: ${acc.providerAccountId}`);
            }
        });

        // 4. Conversations count
        const convCount = await prisma.conversation.count();
        console.log(`Total Conversations: ${convCount}`);

    } catch (error) {
        console.error("Prisma Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

debugData();
