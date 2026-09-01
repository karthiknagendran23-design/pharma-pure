import React, { useState } from 'react';
import { Box, CheckCircle2, AlertTriangle, X, Info, Gauge, Activity, ShieldAlert, RefreshCw, Cuboid as Cube, Layers } from 'lucide-react';
import { CIPTelemetryFrame } from '../types';
import { Hardware3DSoftwareModel } from './Hardware3DSoftwareModel';

interface DigitalTwinViewerProps {
    telemetry: CIPTelemetryFrame;
}

type SelectedComponent = 'SPRAY_BALL' | 'OUTLET' | 'PUMP' | 'DEAD_LEG' | 'VESSEL' | null;

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({ telemetry }) => {
    const [selectedComp, setSelectedComp] = useState<SelectedComponent>('SPRAY_BALL');
    const [viewMode, setViewMode] = useState<'3D_SOFTWARE_MODEL' | '2D_SCHEMATIC'>('3D_SOFTWARE_MODEL');

    // Determine component status color based on scenario & ML anomaly score
    const isSprayAbnormal = telemetry.active_scenario === 'SPRAY_BLOCKAGE' || (telemetry.ml_anomaly.anomaly_score > 60 && telemetry.sensors.flow < 130);
    const isPumpAbnormal = telemetry.active_scenario === 'FLOW_STAGNATION' || telemetry.sensors.flow < 60;
    const isOutletAbnormal = telemetry.active_scenario === 'SLOW_CLEARANCE' || telemetry.sensors.toc > 250;
    const isDeadLegAbnormal = telemetry.active_scenario === 'MULTI_ANOMALY';

    const getCompColor = (abnormal: boolean) => abnormal ? '#ef4444' : '#10b981';

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header with View Mode Switcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <Box className="w-4 h-4 text-cyan-400" />
                        <span>Digital Twin Intelligence — Reactor-04</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Interactive 3D Hardware Software Model & Digital Twin
                    </h2>
                    <p className="text-xs text-slate-400">
                        Real-time WebGL CAD software model mapping spray coverage, agitator dynamics, pump flow, and dead-leg clearance zones. Click any component to inspect.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* View Switcher: 3D Software Model vs 2D Schematic */}
                    <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1">
                        <button
                            onClick={() => setViewMode('3D_SOFTWARE_MODEL')}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all ${viewMode === '3D_SOFTWARE_MODEL'
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Cube className="w-3.5 h-3.5" />
                            <span>3D Software Model</span>
                        </button>

                        <button
                            onClick={() => setViewMode('2D_SCHEMATIC')}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all ${viewMode === '2D_SCHEMATIC'
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>2D P&ID Schematic</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Digital Twin Grid (3D/2D Hardware Display Left + Inspector Panel Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: 3D Three.js WebGL Software Model or 2D SVG Diagram (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 relative flex flex-col items-center justify-center min-h-[500px]">
                    {viewMode === '3D_SOFTWARE_MODEL' ? (
                        <Hardware3DSoftwareModel
                            telemetry={telemetry}
                            selectedComponent={selectedComp}
                            onSelectComponent={(comp: string) => setSelectedComp(comp as SelectedComponent)}
                        />
                    ) : (
                        <div className="w-full relative flex flex-col items-center">
                            {/* 2D P&ID SVG Diagram */}
                            <div className="absolute top-2 left-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800 flex items-center space-x-2 z-10">
                                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                                <span>2D Process & Instrumentation Diagram (P&ID)</span>
                            </div>

                            <svg className="w-full max-w-xl h-auto" viewBox="0 0 600 450" fill="none">
                                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                                </pattern>
                                <rect width="600" height="450" fill="url(#grid)" opacity="0.5" />

                                {/* Inlet Piping */}
                                <path d="M 100 80 L 300 80 L 300 130" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" fill="none" />
                                <path d="M 100 80 L 300 80 L 300 130" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" fill="none" className="animate-pulse" />

                                {/* Inlet Pump Node */}
                                <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => setSelectedComp('PUMP')}>
                                    <circle cx="150" cy="80" r="24" fill="#0f172a" stroke={getCompColor(isPumpAbnormal)} strokeWidth="4" />
                                    <text x="150" y="85" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">PUMP</text>
                                </g>

                                {/* Reactor Vessel Body */}
                                <g className="cursor-pointer" onClick={() => setSelectedComp('VESSEL')}>
                                    <rect x="200" y="130" width="200" height="240" rx="30" fill="#0f172a" stroke="#334155" strokeWidth="5" />
                                    <rect x="208" y="260" width="184" height="100" rx="10" fill="url(#liquidGrad)" opacity="0.3" />
                                    <defs>
                                        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>
                                    <text x="300" y="270" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="600" fontFamily="sans-serif">5000L REACTOR VESSEL A</text>
                                </g>

                                {/* Spray Ball Assembly */}
                                <g className="cursor-pointer" onClick={() => setSelectedComp('SPRAY_BALL')}>
                                    <line x1="300" y1="130" x2="300" y2="170" stroke="#0ea5e9" strokeWidth="8" />
                                    <circle cx="300" cy="175" r="16" fill="#0284c7" stroke={getCompColor(isSprayAbnormal)} strokeWidth="4" />
                                    <line x1="300" y1="175" x2="240" y2="220" stroke={getCompColor(isSprayAbnormal)} strokeWidth="2" strokeDasharray="3 3" />
                                    <line x1="300" y1="175" x2="360" y2="220" stroke={getCompColor(isSprayAbnormal)} strokeWidth="2" strokeDasharray="3 3" />
                                    <line x1="300" y1="175" x2="220" y2="190" stroke={getCompColor(isSprayAbnormal)} strokeWidth="2" strokeDasharray="3 3" />
                                    <line x1="300" y1="175" x2="380" y2="190" stroke={getCompColor(isSprayAbnormal)} strokeWidth="2" strokeDasharray="3 3" />
                                    <text x="300" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="monospace">SPRAY BALL</text>
                                </g>

                                {/* Dead-Leg Branch */}
                                <g className="cursor-pointer" onClick={() => setSelectedComp('DEAD_LEG')}>
                                    <path d="M 400 240 L 460 240 L 460 300" stroke="#475569" strokeWidth="10" fill="none" />
                                    <circle cx="460" cy="300" r="12" fill="#0f172a" stroke={getCompColor(isDeadLegAbnormal)} strokeWidth="3" />
                                    <text x="460" y="325" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">DEAD LEG</text>
                                </g>

                                {/* Outlet Manifold & Sensors */}
                                <g className="cursor-pointer" onClick={() => setSelectedComp('OUTLET')}>
                                    <path d="M 300 370 L 300 410 L 500 410" stroke="#38bdf8" strokeWidth="12" fill="none" />
                                    <rect x="340" y="390" width="90" height="35" rx="6" fill="#0f172a" stroke={getCompColor(isOutletAbnormal)} strokeWidth="3" />
                                    <text x="385" y="412" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">SENSORS (TOC/COND)</text>
                                    <text x="300" y="390" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">OUTLET</text>
                                </g>
                            </svg>
                        </div>
                    )}
                </div>

                {/* RIGHT: Detailed Component Inspector Panel (4 cols) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                                <Info className="w-4 h-4 text-cyan-400" />
                                <span>Software Model Component Inspector</span>
                            </h3>
                            {selectedComp && (
                                <button
                                    onClick={() => setSelectedComp(null)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {selectedComp === 'SPRAY_BALL' && (
                            <div className="space-y-4 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-400 font-mono">Hardware Component: 360° CIP SPRAY BALL</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isSprayAbnormal ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {isSprayAbnormal ? 'ABNORMAL' : 'NORMAL'}
                                    </span>
                                </div>

                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">3D CAD Model ID:</span>
                                        <strong className="text-slate-200 font-mono">SB-360-SS316L</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Health Score:</span>
                                        <strong className="text-slate-200 font-mono">{telemetry.equipment_id === 'REACTOR-04' ? '94/100' : '88/100'}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Flow Condition:</span>
                                        <strong className={telemetry.sensors.flow < 130 ? 'text-amber-400' : 'text-emerald-400'}>{telemetry.sensors.flow} L/min</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Spray Coverage Est:</span>
                                        <strong className={isSprayAbnormal ? 'text-red-400' : 'text-emerald-400'}>
                                            {isSprayAbnormal ? '74.2% (Degraded Nozzle)' : '99.1% (Full 360°)'}
                                        </strong>
                                    </div>
                                </div>

                                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                                    <span className="text-[11px] font-bold text-slate-300 uppercase">Software Model Telemetry Diagnostic</span>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {isSprayAbnormal
                                            ? "Flow rate dropped below nominal 140 L/min specification. Pressure build-up at inlet indicates potential partial spray nozzle obstruction."
                                            : "Spray nozzle pattern maintaining required 2.3 bar pressure and turbulence energy."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedComp === 'OUTLET' && (
                            <div className="space-y-4 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-400 font-mono">Hardware Component: OUTLET SENSOR MANIFOLD</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isOutletAbnormal ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {isOutletAbnormal ? 'CLEARANCE DELAY' : 'NORMAL'}
                                    </span>
                                </div>

                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">TOC Residue:</span>
                                        <strong className="text-emerald-400 font-mono">{telemetry.sensors.toc} ppb</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Conductivity:</span>
                                        <strong className="text-purple-400 font-mono">{telemetry.sensors.conductivity} µS/cm</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Turbidity:</span>
                                        <strong className="text-cyan-400 font-mono">{telemetry.sensors.turbidity} NTU</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedComp === 'PUMP' && (
                            <div className="space-y-4 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-400 font-mono">Hardware Component: RECIRCULATION PUMP MOTOR</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isPumpAbnormal ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {isPumpAbnormal ? 'FAULT' : 'NORMAL'}
                                    </span>
                                </div>

                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Pump Health Index:</span>
                                        <strong className="text-slate-200 font-mono">88/100</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Inlet Pressure:</span>
                                        <strong className="text-slate-200 font-mono">{telemetry.sensors.pressure} bar</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedComp === 'DEAD_LEG' && (
                            <div className="space-y-4 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-400 font-mono">Hardware Component: DEAD-LEG TRAP</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isDeadLegAbnormal ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {isDeadLegAbnormal ? 'STAGNATION RISK' : 'NORMAL'}
                                    </span>
                                </div>

                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">L/D Ratio:</span>
                                        <strong className="text-slate-200 font-mono">1.8 (Compliant &lt; 2.0)</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(!selectedComp || selectedComp === 'VESSEL') && (
                            <div className="space-y-3 pt-3">
                                <span className="text-xs font-bold text-cyan-400 font-mono">3D CAD Model: 5000L FORMULATION VESSEL</span>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    The 3D Software Model represents the physical CIP hardware assembly. Orbit the 3D canvas or click any component mesh (Spray Ball, Pump, Sensors, Dead-Leg) to view diagnostic telemetry.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Software Model Sync:</span>
                        <span className="text-emerald-400 font-bold font-mono">REAL-TIME WEBGL</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
