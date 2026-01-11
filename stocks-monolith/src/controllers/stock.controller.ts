import { Request, Response } from 'express';
import { StockService } from '../services/stock.service.js';
import { tradeSchema, createStockSchema } from '../validations/schemas.js';
import { AuthRequest } from '../middlewares/auth.js';

const stockService = new StockService();

export class StockController {
    async getAllStocks(req: Request, res: Response) {
        try {
            const stocks = await stockService.getAllStocks();
            res.json(stocks);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createStock(req: Request, res: Response) {
        try {
            const validated = createStockSchema.parse(req.body);
            const stock = await stockService.createStock(validated);
            res.status(201).json(stock);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async trade(req: AuthRequest, res: Response) {
        try {
            const validated = tradeSchema.parse(req.body);
            const trade = await stockService.executeTrade(req.user!.id, validated);
            res.status(201).json(trade);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getPortfolio(req: AuthRequest, res: Response) {
        try {
            const portfolio = await stockService.getPortfolio(req.user!.id);
            res.json(portfolio);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
