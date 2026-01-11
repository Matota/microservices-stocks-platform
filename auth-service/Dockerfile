FROM node:22-alpine

WORKDIR /app

# Copy shared library
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Setup Service
WORKDIR /app/auth-service
COPY auth-service/package.json .
# Adjust dependency to point to local shared folder if needed, or rely on file:../shared (which works if structure is preserved)
# Since we copied shared to /app/shared and we are in /app/auth-service, ../shared works.

RUN npm install

COPY auth-service .

# Generate Prisma Client
RUN npx prisma generate

CMD ["npm", "run", "dev"]
