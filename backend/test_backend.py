"""
Backend self-verification script.
"""

from simulator import CIPSimulator
from database import PlantDatabase

def test_backend():
    print("=== CleanOptima Edge Backend Self-Test ===")
    sim = CIPSimulator()
    frame = sim.generate_step(time_step_sec=5.0)
    print(f"Equipment: {frame['equipment_id']}")
    print(f"Phase: {frame['phase_info']['current_phase']}")
    print(f"Sensors: TOC={frame['sensors']['toc']}ppb, Flow={frame['sensors']['flow']}L/min")
    print(f"Physics Clearance: {frame['physics_model']['clearance_percentage']}% (ETA: {frame['physics_model']['estimated_minutes_to_target']} min)")
    print(f"ML Anomaly Score: {frame['ml_anomaly']['anomaly_score']} ({frame['ml_anomaly']['status_label']})")
    print(f"Decision Status: {frame['decision']['cip_status']}")
    print(f"Interlock State: {frame['decision']['interlock_state']} ({frame['decision']['interlock_label']})")
    
    # Test Scenario Injection
    sim.set_scenario("SPRAY_BLOCKAGE")
    frame_blocked = sim.generate_step(time_step_sec=10.0)
    print("\n--- After SPRAY_BLOCKAGE Scenario Injection ---")
    print(f"Flow: {frame_blocked['sensors']['flow']} L/min")
    print(f"ML Anomaly Score: {frame_blocked['ml_anomaly']['anomaly_score']} ({frame_blocked['ml_anomaly']['status_label']})")
    print(f"XAI Cause: {frame_blocked['ml_anomaly']['xai_reasoning']['most_likely_cause']}")
    print(f"Interlock State: {frame_blocked['decision']['interlock_state']} ({frame_blocked['decision']['interlock_label']})")

    db = PlantDatabase()
    print(f"\nEquipment count: {len(db.equipment)}")
    print(f"Alarms count: {len(db.alarms)}")
    print(f"Audit log entries: {len(db.audit_logs)}")
    print("Backend test completed successfully!")

if __name__ == "__main__":
    test_backend()
