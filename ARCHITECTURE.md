# Architecture

## Overview
CrowdFifaX employs a variant of **Clean Architecture** to ensure robust separation of concerns, testability, and a clear boundary between presentation, application logic, and external providers (like AI or Cloud APIs).

## Layers

### 1. Presentation
- React Components (Next.js App Router)
- Context Providers (React Context)
- Tailored for accessible, fast-rendering UI components.
- Components never call external services directly.

### 2. Application (Use Cases)
- Defines what the application actually *does*. 
- Exposes clean interfaces for data retrieval and mutation.
- Includes our AI Pipeline configuration (`prompt.ts`, `rate-limit.ts`).

### 3. Domain
- Core entities (e.g., `EmissionFactor`, `Category`, `ActivityRecord`).
- Data integrity constraints and pure calculation functions.
- Highly testable, zero dependencies on UI or networking.

### 4. Infrastructure
- AI Provider integrations (`client.ts`).
- Secure API Routes (`/api/assistant`).
- No UI dependencies. 

## The AI Pipeline Architecture
We strict enforce the following flow for any GenAI feature to prevent injection attacks and ensure reliable schema outputs:

1. **Prompt Builder**: Formats the dynamic context.
2. **Context Builder**: Appends live telemetry and guardrails.
3. **AI Provider**: Makes the secure POST request (Gemini / Ollama).
4. **Response Parser**: Handles SSE streaming chunks.
5. **Output Validator**: Uses Zod to ensure the schema matches expectations before sending it to the client.

*Component -> Use Case -> Prompt Builder -> Provider -> Parser -> Validator -> Mapper -> DTO*

## Core Tenets
- **Data flow is unidirectional.**
- **No direct component-to-database coupling.**
- **Strict separation of AI generation from UI rendering.**
