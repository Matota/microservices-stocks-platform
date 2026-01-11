import { Router } from 'express';
import { StocksController } from '../controllers/stocks.controller';

const router = Router();
const controller = new StocksController();

router.post('/', controller.createStock);
router.get('/', controller.getStocks);
router.post('/:symbol/quote', controller.addQuote);
router.get('/:symbol/quote', controller.getQuote);

export { router as stocksRouter };
