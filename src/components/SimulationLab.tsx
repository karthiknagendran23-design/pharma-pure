import React from 'react';
import { FlaskConical, Play, RotateCcw, Zap, AlertTriangle, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { ScenarioType, NavigationTab } from '../types';
import { api } from '../services/api';

interface SimulationLabProps {
    activeScenario: ScenarioType;
    setActiveScenario: (s: ScenarioType) => void;
    setActiveTab: (tab: NavigationTab) => void;
}

export const SimulationLab: React.FC<SimulationLabProps> = ({
    activeScenario,
    setActiveScenario,
    setActiveTab
}) => {
    const handleScenarioChange = (s: ScenarioType) => {
        setActiveScenario(s);
        api.setScenario(s);
    };

    const handleReset = () => {
        setActiveScenario('NORMAL');
        api.resetSimulation();
    };

    const scenarios: { id: ScenarioType; title: string; desc: string; severity: string; color: string }[] = [
        {
            id: 'NORMAL',
            title: '1. Normal CIP Cycle',
            desc: 'All 6 sensors follow validated historical baselines. Residue clears at nominal rate C(t) = C₀ e⁻ᵏᵗ.',
            severity: 'NORMAL',
            color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
        },
        {
            id: 'SPRAY_BLOCKAGE',
            title: '2. Spray Nozzle Obstruction',
            desc: 'Flow rate gradually decays over time due to partial spray nozzle blockage. TOC clearance slows down.',
            severity: 'WARNING',
            color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
        },
        {
            id: 'FLOW_STAGNATION',
            title: '3. Severe Flow Stagnation',
            desc: 'Flow rate drops abruptly below 60 L/min. Recirculation pressure destabilizes.',
            severity: 'CRITICAL',
            color: 'border-red-500/40 bg-red-950/20 text-red-300'
        },
        {
            id: 'SLOW_CLEARANCE',
            title: '4. Slow Residue Clearance',
            desc: 'TOC residue clearance rate constant (k) decays 31% slower than physics model prediction.',
            severity: 'WARNING',
            color: 'border-purple-500/40 bg-purple-950/20 text-purple-300'
        },
        {
            id: 'DETERGENT_ANOMALY',
            title: '5. Detergent Dosing Anomaly',
            desc: 'Conductivity reading deviates significantly from expected Caustic/Acid wash phase profiles.',
            severity: 'WARNING',
            color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
        },
        {
            id: 'SENSOR_FAILURE',
            title: '6. Sensor Signal Drift / Failure',
            desc: 'Conductivity sensor produces implausible values (9900+ µS/cm) while other sensors remain normal.',
            severity: 'CRITICAL',
            color: 'border-red-500/40 bg-red-950/20 text-red-300'
        },
        {
            id: 'MULTI_ANOMALY',
            title: '7. Multi-Anomaly Compound Failure',
            desc: 'Simultaneous flow reduction, elevated TOC residue, and unstable conductivity dosing.',
            severity: 'CRITICAL',
            color: 'border-red-600 bg-red-950/40 text-red-200'
        }
    ];

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 uppercase tracking-widest">
                        <FlaskConical className="w-4 h-4 text-teal-400" />
                        <span>CIP Simulation Control Center</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Real-Time Telemetry & Anomaly Injection Lab
                    </h2>
                    <p className="text-xs text-slate-400">
                        Inject realistic pharmaceutical process abnormalities live into the edge data stream to demonstrate AI early detection.
                    </p>
                </div>

                <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-all shrink-0"
                >
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <span>Reset Simulation to Normal</span>
                </button>
            </div>

            {/* Active Scenario Indicator Banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Currently Injected Scenario</span>
                        <h3 className="text-base font-bold text-cyan-300 font-mono">{activeScenario}</h3>
                    </div>
                </div>

                <button
                    onClick={() => setActiveTab('live-cip')}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                    <span>Watch Real-Time Dashboard Reaction</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Scenario Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((sc) => {
                    const isSelected = activeScenario === sc.id;
                    return (
                        <div
                            key={sc.id}
                            onClick={() => handleScenarioChange(sc.id)}
                            className={`p-5 rounded-xl border cursor-pointer transition-all space-y-3 flex flex-col justify-between ${isSelected
                                    ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/10 ' + sc.color
                                    : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                                }`}
                        >
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm text-slate-100">{sc.title}</h4>
                                    {isSelected && (
                                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500 text-slate-950 uppercase">
                                            ACTIVE
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{sc.desc}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-400">Target Severity:</span>
                                <span className={`font-bold ${sc.severity === 'NORMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {sc.severity}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
