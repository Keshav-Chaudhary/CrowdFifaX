from typing import List, Dict, Any, Tuple
from backend.services.crowd import crowd_service
from backend.services.stadium_data import stadium_data_service

BASE_ROUTE_TIME_MINS = 8
ACCESSIBLE_ROUTING_DELAY_MINS = 3
NOMINAL_CONGESTION_SCORE = 0.1
MAX_SAFETY_SCORE = 100
DETOUR_CONGESTION_SCORE = 0.2
DETOUR_SAFETY_SCORE = 95
BOTTLENECK_DELAY_SAVED_MINS = 15
DETOUR_TIME_OVERHEAD_MINS = 1

class RoutingEngine:
    def calculate_route(
        self, origin: str, destination: str, accessibility_needs: List[str]
    ) -> Tuple[List[str], int, float, int, int, List[str]]:
        """Calculate optimal wayfinding route path based on accessibility needs and live crowd data."""
        reasoning_steps = []
        path = [origin]
        
        # Check accessibility requirements
        is_accessible = "wheelchair" in accessibility_needs
        if is_accessible:
            reasoning_steps.append("Accessibility constraints active: routing restricted to step-free zones and elevator banks.")
            path.append("Elevator Bank C")
        else:
            path.append("Concourse Stairs B")
            
        path.append(destination)
        
        # Base travel time
        base_time = BASE_ROUTE_TIME_MINS
        if is_accessible:
            base_time += ACCESSIBLE_ROUTING_DELAY_MINS  # elevator delay
            
        # Check crowd congestion for the destination zone or gates along the way
        gate_status = crowd_service.get_gate_status("Gate 6")
        concourse_status = crowd_service.get_concourse_density("South Concourse")
        
        congestion_score = NOMINAL_CONGESTION_SCORE
        safety_score = MAX_SAFETY_SCORE
        delay_saved = 0
        
        # Rerouting simulation based on congestion rules
        if gate_status.get("status") == "bottleneck" or concourse_status.get("status") == "bottleneck":
            reasoning_steps.append(f"Congestion alert: South Concourse / Gate 6 bottleneck detected (capacity {gate_status.get('capacity_pct')}%).")
            reasoning_steps.append("Rerouting engine triggered: avoiding primary bottleneck zone.")
            
            # Modify path
            if "Elevator Bank C" in path:
                path.remove("Elevator Bank C")
                path.insert(1, "Elevator Bank A (North)")
                reasoning_steps.append("Redirected from South Elevator Bank C to North Elevator Bank A to avoid bottleneck.")
            else:
                path.remove("Concourse Stairs B")
                path.insert(1, "Concourse Stairs A")
                reasoning_steps.append("Redirected via North Concourse Stairs A.")
                
            congestion_score = DETOUR_CONGESTION_SCORE
            safety_score = DETOUR_SAFETY_SCORE
            delay_saved = BOTTLENECK_DELAY_SAVED_MINS  # Avoided the wait time of the bottleneck
            base_time += DETOUR_TIME_OVERHEAD_MINS    # slight detour overhead
        else:
            reasoning_steps.append("Concourse flow is nominal. Normal route mapped.")
            
        return path, base_time, congestion_score, safety_score, delay_saved, reasoning_steps

routing_engine = RoutingEngine()
