
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAll() {
    console.log('--- ALL USERS ---');
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                role: true,
                createdAt: true
            }
        });
        console.table(users);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

listAll();
