
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allJobs = await prisma.job.findMany();
  console.log(`Total Jobs: ${allJobs.length}`);

  const pendingJobs = allJobs.filter(j => j.status === 'PENDING');
  console.log(`Pending Jobs (filtered in JS): ${pendingJobs.length}`);
  
  if (pendingJobs.length > 0) {
      console.log('Sample Pending Job ID:', pendingJobs[0].id);
  } else {
      console.log('No pending jobs found in JS filtering either.');
      console.log('Statuses found in all jobs:', [...new Set(allJobs.map(j => j.status))]);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
