import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.verifyConnection();
    }

    private async verifyConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('✅ SMTP Connection verified successfully');
        } catch (error) {
            this.logger.error('❌ SMTP Connection failed', error);
        }
    }

    async sendRegistrationPendingEmail(to: string, name: string, role: string) {
        const portalUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
        const roleLabel = role === 'BUSINESS' ? 'Business Facility' : 'Nurse';

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2563eb; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic;">NurseFlex</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome to NurseFlex, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Thank you for registering as a <strong>${roleLabel}</strong>. We have successfully received your registration details.
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <p style="color: #0f172a; margin: 0; font-weight: bold;">Status: Pending Approval</p>
            <p style="color: #475569; margin: 8px 0 0 0; font-size: 14px;">
              Our administrative team is currently reviewing your profile to ensure quality and compliance. 
              This process typically takes 24-48 hours.
            </p>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            We will send you another email as soon as your account is approved and ready to use.
          </p>
          <div style="margin-top: 32px;">
            <a href="${portalUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Return to Portal</a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Notifications" <${process.env.SMTP_USER}>`,
                to,
                subject: 'Registration Pending Approval - NurseFlex',
                html,
            });
            this.logger.log(`Registration pending email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send registration email to ${to}`, error);
        }
    }

    async sendAccountApprovedEmail(to: string, name: string, role: string) {
        const portalUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
        const roleLabel = role === 'BUSINESS' ? 'business' : 'nursing';
        const dashboardUrl = role === 'BUSINESS' ? `${portalUrl}/business/dashboard` : `${portalUrl}/dashboard`;

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #10b981; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic;">NurseFlex</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">Congratulations, ${name}! 🎉</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Great news! Your ${roleLabel} account has been fully <strong>approved</strong> by our administrative team.
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <p style="color: #0f172a; margin: 0; font-weight: bold;">Status: Approved & Active</p>
            <p style="color: #475569; margin: 8px 0 0 0; font-size: 14px;">
              You now have full access to the NurseFlex platform. You can log in and start using your dashboard immediately.
            </p>
          </div>
          <div style="margin-top: 32px; text-align: center;">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
          </div>
          <p style="color: #475569; font-size: 14px; margin-top: 24px;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${dashboardUrl}" style="color: #2563eb;">${dashboardUrl}</a>
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Notifications" <${process.env.SMTP_USER}>`,
                to,
                subject: 'Your Account is Approved! - NurseFlex',
                html,
            });
            this.logger.log(`Account approved email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send approval email to ${to}`, error);
        }
    }

    async sendNewBlogNotification(to: string, blogTitle: string, blogId: string) {
        const portalUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
        const blogUrl = `${portalUrl}/blogs/${blogId}`;

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2563eb; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic;">NurseFlex</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Blog Update! 📖</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hello! Our admin has just posted a new blog: <strong>"${blogTitle}"</strong>.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Stay updated with the latest nursing tips and industry news on the NurseFlex portal.
          </p>
          <div style="margin-top: 32px; text-align: center;">
            <a href="${blogUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">Read Full Blog</a>
          </div>
          <p style="color: #475569; font-size: 14px; margin-top: 24px;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${blogUrl}" style="color: #2563eb;">${blogUrl}</a>
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Notifications" <${process.env.SMTP_USER}>`,
                to,
                subject: `New Blog Posted: ${blogTitle} - NurseFlex`,
                html,
            });
            this.logger.log(`New blog notification email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send blog notification email to ${to}`, error);
        }
    }

    async sendAdminRegistrationAlert(nurse: any, info: any) {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@nurseflex.com';
        
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">New Nurse Registration</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${nurse.profile?.name || nurse.name || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${nurse.email}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${info.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">State:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${info.state || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">License:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${info.licenseNumber || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Specialization:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${info.specialization || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Experience:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${info.yearsOfExperience || '0'} Years</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Resume:</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${info.resumeUrl ? 'Uploaded' : 'No Resume'}</td></tr>
          </table>
          <p style="margin-top: 24px; color: #475569; font-size: 14px;">The profile is currently under review. Please log in to the admin panel to verify and approve.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Systems" <${process.env.SMTP_USER}>`,
                to: adminEmail,
                subject: 'New Nurse Registration Received',
                html,
            });
            this.logger.log(`Admin alert sent for ${nurse.email}`);
        } catch (error) {
            this.logger.error(`Failed to send admin alert`, error);
        }
    }

    async sendNurseWelcomeEmail(to: string, name: string) {
        const portalUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2563eb; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic;">NurseFlex</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome to Our Nurse Community, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Welcome to one of the largest nurse communities in the United States. Your registration has been successfully received. 
          </p>
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #1e40af; margin: 0; font-weight: bold;">Verification in Progress</p>
            <p style="color: #3b82f6; margin: 8px 0 0 0; font-size: 14px;">
              Our team is currently reviewing your profile and will verify your account shortly.
            </p>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Once approved, you will have access to career opportunities with our trusted healthcare partners.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex Community. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Community" <${process.env.SMTP_USER}>`,
                to,
                subject: 'Welcome to Our Nurse Community',
                html,
            });
            this.logger.log(`Nurse welcome email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email to ${to}`, error);
        }
    }

    async sendIssueReportEmail(to: string, role: string, reportData: any) {
        const roleLabel = role === 'ADMIN' ? 'Platform Administrator' : 'Job Poster';
        
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #ef4444; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic;">NurseFlex - Issue Reported</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">Hello ${roleLabel},</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            A new issue has been reported by a nurse on the platform.
          </p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #991b1b; margin: 0; font-weight: bold;">Issue Details:</p>
            <p style="color: #b91c1c; margin: 8px 0 0 0; font-size: 14px;"><strong>Category:</strong> ${reportData.category}</p>
            <p style="color: #b91c1c; margin: 4px 0 0 0; font-size: 14px;"><strong>Message:</strong> ${reportData.message}</p>
            ${reportData.jobTitle ? `<p style="color: #b91c1c; margin: 4px 0 0 0; font-size: 14px;"><strong>Job:</strong> ${reportData.jobTitle}</p>` : ''}
            <p style="color: #b91c1c; margin: 4px 0 0 0; font-size: 14px;"><strong>Nurse:</strong> ${reportData.nurseName} (${reportData.nurseEmail})</p>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Please log in to your dashboard to review this issue and take appropriate action.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Alerts" <${process.env.SMTP_USER}>`,
                to,
                subject: `Issue Reported: ${reportData.category} - NurseFlex`,
                html,
            });
            this.logger.log(`Issue report email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send issue report email to ${to}`, error);
        }
    }

    async sendFeedbackConfirmationEmail(to: string, name: string, category: string, message: string) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #10b981; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic;">NurseFlex - Feedback Received</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; margin-top: 0;">Thank you, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            We have successfully received your feedback/report. Our team is investigating the matter and will get back to you if needed.
          </p>
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #166534; margin: 0; font-weight: bold;">Your Submission:</p>
            <p style="color: #15803d; margin: 8px 0 0 0; font-size: 14px;"><strong>Category:</strong> ${category}</p>
            <p style="color: #15803d; margin: 4px 0 0 0; font-size: 14px;"><strong>Message:</strong> ${message}</p>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your feedback helps us make NurseFlex better for everyone.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Community" <${process.env.SMTP_USER}>`,
                to,
                subject: 'We have received your feedback - NurseFlex',
                html,
            });
            this.logger.log(`Feedback confirmation email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send feedback confirmation email to ${to}`, error);
        }
    }

    async sendApplicationNoticeToBusiness(to: string, businessName: string, nurseName: string, jobTitle: string) {
        const portalUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
        const applicantsUrl = `${portalUrl}/business/applicants`;

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #ec4899; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic; font-size: 28px;">NurseFlex Business</h1>
          <p style="color: #fce7f3; margin: 8px 0 0 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">New Applicant Received</p>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; tracking: -0.5px;">Hello ${businessName},</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            A new professional, <strong>${nurseName}</strong>, has just applied for your job posting: <strong>${jobTitle}</strong>.
          </p>
          
          <div style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <p style="color: #9d174d; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 12px;">Action Required</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">
                Please review their profile and resume to decide on the next steps. You can approve the application or move them to the interview stage directly from your dashboard.
            </p>
          </div>

          <div style="text-align: center;">
            <a href="${applicantsUrl}" style="background-color: #ec4899; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.1), 0 2px 4px -1px rgba(236, 72, 153, 0.06);">Review Applicant</a>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center;">
            Manage your staffing needs efficiently with NurseFlex.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex Business. All rights reserved.</p>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Recruitment" <${process.env.SMTP_USER}>`,
                to,
                subject: `New Application: ${nurseName} for ${jobTitle} - NurseFlex`,
                html,
            });
            this.logger.log(`Business application notice sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send business application notice to ${to}`, error);
        }
    }

    async sendApplicationConfirmationEmail(to: string, name: string, jobTitle: string, facilityName: string) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2563eb; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-style: italic; font-size: 28px;">NurseFlex</h1>
          <p style="color: #bfdbfe; margin: 8px 0 0 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">Application Confirmed</p>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; tracking: -0.5px;">Application Received, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            Your application for the position of <strong>${jobTitle}</strong> at <strong>${facilityName}</strong> has been successfully submitted via NurseFlex.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <p style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 12px;">What happens next?</p>
            <ul style="color: #334155; font-size: 15px; line-height: 1.6; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">The facility will review your profile and resume.</li>
              <li style="margin-bottom: 8px;">If your profile matches their requirements, they will contact you for an interview.</li>
              <li>You can track your application status anytime in your NurseFlex dashboard.</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://127.0.0.1:3000'}/dashboard" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06);">Track Application</a>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center;">
            Thank you for choosing NurseFlex for your career journey.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} NurseFlex Community. All rights reserved.</p>
          <div style="margin-top: 8px;">
            <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy Policy</a>
            <a href="#" style="color: #64748b; text-decoration: none; font-size: 12px; margin: 0 8px;">Contact Support</a>
          </div>
        </div>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"NurseFlex Career" <${process.env.SMTP_USER}>`,
                to,
                subject: `Application Submitted: ${jobTitle} - NurseFlex`,
                html,
            });
            this.logger.log(`Application confirmation email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send application confirmation email to ${to}`, error);
        }
    }
}

