/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Seeding database with USA Nursing Jobs and Tiers...');

  // Pehle purana data clear kar dete hain taake mix na ho
  await prisma.job.deleteMany({});
  await prisma.subscriptionTier.deleteMany({});

  // Seed Subscription Tiers
  console.log('⏳ Seeding Subscription Tiers...');
  const tiers = [
    { 
      id: '65f1a2b3c4d5e6f7a8b9c0d1', // Fixed ID for Starter
      name: 'Starter', 
      price: 49, 
      jobsLimit: 5, 
      features: ["5 Active Job Posts", "Email Support", "Basic Analytics"],
      isPopular: false
    },
    { 
      id: '65f1a2b3c4d5e6f7a8b9c0d2', // Fixed ID for Pro Max
      name: 'Pro Max', 
      price: 199, 
      jobsLimit: 1000, // Unlimited
      features: ["Unlimited Job Posts", "Priority Support", "Advanced Analytics", "Featured Posts"],
      isPopular: true
    }
  ];

  for (const tier of tiers) {
    await prisma.subscriptionTier.create({ data: tier });
  }
  console.log('✅ Subscription Tiers seeded!');

  const usaJobs = [
    { title: 'Registered Nurse (ICU)', hospital: 'Mayo Clinic', location: 'Rochester, MN', salary: '$45 - $60/hr', type: 'Night Shift', description: 'Provide critical care in one of the top-rated hospitals in the US.' },
    { title: 'Emergency Room RN', hospital: 'Cleveland Clinic', location: 'Cleveland, OH', salary: '$50 - $70/hr', type: 'Full-time', description: 'High-energy ER department looking for experienced nurses.' },
    { title: 'Pediatric Nurse', hospital: 'Texas Children\'s Hospital', location: 'Houston, TX', salary: '$40 - $55/hr', type: 'Day Shift', description: 'Compassionate care for children in a specialized environment.' },
    { title: 'Operating Room Nurse', hospital: 'Johns Hopkins Hospital', location: 'Baltimore, MD', salary: '$55 - $80/hr', type: 'Full-time', description: 'Assisting in advanced surgical procedures.' },
    { title: 'Labor & Delivery Nurse', hospital: 'Cedars-Sinai Medical Center', location: 'Los Angeles, CA', salary: '$65 - $85/hr', type: 'Night Shift', description: 'Supporting mothers through the birthing process.' },
    { title: 'Home Health Nurse', hospital: 'Kindred at Home', location: 'Miami, FL', salary: '$35 - $50/hr', type: 'Shift-based', description: 'Visiting patients at their residences for post-op care.' },
    { title: 'Psychiatric Nurse', hospital: 'McLean Hospital', location: 'Belmont, MA', salary: '$48 - $65/hr', type: 'Full-time', description: 'Mental health support and medication management.' },
    { title: 'Travel Nurse (General)', hospital: 'AMN Healthcare', location: 'New York, NY', salary: '$3,500/week', type: 'Contract', description: 'Travel across the state with premium housing provided.' },
    { title: 'Oncology Nurse', hospital: 'MD Anderson Cancer Center', location: 'Houston, TX', salary: '$52 - $75/hr', type: 'Full-time', description: 'Specialized care for cancer patients.' },
    { title: 'Geriatric Nurse', hospital: 'Sunrise Senior Living', location: 'Phoenix, AZ', salary: '$38 - $50/hr', type: 'Part-time', description: 'Care and support for elderly residents.' }
  ];

  // 30 jobs generate karne ke liye loop
  for (let i = 0; i < 30; i++) {
    const template = usaJobs[i % usaJobs.length];
    await prisma.job.create({
      data: {
        ...template,
        title: `${template.title} (ID: US-${1000 + i})`
      },
    });
  }

  console.log('✅ USA Jobs Seeding finished! 30 Jobs created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });