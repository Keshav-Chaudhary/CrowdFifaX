import time
from fastapi import FastAPI, Request, Response, HTTPException, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from backend.config import settings
from backend.logging_conf import configure_logging
from backend.models.schemas import ChatRequest, WayfindingRequest, WayfindingResponse, SimulationScenario, SimulationResponse
from backend.services.security import validate_prompt_input, verify_api_key
from backend.services.context_engine import context_engine
from backend.services.llm import llm_service
from backend.services.routing import routing_engine
from backend.services.health import health_service
from backend.services.version import version_service
from backend.services.cache import prompt_cache
from backend.services.rate_limit import rate_limiter
from backend.services.metrics import metrics_exporter
from backend.services.simulation import simulation_engine

# Setup logger configuration
configure_logging(settings.debug)

app = FastAPI(
    title="CrowdFifaX Smart Stadium Operations Engine",
    description="Explainable Decision Support System (EDSS) for FIFA World Cup 2026™ Operations",
    version="1.0.0"
)

CHARS_PER_TOKEN = 4

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next) -> Response:
    """Inject strict security headers into all outgoing HTTP responses."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

@app.middleware("http")
async def track_latency_middleware(request: Request, call_next) -> Response:
    """Record response latency metrics across HTTP operations."""
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    metrics_exporter.record_request(duration)
    return response

# Probes / Healthcheck Endpoints
@app.get("/health", tags=["Monitoring"])
async def get_health() -> Dict[str, Any]:
    """Check service container liveness."""
    is_alive = await health_service.check_liveness()
    if is_alive:
        return {"status": "ok", "timestamp": time.time()}
    raise HTTPException(status_code=500, detail="Service unhealthy")

@app.get("/live", tags=["Monitoring"])
async def get_liveness() -> Dict[str, str]:
    """Check host container responsiveness."""
    return {"status": "alive"}

@app.get("/ready", tags=["Monitoring"])
async def get_readiness() -> Dict[str, str]:
    """Verify ready state of internal model dependencies."""
    is_ready = await health_service.check_readiness()
    if is_ready:
        return {"status": "ready"}
    raise HTTPException(status_code=503, detail="LLM service dependency not ready")

@app.get("/metrics", tags=["Monitoring"])
async def get_metrics() -> Response:
    """Expose Prometheus formatted metrics instrumentation."""
    return Response(
        content=metrics_exporter.get_prometheus_metrics(),
        media_type="text/plain"
    )

@app.get("/api/v1/version", tags=["Metadata"])
async def get_api_version() -> Dict[str, Any]:
    """Expose build version target and enabled system capabilities."""
    return version_service.get_metadata()

# Core Assistant Chat Endpoint (Streaming Server-Sent Events)
@app.post("/api/v1/chat", tags=["Assistant"])
async def post_chat(request: Request, payload: ChatRequest) -> StreamingResponse:
    """Stream user prompt assistant chat completions."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    rate_limiter.check_limit(client_ip, "chat")
    
    # 1. Sanitize user queries
    for msg in payload.messages:
        if msg.role == "user":
            msg.content = validate_prompt_input(msg.content)
            
    # 2. Build system contextual prompt
    system_prompt = context_engine.build_system_context(payload.context)
    user_query = payload.messages[-1].content if payload.messages else ""
    
    # 3. Check Caching Layer
    cached_response = prompt_cache.get(system_prompt, user_query)
    if cached_response:
        metrics_exporter.record_cache_hit()
        # Return single chunk streaming matching standard SSE generator structure
        async def stream_cached():
            yield cached_response
        return StreamingResponse(stream_cached(), media_type="text/plain")

    # 4. Stream LLM query completions
    async def event_generator():
        collected_chunks = []
        async for chunk in llm_service.stream_chat(system_prompt, [m.model_dump() for m in payload.messages]):
            yield chunk
            collected_chunks.append(chunk)
        
        full_text = "".join(collected_chunks)
        # Record stats using token length mapping constant
        metrics_exporter.record_tokens(len(full_text) // CHARS_PER_TOKEN)
        # Cache results
        prompt_cache.set(system_prompt, user_query, full_text)

    return StreamingResponse(event_generator(), media_type="text/plain")

# Core Wayfinding Endpoint (Explainable Decision Support Routing)
@app.post("/api/v1/wayfinding", response_model=WayfindingResponse, tags=["Routing"])
async def post_wayfinding(request: Request, payload: WayfindingRequest, api_key: str = Depends(verify_api_key)) -> WayfindingResponse:
    """Calculate and return optimal wayfinding routing parameters."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    rate_limiter.check_limit(client_ip, "wayfinding")
    
    path, time_mins, congestion_score, safety_score, delay_saved, reasoning_steps = (
        routing_engine.calculate_route(payload.origin, payload.destination, payload.accessibility_needs)
    )
    
    return WayfindingResponse(
        route_id=f"rt_{int(time.time())}",
        path=path,
        estimated_time_mins=time_mins,
        accessibility_mode="wheelchair" in payload.accessibility_needs,
        congestion_score=congestion_score,
        safety_score=safety_score,
        estimated_delay_saved=delay_saved,
        reasoning_steps=reasoning_steps
    )

# Operations Simulator Injection
@app.post("/api/v1/simulation", response_model=SimulationResponse, tags=["Operations Simulator"])
async def post_simulation(payload: SimulationScenario, api_key: str = Depends(verify_api_key)) -> SimulationResponse:
    """Simulate incident overrides mapping stadium congestion alerts."""
    res = simulation_engine.inject_scenario(
        scenario_type=payload.scenario_type,
        target_zone=payload.target_zone,
        severity=payload.severity
    )
    return SimulationResponse(**res)

@app.post("/api/v1/simulation/reset", tags=["Operations Simulator"])
async def post_simulation_reset(api_key: str = Depends(verify_api_key)) -> Dict[str, str]:
    """Reset active simulation status variables."""
    simulation_engine.clear_scenarios()
    return {"status": "reset_successful"}
