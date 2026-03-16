const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProfiles() {
    try {
        const usersWithoutProfile = await prisma.user.findMany({
            where: { profile: { is: null } },
            select: { id: true, email: true, name: true }
        });

        console.log(`Found ${usersWithoutProfile.length} users without profiles.`);

        for (const user of usersWithoutProfile) {
            await prisma.profile.create({
                data: {
                    userId: user.id,
                    name: user.name || user.email.split('@')[0],
                    bio: "Nursing Professional",
                    experience: 0,
                    skills: []
                }
            });
            console.log(`✅ Created profile for: ${user.email}`);
        }

        console.log("All missing profiles created!");

    } catch (error) {
        console.error("Prisma Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixProfiles();
