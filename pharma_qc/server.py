from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import cv2
import json
import time
import datetime
from pharma_qc.cv_engine import PharmaCVEngine

app = FastAPI(title="PHARMA-VISION Quality Control Inspection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = PharmaCVEngine()

# Global metrics state
stats = {
    "total_scanned": 1284,
    "pass_count": 1238,
    "reject_count": 46,
    "pass_rate_pct": 96.4,
    "defects_breakdown": {
        "Chipped/Fractured Tablet": 18,
        "Missing Tablet": 14,
        "Expired Batch Label": 9,
        "Liquid Level Discrepancy": 5
    },
    "current_mode": "SYNTHETIC_CONVEYOR",
    "selected_defect_injection": "AUTO"
}

latest_result = {
    "timestamp": datetime.datetime.now().isoformat(),
    "item_type": "Blister Strip 10-Tab",
    "status": "PASS",
    "defects_found": [],
    "confidence": 0.98,
    "ocr_batch": "BAT-2026-PH892",
    "ocr_exp": "11/2027",
    "exp_status": "VALID",
    "pills_detected": 10
}

@app.get("/")
def root():
    return {"system": "PHARMA-VISION Quality Control AI", "status": "ONLINE"}

@app.get("/api/inspection/latest")
def get_latest():
    global latest_result
    frame, res = engine.generate_synthetic_conveyor_frame(stats["selected_defect_injection"])
    latest_result = res

    # Update rolling metrics
    stats["total_scanned"] += 1
    if res["status"] == "PASS":
        stats["pass_count"] += 1
    else:
        stats["reject_count"] += 1
    stats["pass_rate_pct"] = round((stats["pass_count"] / stats["total_scanned"]) * 100, 1)

    return res

@app.get("/api/stats")
def get_stats():
    return stats

@app.post("/api/config")
def update_config(config: dict):
    if "defect_injection" in config:
        stats["selected_defect_injection"] = config["defect_injection"]
    if "mode" in config:
        stats["current_mode"] = config["mode"]
    return {"message": "Config updated", "config": stats}

@app.get("/api/frame")
def get_current_frame():
    frame, res = engine.generate_synthetic_conveyor_frame(stats["selected_defect_injection"])
    _, jpeg = cv2.imencode('.jpg', frame)
    return Response(content=jpeg.tobytes(), media_type="image/jpeg")
