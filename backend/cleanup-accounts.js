const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Delete the Account record that mistakenly links Google ID 112925085663378125064 to qamerhassan17
        const result = await prisma.account.deleteMany({
            where: {
                providerAccountId: '112925085663378125064'
            }
        });

        console.log(`Deleted ${result.count} mistakenly linked account(s).`);

        // Check if there are any other accounts for qamerhassan445 that might be linked wrongly
        const users = await prisma.user.findMany({
            where: {
                accounts: {
                    some: {
                        providerAccountId: {
                            contains: 'qamerhassan445'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Prisma Error:", error);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
