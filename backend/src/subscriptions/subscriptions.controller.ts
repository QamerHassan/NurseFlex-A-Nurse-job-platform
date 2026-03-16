import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMySubscription(@Req() req) {
        // req.user comes from JwtAuthGuard
        return this.subscriptionsService.getMySubscription(req.user.userId || req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-payment-intent')
    createPaymentIntent(@Req() req, @Body() data: { tierId?: string; amount?: number; currency?: string }) {
        const userId = req.user.userId || req.user.id;
        return this.subscriptionsService.createPaymentIntent(userId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('confirm')
    confirmPayment(@Req() req, @Body() data: { tierId: string, paymentIntentId: string }) {
        return this.subscriptionsService.confirmPayment(req.user.userId || req.user.id, data.tierId, data.paymentIntentId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    checkout(@Req() req, @Body() data: any) {
        return this.subscriptionsService.checkout(req.user.userId || req.user.id, data);
    }
}
