const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage: node fix-subscription.js <email>');
        process.exit(1);
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        const tier = await prisma.subscriptionTier.findFirst({
            where: { name: 'Pro Max' }
        });

        if (!tier) {
            console.error('Pro Max tier not found. Run seed first.');
            process.exit(1);
        }

        // Create or update subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        const sub = await prisma.businessSubscription.upsert({
            where: { 
                // We don't have a unique constraint on userId in BusinessSubscription, 
                // but we'll find the first active one or create a new one.
                id: (await prisma.businessSubscription.findFirst({ where: { userId: user.id } }))?.id || '000000000000000000000000'
            },
            update: {
                status: 'ACTIVE',
                tierId: tier.id,
                startDate,
                endDate,
                jobsPostedCount: 0
            },
            create: {
                userId: user.id,
                tierId: tier.id,
                status: 'ACTIVE',
                startDate,
                endDate,
                jobsPostedCount: 0
            }
        });

        // Ensure user is APPROVED so they can access the dashboard
        await prisma.user.update({
            where: { id: user.id },
            data: { status: 'APPROVED' }
        });

        console.log(`✅ Fixed subscription for ${email}. User is now APPROVED with '${tier.name}' plan.`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
