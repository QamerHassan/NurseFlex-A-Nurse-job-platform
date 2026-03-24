import { Controller, Get, Patch, Post, Body, UseGuards, Req, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  // Profile picture upload karne ke liye: POST http://localhost:3001/profile/upload-picture
  @Post('upload-picture')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }))
  async uploadProfilePicture(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    
    const imageUrl = `/uploads/${file.filename}`;
    
    // Auto-update profile picture in database
    await this.profileService.updateProfile(req.user.userId, { profilePicture: imageUrl });

    return { 
      message: 'Profile picture uploaded successfully',
      url: imageUrl
    };
  }
}