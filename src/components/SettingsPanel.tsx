import React, { useState } from 'react';
import { Settings, Sliders, Server, Save, RotateCcw } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
    const [tocThreshold, setTocThreshold] = useState<number>(50.0);
    const [minFlow, setMinFlow] = useState<number>(130.0);
    const [wsUrl, setWsUrl] = useState<string>('ws://localhost:8000/ws/cip/live');
    const [anomalySensitivity, setAnomalySensitivity] = useState<number>(75);
    const [saved, setSaved] = useState<boolean>(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="p-6 space-y-6 select-none max-w-4xl">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <Settings className="w-4 h-4 text-cyan-400" />
                        <span>Edge Infrastructure & Threshold Config</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        System & Physics Model Settings
                    </h2>
                    <p className="text-xs text-slate-400">
                        Configure target clearance limits, ML anomaly sensitivity, and OPC-UA / WebSocket gateway parameters.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition-all shrink-0"
                >
                    <Save className="w-4 h-4" />
                    <span>{saved ? 'Settings Saved!' : 'Save Configuration'}</span>
                </button>
            </div>

            {/* Threshold Configuration Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Validated Sensor Thresholds</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
                    <div className="space-y-2">
                        <label className="text-slate-300 font-medium">TOC Release Limit (ppb)</label>
                        <input
                            type="number"
                            value={tocThreshold}
                            onChange={(e) => setTocThreshold(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                        />
                        <p className="text-[10px] text-slate-400">Acceptable upper limit for API TOC residue clearance.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-300 font-medium">Minimum Spray Flow Rate (L/min)</label>
                        <input
                            type="number"
                            value={minFlow}
                            onChange={(e) => setMinFlow(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                        />
                        <p className="text-[10px] text-slate-400">Trigger warning if flow drops below this value during active CIP.</p>
                    </div>
                </div>
            </div>

            {/* Edge Gateway Connection */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Edge Gateway Telemetry Stream Connection</span>
                </h3>

                <div className="space-y-2 text-xs">
                    <label className="text-slate-300 font-medium">WebSocket Gateway URL</label>
                    <input
                        type="text"
                        value={wsUrl}
                        onChange={(e) => setWsUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[10px] text-slate-400">
                        Default: <code className="text-slate-300">ws://localhost:8000/ws/cip/live</code>. If unavailable, frontend uses local browser simulation.
                    </p>
                </div>
            </div>
        </div>
    );
};
