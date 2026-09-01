export type NavigationTab =
    | 'dashboard'
    | 'live-cip'
    | 'digital-twin'
    | 'digital-queen'
    | 'anomaly-intel'
    | 'physics-clearance'
    | 'equipment-health'
    | 'equipment'
    | 'cip-history'
    | 'resource-opt'
    | 'alarm-center'
    | 'audit-trail'
    | 'simulation-lab'
    | 'pitch-guide'
    | 'pitch-mode'
    | 'settings';

export type UserRole = 'OPERATOR' | 'QA_ENGINEER' | 'PROCESS_ENGINEER' | 'PLANT_MANAGER';

export interface PhaseInfo {
    name: string;
    duration_min: number;
    description: string;
}

export interface CIPPhaseProgress {
    current_phase: string;
    phase_index: number;
    total_phases: number;
    description: string;
    phase_progress_pct: number;
    overall_progress_pct: number;
    total_elapsed_min: number;
    estimated_clearance_eta_min: number;
    all_phases: PhaseInfo[];
}

export interface SensorFrame {
    toc: number;            // ppb
    conductivity: number;   // µS/cm
    turbidity: number;      // NTU
    flow: number;           // L/min
    temp: number;           // °C
    pressure: number;       // bar
    timestamp: number;
}

export interface PhysicsClearance {
    elapsed_minutes: number;
    observed_toc: number;
    expected_toc: number;
    target_threshold: number;
    clearance_rate_k: number;
    clearance_percentage: number;
    estimated_minutes_to_target: number;
    lower_bound_confidence: number;
    upper_bound_confidence: number;
    clearance_status: 'ON_TRACK' | 'SLIGHT_LAG' | 'SIGNIFICANT_LAG' | 'OPTIMAL_ACCELERATED';
    deviation_pct: number;
    is_cleared: boolean;
}

export interface XAIReasoning {
    summary_bullet_points: string[];
    most_likely_cause: string;
    confidence_percentage: number;
    flagged: boolean;
}

export interface MLAnomaly {
    anomaly_score: number; // 0-100
    status_label: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reconstruction_error: number;
    feature_contributions: {
        flow: number;
        toc: number;
        conductivity: number;
        turbidity: number;
        temperature: number;
        pressure: number;
    };
    xai_reasoning: XAIReasoning;
}

export interface DecisionSupport {
    cip_status: 'CLEANING' | 'ON TRACK' | 'OPTIMIZATION POSSIBLE' | 'INVESTIGATION REQUIRED' | 'HOLD' | 'READY FOR QA VERIFICATION';
    action_recommendation: string;
    interlock_state: 'GREEN' | 'YELLOW' | 'RED';
    interlock_label: string;
    interlock_description: string;
    qa_readiness: 'IN_PROGRESS' | 'NEEDS_ATTENTION' | 'NOT_READY' | 'READY';
    disclaimer: string;
}

export interface CIPTelemetryFrame {
    equipment_id: string;
    vessel_name: string;
    previous_product: string;
    recipe_id: string;
    cycle_id: string;
    operator: string;
    phase_info: CIPPhaseProgress;
    sensors: SensorFrame;
    physics_model: PhysicsClearance;
    ml_anomaly: MLAnomaly;
    decision: DecisionSupport;
    active_scenario: string;
    simulation_speed: number;
}

export interface EquipmentAsset {
    id: string;
    name: string;
    type: string;
    health_score: number;
    status: string;
    active_cip: string | null;
    current_phase: string;
    previous_product: string;
    anomaly_frequency_30d: number;
    avg_cleaning_min: number;
    last_maintenance: string;
    spray_ball_health: number;
    pump_health: number;
    sensor_health: number;
}

export interface AlarmItem {
    id: string;
    timestamp: string;
    equipment_id: string;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    sensor: string;
    anomaly_score: number;
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
    acknowledged_by: string | null;
}

export interface AuditLogItem {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    equipment_id: string;
    details: string;
    reason: string;
}

export interface CIPHistoryItem {
    cycle_id: string;
    equipment_id: string;
    date: string;
    recipe: string;
    duration_min: number;
    water_consumed_L: number;
    max_anomaly_score: number;
    status: string;
    qa_released: boolean;
    water_saved_L: number;
}

export type ScenarioType =
    | 'NORMAL'
    | 'SPRAY_BLOCKAGE'
    | 'FLOW_STAGNATION'
    | 'SLOW_CLEARANCE'
    | 'DETERGENT_ANOMALY'
    | 'SENSOR_FAILURE'
    | 'MULTI_ANOMALY';
