import express from 'express';
import { authRouter } from './routes/auth.routes';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
    res.send('Auth Service is Healthy');
});

export { app };
