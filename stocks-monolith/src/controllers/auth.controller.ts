import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validations/schemas.js';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const validated = registerSchema.parse(req.body);
            const result = await authService.register(validated);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const validated = loginSchema.parse(req.body);
            const result = await authService.login(validated);
            res.json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: error.errors });
            }
            res.status(401).json({ error: error.message });
        }
    }
}
