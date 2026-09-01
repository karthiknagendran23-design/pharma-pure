"""
CleanOptima Edge — Physics-Informed Clearance Model
Formula: C(t) = C0 * exp(-k * t)
"""

import math
from typing import Dict, Any, List

class PhysicsClearanceModel:
    def __init__(self, initial_concentration: float = 5000.0, target_threshold: float = 50.0, default_k: float = 0.35):
        self.initial_concentration = initial_concentration  # C0 (ppb)
        self.target_threshold = target_threshold            # Target (ppb)
        self.default_k = default_k                          # Clearance rate constant (1/min)

    def calculate_clearance(self, elapsed_minutes: float, observed_toc: float, phase: str) -> Dict[str, Any]:
        """
        Calculates physics-informed exponential residue clearance and estimated completion time.
        """
        if elapsed_minutes <= 0.05:
            elapsed_minutes = 0.05

        # Dynamically estimate clearance rate constant k based on observed TOC if TOC <= initial
        if observed_toc > 0 and observed_toc < self.initial_concentration:
            # observed_toc = C0 * exp(-k * t)  =>  k = ln(C0 / observed_toc) / t
            try:
                calculated_k = math.log(self.initial_concentration / max(observed_toc, 1.0)) / elapsed_minutes
                k = max(0.05, min(0.8, calculated_k))
            except Exception:
                k = self.default_k
        else:
            k = self.default_k

        # Expected model concentration at current time
        expected_concentration = self.initial_concentration * math.exp(-k * elapsed_minutes)

        # Clearance percentage
        clearance_pct = max(0.0, min(100.0, (1.0 - (observed_toc / self.initial_concentration)) * 100.0))

        # Time to target threshold (t_target = ln(C0 / C_target) / k)
        if k > 0 and self.initial_concentration > self.target_threshold:
            total_time_required = math.log(self.initial_concentration / self.target_threshold) / k
            remaining_minutes = max(0.0, total_time_required - elapsed_minutes)
        else:
            remaining_minutes = 0.0

        # Confidence bounds (+/- 12%)
        lower_bound = expected_concentration * 0.88
        upper_bound = expected_concentration * 1.12

        # Check if actual clearance is lagging physics expectation
        clearance_status = "ON_TRACK"
        deviation_pct = 0.0
        if expected_concentration > 0:
            deviation_pct = ((observed_toc - expected_concentration) / expected_concentration) * 100.0
            if deviation_pct > 35.0:
                clearance_status = "SIGNIFICANT_LAG"
            elif deviation_pct > 15.0:
                clearance_status = "SLIGHT_LAG"
            elif deviation_pct < -15.0:
                clearance_status = "OPTIMAL_ACCELERATED"

        return {
            "elapsed_minutes": round(elapsed_minutes, 2),
            "observed_toc": round(observed_toc, 2),
            "expected_toc": round(expected_concentration, 2),
            "target_threshold": self.target_threshold,
            "clearance_rate_k": round(k, 4),
            "clearance_percentage": round(clearance_pct, 1),
            "estimated_minutes_to_target": round(remaining_minutes, 2),
            "lower_bound_confidence": round(lower_bound, 2),
            "upper_bound_confidence": round(upper_bound, 2),
            "clearance_status": clearance_status,
            "deviation_pct": round(deviation_pct, 1),
            "is_cleared": observed_toc <= self.target_threshold and phase in ["Verification", "Release / Hold", "Final rinse"]
        }

    def generate_theoretical_curve(self, total_minutes: float = 15.0, steps: int = 50) -> List[Dict[str, float]]:
        """Generates theoretical baseline clearance curve for comparison UI."""
        curve = []
        step_size = total_minutes / steps
        for i in range(steps + 1):
            t = round(i * step_size, 2)
            c = self.initial_concentration * math.exp(-self.default_k * t)
            curve.append({
                "time_min": t,
                "expected_toc": round(max(c, 5.0), 2),
                "threshold": self.target_threshold
            })
        return curve
