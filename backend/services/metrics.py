import time
from typing import Dict, Any

class OperationalMetrics:
    def __init__(self):
        self.request_count = 0
        self.latency_sum = 0.0
        self.token_count = 0
        self.cache_hits = 0
        self.emergency_reroutes = 0

    def record_request(self, duration_sec: float):
        self.request_count += 1
        self.latency_sum += duration_sec

    def record_tokens(self, count: int):
        self.token_count += count

    def record_cache_hit(self):
        self.cache_hits += 1

    def record_emergency_reroute(self):
        self.emergency_reroutes += 1

    def get_prometheus_metrics(self) -> str:
        avg_latency = self.latency_sum / self.request_count if self.request_count > 0 else 0.0
        metrics = [
            "# HELP crowdfifax_requests_total Total API requests processed.",
            "# TYPE crowdfifax_requests_total counter",
            f"crowdfifax_requests_total {self.request_count}",
            "",
            "# HELP crowdfifax_avg_latency_seconds Average response latency in seconds.",
            "# TYPE crowdfifax_avg_latency_seconds gauge",
            f"crowdfifax_avg_latency_seconds {avg_latency:.4f}",
            "",
            "# HELP crowdfifax_llm_tokens_total Estimated total LLM tokens processed.",
            "# TYPE crowdfifax_llm_tokens_total counter",
            f"crowdfifax_llm_tokens_total {self.token_count}",
            "",
            "# HELP crowdfifax_cache_hits_total Total assistant cache hits.",
            "# TYPE crowdfifax_cache_hits_total counter",
            f"crowdfifax_cache_hits_total {self.cache_hits}",
            "",
            "# HELP crowdfifax_emergency_reroutes_total Total emergency reroute events triggered.",
            "# TYPE crowdfifax_emergency_reroutes_total counter",
            f"crowdfifax_emergency_reroutes_total {self.emergency_reroutes}"
        ]
        return "\n".join(metrics)

metrics_exporter = OperationalMetrics()
