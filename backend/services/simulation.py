from typing import Dict, Any, List
from backend.services.crowd import crowd_service
from backend.services.cache import prompt_cache
from backend.services.metrics import metrics_exporter

class IncidentSimulationEngine:
    def __init__(self):
        self.active_scenarios: List[str] = []
        self.system_status = "nominal"

    def inject_scenario(self, scenario_type: str, target_zone: str = None, severity: str = "medium") -> Dict[str, Any]:
        self.active_scenarios.append(scenario_type)
        
        if scenario_type == "evacuation":
            self.system_status = "evacuation"
            prompt_cache.toggle_emergency_mode(True)
            metrics_exporter.record_emergency_reroute()
            
            # Inject extreme congestion overrides across all sectors
            crowd_service.inject_simulation_override("Gate 6", {"wait_time_mins": 99, "capacity_pct": 100, "status": "bottleneck"})
            crowd_service.inject_simulation_override("South Concourse", {"density_score": 1.0, "status": "bottleneck"})
            
        elif scenario_type == "gate_closure" and target_zone:
            self.system_status = "warning"
            crowd_service.inject_simulation_override(target_zone, {"wait_time_mins": 999, "capacity_pct": 100, "status": "closed"})
            
        elif scenario_type == "concourse_overflow" and target_zone:
            self.system_status = "warning"
            crowd_service.inject_simulation_override(target_zone, {"density_score": 0.99, "status": "bottleneck"})
            
        return {
            "success": True,
            "active_incidents": self.active_scenarios,
            "system_status": self.system_status
        }

    def clear_scenarios(self):
        self.active_scenarios.clear()
        self.system_status = "nominal"
        prompt_cache.toggle_emergency_mode(False)
        crowd_service.clear_simulation_overrides()

simulation_engine = IncidentSimulationEngine()
