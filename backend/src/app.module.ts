import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { BlogsModule } from './blogs/blogs.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TiersModule } from './tiers/tiers.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EmailModule } from './email/email.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IssueReportsModule } from './issue-reports/issue-reports.module';

@Module({
  imports: [
    // 1. Global Configuration setup (Database URL etc load karne ke liye)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Database Connection Module
    PrismaModule,

    // 3. Application Feature Modules
    EmailModule,   // Global Email Service
    UsersModule,   // User management
    AuthModule,    // JWT and Login logic
    ProfileModule, // Nurse profile details
    JobsModule, ApplicationsModule,    // Job listings and applications
    BlogsModule,
    SavedJobsModule,
    MessagesModule,
    NotificationsModule,
    TiersModule,
    SubscriptionsModule,
    ReviewsModule,
    AnalyticsModule,
    IssueReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }