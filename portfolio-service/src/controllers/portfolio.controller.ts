import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';

const portfolioService = new PortfolioService();

export class PortfolioController {
    async getPortfolio(req: Request, res: Response) {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) return res.status(401).json({ message: 'User ID missing' });

        const portfolio = await portfolioService.getPortfolio(userId);
        res.json(portfolio);
    }

    async trade(req: Request, res: Response) {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) return res.status(401).json({ message: 'User ID missing' });

        const { symbol, shares, action } = req.body;

        try {
            const trade = await portfolioService.executeTrade(userId, symbol, Number(shares), action);
            res.status(201).json(trade);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
