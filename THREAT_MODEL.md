# Threat Model

## Overview
CrowdFifaX processes sensitive telemetry data and integrates with an external AI Provider (Gemini/Ollama). Our threat model prioritizes preventing Prompt Injections, Cross-Site Scripting (XSS), and ensuring data privacy (Local-First architecture).

## Assets
1. **API Keys**: E.g., `GEMINI_API_KEY`. These must remain secure and out of the client bundle.
2. **Local User State**: Telemetry, location routing overrides, preferences. Stored in `localStorage`.
3. **AI Pipeline**: External dependency requiring rate limiting and output sanitization.

## Threat Actors
- **Malicious End Users**: Attempting to manipulate AI via prompt injection or exploit local storage for XSS.
- **External Network Observers**: Attempting to intercept telemetry.

## Threats & Mitigations

### 1. Prompt Injection (AI Manipulation)
**Threat:** User enters malicious commands in chat to bypass restrictions or reveal systemic instructions.
**Mitigation:** 
- Strict context boundary inside `prompt.ts`.
- Validation of outputs against expected schemas using `Zod`.
- No sensitive operational logic relies solely on unstructured LLM output.

### 2. Cross-Site Scripting (XSS)
**Threat:** Malicious payload returned from AI or injected via local storage is executed in the browser.
**Mitigation:**
- Next.js auto-escapes HTML via React DOM.
- Rendered Markdown (via `react-markdown`) explicitly sanitizes content.
- Strict `Content-Security-Policy` limits script sources.

### 3. API Key Exposure
**Threat:** Attackers extract API keys from client bundles.
**Mitigation:**
- API integration happens on the Server side (`/api/assistant`).
- `server-only` import directive strictly enforces this boundary, causing build failures if leaked to the client.

### 4. Denial of Service (DoS)
**Threat:** Exhausting AI token limits or server resources.
**Mitigation:**
- IP-based Fixed Window Rate Limiting on `/api/assistant`.
- Maximum token limits enforced per request.
