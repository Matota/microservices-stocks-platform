import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { AuthController } from './controllers/auth.controller.js';
import { StockController } from './controllers/stock.controller.js';
import { authMiddleware } from './middlewares/auth.js';
import { errorHandler, apiLimiter } from './middlewares/error.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use('/api/', apiLimiter);

// Controllers
const authController = new AuthController();
const stockController = new StockController();

// Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

app.get('/api/stocks', stockController.getAllStocks);
app.post('/api/stocks', stockController.createStock); // Ideally protected by Admin role

// Protected Routes
app.post('/api/trade', authMiddleware as any, stockController.trade as any);
app.get('/api/portfolio', authMiddleware as any, stockController.getPortfolio as any);

// Error Handling
app.use(errorHandler);

export default app;
