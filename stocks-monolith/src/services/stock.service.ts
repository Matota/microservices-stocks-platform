import { StockRepository } from '../repositories/stock.repository.js';
import { TradeRepository } from '../repositories/trade.repository.js';
import logger from '../utils/logger.js';

const stockRepository = new StockRepository();
const tradeRepository = new TradeRepository();

export class StockService {
    async getAllStocks() {
        return stockRepository.findAll();
    }

    async createStock(data: any) {
        const existing = await stockRepository.findBySymbol(data.symbol);
        if (existing) throw new Error('Stock already exists');
        return stockRepository.create(data);
    }

    async executeTrade(userId: string, data: any) {
        const stock = await stockRepository.findBySymbol(data.symbol);
        if (!stock) throw new Error('Stock not found');

        if (data.type === 'SELL') {
            const holding = await tradeRepository.getHolding(userId, stock.id);
            if (!holding || holding.quantity < data.quantity) {
                throw new Error('Insufficient shares to sell');
            }
        }

        const trade = await tradeRepository.executeTrade(
            userId,
            stock.id,
            data.type,
            data.quantity,
            stock.price
        );

        logger.info(`Trade executed: ${data.type} ${data.quantity} shares of ${data.symbol} for user ${userId}`);
        return trade;
    }

    async getPortfolio(userId: string) {
        const portfolio = await tradeRepository.getUserPortfolio(userId);
        return portfolio.map(item => ({
            symbol: item.stock.symbol,
            name: item.stock.name,
            quantity: item.quantity,
            currentPrice: item.stock.price,
            value: item.quantity * item.stock.price
        }));
    }
}
