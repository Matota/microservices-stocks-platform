FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy shared library
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Setup Service
WORKDIR /app/portfolio-service
COPY portfolio-service/package.json .
RUN npm install

COPY portfolio-service .

# Generate Prisma Client
RUN npx prisma generate

CMD ["npm", "run", "dev"]
