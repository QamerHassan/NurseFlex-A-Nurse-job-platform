import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service'; // Hum isi service mein logic add kar sakte hain
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('service-requests')
@UseGuards(JwtAuthGuard)
export class ServiceRequestsController {
    constructor(private readonly appsService: ApplicationsService) { }

    // 0. Get Dashboard Summary (Stats for Admin Home)
    @Get('dashboard-summary')
    async getSummary() {
        return this.appsService.getAdminDashboardStats();
    }

    // 1. Get Pending Requests (For Applications Page)
    @Get('pending')
    async getPending() {
        return this.appsService.findRequestsByStatus('Pending');
    }

    // 2. Get Approved Requests (For Approvals Page)
    @Get('approved')
    async getApproved() {
        return this.appsService.findRequestsByStatus('Approved');
    }

    // 3. Update Status (Approve/Reject)
    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.appsService.updateRequestStatus(id, status);
    }

    // 4. Delete Request
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.appsService.deleteRequest(id);
    }
}
