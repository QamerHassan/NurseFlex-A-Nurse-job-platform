import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get('conversations')
    async getMyConversations(@Req() req) {
        try {
            return await this.messagesService.getConversations(req.user.userId);
        } catch (error) {
            console.error("🔥 MessagesController.getMyConversations Error:", error);
            throw error;
        }
    }
    @Post('start')
    async startConversation(@Req() req, @Body('participantId') participantId: string) {
        return this.messagesService.createConversation([req.user.userId, participantId]);
    }

    @Get(':conversationId')
    async getMessages(@Param('conversationId') conversationId: string) {
        return this.messagesService.getMessages(conversationId);
    }

    @Post(':conversationId')
    async send(@Req() req, @Param('conversationId') conversationId: string, @Body('content') content: string) {
        return this.messagesService.sendMessage(conversationId, req.user.userId, content);
    }
}
