import json
import os
from typing import Dict, Any

class CrowdService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "data", "crowd.json"
        )
        self.crowd_data = self._load_data()
        self.simulated_incidents = {}

    def _load_data(self) -> Dict[str, Any]:
        if not os.path.exists(self.data_path):
            return {"gates": {}, "concourses": {}, "concessions": {}}
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_gate_status(self, gate_name: str) -> Dict[str, Any]:
        """Return gate entry status, merged with any active simulation overrides."""
        base_gate_status = self.crowd_data.get("gates", {}).get(gate_name, {"wait_time_mins": 2, "capacity_pct": 10, "status": "nominal"})
        if gate_name in self.simulated_incidents:
            return {**base_gate_status, **self.simulated_incidents[gate_name]}
        return base_gate_status

    def get_concourse_density(self, concourse_name: str) -> Dict[str, Any]:
        """Return concourse density status, merged with any active simulation overrides."""
        base_concourse_status = self.crowd_data.get("concourses", {}).get(concourse_name, {"density_score": 0.1, "status": "nominal"})
        if concourse_name in self.simulated_incidents:
            return {**base_concourse_status, **self.simulated_incidents[concourse_name]}
        return base_concourse_status

    def inject_simulation_override(self, target_facility: str, override_metrics: Dict[str, Any]) -> None:
        """Inject crowd simulation overrides for a specific stadium facility."""
        self.simulated_incidents[target_facility] = override_metrics

    def clear_simulation_overrides(self):
        self.simulated_incidents.clear()

crowd_service = CrowdService()
