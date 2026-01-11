import express from 'express';
import { stocksRouter } from './routes/stocks.routes';

const app = express();
app.use(express.json());

app.use('/stocks', stocksRouter);

app.get('/health', (req, res) => {
    res.send('Stocks Service is Healthy');
});

export { app };
