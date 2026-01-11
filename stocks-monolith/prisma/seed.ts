import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial stock data...');

    const stocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 225.40 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.20 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.50 },
        { symbol: 'TSLA', name: 'Tesla, Inc.', price: 210.10 },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 185.00 },
    ];

    for (const stock of stocks) {
        await prisma.stock.upsert({
            where: { symbol: stock.symbol },
            update: { price: stock.price },
            create: stock,
        });
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
