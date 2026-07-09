import pytest
from backend.services.routing import routing_engine
from backend.services.crowd import crowd_service
from backend.services.simulation import simulation_engine

def test_nominal_route():
    crowd_service.clear_simulation_overrides()
    path, time_mins, congestion_score, safety_score, delay_saved, reasoning = (
        routing_engine.calculate_route("Gate 1", "Seat 44B", [])
    )
    
    assert "Gate 1" in path
    assert "Seat 44B" in path
    assert "Concourse Stairs A" in path
    assert congestion_score == 0.2
    assert safety_score == 95
    assert delay_saved == 15
    assert any("Congestion alert" in step for step in reasoning)

def test_accessibility_routing():
    crowd_service.clear_simulation_overrides()
    path, time_mins, congestion_score, safety_score, delay_saved, reasoning = (
        routing_engine.calculate_route("Gate 1", "Seat 44B", ["wheelchair"])
    )
    
    assert "Elevator Bank A (North)" in path
    assert "Concourse Stairs A" not in path
    assert any("Accessibility constraints active" in step for step in reasoning)

def test_congestion_rerouting():
    # Inject emergency simulation trigger causing concourse bottleneck
    simulation_engine.inject_scenario("evacuation")
    
    path, time_mins, congestion_score, safety_score, delay_saved, reasoning = (
        routing_engine.calculate_route("Gate 1", "Seat 44B", [])
    )
    
    assert "Concourse Stairs A" in path
    assert "Concourse Stairs B" not in path
    assert congestion_score == 0.2
    assert safety_score == 95
    assert delay_saved == 15
    assert any("Congestion alert" in step for step in reasoning)
    
    # Reset simulation
    simulation_engine.clear_scenarios()
