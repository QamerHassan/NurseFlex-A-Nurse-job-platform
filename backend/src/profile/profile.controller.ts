import { Controller, Get, Patch, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard) // Token lazmi hai
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  // Apni profile dekhne ke liye: GET http://localhost:3001/profile
  @Get()
  async getMyProfile(@Req() req) {
    try {
      return await this.profileService.getProfile(req.user.userId);
    } catch (error) {
      console.error("🔥 ProfileController.getMyProfile Error:", error);
      throw error;
    }
  }

  // Public profile dekhne ke liye: GET http://localhost:3001/profile/:id
  @Get(':id')
  async getPublicProfile(@Req() req, @Param('id') userId: string) {
    // If 'update' or 'onboard' comes here occasionally, let it pass to specific routes
    if (userId === 'update' || userId === 'onboard') return;
    return this.profileService.getPublicProfile(userId);
  }

  // Profile update karne ke liye: PATCH http://localhost:3001/profile/update
  @Patch('update')
  async update(@Req() req, @Body() body: any) {
    return this.profileService.updateProfile(req.user.userId, body);
  }

  // Onboarding khatam karne ke liye: POST http://localhost:3001/profile/onboard
  @Post('onboard')
  async onboard(@Req() req, @Body() body: any) {
    return this.profileService.completeOnboarding(req.user.userId, body);
  }
}