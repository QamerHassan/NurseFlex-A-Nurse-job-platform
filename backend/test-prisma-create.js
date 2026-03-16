const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.create({
            data: {
                email: 'test_create_oauth@example.com',
                name: 'Test OAuth',
                image: 'https://example.com/image.png'
            }
        });
        console.log("Success:", user);

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } });
    } catch (error) {
        console.error("Prisma Error:", error);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
