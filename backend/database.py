"""
CleanOptima Edge — Database Models & Plant Equipment Dataset
Provides lightweight SQLite / InMemory data store for equipment, alarms, audit logs, and CIP history.
"""

import time
from typing import Dict, Any, List

class PlantDatabase:
    def __init__(self):
        self.equipment = [
            {
                "id": "REACTOR-04",
                "name": "5000L Formulation Reactor Vessel A",
                "type": "Reactor",
                "health_score": 91,
                "status": "CLEANING",
                "active_cip": "CIP-2026-00482",
                "current_phase": "Final rinse",
                "previous_product": "API-FORMULATION-A",
                "anomaly_frequency_30d": 2,
                "avg_cleaning_min": 18.5,
                "last_maintenance": "2026-08-14",
                "spray_ball_health": 94,
                "pump_health": 88,
                "sensor_health": 96
            },
            {
                "id": "MIXER-02",
                "name": "2500L High Shear Granulator Vessel",
                "type": "Mixer",
                "health_score": 98,
                "status": "READY",
                "active_cip": None,
                "current_phase": "IDLE",
                "previous_product": "IBUPROFEN-200MG",
                "anomaly_frequency_30d": 0,
                "avg_cleaning_min": 14.2,
                "last_maintenance": "2026-08-20",
                "spray_ball_health": 99,
                "pump_health": 97,
                "sensor_health": 98
            },
            {
                "id": "FERMENTER-01",
                "name": "10000L Bioreactor Fermentation Tank",
                "type": "Fermenter",
                "health_score": 84,
                "status": "WARNING",
                "active_cip": "CIP-2026-00479",
                "current_phase": "Intermediate rinse",
                "previous_product": "MONOCLONAL-MAB-9",
                "anomaly_frequency_30d": 5,
                "avg_cleaning_min": 24.8,
                "last_maintenance": "2026-07-28",
                "spray_ball_health": 78,
                "pump_health": 82,
                "sensor_health": 91
            },
            {
                "id": "BIOREACTOR-03",
                "name": "3000L Cell Culture Bioreactor C",
                "type": "Bioreactor",
                "health_score": 95,
                "status": "READY",
                "active_cip": None,
                "current_phase": "IDLE",
                "previous_product": "VACCINE-ADJUVANT-B",
                "anomaly_frequency_30d": 1,
                "avg_cleaning_min": 16.0,
                "last_maintenance": "2026-08-18",
                "spray_ball_health": 96,
                "pump_health": 95,
                "sensor_health": 94
            },
            {
                "id": "COATER-05",
                "name": "Tablet Coating Pan System E",
                "type": "Coater",
                "health_score": 92,
                "status": "READY",
                "active_cip": None,
                "current_phase": "IDLE",
                "previous_product": "METFORMIN-500MG",
                "anomaly_frequency_30d": 1,
                "avg_cleaning_min": 15.1,
                "last_maintenance": "2026-08-02",
                "spray_ball_health": 91,
                "pump_health": 93,
                "sensor_health": 92
            },
            {
                "id": "DRYER-01",
                "name": "Fluid Bed Dryer Processing Unit 1",
                "type": "Dryer",
                "health_score": 87,
                "status": "MAINTENANCE",
                "active_cip": None,
                "current_phase": "IDLE",
                "previous_product": "PARACETAMOL-DC",
                "anomaly_frequency_30d": 4,
                "avg_cleaning_min": 21.0,
                "last_maintenance": "2026-08-31",
                "spray_ball_health": 82,
                "pump_health": 85,
                "sensor_health": 94
            }
        ]

        self.alarms = [
            {
                "id": "ALM-9081",
                "timestamp": "2026-09-01 14:32:10",
                "equipment_id": "REACTOR-04",
                "title": "CLEARANCE RATE DEVIATION",
                "description": "TOC clearance is 31% slower than physics baseline profile",
                "severity": "HIGH",
                "sensor": "TOC",
                "anomaly_score": 68.4,
                "status": "ACTIVE",
                "acknowledged_by": None
            },
            {
                "id": "ALM-9078",
                "timestamp": "2026-09-01 11:15:04",
                "equipment_id": "FERMENTER-01",
                "title": "SPRAY COVERAGE ANOMALY",
                "description": "Flow rate dropped 18% below lower specification boundary",
                "severity": "CRITICAL",
                "sensor": "FLOW",
                "anomaly_score": 84.1,
                "status": "ACKNOWLEDGED",
                "acknowledged_by": "J. Miller (QA Specialist)"
            },
            {
                "id": "ALM-9065",
                "timestamp": "2026-08-31 09:40:22",
                "equipment_id": "DRYER-01",
                "title": "CONDUCTIVITY SPIKE DETECTED",
                "description": "Detergent rinse phase conductivity exceeded 450 µS/cm threshold",
                "severity": "MEDIUM",
                "sensor": "CONDUCTIVITY",
                "anomaly_score": 52.0,
                "status": "RESOLVED",
                "acknowledged_by": "R. Vance (Process Eng)"
            }
        ]

        self.audit_logs = [
            {
                "id": "AUD-5021",
                "timestamp": "2026-09-01 15:02:11",
                "user": "K. Sharma (Operator)",
                "action": "CIP RECIPE STARTED",
                "equipment_id": "REACTOR-04",
                "details": "Initiated CIP-RECIPE-07 post API-FORMULATION-A campaign",
                "reason": "Routine campaign changeover cleaning SOP-CIP-402"
            },
            {
                "id": "AUD-5019",
                "timestamp": "2026-09-01 14:35:00",
                "user": "CleanOptima Edge AI Engine",
                "action": "INTERLOCK STATE CHANGE",
                "equipment_id": "REACTOR-04",
                "details": "Changed interlock status to YELLOW (CIP INVESTIGATION REQUIRED)",
                "reason": "ML Anomaly Score exceeded 60 threshold (68.4 score)"
            },
            {
                "id": "AUD-5015",
                "timestamp": "2026-09-01 11:16:30",
                "user": "J. Miller (QA Lead)",
                "action": "ALARM ACKNOWLEDGED",
                "equipment_id": "FERMENTER-01",
                "details": "Acknowledged ALM-9078 Spray Coverage Anomaly",
                "reason": "Maintenance dispatched to clear spray nozzle inlet strainers"
            },
            {
                "id": "AUD-5008",
                "timestamp": "2026-08-31 16:45:10",
                "user": "A. Chen (QA Director)",
                "action": "QA VERIFICATION SIGN-OFF",
                "equipment_id": "MIXER-02",
                "details": "Verified final TOC < 15 ppb, conductivity < 1.5 µS/cm",
                "reason": "Batch release for IBUPROFEN-200MG production"
            }
        ]

        self.cip_history = [
            {
                "cycle_id": "CIP-2026-00481",
                "equipment_id": "REACTOR-04",
                "date": "2026-08-31",
                "recipe": "CIP-RECIPE-07",
                "duration_min": 17.8,
                "water_consumed_L": 840,
                "max_anomaly_score": 14.2,
                "status": "SUCCESS",
                "qa_released": True,
                "water_saved_L": 260
            },
            {
                "cycle_id": "CIP-2026-00480",
                "equipment_id": "REACTOR-04",
                "date": "2026-08-30",
                "recipe": "CIP-RECIPE-07",
                "duration_min": 18.2,
                "water_consumed_L": 860,
                "max_anomaly_score": 19.5,
                "status": "SUCCESS",
                "qa_released": True,
                "water_saved_L": 240
            },
            {
                "cycle_id": "CIP-2026-00478",
                "equipment_id": "FERMENTER-01",
                "date": "2026-08-29",
                "recipe": "CIP-BIO-RECIPE-03",
                "duration_min": 26.5,
                "water_consumed_L": 1450,
                "max_anomaly_score": 79.0,
                "status": "INVESTIGATED",
                "qa_released": False,
                "water_saved_L": 0
            }
        ]

    def acknowledge_alarm(self, alarm_id: str, user_name: str) -> bool:
        for alm in self.alarms:
            if alm["id"] == alarm_id:
                alm["status"] = "ACKNOWLEDGED"
                alm["acknowledged_by"] = user_name
                self.audit_logs.insert(0, {
                    "id": f"AUD-{int(time.time()) % 10000}",
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "user": user_name,
                    "action": "ALARM ACKNOWLEDGED",
                    "equipment_id": alm["equipment_id"],
                    "details": f"Acknowledged {alm['id']} ({alm['title']})",
                    "reason": "Operator investigation conducted"
                })
                return True
        return False
