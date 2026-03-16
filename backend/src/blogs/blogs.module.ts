import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [UsersModule, NotificationsModule],
    controllers: [BlogController],
    providers: [BlogService, PrismaService],
})
export class BlogsModule { }
