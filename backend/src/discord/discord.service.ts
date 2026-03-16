import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private isReady = false;
  private readonly logger = new Logger(DiscordService.name);

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    });
  }

  async onModuleInit() {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      this.logger.warn('⚠️  DISCORD_BOT_TOKEN not set. Discord features disabled.');
      return;
    }

    try {
      await this.client.login(BOT_TOKEN);
      this.isReady = true;
      this.logger.log('✅ NurseFlex Discord Bot is Online');
    } catch (error) {
      this.logger.error('❌ Discord Login Failed — continuing without Discord:', error.message);
    }
  }

  async getMemberCount(guildId: string): Promise<number> {
    if (!this.isReady) return 0;
    try {
      const guild = await this.client.guilds.fetch(guildId);
      return guild.memberCount;
    } catch {
      return 0;
    }
  }

  async sendAdminAlert(channelId: string, message: string): Promise<void> {
    if (!this.isReady) return;
    try {
      const channel = await this.client.channels.fetch(channelId) as TextChannel;
      if (channel) {
        await channel.send(`🛡️ **Admin Action:** ${message}`);
      }
    } catch {
      this.logger.warn('Could not send Discord alert.');
    }
  }
}