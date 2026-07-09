import asyncio
from typing import AsyncGenerator, List, Dict
import re

class MockLLMService:
    async def stream_chat(
        self, system_prompt: str, messages: List[Dict[str, str]]
    ) -> AsyncGenerator[str, None]:
        
        # Determine language from system prompt if possible
        lang_match = re.search(r"language:\s*(EN|ES|FR)", system_prompt, re.IGNORECASE)
        language = lang_match.group(1).upper() if lang_match else "EN"
        
        # Simple offline templates
        templates = {
            "EN": "You are currently running in **Offline Mode** (MockLLM). The rules engine has evaluated your context and accessibility needs perfectly. To enable live Gemini LLM phrasing, please configure `GEMINI_API_KEY`.",
            "ES": "Actualmente se encuentra en **Modo sin conexión** (MockLLM). El motor de reglas ha evaluado su contexto perfectamente. Para habilitar el fraseo en vivo con Gemini LLM, configure `GEMINI_API_KEY`.",
            "FR": "Vous êtes actuellement en **Mode hors ligne** (MockLLM). Le moteur de règles a évalué votre contexte parfaitement. Pour activer la formulation en direct avec Gemini LLM, veuillez configurer `GEMINI_API_KEY`."
        }
        
        response_text = templates.get(language, templates["EN"])
        
        # Simulate typing effect
        words = response_text.split(" ")
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.05)

mock_llm_service = MockLLMService()
