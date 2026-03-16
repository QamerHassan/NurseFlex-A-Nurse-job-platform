import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TiersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.subscriptionTier.findMany({
            orderBy: { price: 'asc' }
        });
    }

    async create(data: { name: string; price: number; jobsLimit: number; features: string[]; isPopular?: boolean }) {
        return this.prisma.subscriptionTier.create({ data });
    }

    async update(id: string, data: any) {
        const tier = await this.prisma.subscriptionTier.findUnique({ where: { id } });
        if (!tier) throw new NotFoundException('Tier not found');

        return this.prisma.subscriptionTier.update({
            where: { id },
            data
        });
    }

    async remove(id: string) {
        const tier = await this.prisma.subscriptionTier.findUnique({ where: { id } });
        if (!tier) throw new NotFoundException('Tier not found');

        return this.prisma.subscriptionTier.delete({ where: { id } });
    }
}
