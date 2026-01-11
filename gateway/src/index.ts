import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { currentUser, requireAuth } from './middlewares/auth';

const app = express();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';
const STOCKS_SERVICE_URL = process.env.STOCKS_SERVICE_URL || 'http://stocks-service:3000';
const PORTFOLIO_SERVICE_URL = process.env.PORTFOLIO_SERVICE_URL || 'http://portfolio-service:3000';

// Middleware to extract user from token
app.use(currentUser);

// Auth Service Proxy
app.use('/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '/auth', // Keep /auth prefix if service expects it, or strip if service mounts at /
        // My Auth service mounts at /auth, so we keep it.
    },
}));

// Stocks Service Proxy
// Public read, maybe protected write. simpler to just proxy for now.
app.use('/stocks', createProxyMiddleware({
    target: STOCKS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/stocks': '/stocks',
    },
}));

// Portfolio Service Proxy (Protected)
app.use('/portfolio', requireAuth, createProxyMiddleware({
    target: PORTFOLIO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/portfolio': '/portfolio',
    },
}));

app.get('/health', (req, res) => {
    res.send('Gateway is Healthy');
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});
