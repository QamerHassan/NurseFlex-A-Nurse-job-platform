import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
    private stripe: Stripe;

    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2026-02-25.clover' as any,
        });
    }

    // Get active subscription for a user
    async getMySubscription(userId: string) {
        return this.prisma.businessSubscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: { tier: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Create Stripe Payment Intent
    async createPaymentIntent(userId: string | null, data: { tierId?: string; amount?: number; currency?: string }) {
        let finalAmount = 0;
        let metadata = { userId: userId || 'guest' };
        const currency = data.currency || 'gbp';

        if (data.tierId) {
            const tier = await this.prisma.subscriptionTier.findUnique({
                where: { id: data.tierId }
            });
            if (!tier) throw new NotFoundException('Selected tier does not exist');
            finalAmount = Math.round(tier.price * 100);
            metadata['tierId'] = data.tierId;
        } else if (data.amount) {
            finalAmount = data.amount;
        } else {
            throw new BadRequestException('Either tierId or amount must be provided');
        }

        if (finalAmount === 0) {
            return { clientSecret: null, isFree: true };
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: finalAmount,
            currency: currency,
            metadata: metadata,
            automatic_payment_methods: { enabled: true }
        });

        return {
            clientSecret: paymentIntent.client_secret,
            isFree: false
        };
    }

    // Handle mock checkout (Legacy/Fallback)
    async checkout(userId: string, data: { tierId: string; paymentMethod: string }) {
        const tier = await this.prisma.subscriptionTier.findUnique({
            where: { id: data.tierId }
        });

        if (!tier) throw new NotFoundException('Selected tier does not exist');

        // Cancel any existing active subscriptions first
        await this.prisma.businessSubscription.updateMany({
            where: { userId, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });

        // Valid processing period: 30 days from now
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        return this.prisma.businessSubscription.create({
            data: {
                userId,
                tierId: data.tierId,
                status: 'ACTIVE',
                startDate,
                endDate,
                jobsPostedCount: 0
            },
            include: { tier: true }
        });
    }

    // Confirm Payment and Create Subscription
    async confirmPayment(userId: string, tierId: string, paymentIntentId: string) {
        // Here you would optimally verify the PaymentIntent status with Stripe
        // const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        // if (intent.status !== 'succeeded') throw new BadRequestException('Payment not successful');

        return this.checkout(userId, { tierId, paymentMethod: 'stripe' });
    }
}
