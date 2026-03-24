const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'qamerhassan445@gmail.com';
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });
        console.log(JSON.stringify(user, null, 2));
        
        if (user && !user.profile) {
            console.log('Profile missing. Creating one...');
            await prisma.profile.create({
                data: {
                    userId: user.id,
                    name: 'Business User',
                    location: 'United States'
                }
            });
            console.log('✅ Profile created!');
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
