import httpx
from backend.config import settings

class HealthService:
    async def check_liveness(self) -> bool:
        # Container liveness check
        return True
        
    async def check_readiness(self) -> bool:
        # Verify LLM connectivity
        url = f"{settings.gemini_base_url.rstrip('/')}/models"
        headers = {}
        if settings.gemini_api_key:
            headers["Authorization"] = f"Bearer {settings.gemini_api_key}"
            
        # For local Ollama models, /models is not standard, we check standard base url
        if "generativelanguage" not in settings.gemini_base_url:
            url = settings.gemini_base_url
            
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(url, headers=headers)
                return res.status_code == 200 or "generativelanguage" not in settings.gemini_base_url
        except Exception:
            return False

health_service = HealthService()
