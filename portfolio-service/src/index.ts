import { app } from './app';
import { broker } from './services/message-broker';

const PORT = 3000;

const start = async () => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be defined');
    if (!process.env.RABBITMQ_URL) throw new Error('RABBITMQ_URL must be defined');

    await broker.connect(process.env.RABBITMQ_URL);

    try {
        app.listen(PORT, () => {
            console.log(`Portfolio Service listening on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
