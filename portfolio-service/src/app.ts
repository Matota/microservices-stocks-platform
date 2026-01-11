import express from 'express';
import { portfolioRouter } from './routes/portfolio.routes';

const app = express();
app.use(express.json());

app.use('/portfolio', portfolioRouter);

app.get('/health', (req, res) => {
    res.send('Portfolio Service is Healthy');
});

export { app };
