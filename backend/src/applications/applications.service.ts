import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) { }

  // ==========================================
  // 1. NURSE: JOB PORTAL LOGIC
  // ==========================================

  // Apply for a job
  async apply(userId: string, jobId: string, resumeUrl?: string, experience?: any) {
    const existing = await this.prisma.application.findUnique({
      where: {
        userId_jobId: { userId, jobId },
      },
    });

    if (existing) {
      throw new BadRequestException('Bhai, aap is job par pehle hi apply kar chuke hain!');
    }

    const application = await this.prisma.application.create({
      data: {
        userId,
        jobId,
        resumeUrl,
        status: 'Pending',
        ...({ experience } as any)
      },
      include: { 
        job: {
          include: { postedBy: true }
        },
        user: {
          include: { profile: true }
        }
      }
    }) as any;

    // Fire emails and in-app notifications
    if (application.user && application.job) {
      const nurseName = application.user.profile?.name || application.user.name || 'Nurse';
      const nurseEmail = application.user.email;
      const jobTitle = application.job.title;
      const facilityName = application.job.hospital;
      const businessUser = application.job.postedBy;

      this.logger.log(`📬 Processing notifications for application to: ${jobTitle}`);

      const notifications = [
        // 1. Nurse: Confirmation Email
        this.emailService.sendApplicationConfirmationEmail(nurseEmail, nurseName, jobTitle, facilityName)
          .catch(e => this.logger.error(`❌ Nurse email failed: ${e.message}`)),

        // 2. Nurse: In-app Notification
        this.notificationsService.createNotification(
          userId,
          '✅ Application Submitted',
          `Your application for "${jobTitle}" at ${facilityName} has been received.`,
          'APPLICATION',
          { jobId, jobTitle, facilityName }
        ).catch(e => this.logger.error(`❌ Nurse in-app failed: ${e.message}`)),
      ];

      // 3 & 4. Business: Notification (If job was posted by a user)
      if (businessUser && businessUser.email) {
        notifications.push(
          // Email to Business
          this.emailService.sendApplicationNoticeToBusiness(
            businessUser.email,
            businessUser.name || 'Facility Manager',
            nurseName,
            jobTitle
          ).catch(e => this.logger.error(`❌ Business email failed: ${e.message}`)),

          // In-app for Business
          this.notificationsService.createNotification(
            businessUser.id,
            '👥 New Applicant Received',
            `${nurseName} has applied for "${jobTitle}". Review their profile now.`,
            'APPLICATION',
            { jobId, nurseName, applicationId: application.id }
          ).catch(e => this.logger.error(`❌ Business in-app failed: ${e.message}`))
        );
      }

      // Execute all notifications in background (don't block the return)
      Promise.all(notifications);
    } else {
      this.logger.warn(`⚠️ Application created but data missing for notifications. userId: ${userId}`);
    }

    return application;
  }

  // Nurse personal dashboard stats
  async getDashboardStats(userId: string) {
    const [totalApplied, pending, interviewed] = await Promise.all([
      this.prisma.application.count({ where: { userId } }),
      this.prisma.application.count({ where: { userId, status: 'Pending' } }),
      this.prisma.application.count({ where: { userId, status: 'Interview' } }),
    ]);

    return { totalApplied, pending, interviewed };
  }

  // Get own applications list
  async getMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  // ==========================================
  // 2. ADMIN: DASHBOARD & SYSTEM OVERVIEW
  // ==========================================

  // [UPDATED] Get Global Stats for Admin Dashboard
  async getAdminDashboardStats() {
    const [totalBlogs, pendingApps, approvedProviders, totalNurses] = await Promise.all([
      this.prisma.blog.count(),
      this.prisma.serviceRequest.count({ where: { status: 'Pending' } }),
      this.prisma.serviceRequest.count({ where: { status: 'Approved' } }),
      this.prisma.user.count({ where: { role: 'NURSE' } }),
    ]);

    // Fetch latest 5 requests for the dashboard table
    const latestRequests = await this.prisma.serviceRequest.findMany({
      where: { status: 'Pending' },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalBlogs,
      pendingApps,
      approvedProviders,
      totalNurses,
      latestRequests
    };
  }

  // ==========================================
  // 3. ADMIN: JOB APPLICATIONS MANAGEMENT
  // ==========================================

  async getAllApplications() {
    return this.prisma.application.findMany({
      include: {
        job: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async updateStatus(applicationId: string, status: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: { job: true },
    });
  }

  // ==========================================
  // 4. ADMIN: SERVICE REQUESTS / APPROVALS
  // ==========================================

  async findRequestsByStatus(status: string) {
    return this.prisma.serviceRequest.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRequestStatus(id: string, status: string) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data: { status },
    });
  }

  async deleteRequest(id: string) {
    return this.prisma.serviceRequest.delete({
      where: { id },
    });
  }

  // ==========================================
  // 5. BUSINESS: DASHBOARD & APPLICANT MGMT
  // ==========================================

  async getBusinessDashboardStats(businessId: string) {
    const [activeShifts, totalApplicants, hiredToday, subscription] = await Promise.all([
      this.prisma.job.count({ where: { postedById: businessId } }),
      this.prisma.application.count({ 
        where: { 
          job: { postedById: businessId } 
        } 
      }),
      this.prisma.application.count({ 
        where: { 
          job: { postedById: businessId },
          status: 'Approved',
          appliedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        } 
      }),
      this.prisma.businessSubscription.findFirst({
        where: { userId: businessId, status: 'ACTIVE' },
        include: { tier: true }
      })
    ]);

    return { 
      activeShifts, 
      totalApplicants, 
      hiredToday,
      subscription: subscription ? {
        planName: subscription.tier.name,
        jobsLimit: subscription.tier.jobsLimit,
        jobsPosted: subscription.jobsPostedCount
      } : null
    };
  }

  async getBusinessJobsApplications(businessId: string) {
    const apps = await this.prisma.application.findMany({
      where: {
        job: { postedById: businessId }
      },
      include: {
        job: true,
        user: {
          include: {
            profile: true,
            reviewsReceived: {
              select: { rating: true }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    // Map through and calculate average rating
    return apps.map(app => {
      const reviews = app.user.reviewsReceived || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
        : 0;

      return {
        ...app,
        nurseRating: {
          average: averageRating,
          count: totalReviews
        }
      };
    });
  }

  async updateStatusByBusiness(businessId: string, applicationId: string, status: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.postedById !== businessId) {
      throw new BadRequestException('Aap is application ka status update nahi kar sakte, kyunki ye job aapne post nahi ki thi!');
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: { job: true, user: true },
    });
  }
}