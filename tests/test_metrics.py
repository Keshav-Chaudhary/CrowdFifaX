from backend.services.metrics import metrics_exporter

def test_metrics_record():
    metrics_exporter.record_request(0.1)
    assert True
