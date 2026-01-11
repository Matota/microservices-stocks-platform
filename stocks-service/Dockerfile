FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy shared library
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Setup Service
WORKDIR /app/stocks-service
COPY stocks-service/package.json .
RUN npm install

COPY stocks-service .

# Generate Prisma Client
RUN npx prisma generate

CMD ["npm", "run", "dev"]
