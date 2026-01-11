FROM node:22-alpine

WORKDIR /app

# Copy shared library
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Setup Service
WORKDIR /app/gateway
COPY gateway/package.json .
RUN npm install

COPY gateway .

CMD ["npm", "run", "dev"]
