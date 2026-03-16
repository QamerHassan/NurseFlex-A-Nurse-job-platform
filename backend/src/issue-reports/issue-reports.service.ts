import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class IssueReportsService {
  private readonly logger = new Logger(IssueReportsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  async create(data: { category: string; message: string; userId: string; jobId?: string }) {
    try {
      this.logger.log(`🚀 STARTing Issue Report Creation - Category: ${data.category}, UserID: ${data.userId}, JobID: ${data.jobId || 'NONE'}`);
      
      // 1. Create the issue report
      const report = await this.prisma.issueReport.create({
        data: {
          category: data.category,
          message: data.message,
          userId: data.userId,
          jobId: data.jobId || null,
        },
        include: {
          user: true,
          job: {
            include: {
              postedBy: true
            }
          },
        },
      });

      this.logger.log(`✅ Report created in DB with ID: ${report.id}`);
      this.logger.log(`📊 Report Detail: User: ${report.user?.name || report.user?.email || 'NULL'}, Job: ${report.job?.title || 'NULL'}, PostedBy: ${report.job?.postedBy?.email || 'NULL'}`);

      // 2. Send confirmation email to the Nurse
      try {
        if (report.user && report.user.email) {
          this.logger.log(`📧 Sending confirmation mail to nurse: ${report.user.email}`);
          await this.emailService.sendFeedbackConfirmationEmail(
            report.user.email,
            report.user.name || 'Nurse',
            data.category,
            data.message
          );
          this.logger.log(`✅ Confirmation mail sent to nurse`);

          // [NEW] In-App Notification for the Nurse themselves
          this.logger.log(`🔔 Notifying nurse internally: ${report.user.id}`);
          await this.notificationsService.createNotification(
            report.user.id,
            'Feedback Received',
            `We have received your feedback regarding ${data.category}. Thank you for helping us improve!`,
            'FEEDBACK_CONFIRMATION',
          );
          this.logger.log(`✅ Internal notification created for nurse`);
        } else {
          this.logger.warn(`⚠️ Skipping nurse notifications - No email/user found for report ${report.id}`);
        }
      } catch (e) {
        this.logger.error(`❌ Failed to send nurse notifications for report ${report.id}`, e);
      }

      // 3. Notify the Business User (if jobId is provided)
      try {
        if (report.job && report.job.postedById) {
          const businessUser = report.job.postedBy;
          
          if (businessUser) {
            this.logger.log(`🔔 Notifying business user: ${businessUser.id} (${businessUser.email})`);
            
            // Internal Notification
            await this.notificationsService.createNotification(
              businessUser.id,
              'Job Issue Reported',
              `A nurse (${report.user.name || 'User'}) reported an issue with your job "${report.job.title}". Message: ${data.message}`,
              'ISSUE_REPORT',
            );
            this.logger.log(`✅ Internal notification created for business user`);

            // Email Notification
            if (businessUser.email) {
              this.logger.log(`📧 Sending email alert to business: ${businessUser.email}`);
              await this.emailService.sendIssueReportEmail(
                businessUser.email, 
                'BUSINESS', 
                {
                  category: data.category,
                  message: data.message,
                  jobTitle: report.job.title,
                  nurseName: report.user.name || 'A Nurse',
                  nurseEmail: report.user.email
                }
              );
              this.logger.log(`✅ Email alert sent to business`);
            }
          } else {
            this.logger.warn(`⚠️ Business user record not found for postedById: ${report.job.postedById}`);
          }
        } else {
          this.logger.log(`ℹ️ No jobId or postedById found - skipping business notification`);
        }
      } catch (notifyError) {
        this.logger.error('❌ Failed to notify business user', notifyError);
      }

      // 4. Notify all Admins
      try {
        const admins = await this.prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true, email: true, name: true },
        });

        this.logger.log(`🛡️ Found ${admins.length} admins to notify`);

        for (const admin of admins) {
          this.logger.log(`🔔 Notifying admin: ${admin.id} (${admin.email})`);
          
          // Internal Notification
          await this.notificationsService.createNotification(
            admin.id,
            'New Issue Report',
            `Nurse ${report.user.name || report.user.email} reported an issue: ${data.category}. Message: ${data.message}`,
            'ISSUE_REPORT_ADMIN',
          );
          this.logger.log(`✅ Internal notification created for admin ${admin.id}`);

          // Email Notification
          if (admin.email) {
            this.logger.log(`📧 Sending email alert to admin: ${admin.email}`);
            await this.emailService.sendIssueReportEmail(
              admin.email, 
              'ADMIN', 
              {
                category: data.category,
                message: data.message,
                jobTitle: report.job?.title,
                nurseName: report.user.name || 'User',
                nurseEmail: report.user.email
              }
            );
            this.logger.log(`✅ Email alert sent to admin ${admin.id}`);
          }
        }
      } catch (notifyError) {
        this.logger.error('❌ Failed to notify admins', notifyError);
      }

      this.logger.log(`🎯 Issue Report Flow COMPLETE for ID: ${report.id}`);
      return report;
    } catch (dbError) {
      this.logger.error('❌ FATAL: Failed to create issue report flow', dbError);
      throw dbError; 
    }
  }

  async findAll() {
    return this.prisma.issueReport.findMany({
      include: {
        user: true,
        job: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.issueReport.findMany({
      where: { jobId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
