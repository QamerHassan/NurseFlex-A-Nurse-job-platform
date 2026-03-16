import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SavedJobsService {
    constructor(private prisma: PrismaService) { }

    async saveJob(userId: string, jobId: string) {
        return this.prisma.savedJob.upsert({
            where: { userId_jobId: { userId, jobId } },
            update: {},
            create: { userId, jobId },
        });
    }

    async unsaveJob(userId: string, jobId: string) {
        return this.prisma.savedJob.deleteMany({
            where: { userId, jobId },
        });
    }

    async getSavedJobs(userId: string) {
        return this.prisma.savedJob.findMany({
            where: { userId },
            include: { job: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async isJobSaved(userId: string, jobId: string) {
        const saved = await this.prisma.savedJob.findFirst({
            where: { userId, jobId }
        });
        return !!saved;
    }
}
