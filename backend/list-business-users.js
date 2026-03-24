const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'BUSINESS' },
            select: { email: true, name: true, status: true }
        });
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error(err.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
