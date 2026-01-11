import { app } from './app';

const PORT = 3000;

const start = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL must be defined');
    }

    try {
        app.listen(PORT, () => {
            console.log(`Stocks Service listening on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
