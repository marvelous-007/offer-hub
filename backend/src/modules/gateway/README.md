# API Gateway Module

The API Gateway centralizes access to all backend services in the OfferHub platform, providing a single entry point for clients to communicate with the various services.

## Features

- **Centralized Routing**: Routes requests to Hasura GraphQL API, Authentication, and Payment services
- **Authentication**: Validates JWT tokens before forwarding requests to secured services
- **Caching**: Implements Redis-based caching for frequently requested data
- **Rate Limiting**: Prevents abuse by limiting the number of requests per client
- **Logging**: Comprehensive logging of all API traffic for monitoring and debugging
- **Health Checks**: Endpoint to verify the health of downstream services

## Endpoints

| Endpoint           | Description                                   | Authentication Required |
|--------------------|-----------------------------------------------|-------------------------|
| `/graphql`         | Forwards requests to Hasura GraphQL engine    | Yes                     |
| `/auth/*`          | Forwards requests to authentication service   | No                      |
| `/payments/*`      | Forwards requests to payment processing       | Yes                     |
| `/cache/invalidate`| Invalidates cached data for specified pattern | Yes                     |
| `/health`          | Health check endpoint                         | No                      |
| `/logs/requests`   | View API request logs                         | Yes                     |
| `/logs/errors`     | View API error logs                           | Yes                     |

## Authentication

The API Gateway implements JWT-based authentication. Clients must include a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

The token is validated before forwarding requests to secured services.

## Caching

The gateway automatically caches GraphQL responses to improve performance. Cache invalidation can be performed through the `/cache/invalidate` endpoint:

```json
POST /cache/invalidate
{
  "pattern": "hasura:users"
}
```

## Rate Limiting

To prevent abuse, the API Gateway implements rate limiting:

- 100 requests per minute per client IP address
- Custom limits can be configured for specific endpoints

## Logging

All API traffic is logged to files in the `/logs` directory:

- `api-requests.log`: Logs all incoming requests
- `api-responses.log`: Logs all outgoing responses
- `api-errors.log`: Logs all errors encountered

## Configuration

Configuration is done through environment variables:

- `PORT`: The port on which the API Gateway listens (default: 3001)
- `JWT_SECRET`: Secret key used to validate JWT tokens
- `HASURA_URL`: URL of the Hasura GraphQL engine
- `HASURA_GRAPHQL_ADMIN_SECRET`: Admin secret for Hasura
- `AUTH_SERVICE_URL`: URL of the authentication service
- `PAYMENTS_SERVICE_URL`: URL of the payment service
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS
- `REDIS_HOST`: Redis host for caching (optional)
- `REDIS_PORT`: Redis port for caching (optional)
- `REDIS_PASSWORD`: Redis password for caching (optional)

## Testing

Run tests for the API Gateway:

```bash
npm test -- --testPathPattern=gateway
``` 