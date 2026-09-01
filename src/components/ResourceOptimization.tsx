import React from 'react';
import { Leaf, Droplet, Clock, Zap, DollarSign, TrendingUp, CheckCircle2, Award } from 'lucide-react';

export const ResourceOptimization: React.FC = () => {
    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                        <span>Sustainability & Operational ROI Engine</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Resource Optimization: Conventional vs CleanOptima CIP
                    </h2>
                    <p className="text-xs text-slate-400">
                        Quantifying utility savings, chemical reduction, downtime recovery, and expanded manufacturing capacity.
                    </p>
                </div>

                <div className="bg-emerald-950/40 px-4 py-2 rounded-lg border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    Monthly Estimated Cost Reduction: <strong className="text-white">$28,400 / month</strong>
                </div>
            </div>

            {/* Main ROI Grid (4 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Water Saved */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">Purified Water Saved</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <Droplet className="w-4 h-4" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-mono">48,200 L</h3>
                    <p className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>24.5% water consumption reduction</span>
                    </p>
                </div>

                {/* Chemical Saved */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">Chemical Detergent Saved</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                            <Leaf className="w-4 h-4" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-mono">1,420 L</h3>
                    <p className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>18.2% NaOH / HNO3 reduction</span>
                    </p>
                </div>

                {/* Downtime Saved */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">Downtime Reduction</span>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-mono">34.5 Hours</h3>
                    <p className="text-xs text-cyan-400 font-medium flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>+2 additional production batches</span>
                    </p>
                </div>

                {/* Energy Saved */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">Thermal Energy Saved</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <Zap className="w-4 h-4" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-mono">12,400 kWh</h3>
                    <p className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Reduced steam circulation</span>
                    </p>
                </div>
            </div>

            {/* Side-by-side comparative table: Conventional vs CleanOptima */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Operational Benchmark: Traditional CIP vs CleanOptima Edge</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Conventional CIP */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 opacity-75">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <h4 className="font-bold text-slate-300 text-sm">Traditional Fixed-Time CIP</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">LEGACY SOP</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-400 font-mono">
                            <li className="flex items-center justify-between">
                                <span>Methodology:</span>
                                <strong className="text-slate-200">Fixed timer (25.0 min)</strong>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Water Consumption:</span>
                                <strong className="text-slate-200">1,100 L per cycle</strong>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Visibility:</span>
                                <strong className="text-slate-200">Manual swab / offline lab</strong>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Anomaly Detection:</span>
                                <strong className="text-amber-400">Post-cleaning verification failure</strong>
                            </li>
                        </ul>
                    </div>

                    {/* CleanOptima Edge */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/40 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <h4 className="font-bold text-emerald-300 text-sm">CleanOptima Edge Intelligent CIP</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">NEXT GEN</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300 font-mono">
                            <li className="flex items-center justify-between">
                                <span>Methodology:</span>
                                <strong className="text-cyan-400">Physics & AI dynamic clearance</strong>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Water Consumption:</span>
                                <strong className="text-emerald-400">840 L per cycle (-23.6%)</strong>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Visibility:</span>
                                <strong className="text-cyan-400">Real-time 1.5s streaming + Digital Twin</strong>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Anomaly Detection:</span>
                                <strong className="text-emerald-400">Early warning within 2-3 min</strong>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 text-center font-mono">
                    💡 Label: All financial and environmental ROI metrics represent estimated simulation modeling based on conservative plant parameters.
                </div>
            </div>
        </div>
    );
};
