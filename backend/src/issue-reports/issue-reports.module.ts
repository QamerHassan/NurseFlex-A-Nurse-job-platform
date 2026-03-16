import { Module } from '@nestjs/common';
import { IssueReportsService } from './issue-reports.service';
import { IssueReportsController } from './issue-reports.controller';
import { PrismaModule } from '../prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, NotificationsModule, EmailModule],
  controllers: [IssueReportsController],
  providers: [IssueReportsService],
  exports: [IssueReportsService],
})
export class IssueReportsModule {}
