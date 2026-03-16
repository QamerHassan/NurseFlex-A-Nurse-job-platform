import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getMyNotifications(@Req() req) {
        const userId = req.user.userId || req.user.id;
        return this.notificationsService.getMyNotifications(userId);
    }

    @Patch(':id/read')
    async read(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }

    @Patch('read-all')
    async readAll(@Req() req) {
        const userId = req.user.userId || req.user.id;
        return this.notificationsService.markAllAsRead(userId);
    }
}
