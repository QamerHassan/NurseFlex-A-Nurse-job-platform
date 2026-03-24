
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkJobs() {
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        postedById: true
      }
    });
    console.log('--- ALL JOBS ---');
    console.log(JSON.stringify(jobs, null, 2));
    
    const pendingCount = jobs.filter(j => j.status === 'PENDING').length;
    console.log(`\nPending Jobs: ${pendingCount}`);
    
    if (pendingCount > 0) {
      console.log('Approving all existing pending jobs...');
      const result = await prisma.job.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'APPROVED' }
      });
      console.log(`Updated ${result.count} jobs to APPROVED.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkJobs();
