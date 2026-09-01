"""
CleanOptima Edge — CIP Process Data Simulator
Generates realistic pharmaceutical CIP sensor streams across 7 CIP phases with anomaly injection.
"""

import time
import math
import random
from typing import Dict, Any, List
from physics_model import PhysicsClearanceModel
from ml_engine import MLAnomalyEngine
from decision_engine import DecisionEngine

CIP_PHASES = [
    {"name": "Pre-rinse", "duration_min": 3.0, "description": "Initial water flush to clear bulk residual soil"},
    {"name": "Caustic wash", "duration_min": 5.0, "description": "Circulation of 2.0% NaOH detergent solution at 70°C"},
    {"name": "Intermediate rinse", "duration_min": 2.5, "description": "Purified water flush to remove caustic residual"},
    {"name": "Acid wash", "duration_min": 3.5, "description": "Circulation of 1.0% HNO3 solution to remove mineral scale"},
    {"name": "Final rinse", "duration_min": 4.0, "description": "WFI (Water For Injection) final high-purity flush"},
    {"name": "Verification", "duration_min": 2.0, "description": "Real-time TOC & conductivity validation window"},
    {"name": "Release / Hold", "duration_min": 1.0, "description": "Decision support interlock check & GxP release"}
]

class CIPSimulator:
    def __init__(self):
        self.equipment_id = "REACTOR-04"
        self.vessel_name = "5000L Formulation Reactor Vessel A"
        self.previous_product = "API-FORMULATION-A (Paracetamol Active)"
        self.recipe_id = "CIP-RECIPE-07"
        self.cycle_id = "CIP-2026-00482"
        self.operator = "K. Sharma (Lead Process Eng)"

        self.is_running = True
        self.active_scenario = "NORMAL"
        self.simulation_speed = 1.0
        self.elapsed_seconds = 0.0

        self.physics_model = PhysicsClearanceModel(initial_concentration=4800.0, target_threshold=50.0)
        self.ml_engine = MLAnomalyEngine()
        self.decision_engine = DecisionEngine()

        self.history: List[Dict[str, Any]] = []

    def set_scenario(self, scenario: str):
        valid = ["NORMAL", "SPRAY_BLOCKAGE", "FLOW_STAGNATION", "SLOW_CLEARANCE", "DETERGENT_ANOMALY", "SENSOR_FAILURE", "MULTI_ANOMALY"]
        if scenario in valid:
            self.active_scenario = scenario
            self.elapsed_seconds = max(1.0, self.elapsed_seconds)

    def reset_cycle(self):
        self.elapsed_seconds = 0.0
        self.active_scenario = "NORMAL"
        self.history.clear()

    def get_current_phase_info(self) -> Dict[str, Any]:
        total_cycle_seconds = sum(p["duration_min"] for p in CIP_PHASES) * 60.0
        current_sec = self.elapsed_seconds % total_cycle_seconds

        accumulated = 0.0
        current_phase_index = 0
        for i, p in enumerate(CIP_PHASES):
            p_sec = p["duration_min"] * 60.0
            if current_sec < (accumulated + p_sec):
                current_phase_index = i
                break
            accumulated += p_sec

        phase_obj = CIP_PHASES[current_phase_index]
        phase_elapsed_sec = current_sec - accumulated
        phase_progress_pct = min(100.0, (phase_elapsed_sec / (phase_obj["duration_min"] * 60.0)) * 100.0)
        overall_progress_pct = min(100.0, (current_sec / total_cycle_seconds) * 100.0)

        # Estimated clearance time remaining in minutes
        total_remaining_min = max(0.0, (total_cycle_seconds - current_sec) / 60.0)

        return {
            "current_phase": phase_obj["name"],
            "phase_index": current_phase_index + 1,
            "total_phases": len(CIP_PHASES),
            "description": phase_obj["description"],
            "phase_progress_pct": round(phase_progress_pct, 1),
            "overall_progress_pct": round(overall_progress_pct, 1),
            "total_elapsed_min": round(self.elapsed_seconds / 60.0, 2),
            "estimated_clearance_eta_min": round(total_remaining_min, 2),
            "all_phases": CIP_PHASES
        }

    def generate_step(self, time_step_sec: float = 2.0) -> Dict[str, Any]:
        """Generates the next real-time telemetry frame for the active CIP cycle."""
        if self.is_running:
            self.elapsed_seconds += time_step_sec * self.simulation_speed

        phase_info = self.get_current_phase_info()
        phase = phase_info["current_phase"]
        elapsed_min = phase_info["total_elapsed_min"]

        # Base nominal values according to CIP phase
        noise_t = random.uniform(-0.5, 0.5)
        
        # TOC calculation (exponential decay)
        decay = math.exp(-0.35 * elapsed_min)
        base_toc = max(12.0, 4800.0 * decay + random.uniform(-5.0, 5.0))

        # Conductivity (µS/cm) depends on phase
        if phase == "Caustic wash":
            base_cond = 420.0 + random.uniform(-10.0, 10.0)
            base_temp = 71.0 + random.uniform(-1.5, 1.5)
        elif phase == "Acid wash":
            base_cond = 215.0 + random.uniform(-5.0, 5.0)
            base_temp = 65.0 + random.uniform(-1.0, 1.0)
        elif phase == "Final rinse":
            base_cond = 12.4 + random.uniform(-1.0, 1.0)
            base_temp = 32.0 + random.uniform(-1.0, 1.0)
        elif phase == "Verification":
            base_cond = 2.8 + random.uniform(-0.2, 0.2)
            base_temp = 23.0 + random.uniform(-0.5, 0.5)
        else: # Pre-rinse or Intermediate
            base_cond = 28.0 + random.uniform(-2.0, 2.0)
            base_temp = 28.0 + random.uniform(-1.0, 1.0)

        base_flow = 152.0 + random.uniform(-3.0, 3.0)
        base_turb = max(0.1, 8.5 * decay + random.uniform(-0.2, 0.2))
        base_press = 2.35 + random.uniform(-0.05, 0.05)

        # Inject Anomaly Scenario Modifications
        if self.active_scenario == "SPRAY_BLOCKAGE":
            # Flow gradually decays over time
            flow_reduction = min(60.0, elapsed_min * 8.5)
            base_flow = max(80.0, base_flow - flow_reduction)
            base_toc += 180.0 + (elapsed_min * 45.0) # Clearance slows down
            base_turb += 1.8
            base_press += 0.4 # Backpressure rises

        elif self.active_scenario == "FLOW_STAGNATION":
            base_flow = 45.0 + random.uniform(-4.0, 4.0) # Sudden severe drop
            base_press = 0.8 + random.uniform(-0.1, 0.1)
            base_toc += 420.0

        elif self.active_scenario == "DETERGENT_ANOMALY":
            if phase == "Caustic wash":
                base_cond = 180.0 + random.uniform(-10.0, 10.0) # Dosing too low
            elif phase == "Acid wash":
                base_cond = 450.0 + random.uniform(-15.0, 15.0) # Dosing too high

        elif self.active_scenario == "SLOW_CLEARANCE":
            # TOC decays much slower
            slow_decay = math.exp(-0.12 * elapsed_min)
            base_toc = max(180.0, 4800.0 * slow_decay + random.uniform(-10.0, 10.0))
            base_turb += 3.5

        elif self.active_scenario == "SENSOR_FAILURE":
            # Conductivity sensor spikes implausibly
            base_cond = 9850.0 + random.uniform(-100.0, 100.0)

        elif self.active_scenario == "MULTI_ANOMALY":
            base_flow = 95.0 + random.uniform(-5.0, 5.0)
            base_toc += 580.0
            base_cond = 750.0
            base_turb += 4.2

        sensors = {
            "toc": round(max(5.0, base_toc), 2),
            "conductivity": round(max(0.1, base_cond), 2),
            "turbidity": round(max(0.05, base_turb), 2),
            "flow": round(max(0.0, base_flow), 2),
            "temp": round(max(15.0, base_temp), 2),
            "pressure": round(max(0.0, base_press), 2),
            "timestamp": round(time.time(), 2)
        }

        # Run Physics Clearance Model
        physics_res = self.physics_model.calculate_clearance(
            elapsed_minutes=elapsed_min,
            observed_toc=sensors["toc"],
            phase=phase
        )

        # Run ML Anomaly Engine
        ml_res = self.ml_engine.evaluate_sensor_frame(
            sensors=sensors,
            phase=phase,
            active_scenario=self.active_scenario
        )

        # Run Decision Support Engine
        decision_res = self.decision_engine.evaluate_decision(
            anomaly_score=ml_res["anomaly_score"],
            clearance_info=physics_res,
            current_phase=phase,
            elapsed_minutes=elapsed_min
        )

        frame = {
            "equipment_id": self.equipment_id,
            "vessel_name": self.vessel_name,
            "previous_product": self.previous_product,
            "recipe_id": self.recipe_id,
            "cycle_id": self.cycle_id,
            "operator": self.operator,
            "phase_info": phase_info,
            "sensors": sensors,
            "physics_model": physics_res,
            "ml_anomaly": ml_res,
            "decision": decision_res,
            "active_scenario": self.active_scenario,
            "simulation_speed": self.simulation_speed
        }

        self.history.append(frame)
        if len(self.history) > 300:
            self.history.pop(0)

        return frame
