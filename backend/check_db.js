
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    console.log('--- USER DIAGNOSTIC ---');
    try {
        const emails = ['qamerhassan455@gmail.com', 'qamerhassan6@gmail.com'];
        const users = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                role: true,
                createdAt: true
            }
        });
        console.log('Target Users:');
        console.table(users);

        const pendingNurses = await prisma.user.findMany({
            where: {
                role: 'NURSE',
                status: 'PENDING'
            },
            select: { email: true, createdAt: true }
        });
        console.log('Pending Nurses:');
        console.table(pendingNurses);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
