import time
import hashlib
from typing import Optional, Dict, Tuple

class PromptCache:
    def __init__(self, ttl_seconds: int = 45):
        self.ttl = ttl_seconds
        self.store: Dict[str, Tuple[str, float]] = {}
        self.emergency_mode_active = False

    def _hash(self, system_prompt: str, user_prompt: str) -> str:
        combined = f"{system_prompt}|||{user_prompt}"
        return hashlib.sha256(combined.encode("utf-8")).hexdigest()

    def get(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if self.emergency_mode_active:
            # Auto-invalidate all cache entries during active emergencies to ensure dynamic real-time context
            return None
            
        key = self._hash(system_prompt, user_prompt)
        if key not in self.store:
            return None
            
        cached_response, timestamp = self.store[key]
        if time.time() - timestamp > self.ttl:
            del self.store[key]  # Expired
            return None
            
        return cached_response

    def set(self, system_prompt: str, user_prompt: str, value: str):
        if self.emergency_mode_active:
            return
        key = self._hash(system_prompt, user_prompt)
        self.store[key] = (value, time.time())

    def toggle_emergency_mode(self, active: bool):
        self.emergency_mode_active = active
        if active:
            self.store.clear()  # Clear cache instantly on emergency trigger

prompt_cache = PromptCache()
