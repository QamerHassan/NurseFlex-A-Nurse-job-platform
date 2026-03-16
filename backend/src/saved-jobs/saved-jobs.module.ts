import { Module } from '@nestjs/common';
import { SavedJobsService } from './saved-jobs.service';
import { SavedJobsController } from './saved-jobs.controller';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [SavedJobsService, PrismaService],
    controllers: [SavedJobsController],
    exports: [SavedJobsService],
})
export class SavedJobsModule { }
