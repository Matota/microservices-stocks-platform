import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password required' });
            }
            const user = await authService.register(email, password);
            // Don't send password back
            return res.status(201).json({ id: user.id, email: user.email });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.login(email, password);
            return res.status(200).json({ user: { id: user.id, email: user.email }, token });
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }

    async currentUser(req: Request, res: Response) {
        // Setup middleware to Populate req.user
        // For now, return what we have or 401
        // Implementation depends on Gateway or Service middleware.
        // Since Gateway handles Verification in some designs, or service does it again.
        // We will assume a middleware extracts 'authorization' header.
        // But for simplicity in this demo, 'me' might just decode the token passed.
        return res.json({ message: "Use Gateway /api/users/currentuser to check me" });
    }
}
