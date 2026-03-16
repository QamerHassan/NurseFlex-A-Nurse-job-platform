import { Controller, Post, Delete, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SavedJobsService } from './saved-jobs.service';

@Controller('saved-jobs')
@UseGuards(JwtAuthGuard)
export class SavedJobsController {
    constructor(private readonly savedJobsService: SavedJobsService) { }

    @Post(':jobId')
    async save(@Req() req, @Param('jobId') jobId: string) {
        return this.savedJobsService.saveJob(req.user.userId, jobId);
    }

    @Delete(':jobId')
    async unsave(@Req() req, @Param('jobId') jobId: string) {
        return this.savedJobsService.unsaveJob(req.user.userId, jobId);
    }

    @Get()
    async getMySavedJobs(@Req() req) {
        return this.savedJobsService.getSavedJobs(req.user.userId);
    }

    @Get('check/:jobId')
    async check(@Req() req, @Param('jobId') jobId: string) {
        return { isSaved: await this.savedJobsService.isJobSaved(req.user.userId, jobId) };
    }
}
