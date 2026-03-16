import { Controller, Post, Get, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * POST /reviews
   * Submit a review for a nurse (Business only)
   */
  @Post()
  async createReview(
    @Req() req: any,
    @Body() body: { nurseId: string; rating: number; comment?: string; jobId?: string },
  ) {
    return this.reviewsService.createReview(
      req.user.userId,
      body.nurseId,
      body.rating,
      body.comment,
      body.jobId,
    );
  }

  /**
   * GET /reviews/nurse/:id
   * Retrieve all reviews for a specific nurse
   */
  @Get('nurse/:id')
  async getNurseReviews(@Param('id') nurseId: string) {
    return this.reviewsService.getNurseReviews(nurseId);
  }

  /**
   * GET /reviews/nurse/me/received
   * Retrieve all reviews received by the currently logged-in nurse
   */
  @Get('nurse/me/received')
  async getMyReceivedReviews(@Req() req: any) {
    return this.reviewsService.getNurseReceivedReviews(req.user.userId);
  }

  /**
   * GET /reviews/business/my-given
   * Retrieve all reviews given by the currently logged-in business
   */
  @Get('business/my-given')
  async getMyGivenReviews(@Req() req: any) {
    return this.reviewsService.getBusinessReviews(req.user.userId);
  }

  /**
   * GET /reviews/nurse/:id/average
   * Get the average rating for a nurse
   */
  @Get('nurse/:id/average')
  async getAverageRating(@Param('id') nurseId: string) {
    return this.reviewsService.getAverageRating(nurseId);
  }
}
