const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user17 = await prisma.user.findUnique({
            where: { email: 'qamerhassan17@gmail.com' },
            include: { accounts: true }
        });
        console.log("User 17 accounts:", user17?.accounts);

        // Also check for user 445
        const user445 = await prisma.user.findUnique({
            where: { email: 'qamerhassan445@gmail.com' },
            include: { accounts: true }
        });
        console.log("User 445:", user445);

    } catch (error) {
        console.error("Prisma Error:", error);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
