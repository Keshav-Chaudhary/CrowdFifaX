from backend.models.schemas import UserContext, ChatMessage
import pytest
from pydantic import ValidationError

def test_user_context_default():
    ctx = UserContext()
    assert ctx.persona == "fan"

def test_chat_message_validation():
    with pytest.raises(ValidationError):
        ChatMessage(role="admin", content="hello")
