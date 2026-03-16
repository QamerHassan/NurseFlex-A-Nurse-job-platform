import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { ServiceRequestsController } from './service-requests.controller';
import { PrismaService } from '../prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [NotificationsModule, EmailModule],
  providers: [ApplicationsService, PrismaService],
  controllers: [ApplicationsController, ServiceRequestsController],
})
export class ApplicationsModule { }