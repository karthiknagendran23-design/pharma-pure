import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart
} from 'recharts';
import { Gauge, ShieldCheck, AlertTriangle, Lock, Unlock, ArrowRight, HelpCircle } from 'lucide-react';
import { CIPTelemetryFrame } from '../types';

interface PhysicsClearancePanelProps {
    telemetry: CIPTelemetryFrame;
}

export const PhysicsClearancePanel: React.FC<PhysicsClearancePanelProps> = ({ telemetry }) => {
    const phys = telemetry.physics_model;
    const dec = telemetry.decision;

    // Generate theoretical curve points for physics vs actual overlay
    const totalMin = 16.0;
    const curvePoints = [];
    for (let t = 0; t <= totalMin; t += 0.5) {
        const theoretical = 4800.0 * Math.exp(-0.35 * t);
        const upper = theoretical * 1.12;
        const lower = theoretical * 0.88;
        curvePoints.push({
            time: t,
            theoretical: Math.round(theoretical),
            upper: Math.round(upper),
            lower: Math.round(lower),
            target: 50,
            actual: t <= phys.elapsed_minutes ? (t === 0 ? 4800 : Math.round(telemetry.sensors.toc)) : null
        });
    }

    const getInterlockStyle = () => {
        if (dec.interlock_state === 'RED') {
            return {
                bg: 'bg-red-950/60 border-red-500/50 text-red-200',
                badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
                icon: Lock
            };
        }
        if (dec.interlock_state === 'YELLOW') {
            return {
                bg: 'bg-amber-950/50 border-amber-500/50 text-amber-200',
                badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
                icon: AlertTriangle
            };
        }
        return {
            bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
            badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
            icon: Unlock
        };
    };

    const interlockStyle = getInterlockStyle();
    const InterlockIcon = interlockStyle.icon;

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                        <span>Physics Clearance & Hardware Interlock Simulation Engine</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Exponential Residue Clearance Model C(t) = C₀ e⁻ᵏᵗ
                    </h2>
                    <p className="text-xs text-slate-400">
                        Real-time physics calculation of API residue decay kinetics, clearance rate constant (k), and simulated PLC interlock state.
                    </p>
                </div>

                <div className="flex items-center space-x-3 font-mono text-xs">
                    <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                        Initial C₀: <strong className="text-cyan-400">4,800 ppb</strong>
                    </div>
                    <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                        Rate k: <strong className="text-emerald-400">{phys.clearance_rate_k} min⁻¹</strong>
                    </div>
                </div>
            </div>

            {/* Interlock State Spotlight Card */}
            <div className={`p-5 rounded-xl border ${interlockStyle.bg} space-y-3 shadow-lg`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${interlockStyle.badgeBg}`}>
                            <InterlockIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Simulated PLC Hardware Interlock</span>
                            <h3 className="text-lg font-bold tracking-tight">{dec.interlock_label}</h3>
                        </div>
                    </div>

                    <div className={`px-3 py-1 rounded text-xs font-mono font-bold border ${interlockStyle.badgeBg}`}>
                        STATE: {dec.interlock_state}
                    </div>
                </div>

                <p className="text-xs leading-relaxed opacity-90">{dec.action_recommendation}</p>

                <div className="text-[10px] font-mono px-3 py-1.5 rounded bg-slate-950/80 border border-slate-800/80 text-slate-400 flex items-center justify-between">
                    <span>⚠ DISCLAIMER:</span>
                    <span>{dec.disclaimer}</span>
                </div>
            </div>

            {/* Physics Model Metrics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] font-medium text-slate-400 uppercase">Current Estimated Residue</span>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{phys.observed_toc} <span className="text-xs text-slate-400">ppb</span></h3>
                    <p className="text-[10px] text-slate-400 mt-1">Physics expected: {phys.expected_toc} ppb</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] font-medium text-slate-400 uppercase">Target Clearance Threshold</span>
                    <h3 className="text-2xl font-bold text-slate-100 mt-1 font-mono">{phys.target_threshold} <span className="text-xs text-slate-400">ppb</span></h3>
                    <p className="text-[10px] text-slate-400 mt-1">Validated release criterion</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] font-medium text-slate-400 uppercase">Est. Minutes to Target</span>
                    <h3 className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{phys.estimated_minutes_to_target} <span className="text-xs text-slate-400">min</span></h3>
                    <p className="text-[10px] text-slate-400 mt-1">Predicted clearance window</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] font-medium text-slate-400 uppercase">Residue Cleared %</span>
                    <h3 className="text-2xl font-bold text-purple-400 mt-1 font-mono">{phys.clearance_percentage}%</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Status: {phys.clearance_status}</p>
                </div>
            </div>

            {/* Physics Decay Curve Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                            <Gauge className="w-4 h-4 text-cyan-400" />
                            <span>Residue Decay Trajectory: Observed TOC vs Physics Model Curve</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Overlay of physics exponential decay model C(t) with +/- 12% confidence interval</p>
                    </div>
                </div>

                <div className="h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={curvePoints}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (min)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 5000]} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target 50ppb', fill: '#ef4444', fontSize: 10 }} />
                            <Area type="monotone" dataKey="upper" fill="#0284c7" stroke="none" fillOpacity={0.15} name="Upper 12% Confidence Bound" />
                            <Line type="monotone" dataKey="theoretical" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Physics Model C(t)" />
                            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Observed Sensor TOC" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
