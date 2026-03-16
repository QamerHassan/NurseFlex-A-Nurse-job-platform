import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const blogCount = await prisma.blog.count();
    console.log(`Total Blogs in DB: ${blogCount}`);
    
    const blogs = await prisma.blog.findMany({
        select: { id: true, title: true, status: true }
    });
    console.log('Blogs list:', JSON.stringify(blogs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
