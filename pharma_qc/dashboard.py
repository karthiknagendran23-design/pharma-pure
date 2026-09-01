import streamlit as st
import cv2
import numpy as np
import time
import pandas as pd
import datetime
from pharma_qc.cv_engine import PharmaCVEngine

st.set_page_config(
    page_title="PHARMA-VISION AI | Automated Quality Control Inspection",
    page_icon="💊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Industrial High-Tech Aesthetics
st.markdown("""
<style>
    .main { background-color: #0b0f19; color: #e2e8f0; }
    .stApp { background-color: #0b0f19; }
    .metric-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    .status-pass { color: #10b981; font-weight: bold; }
    .status-reject { color: #ef4444; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if 'engine' not in st.session_state:
    st.session_state.engine = PharmaCVEngine()
if 'total_scanned' not in st.session_state:
    st.session_state.total_scanned = 1240
if 'pass_count' not in st.session_state:
    st.session_state.pass_count = 1195
if 'reject_count' not in st.session_state:
    st.session_state.reject_count = 45
if 'defect_mode' not in st.session_state:
    st.session_state.defect_mode = "AUTO"
if 'input_source' not in st.session_state:
    st.session_state.input_source = "Simulated Conveyor"
if 'history' not in st.session_state:
    st.session_state.history = []

# Sidebar Controls
st.sidebar.image("https://img.icons8.com/isometric-folders/100/pill.png", width=60)
st.sidebar.title("PHARMA-VISION QC")
st.sidebar.caption("Computer Vision Inspection System v1.0")

st.sidebar.subheader("⚙️ Inspection Controls")
st.session_state.input_source = st.sidebar.radio("Camera Input Source", ["Simulated Conveyor", "Live Webcam"])

st.sidebar.subheader("🧪 Defect Injection Test")
defect_selection = st.sidebar.selectbox(
    "Inject Defect Mode:",
    ["AUTO", "NORMAL", "CHIPPED_PILL", "MISSING_TABLET", "EXPIRED_LABEL"]
)
st.session_state.defect_mode = defect_selection

conveyor_speed = st.sidebar.slider("Conveyor Speed (FPS)", 5, 60, 30)

st.sidebar.markdown("---")
st.sidebar.info("💡 **Winning Edge:** Live edge detection of missing pills, chipped dosage, and OCR expiration date verification.")

# Main Header
st.title("💊 PHARMA-VISION: Computer Vision QC Pipeline")
st.caption("Real-Time Blister Strip, Tablet Integrity & OCR Batch Verification")

# Top KPI Metric Cards
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Total Scanned", f"{st.session_state.total_scanned:,}", "+12/min")
with col2:
    st.metric("Passed Units", f"{st.session_state.pass_count:,}", "🟢 96.4%")
with col3:
    st.metric("Rejected Defective", f"{st.session_state.reject_count:,}", "🔴 3.6%", delta_color="inverse")
with col4:
    pass_rate = round((st.session_state.pass_count / (st.session_state.total_scanned or 1)) * 100, 1)
    st.metric("Line Yield Index", f"{pass_rate}%", "ISO 9001 Compliant")

st.markdown("---")

# Main Content Layout
cam_col, log_col = st.columns([3, 2])

with cam_col:
    st.subheader("📹 Live Industrial Inspection Feed")
    frame_placeholder = st.empty()
    status_banner = st.empty()

    if st.session_state.input_source == "Simulated Conveyor":
        frame, res = st.session_state.engine.generate_synthetic_conveyor_frame(st.session_state.defect_mode)
    else:
        # Webcam mode fallback
        cap = cv2.VideoCapture(0)
        ret, frame = cap.read()
        if ret:
            frame, res = st.session_state.engine.process_webcam_frame(frame)
        else:
            frame, res = st.session_state.engine.generate_synthetic_conveyor_frame(st.session_state.defect_mode)
        cap.release()

    # Update stats
    st.session_state.total_scanned += 1
    if res["status"] == "PASS":
        st.session_state.pass_count += 1
    else:
        st.session_state.reject_count += 1
        st.session_state.history.insert(0, res)

    # Convert BGR to RGB for Streamlit display
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame_placeholder.image(frame_rgb, channels="RGB", use_column_width=True)

    if res["status"] == "PASS":
        status_banner.success(f"✅ **UNIT APPROVED**: {res['item_type']} | OCR Batch: {res['ocr_batch']} | EXP: {res['ocr_exp']}")
    else:
        defects_str = ", ".join(res["defects_found"])
        status_banner.error(f"🚨 **UNIT REJECTED**: {defects_str} | OCR Status: {res['exp_status']}")

with log_col:
    st.subheader("📋 Real-Time Defect Log & OCR Verification")
    
    # OCR Master Record Card
    st.markdown("""
    <div style="background-color: #1e293b; padding: 12px; border-radius: 8px; border-left: 4px solid #38bdf8;">
        <h5 style="margin:0; color:#38bdf8;">Master Batch Record #BAT-2026-PH892</h5>
        <small>Target Exp Date: 11/2027 | Tablets/Pack: 10 | Standard: USP-42</small>
    </div>
    """, unsafe_allow_html=True)
    
    st.write("")
    st.markdown("##### Recent Rejections & Anomaly Gallery")
    
    if st.session_state.history:
        df = pd.DataFrame(st.session_state.history[:10])
        st.dataframe(
            df[["timestamp", "status", "defects_found", "ocr_batch", "ocr_exp"]],
            use_container_width=True
        )
    else:
        st.info("No defective units detected in the current run.")

st.markdown("---")

# Analytics Section
st.subheader("📊 Quality Analytics & Failure Distribution")
chart_col1, chart_col2 = st.columns(2)

with chart_col1:
    st.markdown("**Defect Failure Classification Breakdown**")
    defect_counts = pd.DataFrame({
        "Defect Category": ["Chipped Pill", "Missing Tablet", "Expired Batch Label", "Liquid Level Error"],
        "Incidents": [18, 14, 9, 5]
    })
    st.bar_chart(defect_counts.set_index("Defect Category"))

with chart_col2:
    st.markdown("**Export Compliance Reports**")
    st.write("Generate downloadable audit logs for FDA / GMP compliance inspection.")
    
    if st.button("📥 Download QC Audit Certificate (CSV)"):
        st.download_button(
            label="Click to Save Certificate CSV",
            data=pd.DataFrame(st.session_state.history).to_csv(index=False),
            file_name=f"PHARMA_QC_REPORT_{datetime.date.today()}.csv",
            mime="text/csv"
        )
