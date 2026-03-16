import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) { }

  async findAll(title?: string, location?: string, minSalary?: string, type?: string, datePosted?: string) {
    const where: any = { status: 'APPROVED' };
    if (title) {
      where.OR = [
        { title: { contains: title, mode: 'insensitive' } },
        { hospital: { contains: title, mode: 'insensitive' } },
      ];
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (type && type !== 'All') {
      where.type = { contains: type, mode: 'insensitive' };
    }
    if (datePosted && datePosted !== 'Anytime') {
      const days = parseInt(datePosted);
      if (!isNaN(days)) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        where.createdAt = { gte: date };
      }
    }

    console.log("🔍 JobsService.findAll called with filters:", { title, location, minSalary, type, datePosted });
    const allJobs = await (this.prisma.job as any).findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // TEMPORARY FIX: Manual status filtering due to stale Prisma client
    let approvedJobs = allJobs.filter((j: any) => j.status === 'APPROVED');

    if (minSalary) {
      const min = parseFloat(minSalary);
      if (!isNaN(min)) {
        approvedJobs = approvedJobs.filter((j: any) => {
          // Extract numbers from "salary" string like "$45 - $60/hr" or "55"
          const matches = j.salary.match(/\d+(\.\d+)?/g);
          if (matches) {
            const salaries = matches.map(Number);
            const maxInJob = Math.max(...salaries);
            return maxInJob >= min;
          }
          return true; // Keep if we can't parse it
        });
      }
    }

    console.log(`✅ Found ${approvedJobs.length} approved jobs (after manual filter)`);
    return approvedJobs;
  }

  async create(data: any) {
    const postedById = data.postedById;

    if (!postedById) {
      return this.prisma.job.create({ data });
    }

    try {
      // 1. Get User Profile for Hospital Name & Location
      const user = await this.prisma.user.findUnique({
        where: { id: postedById },
        include: { profile: true }
      });

      if (!user || !user.profile) {
        throw new ForbiddenException('User profile not found. Please complete your profile first.');
      }

      // 2. Get Active Subscription
      const subscription = await this.prisma.businessSubscription.findFirst({
        where: { userId: postedById, status: 'ACTIVE' },
        include: { tier: true }
      });

      if (!subscription) {
        throw new ForbiddenException('Aapka koi active subscription nahi mila. Please plan subscribe karein.');
      }

      // 3. Check Limit
      if (subscription.jobsPostedCount >= subscription.tier.jobsLimit) {
        throw new ForbiddenException(`Aapki limit khatam ho chuki hai (${subscription.tier.jobsLimit} jobs). Please upgrade karein.`);
      }

      // 4. Sanitize and Populate Data for Prisma
      const prismaData = {
        title: data.title,
        description: data.description,
        salary: data.salary,
        location: data.location === "Facility Location" ? (user.profile.location || "Remote") : (data.location || user.profile.location || "Remote"),
        hospital: user.profile.name || user.name || "Unknown Facility",
        type: data.type || "Full-time",
        postedById: postedById
      };

      // 5. Create Job and Increment Count in Transaction
      const [job] = await this.prisma.$transaction([
        this.prisma.job.create({ data: prismaData }),
        this.prisma.businessSubscription.update({
          where: { id: subscription.id },
          data: { jobsPostedCount: { increment: 1 } }
        })
      ]);

      return job;
    } catch (err) {
      console.error("❌ JobsService.create Error:", err);
      throw err;
    }
  }

  async findByBusiness(businessId: string) {
    return this.prisma.job.findMany({
      where: { postedById: businessId },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(jobId: string, businessId: string, data: any) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) throw new NotFoundException('Shift not found');
    if (job.postedById !== businessId) {
      throw new ForbiddenException('You do not have permission to edit this shift');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data
    });
  }

  async remove(jobId: string, businessId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) throw new NotFoundException('Shift not found');
    if (job.postedById !== businessId) {
      throw new ForbiddenException('You do not have permission to delete this shift');
    }

    return this.prisma.job.delete({
      where: { id: jobId }
    });
  }

  async getSuggestions(type: 'title' | 'location', query: string) {
    if (!query || query.length < 2) return [];

    if (type === 'title') {
      const jobs = await this.prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { hospital: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { title: true },
        distinct: ['title'],
        take: 8,
      });
      return jobs.map((j) => j.title);
    } else {
      const locations = await this.prisma.job.findMany({
        where: {
          location: { contains: query, mode: 'insensitive' },
        },
        select: { location: true },
        distinct: ['location'],
        take: 8,
      });
      return locations.map((l) => l.location);
    }
  }

  // --- ADMIN METHODS ---
  async updateStatus(id: string, status: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Shift not found');

    return (this.prisma.job as any).update({
      where: { id },
      data: { status }
    });
  }

  async findAllPending() {
    console.log("🔍 JobsService.findAllPending called");
    try {
      // TEMPORARY FIX: Fetch all and filter in JS because Prisma filter fails on stale client
      const allJobs = await (this.prisma.job as any).findMany({
        include: {
          postedBy: {
            include: { profile: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      const pendingJobs = allJobs.filter((j: any) => j.status === 'PENDING');
      console.log(`✅ Found ${pendingJobs.length} pending jobs (via manual JS filtering)`);
      return pendingJobs;
    } catch (err) {
      console.error("❌ findAllPending Error:", err);
      throw err;
    }
  }
}