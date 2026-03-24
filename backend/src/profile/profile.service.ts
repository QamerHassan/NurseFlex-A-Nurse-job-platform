import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }

  // 1. User ki profile hasil karne ke liye
  async getProfile(userId: string) {
    // Pehle user ko check karein taake email hamesha mil sake
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, role: true }
    });

    if (!user) throw new NotFoundException('User not found');

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // Agar profile nahi milti toh basic user info ke saath default values bhej dete hain
    if (!profile) {
      return {
        user: user,
        name: user.name || '',
        phone: '', country: '', postcode: '', bio: '',
        experience: 0, skills: [], location: '',
        minPay: 0, payPeriod: 'hour', currency: 'Rs',
        jobTitles: [], jobTypes: []
      };
    }

    return { ...profile, user };
  }

  // 2. Profile update ya create karne ke liye (Smart Upsert)
  async updateProfile(userId: string, data: any) {
    // 1. Update User name if provided
    if (data.name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: data.name }
      });
    }

    // 2. Upsert Profile
    return this.prisma.profile.upsert({
      where: { userId },
      update: {
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        specialization: data.specialization,
        experience: data.experience,
        skills: data.skills,
        location: data.location,
        country: data.country,
        postcode: data.postcode,
        resumeUrl: data.resumeUrl,
        jobTitles: data.jobTitles,
        jobTypes: data.jobTypes,
        minPay: data.minPay,
        payPeriod: data.payPeriod,
        currency: data.currency,
      },
      create: {
        userId: userId,
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        specialization: data.specialization,
        experience: data.experience,
        skills: data.skills,
        location: data.location,
        country: data.country,
        postcode: data.postcode,
        resumeUrl: data.resumeUrl,
        jobTitles: data.jobTitles,
        jobTypes: data.jobTypes,
        minPay: data.minPay,
        payPeriod: data.payPeriod,
        currency: data.currency,
      },
    });
  }

  // 3. Onboarding complete karne ke liye
  async completeOnboarding(userId: string, data: any) {
    // 1. Profile update karein
    await this.prisma.profile.update({
      where: { userId },
      data: {
        country: data.country,
        location: data.location, // This will be "City, State"
        postcode: data.postcode,
        minPay: data.minPay ? parseInt(data.minPay) : undefined,
        payPeriod: data.payPeriod,
        currency: data.currency,
        jobTypes: data.jobTypes || [],
        jobTitles: data.jobTitles || [],
      }
    });

    // 2. User ka isOnboarded status true karein
    return this.prisma.user.update({
      where: { id: userId },
      data: { isOnboarded: true },
      select: {
        id: true,
        email: true,
        role: true,
        isOnboarded: true,
        profile: true
      }
    });
  }

  // 4. Public Profile fetch karne ke liye (with reviews)
  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        profile: true,
        reviewsReceived: {
          include: {
            reviewer: { select: { id: true, name: true, email: true } },
            job: { select: { title: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) throw new NotFoundException('Profile not found');

    const reviews = user.reviewsReceived || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile: user.profile || null,
      reviews,
      rating: {
        average: averageRating,
        count: totalReviews
      }
    };
  }
}