import { CIPTelemetryFrame, EquipmentAsset, AlarmItem, AuditLogItem, CIPHistoryItem, ScenarioType } from '../types';

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws/cip/live';

// Standalone Simulator Fallback in Browser
class LocalBrowserSimulator {
    private elapsedSeconds = 120;
    private scenario: ScenarioType = 'NORMAL';
    private speed = 1.0;

    public setScenario(s: ScenarioType) {
        this.scenario = s;
    }

    public reset() {
        this.elapsedSeconds = 0;
        this.scenario = 'NORMAL';
    }

    public generateStep(): CIPTelemetryFrame {
        this.elapsedSeconds += 1.5 * this.speed;
        const elapsedMin = this.elapsedSeconds / 60.0;

        const phases = [
            { name: "Pre-rinse", duration_min: 3.0, description: "Initial water flush to clear bulk residual soil" },
            { name: "Caustic wash", duration_min: 5.0, description: "Circulation of 2.0% NaOH detergent solution at 70°C" },
            { name: "Intermediate rinse", duration_min: 2.5, description: "Purified water flush to remove caustic residual" },
            { name: "Acid wash", duration_min: 3.5, description: "Circulation of 1.0% HNO3 solution to remove mineral scale" },
            { name: "Final rinse", duration_min: 4.0, description: "WFI (Water For Injection) final high-purity flush" },
            { name: "Verification", duration_min: 2.0, description: "Real-time TOC & conductivity validation window" },
            { name: "Release / Hold", duration_min: 1.0, description: "Decision support interlock check & GxP release" }
        ];

        const totalSec = phases.reduce((acc, p) => acc + p.duration_min * 60, 0);
        const currSec = this.elapsedSeconds % totalSec;
        let accSec = 0;
        let phaseIndex = 0;
        for (let i = 0; i < phases.length; i++) {
            if (currSec < accSec + phases[i].duration_min * 60) {
                phaseIndex = i;
                break;
            }
            accSec += phases[i].duration_min * 60;
        }

        const currentPhase = phases[phaseIndex].name;
        const phaseElapsedSec = currSec - accSec;
        const phaseProgressPct = Math.min(100, (phaseElapsedSec / (phases[phaseIndex].duration_min * 60)) * 100);
        const overallProgressPct = Math.min(100, (currSec / totalSec) * 100);

        // Physics Exponential Clearance
        const initialC = 4800.0;
        const decay = Math.exp(-0.35 * elapsedMin);
        let toc = Math.max(12.0, initialC * decay + (Math.random() * 8 - 4));
        let cond = 14.2;
        let temp = 30.0;
        let flow = 152.0 + (Math.random() * 4 - 2);
        let turb = Math.max(0.1, 8.0 * decay + (Math.random() * 0.4 - 0.2));
        let press = 2.3 + (Math.random() * 0.1 - 0.05);

        if (currentPhase === "Caustic wash") {
            cond = 420.0 + (Math.random() * 20 - 10);
            temp = 71.0 + (Math.random() * 2 - 1);
        } else if (currentPhase === "Acid wash") {
            cond = 215.0 + (Math.random() * 10 - 5);
            temp = 65.0 + (Math.random() * 2 - 1);
        } else if (currentPhase === "Verification") {
            cond = 2.8;
            temp = 23.0;
        }

        let anomalyScore = Math.min(24, Math.random() * 10 + 10);
        let scenarioCause = "All sensors follow validated historical baselines";
        let statusLabel: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL' = 'NORMAL';
        let severityLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        let interlockState: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
        let interlockLabel = "NEXT BATCH ENABLED — PENDING QA RELEASE";
        let cipStatus: any = "ON TRACK";

        if (this.scenario === 'SPRAY_BLOCKAGE') {
            flow = Math.max(85, flow - elapsedMin * 9);
            toc += 160 + elapsedMin * 40;
            turb += 1.5;
            anomalyScore = 78.5;
            statusLabel = 'WARNING';
            severityLabel = 'HIGH';
            interlockState = 'RED';
            interlockLabel = 'NEXT BATCH BLOCKED';
            cipStatus = 'INVESTIGATION REQUIRED';
            scenarioCause = 'Possible spray nozzle obstruction / coverage degradation';
        } else if (this.scenario === 'FLOW_STAGNATION') {
            flow = 42.0 + Math.random() * 4;
            press = 0.9;
            anomalyScore = 94.0;
            statusLabel = 'CRITICAL';
            severityLabel = 'CRITICAL';
            interlockState = 'RED';
            interlockLabel = 'NEXT BATCH BLOCKED';
            cipStatus = 'HOLD';
            scenarioCause = 'Severe flow stagnation or recirculation pump trip';
        } else if (this.scenario === 'DETERGENT_ANOMALY') {
            cond = 175.0;
            anomalyScore = 68.0;
            statusLabel = 'WARNING';
            severityLabel = 'HIGH';
            interlockState = 'YELLOW';
            interlockLabel = 'CIP INVESTIGATION REQUIRED';
            cipStatus = 'INVESTIGATION REQUIRED';
            scenarioCause = 'Detergent concentration dosing error';
        } else if (this.scenario === 'SLOW_CLEARANCE') {
            const slowDecay = Math.exp(-0.10 * elapsedMin);
            toc = Math.max(220.0, initialC * slowDecay);
            anomalyScore = 64.0;
            statusLabel = 'WARNING';
            severityLabel = 'HIGH';
            interlockState = 'YELLOW';
            interlockLabel = 'CIP INVESTIGATION REQUIRED';
            cipStatus = 'INVESTIGATION REQUIRED';
            scenarioCause = 'High initial soil load or dead-leg residual API';
        } else if (this.scenario === 'SENSOR_FAILURE') {
            cond = 9920.0;
            anomalyScore = 86.0;
            statusLabel = 'CRITICAL';
            severityLabel = 'CRITICAL';
            interlockState = 'RED';
            interlockLabel = 'NEXT BATCH BLOCKED';
            cipStatus = 'HOLD';
            scenarioCause = 'Conductivity sensor signal drift or hardware failure';
        } else if (this.scenario === 'MULTI_ANOMALY') {
            flow = 92.0;
            toc += 500;
            anomalyScore = 96.5;
            statusLabel = 'CRITICAL';
            severityLabel = 'CRITICAL';
            interlockState = 'RED';
            interlockLabel = 'NEXT BATCH BLOCKED';
            cipStatus = 'HOLD';
            scenarioCause = 'Combined spray blockage and chemical dosing failure';
        }

        const expectedToc = Math.max(10, initialC * Math.exp(-0.35 * elapsedMin));
        const k = 0.35;
        const remainingMin = Math.max(0, (Math.log(initialC / 50.0) / k) - elapsedMin);

        return {
            equipment_id: "REACTOR-04",
            vessel_name: "5000L Formulation Reactor Vessel A",
            previous_product: "API-FORMULATION-A (Paracetamol Active)",
            recipe_id: "CIP-RECIPE-07",
            cycle_id: "CIP-2026-00482",
            operator: "K. Sharma (Lead Process Eng)",
            phase_info: {
                current_phase: currentPhase,
                phase_index: phaseIndex + 1,
                total_phases: phases.length,
                description: phases[phaseIndex].description,
                phase_progress_pct: Math.round(phaseProgressPct),
                overall_progress_pct: Math.round(overallProgressPct),
                total_elapsed_min: Math.round(elapsedMin * 10) / 10,
                estimated_clearance_eta_min: Math.round(remainingMin * 10) / 10,
                all_phases: phases
            },
            sensors: {
                toc: Math.round(toc * 10) / 10,
                conductivity: Math.round(cond * 10) / 10,
                turbidity: Math.round(turb * 10) / 10,
                flow: Math.round(flow * 10) / 10,
                temp: Math.round(temp * 10) / 10,
                pressure: Math.round(press * 100) / 100,
                timestamp: Date.now() / 1000
            },
            physics_model: {
                elapsed_minutes: Math.round(elapsedMin * 10) / 10,
                observed_toc: Math.round(toc * 10) / 10,
                expected_toc: Math.round(expectedToc * 10) / 10,
                target_threshold: 50.0,
                clearance_rate_k: 0.35,
                clearance_percentage: Math.min(100, Math.round((1 - (toc / initialC)) * 1000) / 10),
                estimated_minutes_to_target: Math.round(remainingMin * 10) / 10,
                lower_bound_confidence: Math.round(expectedToc * 0.88 * 10) / 10,
                upper_bound_confidence: Math.round(expectedToc * 1.12 * 10) / 10,
                clearance_status: this.scenario === 'NORMAL' ? 'ON_TRACK' : 'SLIGHT_LAG',
                deviation_pct: this.scenario === 'NORMAL' ? 2.1 : 28.5,
                is_cleared: toc <= 50.0 && currentPhase === "Verification"
            },
            ml_anomaly: {
                anomaly_score: Math.round(anomalyScore * 10) / 10,
                status_label: statusLabel,
                severity: severityLabel,
                reconstruction_error: Math.round(anomalyScore * 0.008 * 1000) / 1000,
                feature_contributions: {
                    flow: this.scenario === 'SPRAY_BLOCKAGE' || this.scenario === 'FLOW_STAGNATION' ? 84.5 : 12.0,
                    toc: this.scenario === 'SLOW_CLEARANCE' ? 91.0 : 15.4,
                    conductivity: this.scenario === 'DETERGENT_ANOMALY' || this.scenario === 'SENSOR_FAILURE' ? 98.0 : 8.2,
                    turbidity: 14.5,
                    temperature: 9.1,
                    pressure: 11.2
                },
                xai_reasoning: {
                    summary_bullet_points: [
                        `Flow rate observed at ${Math.round(flow)} L/min`,
                        `TOC residue at ${Math.round(toc)} ppb`,
                        `Conductivity reading ${Math.round(cond)} µS/cm`
                    ],
                    most_likely_cause: scenarioCause,
                    confidence_percentage: this.scenario === 'NORMAL' ? 94.0 : 88.5,
                    flagged: anomalyScore >= 30
                }
            },
            decision: {
                cip_status: cipStatus,
                action_recommendation: this.scenario === 'NORMAL'
                    ? "Continue CIP recipe progression. All sensor profiles operating within envelope."
                    : "Inspect spray nozzles and flow recirculating valves immediately.",
                interlock_state: interlockState,
                interlock_label: interlockLabel,
                interlock_description: this.scenario === 'NORMAL'
                    ? "CIP criteria operating cleanly."
                    : "Equipment interlock triggered due to process deviation.",
                qa_readiness: this.scenario === 'NORMAL' ? 'IN_PROGRESS' : 'NOT_READY',
                disclaimer: "SIMULATED INTERLOCK — DEMO PROTOTYPE NOT CONNECTED TO PRODUCTION PLC. GMP VERIFICATION REQUIRED."
            },
            active_scenario: this.scenario,
            simulation_speed: this.speed
        };
    }
}

export const localSimulator = new LocalBrowserSimulator();

export const api = {
    subscribeToTelemetry: subscribeToLiveCIP,
    getEquipmentAssets: async (): Promise<EquipmentAsset[]> => {
        return await api.getEquipment();
    },
    async getEquipment(): Promise<EquipmentAsset[]> {
        try {
            const res = await fetch(`${BACKEND_URL}/api/equipment`);
            if (res.ok) return await res.json();
        } catch (e) {
            // Fallback
        }
        return [
            {
                id: "REACTOR-04",
                name: "5000L Formulation Reactor Vessel A",
                type: "Reactor",
                health_score: 91,
                status: "CLEANING",
                active_cip: "CIP-2026-00482",
                current_phase: "Final rinse",
                previous_product: "API-FORMULATION-A",
                anomaly_frequency_30d: 2,
                avg_cleaning_min: 18.5,
                last_maintenance: "2026-08-14",
                spray_ball_health: 94,
                pump_health: 88,
                sensor_health: 96
            },
            {
                id: "MIXER-02",
                name: "2500L High Shear Granulator Vessel",
                type: "Mixer",
                health_score: 98,
                status: "READY",
                active_cip: null,
                current_phase: "IDLE",
                previous_product: "IBUPROFEN-200MG",
                anomaly_frequency_30d: 0,
                avg_cleaning_min: 14.2,
                last_maintenance: "2026-08-20",
                spray_ball_health: 99,
                pump_health: 97,
                sensor_health: 98
            },
            {
                id: "FERMENTER-01",
                name: "10000L Bioreactor Fermentation Tank",
                type: "Fermenter",
                health_score: 84,
                status: "WARNING",
                active_cip: "CIP-2026-00479",
                current_phase: "Intermediate rinse",
                previous_product: "MONOCLONAL-MAB-9",
                anomaly_frequency_30d: 5,
                avg_cleaning_min: 24.8,
                last_maintenance: "2026-07-28",
                spray_ball_health: 78,
                pump_health: 82,
                sensor_health: 91
            },
            {
                id: "BIOREACTOR-03",
                name: "3000L Cell Culture Bioreactor C",
                type: "Bioreactor",
                health_score: 95,
                status: "READY",
                active_cip: null,
                current_phase: "IDLE",
                previous_product: "VACCINE-ADJUVANT-B",
                anomaly_frequency_30d: 1,
                avg_cleaning_min: 16.0,
                last_maintenance: "2026-08-18",
                spray_ball_health: 96,
                pump_health: 95,
                sensor_health: 94
            },
            {
                id: "COATER-05",
                name: "Tablet Coating Pan System E",
                type: "Coater",
                health_score: 92,
                status: "READY",
                active_cip: null,
                current_phase: "IDLE",
                previous_product: "METFORMIN-500MG",
                anomaly_frequency_30d: 1,
                avg_cleaning_min: 15.1,
                last_maintenance: "2026-08-02",
                spray_ball_health: 91,
                pump_health: 93,
                sensor_health: 92
            },
            {
                id: "DRYER-01",
                name: "Fluid Bed Dryer Processing Unit 1",
                type: "Dryer",
                health_score: 87,
                status: "MAINTENANCE",
                active_cip: null,
                current_phase: "IDLE",
                previous_product: "PARACETAMOL-DC",
                anomaly_frequency_30d: 4,
                avg_cleaning_min: 21.0,
                last_maintenance: "2026-08-31",
                spray_ball_health: 82,
                pump_health: 85,
                sensor_health: 94
            }
        ];
    },

    async setScenario(scenario: ScenarioType): Promise<void> {
        localSimulator.setScenario(scenario);
        try {
            await fetch(`${BACKEND_URL}/api/simulation/scenario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario })
            });
        } catch (e) { }
    },

    async resetSimulation(): Promise<void> {
        localSimulator.reset();
        try {
            await fetch(`${BACKEND_URL}/api/simulation/reset`, { method: 'POST' });
        } catch (e) { }
    },

    async getAlarms(): Promise<AlarmItem[]> {
        try {
            const res = await fetch(`${BACKEND_URL}/api/alarms`);
            if (res.ok) return await res.json();
        } catch (e) { }
        return [
            {
                id: "ALM-9081",
                timestamp: "2026-09-01 14:32:10",
                equipment_id: "REACTOR-04",
                title: "CLEARANCE RATE DEVIATION",
                description: "TOC clearance is 31% slower than physics baseline profile",
                severity: "HIGH",
                sensor: "TOC",
                anomaly_score: 68.4,
                status: "ACTIVE",
                acknowledged_by: null
            },
            {
                id: "ALM-9078",
                timestamp: "2026-09-01 11:15:04",
                equipment_id: "FERMENTER-01",
                title: "SPRAY COVERAGE ANOMALY",
                description: "Flow rate dropped 18% below lower specification boundary",
                severity: "CRITICAL",
                sensor: "FLOW",
                anomaly_score: 84.1,
                status: "ACKNOWLEDGED",
                acknowledged_by: "J. Miller (QA Specialist)"
            },
            {
                id: "ALM-9065",
                timestamp: "2026-08-31 09:40:22",
                equipment_id: "DRYER-01",
                title: "CONDUCTIVITY SPIKE DETECTED",
                description: "Detergent rinse phase conductivity exceeded 450 µS/cm threshold",
                severity: "MEDIUM",
                sensor: "CONDUCTIVITY",
                anomaly_score: 52.0,
                status: "RESOLVED",
                acknowledged_by: "R. Vance (Process Eng)"
            }
        ];
    },

    async acknowledgeAlarm(alarmId: string, userName: string): Promise<boolean> {
        try {
            const res = await fetch(`${BACKEND_URL}/api/alarms/${alarmId}/acknowledge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: userName })
            });
            if (res.ok) return true;
        } catch (e) { }
        return true;
    },

    async getAuditLogs(): Promise<AuditLogItem[]> {
        try {
            const res = await fetch(`${BACKEND_URL}/api/audit-logs`);
            if (res.ok) return await res.json();
        } catch (e) { }
        return [
            {
                id: "AUD-5021",
                timestamp: "2026-09-01 15:02:11",
                user: "K. Sharma (Operator)",
                action: "CIP RECIPE STARTED",
                equipment_id: "REACTOR-04",
                details: "Initiated CIP-RECIPE-07 post API-FORMULATION-A campaign",
                reason: "Routine campaign changeover cleaning SOP-CIP-402"
            },
            {
                id: "AUD-5019",
                timestamp: "2026-09-01 14:35:00",
                user: "CleanOptima Edge AI Engine",
                action: "INTERLOCK STATE CHANGE",
                equipment_id: "REACTOR-04",
                details: "Changed interlock status to YELLOW (CIP INVESTIGATION REQUIRED)",
                reason: "ML Anomaly Score exceeded 60 threshold (68.4 score)"
            },
            {
                id: "AUD-5015",
                timestamp: "2026-09-01 11:16:30",
                user: "J. Miller (QA Lead)",
                action: "ALARM ACKNOWLEDGED",
                equipment_id: "FERMENTER-01",
                details: "Acknowledged ALM-9078 Spray Coverage Anomaly",
                reason: "Maintenance dispatched to clear spray nozzle inlet strainers"
            },
            {
                id: "AUD-5008",
                timestamp: "2026-08-31 16:45:10",
                user: "A. Chen (QA Director)",
                action: "QA VERIFICATION SIGN-OFF",
                equipment_id: "MIXER-02",
                details: "Verified final TOC < 15 ppb, conductivity < 1.5 µS/cm",
                reason: "Batch release for IBUPROFEN-200MG production"
            }
        ];
    },

    async getCIPHistory(): Promise<CIPHistoryItem[]> {
        try {
            const res = await fetch(`${BACKEND_URL}/api/cip/history`);
            if (res.ok) return await res.json();
        } catch (e) { }
        return [
            {
                cycle_id: "CIP-2026-00481",
                equipment_id: "REACTOR-04",
                date: "2026-08-31",
                recipe: "CIP-RECIPE-07",
                duration_min: 17.8,
                water_consumed_L: 840,
                max_anomaly_score: 14.2,
                status: "SUCCESS",
                qa_released: true,
                water_saved_L: 260
            },
            {
                cycle_id: "CIP-2026-00480",
                equipment_id: "REACTOR-04",
                date: "2026-08-30",
                recipe: "CIP-RECIPE-07",
                duration_min: 18.2,
                water_consumed_L: 860,
                max_anomaly_score: 19.5,
                status: "SUCCESS",
                qa_released: true,
                water_saved_L: 240
            },
            {
                cycle_id: "CIP-2026-00478",
                equipment_id: "FERMENTER-01",
                date: "2026-08-29",
                recipe: "CIP-BIO-RECIPE-03",
                duration_min: 26.5,
                water_consumed_L: 1450,
                max_anomaly_score: 79.0,
                status: "INVESTIGATED",
                qa_released: false,
                water_saved_L: 0
            }
        ];
    }
};

export function subscribeToLiveCIP(onFrame: (frame: CIPTelemetryFrame) => void): () => void {
    let ws: WebSocket | null = null;
    let timer: any = null;

    try {
        ws = new WebSocket(WS_URL);
        ws.onmessage = (event) => {
            try {
                const frame: CIPTelemetryFrame = JSON.parse(event.data);
                onFrame(frame);
            } catch (e) { }
        };
        ws.onerror = () => {
            // Use local simulator if WS fails
            startLocalTimer();
        };
    } catch (e) {
        startLocalTimer();
    }

    function startLocalTimer() {
        if (timer) return;
        timer = setInterval(() => {
            const frame = localSimulator.generateStep();
            onFrame(frame);
        }, 1500);
    }

    return () => {
        if (ws) ws.close();
        if (timer) clearInterval(timer);
    };
}
