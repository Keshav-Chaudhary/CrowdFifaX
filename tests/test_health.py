from backend.services.health import health_service
import pytest

@pytest.mark.asyncio
async def test_health_check():
    assert await health_service.check_liveness() is True
