import { Request, Response } from 'express';
import { StocksService } from '../services/stocks.service';

const stocksService = new StocksService();

export class StocksController {
    async createStock(req: Request, res: Response) {
        try {
            const { symbol, name } = req.body;
            const stock = await stocksService.createStock(symbol, name);
            res.status(201).json(stock);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getStocks(req: Request, res: Response) {
        const stocks = await stocksService.getStocks();
        res.json(stocks);
    }

    async addQuote(req: Request, res: Response) {
        try {
            const { symbol } = req.params;
            const { price } = req.body;
            const quote = await stocksService.addQuote(symbol, Number(price));
            res.status(201).json(quote);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getQuote(req: Request, res: Response) {
        try {
            const { symbol } = req.params;
            const quote = await stocksService.getQuote(symbol);
            if (!quote) return res.status(404).json({ message: 'Quote not found' });
            res.json(quote);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
