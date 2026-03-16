import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) { }

  // 1. Admin: Get all Registered Nurses with Profiles + Application Count
  async findAllNurses() {
    const users = await this.prisma.user.findMany({
      where: { role: 'NURSE' },
      include: {
        profile: true,
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      isOnboarded: u.isOnboarded,
      createdAt: u.createdAt,
      name: u.profile?.name || null,
      location: u.profile?.location || null,
      applicationCount: u.applications.length,
    }));
  }

  // 2. Admin/Nurse: Find a specific user by ID
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  // 3. Nurse: Update Profile Logic
  async updateProfile(userId: string, updateData: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        profile: { update: { ...updateData } },
      },
      include: { profile: true },
    });
  }

  // 4. Admin: Remove a user from the system
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }

  // 5. Admin: Get all Pending users by role
  async findAllPendingByRole(role: string) {
    // Fetch ALL users of this role, then filter in JS
    // This avoids Prisma/MongoDB issues with NOT queries on missing fields
    const allUsers = await this.prisma.user.findMany({
      where: {
        role: role as any,
      },
      include: {
        profile: true,
        subscriptions: {
          include: { tier: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter: keep users who are NOT approved and NOT rejected
    const pendingUsers = allUsers.filter((u: any) => {
      const status = u.status;
      return status !== 'APPROVED' && status !== 'REJECTED';
    });

    return pendingUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      status: u.status || 'PENDING',
      createdAt: u.createdAt,
      name: u.profile?.name || u.name || u.email?.split('@')[0] || 'Unknown',
      phone: u.profile?.phone || null,
      subscription: u.subscriptions?.[0] || null,
    }));
  }

  // 6. Admin: Update User Status (Approve/Reject)
  async updateStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: status as any },
    });

    // Send email notification if newly approved
    if (status === 'APPROVED' && user.status === 'PENDING') {
      const name = user.profile?.name || user.name || user.email.split('@')[0];
      await this.emailService.sendAccountApprovedEmail(user.email, name, user.role);
    }

    return updatedUser;
  }

  // 7. Dashboard Helper: Count total nurses
  async countNurses() {
    return this.prisma.user.count({ where: { role: 'NURSE' } });
  }

  // 8. Notification Helper: Get all approved users by roles for bulk emails
  async findAllApprovedUsersByRoles(roles: any[]) {
    return this.prisma.user.findMany({
      where: {
        role: { in: roles },
        status: 'APPROVED'
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });
  }
}