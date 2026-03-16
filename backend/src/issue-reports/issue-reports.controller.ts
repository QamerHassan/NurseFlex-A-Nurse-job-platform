import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { IssueReportsService } from './issue-reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('issue-reports')
export class IssueReportsController {
  constructor(private readonly issueReportsService: IssueReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() data: { category: string; message: string; jobId?: string }) {
    return this.issueReportsService.create({
      ...data,
      userId: req.user.userId || req.user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.issueReportsService.findAll();
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  findByJob(@Param('jobId') jobId: string) {
    return this.issueReportsService.findByJob(jobId);
  }
}
