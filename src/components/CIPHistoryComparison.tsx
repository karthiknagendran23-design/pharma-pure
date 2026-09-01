import React from 'react';
import { History, CheckCircle2, AlertTriangle, Layers, Calendar } from 'lucide-react';
import { CIPHistoryItem } from '../types';

interface CIPHistoryComparisonProps {
    history: CIPHistoryItem[];
}

export const CIPHistoryComparison: React.FC<CIPHistoryComparisonProps> = ({ history }) => {
    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <History className="w-4 h-4 text-cyan-400" />
                        <span>Historical Process Analytics</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        CIP Cycle Comparison & Validated Baseline Analytics
                    </h2>
                    <p className="text-xs text-slate-400">
                        Compare multi-cycle clearance trajectories, max anomaly scores, and water consumption against baseline SOP profiles.
                    </p>
                </div>

                <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                    Historical Logged Cycles: <strong className="text-cyan-400">142 Cycles</strong>
                </div>
            </div>

            {/* Cycle Comparison Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Recent CIP Cycles — Reactor-04 & Fermenter-01</span>
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                                <th className="py-3 px-4">Cycle ID</th>
                                <th className="py-3 px-4">Equipment</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Recipe</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4">Water Used</th>
                                <th className="py-3 px-4">Max Anomaly Score</th>
                                <th className="py-3 px-4">QA Status</th>
                                <th className="py-3 px-4">Water Saved</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {history.map((item) => (
                                <tr key={item.cycle_id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{item.cycle_id}</td>
                                    <td className="py-3 px-4 font-semibold text-slate-200">{item.equipment_id}</td>
                                    <td className="py-3 px-4 text-slate-400 font-mono">{item.date}</td>
                                    <td className="py-3 px-4 text-slate-300 font-mono">{item.recipe}</td>
                                    <td className="py-3 px-4 text-slate-200 font-mono font-bold">{item.duration_min} min</td>
                                    <td className="py-3 px-4 text-slate-200 font-mono">{item.water_consumed_L} L</td>
                                    <td className="py-3 px-4 font-mono font-bold">
                                        <span className={item.max_anomaly_score > 60 ? 'text-red-400' : 'text-emerald-400'}>
                                            {item.max_anomaly_score} / 100
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.qa_released ? (
                                            <span className="flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>QA RELEASED</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center space-x-1 text-amber-400 font-semibold text-[11px]">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                <span>HOLD / INVESTIGATED</span>
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-emerald-400 font-mono font-bold">
                                        {item.water_saved_L > 0 ? `+${item.water_saved_L} L` : '0 L'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
