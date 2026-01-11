import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';

const router = Router();
const controller = new PortfolioController();

router.get('/', controller.getPortfolio);
router.post('/trade', controller.trade);

export { router as portfolioRouter };
