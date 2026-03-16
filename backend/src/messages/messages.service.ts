import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { withRetry } from '../utils/prisma-utils';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    private isValidObjectId(id: string): boolean {
        return /^[0-9a-fA-F]{24}$/.test(id);
    }

    async getConversations(userId: string) {
        console.log("🔍 MessagesService.getConversations for:", userId);
        const conversations = await withRetry(
            () => this.prisma.conversation.findMany({
                where: {
                    participantIds: { has: userId },
                },
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
                orderBy: { updatedAt: 'desc' },
            }),
            3, 1000, 'getConversations'
        );

        // Fetch participant details for each conversation
        const detailedConversations = await Promise.all(
            conversations.map(async (conv) => {
                const participants = await withRetry(
                    () => this.prisma.user.findMany({
                        where: {
                            id: { in: conv.participantIds },
                        },
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                            profile: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }),
                    3, 1000, 'getParticipants'
                );
                return { ...conv, participants };
            })
        );

        return detailedConversations;
    }

    async getMessages(conversationId: string) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async sendMessage(conversationId: string, senderId: string, content: string) {
        const message = await withRetry(
            () => this.prisma.message.create({
                data: { conversationId, senderId, content },
            }),
            3, 1000, 'sendMessage.create'
        );

        await withRetry(
            () => this.prisma.conversation.update({
                where: { id: conversationId },
                data: { updatedAt: new Date() },
            }),
            3, 1000, 'sendMessage.updateConv'
        );

        return message;
    }

    async createConversation(participantIds: string[]) {
        console.log("💬 MessagesService.createConversation: Starting for participants:", participantIds);

        const validIds = participantIds?.filter(id => id && this.isValidObjectId(id));

        if (!validIds || validIds.length < 2) {
            console.error("❌ MessagesService: Invalid or missing participant IDs:", participantIds);
            throw new BadRequestException(`Invalid participants provided: ${JSON.stringify(participantIds)}`);
        }

        try {
            // 1. Look for an existing conversation with these exact participants
            console.log("🔍 MessagesService: Searching for existing conversation...");
            const existing = await this.prisma.conversation.findFirst({
                where: {
                    participantIds: {
                        hasEvery: validIds
                    }
                }
            });

            // Double check length to ensure it's not a larger group that happens to have these two
            if (existing && existing.participantIds.length === validIds.length) {
                console.log("✅ MessagesService: Found existing conversation:", existing.id);
                return existing;
            }

            // 2. Create new if not found
            console.log("🆕 MessagesService: Creating new conversation...");
            return await withRetry(
                () => this.prisma.conversation.create({
                    data: { participantIds: validIds },
                }),
                3, 1000, 'createConversation'
            );
        } catch (error: any) {
            console.error("❌ MessagesService.createConversation Error:", error.message || error);
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException("Failed to process conversation in database");
        }
    }
}
