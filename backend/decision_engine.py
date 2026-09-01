"""
CleanOptima Edge — Cleaning Decision & Hardware Interlock Simulation Engine
Determines CIP process status, QA readiness, and simulated equipment interlock states.
"""

from typing import Dict, Any

class DecisionEngine:
    """
    Evaluates real-time sensor streams, ML anomaly scores, and physics clearance metrics
    to output operational decision support recommendations and simulated PLC interlock states.
    """

    def evaluate_decision(
        self,
        anomaly_score: float,
        clearance_info: Dict[str, Any],
        current_phase: str,
        elapsed_minutes: float
    ) -> Dict[str, Any]:
        
        is_cleared = clearance_info.get("is_cleared", False)
        clearance_status = clearance_info.get("clearance_status", "ON_TRACK")
        observed_toc = clearance_info.get("observed_toc", 500.0)
        target_threshold = clearance_info.get("target_threshold", 50.0)

        # Decision State Logic
        if anomaly_score >= 70.0:
            cip_status = "HOLD"
            action_recommendation = "Halt cycle or initiate emergency investigation. Sensor/process anomaly detected."
            interlock_state = "RED"
            interlock_label = "NEXT BATCH BLOCKED"
            interlock_description = "Equipment interlock engaged. CIP cycle failed process parameters."
            qa_readiness = "NOT_READY"
        elif anomaly_score >= 45.0 or clearance_status in ["SIGNIFICANT_LAG", "SLIGHT_LAG"]:
            cip_status = "INVESTIGATION REQUIRED"
            action_recommendation = "Inspect spray ball pressure and flow outlet. Residue clearing slower than model baseline."
            interlock_state = "YELLOW"
            interlock_label = "CIP INVESTIGATION REQUIRED"
            interlock_description = "Interlock pending operator acknowledgment and manual diagnostic check."
            qa_readiness = "NEEDS_ATTENTION"
        elif is_cleared or (observed_toc <= target_threshold and current_phase in ["Verification", "Release / Hold"]):
            cip_status = "READY FOR QA VERIFICATION"
            action_recommendation = "The monitored sensor and physics criteria have been achieved. Submit for GxP QA sign-off."
            interlock_state = "GREEN"
            interlock_label = "NEXT BATCH ENABLED — PENDING QA RELEASE"
            interlock_description = "CIP criteria satisfied. Awaiting formal QA electronic signature."
            qa_readiness = "READY"
        elif clearance_status == "OPTIMAL_ACCELERATED" and elapsed_minutes > 5.0:
            cip_status = "OPTIMIZATION POSSIBLE"
            action_recommendation = "Residue cleared faster than baseline. Early phase termination could save 3.5 min water rinse."
            interlock_state = "GREEN"
            interlock_label = "NEXT BATCH ENABLED — PENDING QA RELEASE"
            interlock_description = "Process running cleanly under accelerated clearance."
            qa_readiness = "IN_PROGRESS"
        else:
            cip_status = "ON TRACK"
            action_recommendation = "Continue CIP recipe progression. All sensor profiles operating within validated envelope."
            interlock_state = "GREEN"
            interlock_label = "NEXT BATCH ENABLED — PENDING QA RELEASE"
            interlock_description = "Active CIP cycle operating normally."
            qa_readiness = "IN_PROGRESS"

        return {
            "cip_status": cip_status,
            "action_recommendation": action_recommendation,
            "interlock_state": interlock_state,
            "interlock_label": interlock_label,
            "interlock_description": interlock_description,
            "qa_readiness": qa_readiness,
            "disclaimer": "SIMULATED INTERLOCK — DEMO PROTOTYPE NOT CONNECTED TO PRODUCTION PLC. GMP VERIFICATION REQUIRED."
        }
