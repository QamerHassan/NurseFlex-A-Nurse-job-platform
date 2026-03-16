import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // 1. Admin: Sari Nurses ki list nikalne ke liye
  // URL: GET /users/all-nurses
  @UseGuards(JwtAuthGuard)
  @Get('all-nurses')
  findAll() {
    return this.usersService.findAllNurses();
  }

  // ⚠️ IMPORTANT: Specific routes MUST come BEFORE :id wildcard routes

  // 2. Admin: Get all pending users by role (secured)
  // URL: GET /users/pending/NURSE or /users/pending/BUSINESS
  @UseGuards(JwtAuthGuard)
  @Get('pending/:role')
  findPending(@Param('role') role: string) {
    return this.usersService.findAllPendingByRole(role.toUpperCase());
  }

  // 3. Admin: Update user status (approve/reject) (secured)
  // URL: PATCH /users/status/:id
  @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateStatus(id, status.toUpperCase());
  }

  // 4. Dashboard Helper: Count total nurses
  @UseGuards(JwtAuthGuard)
  @Get('count/nurses')
  getCount() {
    return this.usersService.countNurses();
  }

  // 5. Nurse: Apna profile update karne ke liye
  // URL: PATCH /users/profile/:id
  @UseGuards(JwtAuthGuard)
  @Patch('profile/:id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.updateProfile(id, updateData);
  }

  // 6. Admin: User delete karne ke liye
  // URL: DELETE /users/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // 7. ⚠️ MUST be LAST — :id wildcard matches everything!
  // URL: GET /users/:id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}