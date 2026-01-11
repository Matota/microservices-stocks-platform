import { PrismaClient, Stock } from '@prisma/client';

const prisma = new PrismaClient();

export class StockRepository {
    async findAll(): Promise<Stock[]> {
        return prisma.stock.findMany({
            orderBy: { symbol: 'asc' }
        });
    }

    async findBySymbol(symbol: string): Promise<Stock | null> {
        return prisma.stock.findUnique({ where: { symbol } });
    }

    async create(data: any): Promise<Stock> {
        return prisma.stock.create({ data });
    }

    async updatePrice(symbol: string, price: number): Promise<Stock> {
        return prisma.stock.update({
            where: { symbol },
            data: { price }
        });
    }
}
