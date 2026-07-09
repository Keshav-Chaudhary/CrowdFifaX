from backend.config import settings

def test_settings_loaded():
    assert settings is not None
