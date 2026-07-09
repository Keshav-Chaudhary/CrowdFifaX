import json
import httpx
from typing import AsyncGenerator, List, Dict
from backend.config import settings

# Server-Sent Events protocol constants
SSE_DATA_PREFIX = "data: "
SSE_DATA_PREFIX_LEN = len(SSE_DATA_PREFIX)
SSE_DONE_SENTINEL = "[DONE]"

class LLMService:
    async def stream_chat(
        self, system_prompt: str, messages: List[Dict[str, str]]
    ) -> AsyncGenerator[str, None]:
        
        # Prepare headers and body for OpenAI-compatible endpoint (Gemini or Ollama)
        headers = {
            "Content-Type": "application/json"
        }
        if settings.gemini_api_key:
            headers["Authorization"] = f"Bearer {settings.gemini_api_key}"
            
        formatted_messages = [{"role": "system", "content": system_prompt}]
        for chat_message in messages:
            formatted_messages.append({"role": chat_message["role"], "content": chat_message["content"]})
            
        payload = {
            "model": settings.gemini_model,
            "messages": formatted_messages,
            "stream": True,
            "temperature": 0.2,
            "max_tokens": 256
        }
        
        url = f"{settings.gemini_base_url.rstrip('/')}/chat/completions"
        
        # In case settings.gemini_api_key is empty and base url is gemini, use offline MockLLM
        if not settings.gemini_api_key and "generativelanguage" in settings.gemini_base_url:
            from backend.services.mock_llm import mock_llm_service
            async for chunk in mock_llm_service.stream_chat(system_prompt, messages):
                yield chunk
            return

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                async with client.stream("POST", url, headers=headers, json=payload) as response:
                    if response.status_code != 200:
                        error_body = await response.aread()
                        yield f"LLM Connection Error (HTTP {response.status_code}): {error_body.decode('utf-8')}"
                        return
                        
                    async for stream_line in response.iter_lines():
                        if not stream_line.strip():
                            continue
                        if stream_line.startswith(SSE_DATA_PREFIX):
                            raw_event_data = stream_line[SSE_DATA_PREFIX_LEN:]
                            if raw_event_data.strip() == SSE_DONE_SENTINEL:
                                break
                            try:
                                parsed_event = json.loads(raw_event_data)
                                content = parsed_event["choices"][0]["delta"].get("content", "")
                                if content:
                                    yield content
                            except Exception:
                                pass
        except Exception as stream_error:
            yield f"LLM Exception encountered: {str(stream_error)}"

llm_service = LLMService()
