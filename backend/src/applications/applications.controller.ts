import { 
  Controller, Get, Post, Body, UseGuards, Req, 
  UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly appsService: ApplicationsService) {}

  // 1. [NEW] Nurse: Resume Upload Logic
  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Ensure ye folder backend root mein ho
      filename: (req, file, cb) => {
        // File ka unique naam rakhte hain: userId + timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `resume-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new BadRequestException('Only PDF files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Frontend ko file path return karein
    return { 
      message: 'Resume uploaded successfully',
      url: `/uploads/${file.filename}` 
    };
  }

  // 2. Nurse: Dashboard Stats
  @Get('stats')
  async getStats(@Req() req: any) {
    const userId = req.user.userId;
    return this.appsService.getDashboardStats(userId);
  }

  // 3. Nurse: Apply to a job (Updated with resumeUrl in Body)
  @Post('apply')
  async applyToJob(
    @Req() req: any, 
    @Body('jobId') jobId: string,
    @Body('resumeUrl') resumeUrl?: string // Optional: Profile se bhi aa sakta hai
  ) {
    const userId = req.user.userId;
    return this.appsService.apply(userId, jobId);
  }

  // 4. Nurse: Get only their own applications
  @Get('my-apps')
  async getMyApps(@Req() req: any) {
    const userId = req.user.userId;
    return this.appsService.getMyApplications(userId);
  }

  // 5. Admin: Get ALL applications from all users
  @Get('all')
  async getAllApps() {
    return this.appsService.getAllApplications();
  }

  // 6. Admin: Update application status
  @Post('update-status')
  async updateStatus(
    @Body('applicationId') applicationId: string,
    @Body('status') status: string,
  ) {
    return this.appsService.updateStatus(applicationId, status);
  }

  // 7. Business: Dashboard Stats
  @Get('business/stats')
  async getBusinessStats(@Req() req: any) {
    const businessId = req.user.userId;
    return this.appsService.getBusinessDashboardStats(businessId);
  }

  // 8. Business: Get applications for their jobs
  @Get('business/applicants')
  async getBusinessApplicants(@Req() req: any) {
    const businessId = req.user.userId;
    return this.appsService.getBusinessJobsApplications(businessId);
  }
}