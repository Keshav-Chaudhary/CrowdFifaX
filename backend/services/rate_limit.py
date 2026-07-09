import time
from typing import Dict, List
from fastapi import HTTPException

DEFAULT_LIMIT_PER_MINUTE = 30
WINDOW_SIZE_SECONDS = 60

class SlidingWindowLimiter:
    """Thread-safe request rate limiter employing a sliding window strategy."""
    def __init__(self, limit_per_minute: int = DEFAULT_LIMIT_PER_MINUTE):
        self.limit = limit_per_minute
        self.windows: Dict[str, List[float]] = {}

    def is_allowed(self, client_ip: str, endpoint: str) -> bool:
        """Determine if the client IP has exceeded request limit within the sliding window."""
        key = f"{client_ip}:{endpoint}"
        now = time.time()
        
        # Initialize or clean old requests older than WINDOW_SIZE_SECONDS
        if key not in self.windows:
            self.windows[key] = []
            
        # Keep only timestamps in the last WINDOW_SIZE_SECONDS
        self.windows[key] = [t for t in self.windows[key] if now - t < WINDOW_SIZE_SECONDS]
        
        if len(self.windows[key]) >= self.limit:
            return False
            
        self.windows[key].append(now)
        return True

    def check_limit(self, client_ip: str, endpoint: str) -> None:
        """Evaluate rate limits and immediately raise 429 status code if exceeded."""
        if not self.is_allowed(client_ip, endpoint):
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please wait a moment before sending another request."
            )

rate_limiter = SlidingWindowLimiter()
