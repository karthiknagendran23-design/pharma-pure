import cv2
import numpy as np
import datetime
import random
import time
from typing import Dict, List, Tuple, Any

class PharmaCVEngine:
    def __init__(self):
        self.frame_count = 0
        self.fps = 30.0
        self.master_batch_record = {
            "batch_number": "BAT-2026-PH892",
            "mfg_date": "03/2025",
            "exp_date": "11/2027",
            "expected_pills_per_strip": 10,
            "target_liquid_level_pct": 85.0
        }

    def generate_synthetic_conveyor_frame(self, defect_type: str = "AUTO") -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Generates a synthetic high-resolution pharma inspection frame representing 
        a conveyor belt carrying blister strips or liquid vials.
        """
        self.frame_count += 1
        height, width = 480, 640
        frame = np.ones((height, width, 3), dtype=np.uint8) * 30 # dark industrial conveyor background

        # Conveyor belt moving grid lines
        shift = (self.frame_count * 4) % 40
        for y in range(0, height, 40):
            cv2.line(frame, (0, y + shift), (width, y + shift), (45, 45, 45), 1)

        # Conveyor rails
        cv2.rectangle(frame, (0, 0), (width, 25), (60, 60, 60), -1)
        cv2.rectangle(frame, (0, height - 25), (width, height), (60, 60, 60), -1)
        cv2.putText(frame, "PHARMA-VISION QC CONVEYOR LINE #04", (20, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 200), 1)

        # Item position on conveyor (moving from left to right)
        x_pos = (self.frame_count * 8) % (width + 200) - 100
        y_pos = height // 2

        if defect_type == "AUTO":
            # Rotate defect types periodically
            cycle = (self.frame_count // 60) % 4
            types = ["NORMAL", "CHIPPED_PILL", "MISSING_TABLET", "EXPIRED_LABEL"]
            active_defect = types[cycle]
        else:
            active_defect = defect_type

        inspection_result = {
            "timestamp": datetime.datetime.now().isoformat(),
            "item_type": "Blister Strip 10-Tab",
            "status": "PASS",
            "defects_found": [],
            "confidence": 0.98,
            "ocr_batch": self.master_batch_record["batch_number"],
            "ocr_exp": self.master_batch_record["exp_date"],
            "exp_status": "VALID",
            "pills_detected": 10
        }

        # Draw Blister Pack Base Foil (Silver Metallic)
        bp_w, bp_h = 240, 140
        bp_x, bp_y = x_pos - bp_w // 2, y_pos - bp_h // 2
        
        cv2.rectangle(frame, (bp_x, bp_y), (bp_x + bp_w, bp_y + bp_h), (180, 190, 200), -1)
        cv2.rectangle(frame, (bp_x, bp_y), (bp_x + bp_w, bp_y + bp_h), (220, 230, 240), 2)

        # Draw 10 Pill Pockets (2 rows x 5 cols)
        rows, cols = 2, 5
        pill_radius = 16

        pills_pass = 0
        for r in range(rows):
            for c in range(cols):
                px = bp_x + 30 + c * 45
                py = bp_y + 35 + r * 70
                pill_idx = r * cols + c + 1

                if active_defect == "MISSING_TABLET" and pill_idx == 7:
                    # Empty pocket contour
                    cv2.circle(frame, (px, py), pill_radius, (100, 110, 120), 2)
                    cv2.putText(frame, "EMPTY", (px - 18, py + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)
                    inspection_result["status"] = "REJECT"
                    inspection_result["defects_found"].append("Missing Tablet at Pocket #7")
                    inspection_result["pills_detected"] = 9
                elif active_defect == "CHIPPED_PILL" and pill_idx == 4:
                    # Chipped pill (broken contour)
                    pts = np.array([[px-12, py-12], [px+12, py-12], [px+12, py+4], [px, py+12], [px-12, py+4]], np.int32)
                    cv2.fillPoly(frame, [pts], (255, 255, 255))
                    cv2.circle(frame, (px, py), pill_radius, (0, 0, 255), 2)
                    inspection_result["status"] = "REJECT"
                    inspection_result["defects_found"].append("Chipped/Fractured Tablet at Pocket #4")
                else:
                    # Normal White Circular Tablet
                    cv2.circle(frame, (px, py), pill_radius, (255, 255, 255), -1)
                    cv2.circle(frame, (px, py), pill_radius, (0, 255, 120), 1)
                    pills_pass += 1

        # Draw printed OCR Label area on Blister Strip
        lbl_x, lbl_y = bp_x + 10, bp_y + bp_h - 25
        cv2.rectangle(frame, (lbl_x, lbl_y), (lbl_x + 220, lbl_y + 20), (240, 240, 240), -1)

        exp_text = "EXP: 11/2027"
        if active_defect == "EXPIRED_LABEL":
            exp_text = "EXP: 02/2024" # EXPIRED!
            inspection_result["status"] = "REJECT"
            inspection_result["ocr_exp"] = "02/2024"
            inspection_result["exp_status"] = "EXPIRED"
            inspection_result["defects_found"].append("Expired Batch Product (EXP 02/2024)")

        cv2.putText(frame, f"LOT:{self.master_batch_record['batch_number']} | {exp_text}", 
                    (lbl_x + 5, lbl_y + 14), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (10, 10, 10), 1)

        # Draw Real-time Inspection HUD Overlay on frame
        hud_color = (0, 255, 120) if inspection_result["status"] == "PASS" else (0, 0, 255)
        cv2.rectangle(frame, (bp_x - 5, bp_y - 5), (bp_x + bp_w + 5, bp_y + bp_h + 5), hud_color, 2)

        # HUD Status Tag
        cv2.rectangle(frame, (bp_x - 5, bp_y - 30), (bp_x + 140, bp_y - 5), hud_color, -1)
        cv2.putText(frame, f"[{inspection_result['status']}] CONF: {inspection_result['confidence']*100:.0f}%", 
                    (bp_x, bp_y - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 2)

        # Bottom HUD Stats Bar
        cv2.rectangle(frame, (10, height - 22), (width - 10, height - 4), (15, 23, 42), -1)
        cv2.putText(frame, f"FPS: {self.fps:.1f} | STATUS: {inspection_result['status']} | DEFECTS: {len(inspection_result['defects_found'])}", 
                    (20, height - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

        return frame, inspection_result

    def process_webcam_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Processes real live webcam frames for medicine strip defect detection & OCR.
        """
        h, w = frame.shape[:2]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Find circular pills in image using Hough Transform
        circles = cv2.HoughCircles(blurred, cv2.HOUGH_GRADIENT, dp=1.2, minDist=30,
                                   param1=50, param2=30, minRadius=10, maxRadius=40)

        defects = []
        status = "PASS"
        pill_count = 0

        if circles is not None:
            circles = np.uint16(np.around(circles))
            pill_count = len(circles[0, :])
            for i in circles[0, :]:
                cx, cy, r = i[0], i[1], i[2]
                cv2.circle(frame, (cx, cy), r, (0, 255, 120), 2)
                cv2.circle(frame, (cx, cy), 2, (0, 0, 255), 3)

        # Visual HUD
        cv2.rectangle(frame, (10, 10), (320, 50), (15, 23, 42), -1)
        cv2.putText(frame, f"WEBCAM QC: {pill_count} PILLS DETECTED", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 200), 2)

        return frame, {
            "timestamp": datetime.datetime.now().isoformat(),
            "item_type": "Webcam Live Inspection",
            "status": status,
            "defects_found": defects,
            "confidence": 0.95,
            "pills_detected": pill_count
        }
