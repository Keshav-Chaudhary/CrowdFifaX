from locust import HttpUser, task, between
import json

class FanAppUser(HttpUser):
    # Simulates a fan making wayfinding and chat requests at random intervals between 1 and 5 seconds
    wait_time = between(1, 5)

    @task(3)
    def test_wayfinding(self):
        payload = {
            "origin": "Main Concourse",
            "destination": "Section 104",
            "accessibility_needs": []
        }
        headers = {"X-API-KEY": "dev-secure-key-2026", "Content-Type": "application/json"}
        self.client.post("/api/v1/wayfinding", data=json.dumps(payload), headers=headers, name="Calculate Route")

    @task(1)
    def test_health(self):
        self.client.get("/health", name="Health Check")
        self.client.get("/metrics", name="Prometheus Metrics")
