import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordBotService implements OnModuleInit {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
  }

  async onModuleInit() {
    await this.client.login('YOUR_DISCORD_BOT_TOKEN');
    console.log('NurseFlex Bot is Online! 🤖');
  }

  async sendNotification(channelId: string, message: string) {
    const channel = await this.client.channels.fetch(channelId) as any;
    channel.send(message);
  }
}