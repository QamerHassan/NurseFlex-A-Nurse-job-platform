
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = "69a962bddf6d0344a8030a5f"; 
  const participantId = "69ab3d6e7a4eee34efc5018b"; 

  console.log(`Test: participants [${userId}, ${participantId}]`);

  try {
    console.log("🔍 Testing findFirst with hasEvery...");
    const existing = await prisma.conversation.findFirst({
        where: {
            participantIds: {
                hasEvery: [userId, participantId]
            }
        }
    });
    console.log("✅ Find Result:", existing || "None found (No error)");

    if (!existing) {
        console.log("🆕 Testing create...");
        const created = await prisma.conversation.create({
            data: { 
                participantIds: [userId, participantId]
            }
        });
        console.log("✅ Create Result:", created);
    }
  } catch (err) {
    console.error("❌ Prisma Error:", err);
  }
}

main().finally(() => prisma.$disconnect());
