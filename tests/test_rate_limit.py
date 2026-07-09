from backend.services.rate_limit import rate_limiter

def test_rate_limiter_allow():
    assert rate_limiter.is_allowed("192.168.1.1", "test_limit") is True
