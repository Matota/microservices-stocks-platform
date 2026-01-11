import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const tradeSchema = z.object({
    symbol: z.string().min(1).max(5).toUpperCase(),
    quantity: z.number().int().positive(),
    type: z.enum(['BUY', 'SELL']),
});

export const createStockSchema = z.object({
    symbol: z.string().min(1).max(5).toUpperCase(),
    name: z.string().min(1),
    price: z.number().positive(),
});
