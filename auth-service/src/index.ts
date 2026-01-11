import { app } from './app';

const PORT = 3000;

const start = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL must be defined');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined');
    }

    try {
        app.listen(PORT, () => {
            console.log(`Auth Service listening on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
