import { Controller, Get, Post, Body, UseGuards, Query, Req, Patch, Delete, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  // --- ADMIN ROUTES ---
  @UseGuards(JwtAuthGuard)
  @Get('admin/pending')
  async getPendingJobs() {
    return this.jobsService.findAllPending();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  async approveJob(@Param('id') id: string, @Body('status') status: string) {
    return this.jobsService.updateStatus(id, status);
  }

  @Get()
  async getAllJobs(
    @Query('title') title?: string,
    @Query('location') location?: string,
    @Query('minSalary') minSalary?: string,
    @Query('type') type?: string,
    @Query('datePosted') datePosted?: string,
  ) {
    return this.jobsService.findAll(title, location, minSalary, type, datePosted);
  }

  @Get('suggestions')
  async getSuggestions(
    @Query('type') type: 'title' | 'location',
    @Query('q') q: string,
  ) {
    return this.jobsService.getSuggestions(type, q);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-count')
  async getMyJobCount(@Req() req: any) {
    return this.jobsService.getMyJobCount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('business')
  async getBusinessJobs(@Req() req: any) {
    return this.jobsService.findByBusiness(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Req() req: any, @Body() body: any) {
    const postedById = req.user.userId;
    return this.jobsService.create({ ...body, postedById });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateJob(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.jobsService.update(id, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(@Req() req: any, @Param('id') id: string) {
    return this.jobsService.remove(id, req.user.userId);
  }
}