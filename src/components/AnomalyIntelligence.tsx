import React from 'react';
import { Cpu, AlertTriangle, ShieldCheck, HelpCircle, Layers, CheckCircle2, TrendingUp, BarChart2 } from 'lucide-react';
import { CIPTelemetryFrame } from '../types';

interface AnomalyIntelligenceProps {
    telemetry: CIPTelemetryFrame;
}

export const AnomalyIntelligence: React.FC<AnomalyIntelligenceProps> = ({ telemetry }) => {
    const ml = telemetry.ml_anomaly;
    const xai = ml.xai_reasoning;
    const features = ml.feature_contributions;

    const scoreColor = ml.anomaly_score > 60 ? 'text-red-400' : ml.anomaly_score > 30 ? 'text-amber-400' : 'text-emerald-400';
    const scoreBg = ml.anomaly_score > 60 ? 'bg-red-500/10 border-red-500/30' : ml.anomaly_score > 30 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30';

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>Machine Learning & Explainable AI (XAI) Engine</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        1D CNN Autoencoder Anomaly Score & Root Cause Attribution
                    </h2>
                    <p className="text-xs text-slate-400">
                        Sliding-window multivariate time-series reconstruction error analysis across 6 sensor dimensions.
                    </p>
                </div>

                <div className={`px-4 py-2 rounded-lg border font-mono text-xs font-bold ${scoreBg} flex items-center space-x-2`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
                    <span>ANOMALY SCORE: {ml.anomaly_score} / 100 ({ml.status_label})</span>
                </div>
            </div>

            {/* Main Grid: Gauge + XAI Panel + Reconstruction Error */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Anomaly Score Gauge & 1D CNN Architecture (5 cols) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Anomaly Gauge Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Real-Time Anomaly Score Gauge
                        </h3>

                        {/* Circular Gauge Graphic */}
                        <div className="relative w-44 h-44 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Track */}
                                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="10" fill="none" />
                                {/* Progress */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke={ml.anomaly_score > 60 ? '#ef4444' : ml.anomaly_score > 30 ? '#f59e0b' : '#10b981'}
                                    strokeWidth="10"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * ml.anomaly_score) / 100}
                                    strokeLinecap="round"
                                    fill="none"
                                    className="transition-all duration-700"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-extrabold font-mono ${scoreColor}`}>{ml.anomaly_score}</span>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Score / 100</span>
                            </div>
                        </div>

                        {/* Score interpretation range */}
                        <div className="w-full grid grid-cols-4 gap-1 text-[10px] pt-2 border-t border-slate-800">
                            <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-emerald-400 font-bold">
                                0-30 Normal
                            </div>
                            <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-cyan-400 font-bold">
                                30-60 Watch
                            </div>
                            <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-amber-400 font-bold">
                                60-80 Warning
                            </div>
                            <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-red-400 font-bold">
                                80-100 Critical
                            </div>
                        </div>
                    </div>

                    {/* 1D CNN Architecture Pipeline Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                            <Layers className="w-4 h-4 text-cyan-400" />
                            <span>1D CNN Autoencoder Pipeline</span>
                        </h3>

                        <div className="space-y-2 text-xs font-mono">
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-400">Sliding Window:</span>
                                <span className="text-cyan-400 font-bold">30 frames x 6 sensors</span>
                            </div>
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-400">Encoder / Decoder:</span>
                                <span className="text-slate-200">1D Conv (Conv1D-32-64)</span>
                            </div>
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-400">Reconstruction Error:</span>
                                <span className="text-slate-200 font-bold">{ml.reconstruction_error}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Explainable AI Reasoning & Feature Attribution (7 cols) */}
                <div className="lg:col-span-7 space-y-6">

                    {/* AI Reasoning Panel */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                                <HelpCircle className="w-4 h-4 text-cyan-400" />
                                <span>AI Reasoning & Root Cause Attribution</span>
                            </h3>
                            <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                                Confidence: {xai.confidence_percentage}%
                            </span>
                        </div>

                        {/* Why Flagged Questions & Findings */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Why was this cycle evaluated with this score?
                            </span>

                            <div className="space-y-2">
                                {xai.summary_bullet_points.map((bullet, idx) => (
                                    <div key={idx} className="flex items-start space-x-2.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                                        <span className="text-slate-200 font-medium">{bullet}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Most Likely Cause Box */}
                        <div className={`p-4 rounded-xl border space-y-1 ${xai.flagged ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                            }`}>
                            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Primary Diagnostic Inference</span>
                            </div>
                            <p className="text-sm font-bold pt-0.5">{xai.most_likely_cause}</p>
                        </div>
                    </div>

                    {/* Feature Contribution Breakdown Bars */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                                <BarChart2 className="w-4 h-4 text-cyan-400" />
                                <span>Multivariate Feature Contribution to Anomaly Score</span>
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            {Object.entries(features).map(([feat, val]) => (
                                <div key={feat} className="space-y-1">
                                    <div className="flex justify-between font-mono">
                                        <span className="text-slate-300 uppercase font-semibold">{feat}</span>
                                        <span className="text-slate-400 font-bold">{val}% contribution</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${val > 60 ? 'bg-red-500' : val > 30 ? 'bg-amber-400' : 'bg-cyan-500'
                                                }`}
                                            style={{ width: `${val}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
