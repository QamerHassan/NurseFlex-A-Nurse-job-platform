
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findTheGhost() {
    console.log('--- SEARCHING FOR 455 ---');
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: '455' } },
                    { name: { contains: '455' } }
                ]
            }
        });
        console.log('Results:');
        console.table(users);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

findTheGhost();
