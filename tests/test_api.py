import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.cache import prompt_cache
from backend.services.rate_limit import rate_limiter

client = TestClient(app)

def test_health_liveness():
    res = client.get("/live")
    assert res.status_code == 200
    assert res.json() == {"status": "alive"}

def test_api_version():
    res = client.get("/api/v1/version")
    assert res.status_code == 200
    data = res.json()
    assert "version" in data
    assert data["capabilities"]["explainable_routing"] is True

def test_metrics_endpoint():
    res = client.get("/metrics")
    assert res.status_code == 200
    assert "crowdfifax_requests_total" in res.text

def test_wayfinding_api():
    payload = {
        "origin": "Gate 1",
        "destination": "Seat 44B",
        "accessibility_needs": ["wheelchair"]
    }
    headers = {"X-API-KEY": "dev-secure-key-2026"}
    res = client.post("/api/v1/wayfinding", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["accessibility_mode"] is True
    assert len(data["reasoning_steps"]) > 0
    assert "congestion_score" in data

def test_caching_layer():
    prompt_cache.store.clear()
    sys_prompt = "system"
    user_prompt = "hello"
    
    # Assert cache is empty first
    assert prompt_cache.get(sys_prompt, user_prompt) is None
    
    # Store value
    prompt_cache.set(sys_prompt, user_prompt, "cached response")
    assert prompt_cache.get(sys_prompt, user_prompt) == "cached response"

def test_rate_limiting_violation():
    rate_limiter.windows.clear()
    client_ip = "1.2.3.4"
    endpoint = "test_endpoint"
    
    # Hit limit
    for _ in range(30):
        assert rate_limiter.is_allowed(client_ip, endpoint) is True
        
    # 31st request should be blocked
    assert rate_limiter.is_allowed(client_ip, endpoint) is False
