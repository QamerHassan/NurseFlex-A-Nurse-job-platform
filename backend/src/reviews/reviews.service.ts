import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(reviewerId: string, nurseId: string, rating: number, comment?: string, jobId?: string) {
    // Verify the nurse exists
    const nurse = await this.prisma.user.findUnique({ where: { id: nurseId } });
    if (!nurse) {
      throw new NotFoundException('Nurse not found');
    }
    if (nurse.role !== 'NURSE') {
      throw new ForbiddenException('You can only review nurses');
    }

    // Check if business already reviewed this nurse for this job
    if (jobId) {
      const existing = await this.prisma.review.findFirst({
        where: { reviewerId, nurseId, jobId },
      });
      if (existing) {
        throw new ForbiddenException('You have already reviewed this nurse for this job');
      }
    }

    return this.prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId,
        nurseId,
        jobId: jobId || null,
      },
      include: {
        reviewer: { select: { name: true, email: true } },
        nurse: { select: { name: true, email: true } },
        job: { select: { title: true } },
      },
    });
  }

  async getNurseReviews(nurseId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { nurseId },
      include: {
        reviewer: { select: { name: true, email: true } },
        job: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    };
  }

  async getBusinessReviews(businessId: string) {
    return this.prisma.review.findMany({
      where: { reviewerId: businessId },
      include: {
        nurse: { select: { id: true, name: true, email: true, profile: { select: { name: true } } } },
        job: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNurseReceivedReviews(nurseId: string) {
    return this.prisma.review.findMany({
      where: { nurseId },
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
        job: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAverageRating(nurseId: string) {
    const result = await this.prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { nurseId },
    });

    return {
      average: Math.round((result._avg.rating || 0) * 10) / 10,
      count: result._count.rating,
    };
  }
}
