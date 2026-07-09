import re
import os
from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader

API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def verify_api_key(api_key: str = Security(api_key_header)) -> str:
    """Verify incoming header matches environment security key."""
    expected_key = os.getenv("CROWD_FIFA_API_KEY", "dev-secure-key-2026")
    if not api_key or api_key != expected_key:
        raise HTTPException(status_code=403, detail="Invalid or missing API Key")
    return api_key

# Suspicious pattern classifiers for prompt injection or system override attempts
SUSPICIOUS_PATTERNS = [
    r"(?i)ignore\s+(?:all\s+)?prior\s+instructions",
    r"(?i)system\s+override",
    r"(?i)you\s+are\s+now\s+an\s+advisor",
    r"(?i)reveal\s+(?:your\s+)?system\s+prompt",
    r"(?i)forget\s+(?:everything\s+)?you\s+were\s+told",
    r"(?i)as\s+a\s+developer\s+mode",
    r"(?i)bypass\s+restrictions",
    # SQL Injection Patterns
    r"(?i)(union\s+select|drop\s+table|insert\s+into|delete\s+from|update\s+.*set)",
    r"(?i)(--|\b1=1\b|xp_cmdshell)",
    # XSS Payload Patterns
    r"(?i)(<script.*?>|javascript:|onerror=)"
]

PII_PATTERNS = {
    "email": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "phone": r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
    "credit_card": r"\b(?:\d[ -]*?){13,16}\b"
}

MAX_PROMPT_LENGTH = 4000

def validate_prompt_input(text: str) -> str:
    """Sanitize prompt inputs, check length constraints, and mask PII."""
    if len(text) > MAX_PROMPT_LENGTH:
         raise HTTPException(status_code=413, detail="Payload Too Large")
         
    # 1. Clean up characters to avoid injection attempts
    cleaned = text.strip()
    
    # 2. Check for suspicious override and injection patterns
    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, cleaned):
            raise HTTPException(
                status_code=400,
                detail="Adversarial or Malicious input detected (SQLi/XSS/Prompt Injection). Request blocked."
            )
            
    # 3. Mask PII to protect user privacy
    for pii_type, pattern in PII_PATTERNS.items():
        cleaned = re.sub(pattern, f"[{pii_type.upper()}_MASKED]", cleaned)
        
    return cleaned
