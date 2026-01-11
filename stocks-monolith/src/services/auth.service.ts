import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import { generateToken } from '../middlewares/auth.js';
import logger from '../utils/logger.js';

const userRepository = new UserRepository();

export class AuthService {
    async register(data: any) {
        const existing = await userRepository.findByEmail(data.email);
        if (existing) throw new Error('Email already registered');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create({
            ...data,
            password: hashedPassword,
        });

        logger.info(`User registered: ${user.email}`);
        return { id: user.id, email: user.email };
    }

    async login(data: any) {
        const user = await userRepository.findByEmail(data.email);
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = generateToken({ id: user.id, email: user.email });
        logger.info(`User logged in: ${user.email}`);
        return { user: { id: user.id, email: user.email }, token };
    }
}
