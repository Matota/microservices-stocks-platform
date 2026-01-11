# Stocks Monolith Backend

A production-ready monolithic backend for a stocks trading platform.

## Features
- **Clean Architecture**: Decoupled Controllers, Services, and Repositories.
- **Auth**: JWT-based authentication (Register/Login/Protected Routes).
- **Trading**: Mock trade execution (BUY/SELL) with portfolio tracking.
- **Validation**: Strict input validation using Zod.
- **Observability**: Structured logging with Winston.
- **Security**: Helmet, CORS, Rate limiting, and Bcrypt password hashing.
- **ORM**: Prisma for type-safe database access and migrations.

## Tech Stack
- Node.js 22
- Express 5
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod (Validation)
- Winston (Logging)

## Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
```

### 2. Run with Docker
```bash
docker-compose up -d --build
```

### 3. Initialize Database
Once the containers are running:
```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

### 4. Development (Local)
If you prefer running the app locally:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Get JWT token

### Stocks & Trading (Protected)
- `GET /api/stocks` - List all stocks
- `POST /api/trade` - Execute a trade (`BUY` or `SELL`)
- `GET /api/portfolio` - View user holdings

## Why Monolith?
This approach is ideal for:
- **Simplicity**: Single codebase, easier deployment, and lower operational overhead.
- **Perfomance**: Local function calls instead of network overhead (RPC/HTTP) between services.
- **Consistency**: Easier to handle database transactions across multiple domains.

Perfect for the initial phase of a project before scaling into the microservices architecture demonstrated in the parent folder.
