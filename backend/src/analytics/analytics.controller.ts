import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('business')
  @UseGuards(JwtAuthGuard)
  async getBusinessDashboard(@Req() req) {
    return this.analyticsService.getBusinessAnalytics(req.user.userId);
  }
}
