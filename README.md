# BHUMI3D — 3D ULPIN Generation & Vertical Property Mapping System

> **Tagline:** *“One Land Parcel. Every Floor. Every Property. One Digital Identity.”*

[![Digital Public Infrastructure](https://img.shields.io/badge/DPI-Government_Tech_Prototype-amber.svg)](https://bhumi3d.gov.in)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-cyan.svg)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Map-green.svg)](https://leafletjs.com)
[![Turf.js](https://img.shields.io/badge/Turf.js-Geospatial_Validation-emerald.svg)](https://turfjs.org)

**BHUMI3D** is a next-generation Digital Public Infrastructure (DPI) platform that transforms conventional 2D cadastral land parcel mapping into a **3D vertical property identity layer**. It enables urban governance bodies to map, register, validate, and assign unique digital identities to land parcels, buildings, floors, commercial units, and vertically stacked apartments.

---

## 🌟 Problem & Vision

Traditional land records represent property boundaries strictly in 2D space. However, modern urban landscapes consist of multi-storey towers, stacked commercial complexes, mixed-use developments, and basement infrastructure. A single flat 2D parcel footprint cannot distinguish individual floor levels or separate apartment owners.

**BHUMI3D solves this by establishing a clear 3D property hierarchy:**
$$\text{Land Parcel} \longrightarrow \text{Building} \longrightarrow \text{Floor} \longrightarrow \text{Unit} \longrightarrow \text{Ownership / Occupancy}$$

Each vertically stacked property receives a **ULPIN-Compatible Prototype Property ID (VPID)** and a verifiable **QR Digital Property Passport**.

---

## 🔥 Key WOW Features

### 1. Interactive 3D Property Visualizer (Three.js WebGL)
- Real parcel footprints extruded into 3D multi-storey building structures.
- Full camera controls: Orbit, Pan, Zoom, and View Reset.
- **Exploded 3D View (Hero Demo Feature)**: Animated vertical separation of floors along the Y-axis (`y = floor * height * explodedFactor`), making individual unit bounds instantly visually recognizable.
- **Vertical Floor Selector Slider**: Isolate single floors (e.g. Floor 8) or inspect all floors with building opacity control.
- **Interactive 3D Unit Picking**: Click any 3D unit block to highlight it in glowing neon cyan with wireframe bounding edges and trigger the **2D ↔ 3D Cadastral Trace**.

### 2. 2D Interactive GIS Map (Leaflet & Turf.js)
- Dark-themed vector basemap displaying parcel polygons, survey numbers, land use, and 3D building footprint layers.
- Status-coded parcel indicators (Approved = emerald/cyan, Field Verified = amber, Correction Requested = red).
- Map toolbars: Zoom, Locate, Measurement (distance and area calculations), Layer toggles, and Polygon Drawing mode for surveyors.
- Clicking any land parcel opens the **Property Information Sidebar** and triggers direct 2D ↔ 3D view synchronization.

### 3. Configurable ULPIN & VPID Generator
- Encodes land parcels (`TN-CHN-TRP-00018427`) and vertical property units (`TN-CHN-TRP-00018427-B01-F08-U8B`).
- Step-by-step visual animation engine (*Spatial Data Collection ➔ Geometry Bounds Check ➔ Spatial Geohash ➔ Admin Hierarchy ➔ Generated ID*).

### 4. QR Code Digital Property Card & PDF Exporter
- Canvas-rendered QR code pointing to verifiable digital property passport credentials.
- Export PDF Cadastral summary report formatted for municipal revenue archives.

### 5. 9-Step Vertical Property Registration Wizard
- Step 1: Select/Draw Parcel
- Step 2: Parcel Administrative Details (State, District, Taluk, Village, Survey #, Area, Land Use)
- Step 3: Building Structure Information (Name, Type, Height, Floor Count)
- Step 4 & 5: Floors & Units Configuration
- Step 6: Turf.js Geospatial Validation Engine
- Step 7: Smart ULPIN/VPID Generation
- Step 8: 3D Preview
- Step 9: Submit to Revenue Audit

### 6. Admin Verification Queue & Immutable Audit Stream
- Queue for Revenue Admins to inspect 3D geometry bounds, approve submissions, or request field corrections.
- Real-time audit log tracking actions timestamped with role credentials and IP addresses.

### 7. Dashboard Analytics & AI Spatial Assistant
- Metrics for total parcels, 3D buildings, vertical units, and **Vertical Mapping Coverage (73%)**.
- Recharts visualizations for land use distribution and height density breakdown.
- Local rule-based AI Property Assistant answering natural language queries grounded in the live dataset.

### 8. Guided 9-Step Hero Demo Mode
- Prominent **"DEMO MODE"** button launching a 3-minute guided tour featuring the Chennai/Tambaram flagship scenario (2,400 m² parcel, 15-storey tower, 120 units).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Glassmorphism Design System |
| **3D Engine** | Three.js WebGL, Orbit Controls, Custom Raycaster |
| **2D GIS Engine** | Leaflet JS, OpenStreetMap Tile Layer |
| **Geospatial Processing** | Turf.js (Self-intersection, spatial containment, area hierarchy) |
| **Analytics & Data** | Recharts, Custom Canvas QR Code, jsPDF |

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/karthiknagendran23-design/hackverse3-pitch.git
   cd hackverse3-pitch
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Local Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:3000/`

