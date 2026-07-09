from backend.services.simulation import simulation_engine

def test_simulation_clear():
    simulation_engine.clear_scenarios()
    assert len(simulation_engine.active_scenarios) == 0
