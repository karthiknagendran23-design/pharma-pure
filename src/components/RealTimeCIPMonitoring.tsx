import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { Activity, AlertTriangle, ShieldCheck, Clock, Layers, Thermometer, Droplet, ArrowUpRight } from 'lucide-react';
import { CIPTelemetryFrame, NavigationTab } from '../types';

interface RealTimeCIPMonitoringProps {
    telemetry: CIPTelemetryFrame;
    setActiveTab: (tab: NavigationTab) => void;
}

export const RealTimeCIPMonitoring: React.FC<RealTimeCIPMonitoringProps> = ({
    telemetry,
    setActiveTab
}) => {
    const [chartData, setChartData] = useState<any[]>([]);

    // Maintain live 30-point time-series history
    useEffect(() => {
        const timeLabel = new Date(telemetry.sensors.timestamp * 1000).toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
        setChartData(prev => {
            const next = [...prev, {
                time: timeLabel,
                toc: telemetry.sensors.toc,
                flow: telemetry.sensors.flow,
                conductivity: telemetry.sensors.conductivity,
                turbidity: telemetry.sensors.turbidity,
                temp: telemetry.sensors.temp,
                pressure: telemetry.sensors.pressure,
                expected_toc: telemetry.physics_model.expected_toc,
                threshold: 50.0
            }];
            if (next.length > 30) return next.slice(next.length - 30);
            return next;
        });
    }, [telemetry.sensors.timestamp]);

    const phases = telemetry.phase_info.all_phases;
    const currentPhaseName = telemetry.phase_info.current_phase;

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Equipment & Cycle Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-slate-100">{telemetry.equipment_id}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                            {telemetry.vessel_name}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            Recipe: {telemetry.recipe_id}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono pt-1">
                        <span>Cycle ID: <strong className="text-slate-200">{telemetry.cycle_id}</strong></span>
                        <span>•</span>
                        <span>Prev Product: <strong className="text-slate-200">{telemetry.previous_product}</strong></span>
                        <span>•</span>
                        <span>Operator: <strong className="text-slate-200">{telemetry.operator}</strong></span>
                    </div>
                </div>

                {/* Elapsed Time & Decision Status */}
                <div className="flex items-center space-x-3">
                    <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 text-right">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Elapsed Cleaning Time</span>
                        <p className="text-lg font-bold font-mono text-cyan-400">{telemetry.phase_info.total_elapsed_min} <span className="text-xs text-slate-400">min</span></p>
                    </div>

                    <div className={`px-4 py-2 rounded-lg border text-right ${telemetry.decision.interlock_state === 'RED'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : telemetry.decision.interlock_state === 'YELLOW'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                        <span className="text-[10px] font-medium uppercase opacity-80">Decision Support</span>
                        <p className="text-sm font-bold tracking-tight">{telemetry.decision.cip_status}</p>
                    </div>
                </div>
            </div>

            {/* 7-Phase Horizontal Progress Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>CIP Phase Progression Engine (7 Phases)</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                        Overall: <strong className="text-cyan-400">{telemetry.phase_info.overall_progress_pct}%</strong> Complete
                    </span>
                </div>

                {/* Phase Timeline Buttons/Steps */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {phases.map((p, idx) => {
                        const isCurrent = p.name === currentPhaseName;
                        const isPast = idx + 1 < telemetry.phase_info.phase_index;

                        return (
                            <div
                                key={p.name}
                                className={`p-3 rounded-lg border flex flex-col justify-between space-y-1 transition-all ${isCurrent
                                        ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                                        : isPast
                                            ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                                            : 'bg-slate-950/40 border-slate-800/40 text-slate-400'
                                    }`}
                            >
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="opacity-60">Phase 0{idx + 1}</span>
                                    {isCurrent ? (
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                                    ) : isPast ? (
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : null}
                                </div>

                                <span className="font-bold text-xs truncate">{p.name}</span>
                                <span className="text-[10px] opacity-70 font-mono">{p.duration_min} min</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Real-Time Sensor Time-Series Grid (2x2 Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Chart 1: TOC Residue Concentration & Physics Model */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                                <Droplet className="w-4 h-4 text-emerald-400" />
                                <span>TOC Residue (ppb) vs Physics Clearance Model</span>
                            </h4>
                            <p className="text-[11px] text-slate-400">Live TOC concentration vs C(t) = C₀ e⁻ᵏᵗ</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-400">{telemetry.sensors.toc} ppb</span>
                            <p className="text-[10px] text-slate-400">Target &lt; 50 ppb</p>
                        </div>
                    </div>

                    <div className="h-60 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target 50ppb', fill: '#ef4444', fontSize: 10 }} />
                                <Line type="monotone" dataKey="toc" stroke="#10b981" strokeWidth={2.5} dot={false} name="Observed TOC (ppb)" />
                                <Line type="monotone" dataKey="expected_toc" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Physics Model (ppb)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Flow Rate (L/min) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                <span>CIP Flow Rate (L/min)</span>
                            </h4>
                            <p className="text-[11px] text-slate-400">Spray nozzle circulation flow rate</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-mono font-bold ${telemetry.sensors.flow < 130 ? 'text-red-400' : 'text-cyan-400'}`}>
                                {telemetry.sensors.flow} L/min
                            </span>
                            <p className="text-[10px] text-slate-400">Nominal: 140-165 L/min</p>
                        </div>
                    </div>

                    <div className="h-60 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 200]} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                                <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Min Flow 130 L/min', fill: '#f59e0b', fontSize: 10 }} />
                                <Line type="monotone" dataKey="flow" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Flow Rate (L/min)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 3: Conductivity (µS/cm) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span>Conductivity Profile (µS/cm)</span>
                            </h4>
                            <p className="text-[11px] text-slate-400">Chemical detergent dosing verification</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono font-bold text-purple-400">{telemetry.sensors.conductivity} µS/cm</span>
                        </div>
                    </div>

                    <div className="h-60 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                                <Line type="monotone" dataKey="conductivity" stroke="#a855f7" strokeWidth={2} dot={false} name="Conductivity (µS/cm)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 4: Temperature & Pressure */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                                <Thermometer className="w-4 h-4 text-amber-400" />
                                <span>Temperature (°C) & Pressure (bar)</span>
                            </h4>
                            <p className="text-[11px] text-slate-400">Thermal validation & spray header backpressure</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono font-bold text-amber-400">{telemetry.sensors.temp}°C • {telemetry.sensors.pressure} bar</span>
                        </div>
                    </div>

                    <div className="h-60 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                                <YAxis yAxisId="left" stroke="#f59e0b" tick={{ fontSize: 10 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" tick={{ fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temp (°C)" />
                                <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#38bdf8" strokeWidth={2} dot={false} name="Pressure (bar)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Quick Action Navigation to Digital Twin */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-200">Examine 3D Digital Twin Visualizer</h4>
                        <p className="text-xs text-slate-400">Inspect spray ball coverage, pump manifold flow direction, and dead-leg clearance zones.</p>
                    </div>
                </div>

                <button
                    onClick={() => setActiveTab('digital-twin')}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                    <span>Open Digital Twin</span>
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
