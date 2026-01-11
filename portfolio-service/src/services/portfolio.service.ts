import { PrismaClient, PortfolioItem, Trade } from '@prisma/client';
import axios from 'axios';
import { broker } from './message-broker';
import { EventType, TradeExecutedEvent } from 'stock-common';

const prisma = new PrismaClient();
const STOCKS_SERVICE_URL = process.env.STOCKS_SERVICE_URL || 'http://stocks-service:3000';

export class PortfolioService {
    async getPortfolio(userId: string): Promise<PortfolioItem[]> {
        return prisma.portfolioItem.findMany({ where: { userId } });
    }

    async executeTrade(userId: string, symbol: string, shares: number, action: 'BUY' | 'SELL'): Promise<Trade> {
        // 1. Get Stock Price
        let price = 0;
        try {
            const response = await axios.get(`${STOCKS_SERVICE_URL}/stocks/${symbol}/quote`);
            price = response.data.price;
        } catch (error) {
            throw new Error('Failed to fetch stock price');
        }

        const shareChange = action === 'BUY' ? shares : -shares;

        // 2. Transaction: Update Portfolio & Record Trade
        const result = await prisma.$transaction(async (tx) => {
            // Check current holdings if Selling
            if (action === 'SELL') {
                const current = await tx.portfolioItem.findUnique({
                    where: { userId_symbol: { userId, symbol } },
                });
                if (!current || current.shares < shares) {
                    throw new Error('Insufficient shares');
                }
            }

            // Update Portfolio
            const portfolioItem = await tx.portfolioItem.upsert({
                where: { userId_symbol: { userId, symbol } },
                update: { shares: { increment: shareChange } },
                create: { userId, symbol, shares: shareChange },
            });

            // Record Trade
            const trade = await tx.trade.create({
                data: {
                    userId,
                    symbol,
                    shares: shareChange,
                    price,
                },
            });

            return trade;
        });

        // 3. Publish Event
        const event: TradeExecutedEvent = {
            type: EventType.TradeExecuted,
            data: {
                id: result.id,
                userId: result.userId,
                symbol: result.symbol,
                shares: result.shares,
                price: result.price,
                timestamp: result.timestamp // Type mismatch fix might be needed if Date objects, but common uses Date.
            }
        };
        await broker.publish('trade.executed', event);

        return result;
    }
}
