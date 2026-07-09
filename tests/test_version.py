from backend.services.version import version_service

def test_version_metadata():
    meta = version_service.get_metadata()
    assert "version" in meta
    assert "capabilities" in meta
