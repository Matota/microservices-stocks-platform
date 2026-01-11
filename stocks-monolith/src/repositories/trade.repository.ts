import { PrismaClient, Trade, Portfolio, TradeType } from '@prisma/client';

const prisma = new PrismaClient();

export class TradeRepository {
    async getUserPortfolio(userId: string) {
        return prisma.portfolio.findMany({
            where: { userId, quantity: { gt: 0 } },
            include: { stock: true },
        });
    }

    async executeTrade(userId: string, stockId: string, type: TradeType, quantity: number, price: number): Promise<Trade> {
        const tradeChange = type === 'BUY' ? quantity : -quantity;

        return prisma.$transaction(async (tx) => {
            // 1. Record the trade
            const trade = await tx.trade.create({
                data: {
                    userId,
                    stockId,
                    type,
                    quantity,
                    priceAtTrade: price
                }
            });

            // 2. Update the portfolio
            await tx.portfolio.upsert({
                where: { userId_stockId: { userId, stockId } },
                update: { quantity: { increment: tradeChange } },
                create: { userId, stockId, quantity: tradeChange }
            });

            return trade;
        });
    }

    async getHolding(userId: string, stockId: string): Promise<Portfolio | null> {
        return prisma.portfolio.findUnique({
            where: { userId_stockId: { userId, stockId } }
        });
    }
}
