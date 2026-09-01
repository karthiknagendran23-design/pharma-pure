"""
CleanOptima Edge — FastAPI Backend Entrypoint
Real-Time Industrial IoT Anomaly Detection & CIP Validation Platform
"""

import asyncio
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from simulator import CIPSimulator
from database import PlantDatabase

app = FastAPI(
    title="CleanOptima Edge API",
    description="Real-Time Industrial IoT Anomaly Detection & CIP Validation Platform for Pharmaceutical Manufacturing",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
simulator = CIPSimulator()
db = PlantDatabase()

class ScenarioRequest(BaseModel):
    scenario: str
    simulation_speed: Optional[float] = 1.0

class AlarmAckRequest(BaseModel):
    user_name: str

@app.get("/")
def read_root():
    return {
        "product": "CleanOptima Edge",
        "tagline": "Clean Smarter. Detect Earlier. Produce Safer.",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "disclaimer": "Prototype decision-support system. GMP validation & QA authorization required."
    }

@app.get("/api/equipment")
def get_equipment():
    return db.equipment

@app.get("/api/cip/current")
def get_current_cip():
    return simulator.generate_step(time_step_sec=0.0)

@app.get("/api/cip/history")
def get_cip_history():
    return db.cip_history

@app.get("/api/sensors")
def get_sensors():
    frame = simulator.generate_step(time_step_sec=0.0)
    return frame["sensors"]

@app.get("/api/anomalies")
def get_anomalies():
    frame = simulator.generate_step(time_step_sec=0.0)
    return {
        "active_scenario": simulator.active_scenario,
        "ml_anomaly": frame["ml_anomaly"],
        "xai_reasoning": frame["ml_anomaly"]["xai_reasoning"],
        "physics_model": frame["physics_model"]
    }

@app.get("/api/alarms")
def get_alarms():
    return db.alarms

@app.post("/api/alarms/{alarm_id}/acknowledge")
def acknowledge_alarm(alarm_id: str, req: AlarmAckRequest):
    success = db.acknowledge_alarm(alarm_id, req.user_name)
    if not success:
        raise HTTPException(status_code=404, detail="Alarm ID not found")
    return {"status": "SUCCESS", "message": f"Alarm {alarm_id} acknowledged by {req.user_name}"}

@app.get("/api/audit-logs")
def get_audit_logs():
    return db.audit_logs

@app.get("/api/analytics")
def get_analytics():
    return {
        "water_saved_liters_month": 48200,
        "chemical_saved_liters_month": 1420,
        "downtime_reduction_hours_month": 34.5,
        "estimated_cost_savings_usd": 28400,
        "active_cips": 2,
        "average_anomaly_score": 21.4,
        "overall_cip_success_rate": 96.8,
        "equipment_availability_pct": 94.2
    }

@app.post("/api/simulation/scenario")
def set_scenario(req: ScenarioRequest):
    simulator.set_scenario(req.scenario)
    if req.simulation_speed:
        simulator.simulation_speed = req.simulation_speed
    return {
        "status": "SUCCESS",
        "active_scenario": simulator.active_scenario,
        "simulation_speed": simulator.simulation_speed
    }

@app.post("/api/simulation/reset")
def reset_simulation():
    simulator.reset_cycle()
    return {"status": "SUCCESS", "message": "CIP Simulation reset to initial state"}

@app.websocket("/ws/cip/live")
async def websocket_cip_live(websocket: WebSocket):
    """
    WebSocket endpoint broadcasting live telemetry frames every 1.5 seconds.
    """
    await websocket.accept()
    try:
        while True:
            frame = simulator.generate_step(time_step_sec=1.5)
            await websocket.send_text(json.dumps(frame))
            await asyncio.sleep(1.5 / max(0.2, simulator.simulation_speed))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
