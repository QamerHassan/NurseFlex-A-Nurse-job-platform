import { Controller, Get, Post, Body } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get('stats')
  async getStats() {
    // Guild ID aapke server ki unique ID hai
    const count = await this.discordService.getMemberCount('YOUR_GUILD_ID');
    return { totalMembers: count, status: 'Connected' };
  }

  @Post('sync-user')
  async syncUser(@Body() data: { userId: string, role: string }) {
    await this.discordService.sendAdminAlert('YOUR_LOG_CHANNEL_ID', `Syncing user ${data.userId} with role ${data.role}`);
    return { success: true, message: 'User sync initiated' };
  }
}