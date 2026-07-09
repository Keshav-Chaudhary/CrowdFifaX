from backend.services.cache import prompt_cache

def test_cache_set_get():
    prompt_cache.set("sys2", "usr2", "resp2")
    assert prompt_cache.get("sys2", "usr2") == "resp2"
