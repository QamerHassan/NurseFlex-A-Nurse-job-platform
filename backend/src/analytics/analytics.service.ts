import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getBusinessAnalytics(businessId: string) {
    const jobs = await this.prisma.job.findMany({
      where: { postedById: businessId },
      include: { applications: true }
    });

    const totalJobs = jobs.length;
    const activeJobs = jobs.length; // No status field on Job model currently
    const closedJobs = 0;

    let totalApplications = 0;
    let approvedApplications = 0;
    let rejectedApplications = 0;

    // Timeline data (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timelineDataMap = new Map();
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      timelineDataMap.set(key, { name: key, applications: 0, jobs: 0 });
    }

    jobs.forEach(job => {
      const jDate = new Date(job.createdAt);
      const jKey = `${months[jDate.getMonth()]} ${jDate.getFullYear()}`;
      if (timelineDataMap.has(jKey)) {
        timelineDataMap.get(jKey).jobs += 1;
      }

      totalApplications += job.applications.length;
      job.applications.forEach(app => {
        if (app.status === 'Approved') approvedApplications += 1;
        if (app.status === 'Rejected') rejectedApplications += 1;

        const aDate = new Date(app.appliedAt);
        const aKey = `${months[aDate.getMonth()]} ${aDate.getFullYear()}`;
        if (timelineDataMap.has(aKey)) {
          timelineDataMap.get(aKey).applications += 1;
        }
      });
    });

    const approvalRate = totalApplications > 0 
      ? Math.round((approvedApplications / totalApplications) * 100) 
      : 0;

    return {
      jobs: { total: totalJobs, active: activeJobs, closed: closedJobs },
      applications: { total: totalApplications, approved: approvedApplications, rejected: rejectedApplications, approvalRate },
      timeline: Array.from(timelineDataMap.values())
    };
  }
}
