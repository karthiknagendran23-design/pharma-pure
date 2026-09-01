import React from 'react';
import {
    Activity,
    Droplet,
    Clock,
    ShieldAlert,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Zap,
    ArrowRight,
    HardDrive,
    Cpu
} from 'lucide-react';
import { CIPTelemetryFrame, EquipmentAsset, NavigationTab } from '../types';

interface ExecutiveDashboardProps {
    telemetry: CIPTelemetryFrame;
    equipment: EquipmentAsset[];
    setActiveTab: (tab: NavigationTab) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
    telemetry,
    equipment,
    setActiveTab
}) => {
    const activeCIPsCount = equipment.filter(e => e.status === 'CLEANING' || e.status === 'WARNING').length;
    const normalCount = equipment.filter(e => e.status === 'READY' || e.status === 'CLEANING').length;
    const warningCount = equipment.filter(e => e.status === 'WARNING').length;

    return (
        <div className="p-6 space-y-6">
            {/* Top Banner Statement */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>CleanOptima Edge — Real-Time CIP Intelligence Platform</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                        Plant-Wide Cleaning & Sensor Validation Overview
                    </h2>
                    <p className="text-xs text-slate-400 max-w-3xl">
                        Continuously analyzing multi-sensor streams (TOC, Conductivity, Turbidity, Flow, Temp, Pressure),
                        physics-informed exponential clearance rate, and 1D CNN Autoencoder ML anomaly detection across pharmaceutical assets.
                    </p>
                </div>

                <button
                    onClick={() => setActiveTab('pitch-mode')}
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all shrink-0"
                >
                    <span>Pitch Mode (Hackathon Demo)</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active CIPs */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">Active CIP Cycles</p>
                        <h3 className="text-2xl font-bold text-slate-100 mt-1 flex items-baseline space-x-2">
                            <span>{activeCIPsCount}</span>
                            <span className="text-xs font-normal text-slate-400">/ {equipment.length} Assets</span>
                        </h3>
                        <div className="flex items-center space-x-2 mt-2 text-[11px]">
                            <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{normalCount} Normal</span>
                            </span>
                            <span className="flex items-center space-x-1 text-amber-400 font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{warningCount} Warning</span>
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                </div>

                {/* Anomaly Score */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">ML Anomaly Score (Reactor-04)</p>
                        <h3 className="text-2xl font-bold mt-1 flex items-baseline space-x-2">
                            <span className={telemetry.ml_anomaly.anomaly_score > 60 ? 'text-red-400' : telemetry.ml_anomaly.anomaly_score > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                                {telemetry.ml_anomaly.anomaly_score}
                            </span>
                            <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">
                            Status: <span className="text-slate-200 font-bold uppercase">{telemetry.ml_anomaly.status_label}</span>
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${telemetry.ml_anomaly.anomaly_score > 60
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : telemetry.ml_anomaly.anomaly_score > 30
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                </div>

                {/* Water Saved */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">Water Saved (This Month)</p>
                        <h3 className="text-2xl font-bold text-slate-100 mt-1">48,200 L</h3>
                        <p className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1 font-medium">
                            <TrendingUp className="w-3 h-3" />
                            <span>+24.5% efficiency vs conventional CIP</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-blue-400" />
                    </div>
                </div>

                {/* Downtime Reduction */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">Downtime Reduction</p>
                        <h3 className="text-2xl font-bold text-slate-100 mt-1">34.5 Hours</h3>
                        <p className="text-[11px] text-indigo-400 mt-2 flex items-center space-x-1 font-medium">
                            <Zap className="w-3 h-3" />
                            <span>Estimated ROI: $28,400 / month</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Main Focus: Active CIP Monitoring Spotlight (Reactor-04) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                        <div>
                            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                                <span>{telemetry.equipment_id}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-normal">
                                    {telemetry.recipe_id}
                                </span>
                            </h3>
                            <p className="text-xs text-slate-400 font-mono">
                                Cycle: {telemetry.cycle_id} • Previous Product: {telemetry.previous_product}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('live-cip')}
                        className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all flex items-center space-x-1.5"
                    >
                        <span>Open Real-Time Monitor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Phase Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold flex items-center space-x-2">
                            <span>Phase:</span>
                            <span className="text-cyan-400 uppercase tracking-wider">{telemetry.phase_info.current_phase}</span>
                            <span className="text-slate-500">({telemetry.phase_info.phase_index} of 7)</span>
                        </span>
                        <span className="text-slate-400 font-mono">
                            Overall Progress: <strong className="text-slate-100">{telemetry.phase_info.overall_progress_pct}%</strong> (ETA: {telemetry.phase_info.estimated_clearance_eta_min} min)
                        </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${telemetry.ml_anomaly.anomaly_score > 60
                                    ? 'bg-gradient-to-r from-red-500 to-amber-500'
                                    : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400'
                                }`}
                            style={{ width: `${telemetry.phase_info.overall_progress_pct}%` }}
                        ></div>
                    </div>
                </div>

                {/* Live Telemetry Sensor Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">TOC (Residue)</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">{telemetry.sensors.toc} <span className="text-xs text-slate-400">ppb</span></p>
                        <span className="text-[10px] text-emerald-400 font-mono">Target: &lt;50 ppb</span>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Conductivity</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">{telemetry.sensors.conductivity} <span className="text-xs text-slate-400">µS/cm</span></p>
                        <span className="text-[10px] text-slate-400 font-mono">Phase profile active</span>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Turbidity</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">{telemetry.sensors.turbidity} <span className="text-xs text-slate-400">NTU</span></p>
                        <span className="text-[10px] text-slate-400 font-mono">Water clarity index</span>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Flow Rate</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">{telemetry.sensors.flow} <span className="text-xs text-slate-400">L/min</span></p>
                        <span className={telemetry.sensors.flow < 130 ? 'text-[10px] text-amber-400 font-mono font-bold' : 'text-[10px] text-emerald-400 font-mono'}>
                            {telemetry.sensors.flow < 130 ? '⚠ Below Target' : 'Target: >140 L/min'}
                        </span>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Temperature</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">{telemetry.sensors.temp} <span className="text-xs text-slate-400">°C</span></p>
                        <span className="text-[10px] text-slate-400 font-mono">Wash temp sensor</span>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Pressure</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">{telemetry.sensors.pressure} <span className="text-xs text-slate-400">bar</span></p>
                        <span className="text-[10px] text-slate-400 font-mono">Spray pressure</span>
                    </div>
                </div>
            </div>

            {/* Equipment Fleet Status Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                        <HardDrive className="w-5 h-5 text-cyan-400" />
                        <span>Pharmaceutical Fleet Equipment Status</span>
                    </h3>

                    <button
                        onClick={() => setActiveTab('equipment')}
                        className="text-xs text-cyan-400 hover:underline font-medium"
                    >
                        View Full Equipment Matrix →
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {equipment.map((item) => (
                        <div
                            key={item.id}
                            className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3.5 space-y-2 hover:border-slate-700 transition-all cursor-pointer"
                            onClick={() => setActiveTab('live-cip')}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200 text-sm">{item.id}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${item.status === 'CLEANING'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : item.status === 'WARNING'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>

                            <p className="text-xs text-slate-400 truncate">{item.name}</p>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
                                <span className="text-slate-400">Health Score:</span>
                                <span className="font-mono font-bold text-slate-200">{item.health_score}/100</span>
                            </div>

                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.health_score > 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                    style={{ width: `${item.health_score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
