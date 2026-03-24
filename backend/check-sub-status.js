const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'qamerhassan445@gmail.com';
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { 
                subscriptions: {
                    include: { tier: true }
                }
            }
        });
        console.log('User status:', user.status);
        console.log('Subscriptions:', JSON.stringify(user.subscriptions, null, 2));
    } catch (err) {
        console.error(err.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
