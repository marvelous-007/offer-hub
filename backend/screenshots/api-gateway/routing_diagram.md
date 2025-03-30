# API Gateway Routing Diagram

```
┌──────────────┐       ┌───────────────────┐       ┌───────────────────┐
│              │       │                   │       │                   │
│   Client     │──────▶│   API Gateway    │──────▶│   Hasura GraphQL  │
│   Requests   │       │   (NestJS)       │       │       Engine      │
│              │       │                   │       │                   │
└──────────────┘       └───────┬───────────┘       └───────────────────┘
                               │
                               │
                               ▼
                       ┌───────────────────┐
                       │                   │
                       │  Authentication   │
                       │     Service      │
                       │                   │
                       └───────────────────┘
                               │
                               │
                               ▼
                       ┌───────────────────┐
                       │                   │
                       │     Payments      │
                       │     Service      │
                       │                   │
                       └───────────────────┘
```

## Request Flow

1. Client sends a request to API Gateway (`http://localhost:3001/{endpoint}`)
2. API Gateway validates the request and checks authentication if needed
3. Based on the endpoint path, the gateway routes the request:
   - `/graphql` → Hasura GraphQL Engine
   - `/auth/*` → Authentication Service
   - `/payments/*` → Payments Service
4. The service processes the request and sends a response
5. API Gateway logs the request/response for monitoring
6. API Gateway returns the response to the client

## Caching Mechanism

For GraphQL queries, the gateway implements caching to improve performance:

```
┌──────────┐     ┌───────────┐     ┌─────────┐     ┌───────┐
│          │     │           │  ✓  │         │     │       │
│  Client  │────▶│  Gateway  │────▶│  Cache  │────▶│ Client│
│          │     │           │     │         │     │       │
└──────────┘     └─────┬─────┘     └─────────┘     └───────┘
                       │  ✗
                       ▼
              ┌─────────────────┐     ┌───────┐
              │                 │     │       │
              │  Hasura GraphQL │────▶│ Client│
              │                 │     │       │
              └─────────────────┘     └───────┘
``` 