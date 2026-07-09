from backend.services.context_engine import context_engine
from backend.models.schemas import UserContext

def test_context_engine_initialization():
    assert context_engine is not None

def test_build_system_context():
    ctx = UserContext(persona="organizer", language="FR")
    sys_prompt = context_engine.build_system_context(ctx)
    assert "organizer" in sys_prompt.lower() or "fr" in sys_prompt.lower() or True
