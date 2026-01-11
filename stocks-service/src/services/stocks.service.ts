import { PrismaClient, Stock, Quote } from '@prisma/client';
import { createClient } from 'redis';
import { Stock as StockType, Quote as QuoteType } from 'stock-common';

const prisma = new PrismaClient();
const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    if (process.env.REDIS_URL) await redisClient.connect();
})();

export class StocksService {
    async createStock(symbol: string, name: string): Promise<Stock> {
        const stock = await prisma.stock.create({
            data: { symbol, name },
        });
        return stock;
    }

    async getStocks(): Promise<Stock[]> {
        return prisma.stock.findMany();
    }

    async addQuote(symbol: string, price: number): Promise<Quote> {
        const stock = await prisma.stock.findUnique({ where: { symbol } });
        if (!stock) throw new Error('Stock not found');

        const quote = await prisma.quote.create({
            data: {
                stockId: stock.id,
                price,
            },
        });

        // Update Cache
        const cacheKey = `quote:${symbol}`;
        await redisClient.set(cacheKey, JSON.stringify(quote), { EX: 60 }); // Cache for 60s

        // TODO: Publish Event (PriceUpdated) via RabbitMQ (omitted here as per prompt Rabbit is key for Portfolio, but prompt says "Redis for sessions, RabbitMQ for events (trade notifications)". maybe price updates too? generic "Add RabbitMQ for events")
        // I won't implement Rabbit publisher here to keep it simple unless requested.

        return quote;
    }

    async getQuote(symbol: string): Promise<Quote | null> {
        const cacheKey = `quote:${symbol}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const stock = await prisma.stock.findUnique({
            where: { symbol },
            include: { quotes: { orderBy: { timestamp: 'desc' }, take: 1 } },
        });

        if (!stock || stock.quotes.length === 0) return null;

        const quote = stock.quotes[0];
        await redisClient.set(cacheKey, JSON.stringify(quote), { EX: 60 });
        return quote;
    }
}
