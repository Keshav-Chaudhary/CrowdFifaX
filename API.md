# Internal API Documentation

CrowdFifaX utilizes Next.js API Routes for backend-to-frontend communication. All routes enforce strict request validation via Zod schemas and implement fixed-window rate limiting.

## Endpoints

### 1. `POST /api/assistant`
Streams a Server-Sent Events (SSE) response containing the GenAI assistant reply based on provided telemetry.

#### Request Headers
- `Content-Type`: `application/json`

#### Request Body
```json
{
  "message": "Is concourse C safe right now?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ],
  "telemetry": {
    "carbonKg": 0,
    "activities": []
  },
  "persona": "fan"
}
```

#### Response
- `200 OK`: `text/event-stream` stream containing markdown chunks.
- `400 Bad Request`: Validation failure (Zod error).
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: AI Provider failure.

### 2. `POST /api/explain`
Generates a structured analysis of current stadium telemetry state using the AI engine.

#### Request Headers
- `Content-Type`: `application/json`

#### Request Body
```json
{
  "telemetry": {
    "carbonKg": 150,
    "activities": [...]
  }
}
```

#### Response
- `200 OK`: JSON containing the analysis payload.
- `429 Too Many Requests`: Rate limit exceeded.

## Validation
Validation logic is isolated into `src/lib/ai/client.ts` and `src/app/api/...` ensuring exact types match expected schemas.
