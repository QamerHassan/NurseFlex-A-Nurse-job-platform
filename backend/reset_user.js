
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetUser() {
    const email = 'qamerhassan6@gmail.com';
    console.log(`--- RESETTING USER: ${email} ---`);
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { status: 'PENDING' }
        });
        console.log('Success! User is now PENDING.');
        console.table(user);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

resetUser();
