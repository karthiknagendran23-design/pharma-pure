<div align="center">

# 🧪 CleanOptima Edge (PharmaPure)
### Real-Time Industrial IoT Anomaly Detection & CIP Validation Platform for Multiproduct Pharmaceutical Manufacturing

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Hackathon-Ready Industrial IoT Decision Support & Digital Twin Engine**

[Live Web Control Room](http://localhost:3000) • [API Documentation](http://localhost:8000/docs) • [Architecture Guide](#-system-architecture)

</div>

---

## 📌 Executive Summary

In multiproduct pharmaceutical manufacturing, equipment (reactors, mixers, bioreactors) must be thoroughly cleaned between batch changeovers to prevent active pharmaceutical ingredient (API) cross-contamination. 

Traditional Clean-In-Place (CIP) cleaning relies on **fixed-time recipe cycles**, leading to:
- ❌ **Over-cleaning & Resource Waste**: Thousands of liters of Water-For-Injection (WFI) and hazardous chemical detergents wasted.
- ❌ **Unnoticed Anomaly Risks**: Partial spray nozzle blockages, pump cavitation, or flow stagnation passing unnoticed until offline lab swab samples fail.
- ❌ **Costly Downtime**: Equipment locked in unnecessary cleaning cycles rather than high-value production.

**CleanOptima Edge (PharmaPure)** solves this with an **Edge AI & Physics-Informed Digital Twin** that validates residue clearance in real-time, predicts time-to-target threshold, detects anomalies using a 1D CNN Autoencoder, and automatically manages hardware safety interlocks.

---

## ⚡ Key Highlights & Core Capabilities

```
                  +-------------------------------------------------------+
                  |              CleanOptima Edge Architecture            |
                  +-------------------------------------------------------+
                                              |
     +-------------------------+              |              +-------------------------+
     |   Industrial Sensors    |              |              |    Physics Model C(t)   |
     | (TOC, Cond, Flow, Temp) |              |              |   Exponential Decay k   |
     +------------+------------+              |              +------------+------------+
                  |                           v                           |
                  +-------------------> [ Edge AI Engine ] <---------------+
                                              |
                                   (1D CNN Autoencoder XAI)
                                              |
                                              v
                             +---------------------------------+
                             | Hardware Interlock State Engine |
                             |   [GREEN]  [YELLOW]  [RED]      |
                             +---------------------------------+
```

### 1. 🧊 Interactive 3D WebGL Software Model
- Full **Three.js WebGL CAD software model** of a 5000L Formulation Reactor Vessel, spray ball mist particles, rotating agitator impellers, inlet/outlet piping manifolds, and dead-leg traps.
- **360° Mouse Orbit Controls**, **Wireframe CAD Mode**, **X-Ray Shell Transparency**, and interactive 3D component raycasting diagnostics.
- Seamless toggle between **3D CAD Software Model** and **2D P&ID Process Schematic**.

### 2. 🧬 Physics-Informed Residue Clearance Kinetics
- Implements first-principles exponential decay kinetics:
  $$C(t) = C_0 \cdot e^{-k t}$$
- Computes clearance rate constant $k$, confidence boundaries ($\pm 12\%$), observed vs. theoretical TOC trajectories, and estimated minutes to release threshold ($< 50\text{ ppb}$).

### 3. 🧠 1D CNN Autoencoder ML Anomaly Engine & XAI
- Continuously calculates multi-sensor reconstruction error to generate a 0–100 Anomaly Score.
- **Explainable AI (XAI)** breakdown mapping feature contributions (flow drop, conductivity drift, TOC lagging) to root cause hypotheses with confidence scores.

### 4. 🔒 Hardware Safety Interlocks & GxP Compliance
- **Simulated PLC Hardware Interlock**:
  - 🟢 **GREEN (Enabled)**: Cleaning validated; next batch release enabled.
  - 🟡 **YELLOW (Investigate)**: Slight deviation detected; QA investigation requested.
  - 🔴 **RED (Blocked)**: Critical flow drop or spray blockage; hardware interlock locks discharge valves to prevent batch cross-contamination.
- **21 CFR Part 11 Immutable Audit Trail**: Role-based access control (Operator, QA Lead, Process Engineer, Admin) logging every alarm acknowledgment and recipe execution with cryptographic timestamps.

### 5. 💰 Resource Optimization & Sustainability ROI
- Tracks plant-wide sustainability impact:
  - 💧 **48,200 L Water Saved** per month (+24.5% efficiency).
  - ⚡ **34.5 Hours Downtime Reduction** per month.
  - 💵 **$28,400 / month Financial Payback**.

---

## 🚀 Guided Hackathon Pitch Narrative (10-Step Demo)

CleanOptima Edge includes a built-in **Pitch Mode Guide** designed for investor presentations and hackathon live demos:

1. **The $2B Cross-Contamination Risk**: Show plant overview & traditional over-cleaning penalty.
2. **Multi-Sensor Baseline**: Stream live 6-channel sensor baseline ($152\text{ L/min}$, $71^\circ\text{C}$).
3. **Injecting Nozzle Blockage Anomaly**: Trigger `SPRAY_BLOCKAGE` scenario in Simulation Lab.
4. **Instant Anomaly Alert**: Watch ML Anomaly Score spike to **78.5/100 (CRITICAL)**.
5. **Explainable AI Reasoning**: Review 1D CNN reconstruction loss feature chart pinpointing flow degradation.
6. **Physics Decay Deviation**: Observe $C(t)$ curve lagging physics model trajectory.
7. **Simulated Hardware Interlock Trigger**: Interlock switches to **RED (NEXT BATCH BLOCKED)**.
8. **3D Software Model Inspection**: Click spray ball nozzle in 3D WebGL viewer to view nozzle pressure build-up.
9. **QA Role Sign-Off & Audit Trail**: Switch role to QA Lead, acknowledge alarm with digital signature.
10. **ROI & Water Savings Summary**: Demonstrate $28.4k/mo savings & environmental impact.

---

## 🛠️ Project Structure

```
pharma-pure/
├── backend/                        # Python FastAPI Backend & AI Engine
│   ├── simulator.py                # 6-channel telemetry simulator & scenario generator
│   ├── physics_model.py            # Exponential residue decay kinetics C(t) = C0 * exp(-kt)
│   ├── ml_engine.py                # 1D CNN Autoencoder reconstruction error & XAI
│   ├── decision_engine.py         # Hardware interlocks & GxP audit logger
│   ├── main.py                     # FastAPI REST API & WebSocket gateway (/ws/cip/live)
│   └── requirements.txt            # Python dependencies
├── src/                            # React + TypeScript Frontend
│   ├── components/
│   │   ├── Hardware3DSoftwareModel.tsx  # Three.js 3D WebGL CAD visualizer & particles
│   │   ├── DigitalTwinViewer.tsx        # 3D/2D Digital Twin viewer & inspector
│   │   ├── RealTimeCIPMonitoring.tsx    # 7-phase timeline & live streaming charts
│   │   ├── ExecutiveDashboard.tsx       # Plant overview & fleet matrix
│   │   ├── AnomalyIntelligence.tsx      # XAI radar & reconstruction loss breakdown
│   │   ├── PhysicsClearancePanel.tsx    # Residue decay curve & interlock spotlight
│   │   ├── EquipmentHealth.tsx          # Asset health scorecards (0-100)
│   │   ├── CIPHistoryComparison.tsx     # Historical cycle overlay analytics
│   │   ├── ResourceOptimization.tsx     # Sustainability & ROI calculations
│   │   ├── AlarmCenter.tsx              # Role-based alarm acknowledgment
│   │   ├── AuditTrailView.tsx           # 21 CFR Part 11 compliant audit trail
│   │   ├── SimulationLab.tsx            # Live scenario injection control center
│   │   ├── PitchModeGuide.tsx           # 10-step guided hackathon story flow
│   │   └── SettingsPanel.tsx            # Edge node configuration
│   ├── services/
│   │   └── api.ts                   # WebSocket client & REST API service
│   ├── types/
│   │   └── index.ts                 # TypeScript data contracts & sensor interfaces
│   ├── App.tsx                      # Main layout & router orchestration
│   └── index.css                    # Tailwind CSS control-room dark styling
├── docker-compose.yml              # Containerized edge deployment
├── Dockerfile                      # Backend Docker container specification
├── README.md                       # Product documentation
└── walkthrough.md                  # Detailed verification report
```

---

## 💻 Quick Start & Installation

### Option 1: Local Development (Without Docker)

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*FastAPI REST server will run on `http://localhost:8000` with WebSocket at `ws://localhost:8000/ws/cip/live`.*

#### 2. Frontend Setup
```bash
# In project root
npm install
npm run dev
```
*React Vite application will run on `http://localhost:3000`.*

---

### Option 2: Docker Containerized Edge Deployment

```bash
docker-compose up --build
```
This builds and launches both containers:
- **Backend API & WebSockets**: `http://localhost:8000`
- **Frontend Mission Control UI**: `http://localhost:80`

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/cip/telemetry` | `GET` | Get current CIP telemetry frame snapshot |
| `/ws/cip/live` | `WS` | WebSocket real-time sensor & AI telemetry stream |
| `/api/equipment` | `GET` | List pharmaceutical asset fleet health scorecards |
| `/api/alarms` | `GET` | Retrieve active & acknowledged alarm logs |
| `/api/alarms/{id}/acknowledge` | `POST` | Acknowledge alarm with GxP digital sign-off |
| `/api/simulation/scenario` | `POST` | Inject live anomaly scenario (`SPRAY_BLOCKAGE`, etc.) |
| `/api/simulation/reset` | `POST` | Reset simulation to normal operating baseline |

---

## ⚖️ GxP Compliance & Disclaimer

> **DISCLAIMER**: CleanOptima Edge (PharmaPure) is a functional prototype and decision-support demonstration created for pharmaceutical IoT technology evaluation. Hardware interlocks are simulated and not connected to live physical production PLCs without validated 21 CFR Part 11 qualification.

---

<div align="center">

**CleanOptima Edge / PharmaPure** — *Clean Smarter. Detect Earlier. Produce Safer.*

</div>
