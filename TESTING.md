# Testing Guide: Stocks Microservices

Now that the services are running, you can test them using the following methods.

## Method 1: Using Postman (Recommended)

1. Open **Postman**.
2. Click **Import** and select the [postman_collection.json](file:///Users/hiteshahuja/.gemini/antigravity/playground/core-zenith/postman_collection.json) file.
3. This collection includes a login script that automatically sets the `token` variable for subsequent requests.

## Method 2: Using Curl

The **API Gateway** is running on `http://localhost:8080`.

### 1. Auth Service (Registration & Login)

**Register a new user:**
```bash
curl -X POST http://localhost:8080/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "test@test.com", "password": "password123"}'
```

**Login to get a token:**
```bash
curl -X POST http://localhost:8080/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@test.com", "password": "password123"}'
```
> [!TIP]
> Copy the `token` from the response for the Portfolio steps.

### 2. Stocks Service (Public Endpoints)

**Create a stock:**
```bash
curl -X POST http://localhost:8080/stocks \
     -H "Content-Type: application/json" \
     -d '{"symbol": "AAPL", "name": "Apple Inc."}'
```

**Add a quote:**
```bash
curl -X POST http://localhost:8080/stocks/AAPL/quote \
     -H "Content-Type: application/json" \
     -d '{"price": 150.50}'
```

**Get current quote:**
```bash
curl -X GET http://localhost:8080/stocks/AAPL/quote
```

### 3. Portfolio Service (Authenticated Endpoints)

**Execution (Buy Stock):**
Replace `<YOUR_TOKEN>` with the token from the login step.
```bash
curl -X POST http://localhost:8080/portfolio/trade \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <YOUR_TOKEN>" \
     -d '{"symbol": "AAPL", "shares": 10, "action": "BUY"}'
```

**Check Portfolio:**
```bash
curl -X GET http://localhost:8080/portfolio \
     -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Method 3: Direct Service Access (Optional)

If you want to bypass the gateway, you can access services directly:
- **Auth**: `http://localhost:3001`
- **Stocks**: `http://localhost:3002`
- **Portfolio**: `http://localhost:3003`
