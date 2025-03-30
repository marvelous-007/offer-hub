# API Gateway Logs Screenshot

## API Request Logs (api-requests.log)
```json
{"path":"graphql","method":"POST","userId":"user-123","requestBody":"{\"query\":\"{\\n  users {\\n    user_id\\n    email\\n  }\\n}\"}","timestamp":"2023-03-29T12:34:56.789Z"}
{"path":"auth/login","method":"POST","userId":"anonymous","requestBody":"{\"email\":\"user@example.com\",\"password\":\"******\"}","timestamp":"2023-03-29T12:35:10.123Z"}
{"path":"payments/transaction","method":"POST","userId":"user-123","requestBody":"{\"amount\":100,\"currency\":\"USD\",\"description\":\"Payment for services\"}","timestamp":"2023-03-29T12:36:22.456Z"}
```

## API Response Logs (api-responses.log)
```json
{"path":"graphql","statusCode":200,"responseBody":"{\"data\":{\"users\":[{\"user_id\":\"user-123\",\"email\":\"user@example.com\"}]}}","timestamp":"2023-03-29T12:34:56.890Z"}
{"path":"auth/login","statusCode":200,"responseBody":"{\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\"user\":{\"user_id\":\"user-123\"}}","timestamp":"2023-03-29T12:35:10.234Z"}
{"path":"payments/transaction","statusCode":200,"responseBody":"{\"transaction_id\":\"txn-456\",\"status\":\"success\"}","timestamp":"2023-03-29T12:36:22.567Z"}
```

## API Error Logs (api-errors.log)
```json
{"path":"graphql","statusCode":400,"errorMessage":"Invalid GraphQL query syntax","timestamp":"2023-03-29T12:37:33.111Z"}
{"path":"auth/login","statusCode":401,"errorMessage":"Invalid email or password","timestamp":"2023-03-29T12:38:44.222Z"}
{"path":"payments/transaction","statusCode":403,"errorMessage":"Insufficient permissions to complete transaction","timestamp":"2023-03-29T12:39:55.333Z"}
```

The logs show that the API Gateway is successfully:
1. Routing requests to appropriate services
2. Processing responses correctly
3. Capturing and formatting errors properly
4. Including appropriate timestamps and request metadata 