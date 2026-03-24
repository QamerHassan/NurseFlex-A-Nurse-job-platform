import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    // Terminal mein check karein ke kya ye print ho raha hai?
    console.log('--- Login Request Received ---');
    console.log('Body:', body);

    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email and Password are required');
    }

    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: any) {
    console.log('--- Register Request Received ---');
    console.log('Body:', body);

    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email and Password are required');
    }

    const { name, email, password, role, ...additionalInfo } = body;
    
    // Ensure yearsOfExperience is a number if it exists and is not an empty string
    if (additionalInfo.yearsOfExperience !== undefined && additionalInfo.yearsOfExperience !== '') {
      additionalInfo.yearsOfExperience = Number(additionalInfo.yearsOfExperience);
    } else {
      delete additionalInfo.yearsOfExperience;
    }

    return this.authService.register(name, email, password, role, additionalInfo);
  }

  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() body: any) {
    const admin = await this.authService.validateAdmin(body.email, body.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid Admin credentials');
    }
    return admin;
  }
}