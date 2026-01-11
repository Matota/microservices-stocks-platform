import * as amqp from 'amqplib';

export class MessageBroker {
    private connection?: any;
    private channel?: any;

    async connect(url: string) {
        try {
            this.connection = await amqp.connect(url);
            if (!this.connection) return;
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('trade-events', 'topic', { durable: false });
            console.log('Connected to RabbitMQ');
        } catch (err) {
            console.error('Failed to connect to RabbitMQ, retrying...', err);
            setTimeout(() => this.connect(url), 5000);
        }
    }

    async publish(key: string, msg: any) {
        if (!this.channel) {
            console.error('RabbitMQ channel not active');
            return;
        }
        this.channel.publish('trade-events', key, Buffer.from(JSON.stringify(msg)));
        console.log(`Published ${key}`);
    }
}

export const broker = new MessageBroker();
