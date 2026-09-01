import React, { useState } from 'react';
import { Crown, Cpu, Zap, Activity, AlertTriangle, ShieldCheck, RefreshCw, Power, Sliders, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';
import { CIPTelemetryFrame } from '../types';
import { Hardware3DSoftwareModel } from './Hardware3DSoftwareModel';

interface DigitalTwinQueenProps {
    telemetry: CIPTelemetryFrame;
}

interface CommandLogEntry {
    id: string;
    timestamp: string;
    action: string;
    component: string;
    status: 'SUCCESS' | 'EXECUTING' | 'OVERRIDDEN';
    operator: string;
}

export const DigitalTwinQueen: React.FC<DigitalTwinQueenProps> = ({ telemetry }) => {
    const [selectedComponent, setSelectedComponent] = useState<string>('SPRAY_BALL');
    const [flushActive, setFlushActive] = useState<boolean>(false);
    const [purgeActive, setPurgeActive] = useState<boolean>(false);
    const [overrideActive, setOverrideActive] = useState<boolean>(false);
    const [calibrating, setCalibrating] = useState<boolean>(false);

    const [commandLogs, setCommandLogs] = useState<CommandLogEntry[]>([
        {
            id: 'CMD-101',
            timestamp: new Date().toLocaleTimeString(),
            action: 'INITIALIZE_3D_DIGITAL_QUEEN',
            component: 'MASTER_HARDWARE_CONTROLLER',
            status: 'SUCCESS',
            operator: 'SYSTEM_AUTOPILOT'
        }
    ]);

    const isSprayAbnormal = telemetry.active_scenario === 'SPRAY_BLOCKAGE' || (telemetry.ml_anomaly.anomaly_score > 60 && telemetry.sensors.flow < 130);
    const isPumpAbnormal = telemetry.active_scenario === 'FLOW_STAGNATION' || telemetry.sensors.flow < 60;
    const isDeadLegAbnormal = telemetry.active_scenario === 'MULTI_ANOMALY';

    const triggerAction = (actionName: string, component: string, setStateFn?: (val: boolean) => void) => {
        if (setStateFn) {
            setStateFn(true);
            setTimeout(() => setStateFn(false), 3000);
        }

        const newLog: CommandLogEntry = {
            id: `CMD-${Math.floor(Math.random() * 900 + 100)}`,
            timestamp: new Date().toLocaleTimeString(),
            action: actionName,
            component: component,
            status: 'SUCCESS',
            operator: 'QA_LEAD_DESK_01'
        };

        setCommandLogs(prev => [newLog, ...prev.slice(0, 7)]);
    };

    return (
        <div className="p-6 space-y-6 select-none bg-slate-950 text-slate-100 min-h-screen">
            {/* Header Banner - Digital Queen Master Controller */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                            <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>Digital Queen Command Architecture — Master Hardware Controller</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-white mt-1 flex items-center space-x-3">
                            <span>PharmaPure Digital Queen Asset Twin</span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-normal">
                                WebGL 3D Real-Time
                            </span>
                        </h1>
                        <p className="text-xs text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
                            Master Digital Twin controller monitoring real-time physical vessel dynamics, spray ball fluid coverage, pump hydraulic pressure, and dead-leg stagnation traps with hardware override controls.
                        </p>
                    </div>

                    {/* Quick Command Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => triggerAction('HIGH_PRESSURE_SPRAY_FLUSH', 'SPRAY_BALL', setFlushActive)}
                            disabled={flushActive}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-2 transition-all ${flushActive
                                ? 'bg-cyan-500 text-slate-950 font-black animate-pulse'
                                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40'
                                }`}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${flushActive ? 'animate-spin' : ''}`} />
                            <span>{flushActive ? 'FLUSHING SPRAY BALL...' : '⚡ NOZZLE FLUSH'}</span>
                        </button>

                        <button
                            onClick={() => triggerAction('STAGNATION_DEADLEG_PURGE', 'DEAD_LEG', setPurgeActive)}
                            disabled={purgeActive}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-2 transition-all ${purgeActive
                                ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                                : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40'
                                }`}
                        >
                            <Zap className={`w-3.5 h-3.5 ${purgeActive ? 'animate-bounce' : ''}`} />
                            <span>{purgeActive ? 'PURGING DEAD-LEG...' : '🔄 DEAD-LEG PURGE'}</span>
                        </button>

                        <button
                            onClick={() => triggerAction('CALIBRATE_SENSOR_PROBES', 'TOC_COND_PROBES', setCalibrating)}
                            disabled={calibrating}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-2 transition-all ${calibrating
                                ? 'bg-purple-500 text-white font-black animate-pulse'
                                : 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40'
                                }`}
                        >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{calibrating ? 'CALIBRATING...' : '⚙️ ZERO CALIBRATE'}</span>
                        </button>

                        <button
                            onClick={() => triggerAction('HARDWARE_INTERLOCK_OVERRIDE', 'DISCHARGE_VALVE', setOverrideActive)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono flex items-center space-x-2 transition-all ${overrideActive
                                ? 'bg-red-500 text-white font-black animate-pulse'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                                }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>OVERRIDE INTERLOCK</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Central Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: 3D WebGL Digital Queen Hardware Viewer (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <div className="flex items-center space-x-2">
                                <Cpu className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                                    3D Hardware Digital Queen Software CAD Model
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs font-mono">
                                <span className="text-slate-400">FPS: <strong className="text-emerald-400">60.0</strong></span>
                                <span className="text-slate-400">Sync: <strong className="text-cyan-400">0.8ms</strong></span>
                            </div>
                        </div>

                        {/* Three.js Interactive 3D Model */}
                        <Hardware3DSoftwareModel
                            telemetry={telemetry}
                            selectedComponent={selectedComponent}
                            onSelectComponent={(comp) => setSelectedComponent(comp)}
                        />
                    </div>

                    {/* Hardware Asset Component Health Matrix */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                            <span>Hardware Fleet Digital Twin Matrix</span>
                            <span className="text-[11px] text-cyan-400 font-normal">8 Asset Nodes Syncing</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div
                                onClick={() => setSelectedComponent('SPRAY_BALL')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedComponent === 'SPRAY_BALL'
                                    ? 'bg-cyan-950/40 border-cyan-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                <div className="text-[11px] font-mono text-slate-400">360° Spray Ball</div>
                                <div className="text-sm font-bold mt-1 font-mono flex items-center justify-between">
                                    <span>{isSprayAbnormal ? '82.4%' : '99.1%'}</span>
                                    <span className={`w-2 h-2 rounded-full ${isSprayAbnormal ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 font-mono">{telemetry.sensors.flow} L/min</div>
                            </div>

                            <div
                                onClick={() => setSelectedComponent('PUMP')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedComponent === 'PUMP'
                                    ? 'bg-cyan-950/40 border-cyan-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                <div className="text-[11px] font-mono text-slate-400">Recirculation Pump</div>
                                <div className="text-sm font-bold mt-1 font-mono flex items-center justify-between">
                                    <span>{isPumpAbnormal ? '64.0%' : '94.8%'}</span>
                                    <span className={`w-2 h-2 rounded-full ${isPumpAbnormal ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 font-mono">{telemetry.sensors.pressure} bar</div>
                            </div>

                            <div
                                onClick={() => setSelectedComponent('DEAD_LEG')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedComponent === 'DEAD_LEG'
                                    ? 'bg-cyan-950/40 border-cyan-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                <div className="text-[11px] font-mono text-slate-400">Dead-Leg Trap</div>
                                <div className="text-sm font-bold mt-1 font-mono flex items-center justify-between">
                                    <span>{isDeadLegAbnormal ? 'RISK' : 'CLEAN'}</span>
                                    <span className={`w-2 h-2 rounded-full ${isDeadLegAbnormal ? 'bg-amber-500' : 'bg-emerald-400'}`} />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 font-mono">L/D = 1.8</div>
                            </div>

                            <div
                                onClick={() => setSelectedComponent('OUTLET')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedComponent === 'OUTLET'
                                    ? 'bg-cyan-950/40 border-cyan-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                <div className="text-[11px] font-mono text-slate-400">TOC/Cond Probe</div>
                                <div className="text-sm font-bold mt-1 font-mono flex items-center justify-between">
                                    <span>{telemetry.sensors.toc} ppb</span>
                                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 font-mono">{telemetry.sensors.conductivity} µS/cm</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Queen Control Log & Asset Inspector (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Live Command Log Console */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                <span>Digital Queen Command Log</span>
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                PLC ONLINE
                            </span>
                        </div>

                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto font-mono text-xs pr-1">
                            {commandLogs.map(log => (
                                <div key={log.id} className="p-2.5 bg-slate-950 rounded border border-slate-800/80 space-y-1">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-cyan-400 font-bold">{log.id}</span>
                                        <span className="text-slate-500">{log.timestamp}</span>
                                    </div>
                                    <div className="text-slate-200 font-semibold text-[11px]">{log.action}</div>
                                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                                        <span>Target: {log.component}</span>
                                        <span className="text-emerald-400 font-bold">{log.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Component Inspector & AI Recommendation */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-2">
                            <Sliders className="w-4 h-4 text-amber-400" />
                            <span>Digital Twin Diagnostic Inspector</span>
                        </h3>

                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">Selected Component:</span>
                                <strong className="text-cyan-400">{selectedComponent}</strong>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">ML Anomaly Score:</span>
                                <strong className={telemetry.ml_anomaly.anomaly_score > 50 ? 'text-red-400' : 'text-emerald-400'}>
                                    {telemetry.ml_anomaly.anomaly_score.toFixed(1)} / 100
                                </strong>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">Interlock State:</span>
                                <strong className="text-amber-400">{telemetry.decision.interlock_state}</strong>
                            </div>
                        </div>

                        <div className="p-3.5 bg-indigo-950/40 rounded-lg border border-indigo-500/30 text-xs space-y-1.5">
                            <div className="font-bold text-indigo-300 font-mono text-[11px] uppercase flex items-center space-x-1.5">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>Digital Queen AI Recommendation</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                                {isSprayAbnormal
                                    ? "Partial spray ball nozzle restriction detected. Initiate 3.5 bar high-pressure flush pulse to clear debris without extending cycle time."
                                    : "All hardware components operating within optimal 1D CNN autoencoder confidence bounds. Ready for automated batch release."}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
