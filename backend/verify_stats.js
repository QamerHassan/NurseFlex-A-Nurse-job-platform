const { PrismaClient } = require('@prisma/client');

async function testStats() {
    const prisma = new PrismaClient();
    try {
        console.log("🚀 Testing Admin Dashboard Stats Logic...");
        
        const [totalBlogs, pendingApps, approvedProviders, totalNurses] = await Promise.all([
          prisma.blog.count(),
          prisma.serviceRequest.count({ where: { status: 'Pending' } }),
          prisma.serviceRequest.count({ where: { status: 'Approved' } }),
          prisma.user.count({ where: { role: 'NURSE' } }),
        ]);
        
        console.log(`✅ Results:`);
        console.log(`   - Active Blogs: ${totalBlogs}`);
        console.log(`   - Total Nurses: ${totalNurses}`);
        console.log(`   - Pending Apps: ${pendingApps}`);
        console.log(`   - Approved Providers: ${approvedProviders}`);
        
        if (totalBlogs === 6) {
            console.log("🎉 SUCCESS: DB sees all 6 blogs!");
        } else {
            console.log("⚠️ WARNING: DB count mismatch (Found " + totalBlogs + ")");
        }
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testStats();
