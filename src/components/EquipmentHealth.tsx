import React from 'react';
import { HardDrive, AlertTriangle, CheckCircle2, Wrench, ShieldCheck, Cpu } from 'lucide-react';
import { EquipmentAsset } from '../types';

interface EquipmentHealthProps {
    equipment: EquipmentAsset[];
}

export const EquipmentHealth: React.FC<EquipmentHealthProps> = ({ equipment }) => {
    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <HardDrive className="w-4 h-4 text-cyan-400" />
                        <span>Plant Asset Intelligence</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Fleet Equipment Health & Subsystem Diagnostics
                    </h2>
                    <p className="text-xs text-slate-400">
                        Monitoring spray ball coverage health, pump cavitation risk, sensor drift, and historical CIP anomaly frequency.
                    </p>
                </div>

                <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                    Total Monitored Vessels: <strong className="text-cyan-400">{equipment.length} Assets</strong>
                </div>
            </div>

            {/* Equipment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all">
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                                    <span>{item.id}</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-normal">
                                        {item.type}
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400 truncate">{item.name}</p>
                            </div>

                            <div className="text-right">
                                <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${item.status === 'CLEANING'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : item.status === 'WARNING'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>

                        {/* Health Score Gauge Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400">Overall Health Score:</span>
                                <strong className={`font-bold ${item.health_score > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {item.health_score} / 100
                                </strong>
                            </div>
                            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                <div
                                    className={`h-full rounded-full ${item.health_score > 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                    style={{ width: `${item.health_score}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Subsystem Health Breakdown */}
                        <div className="space-y-2 pt-2 text-xs font-mono">
                            <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-slate-400">Spray System Health:</span>
                                <span className="text-cyan-400 font-bold">{item.spray_ball_health}%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-slate-400">Pump Manifold Health:</span>
                                <span className="text-slate-200 font-bold">{item.pump_health}%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-slate-400">Sensor Loop Health:</span>
                                <span className="text-emerald-400 font-bold">{item.sensor_health}%</span>
                            </div>
                        </div>

                        {/* Footer Metadata */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
                            <span>Anomalies (30d): <strong className="text-slate-200">{item.anomaly_frequency_30d}</strong></span>
                            <span>Avg CIP: <strong className="text-slate-200">{item.avg_cleaning_min} min</strong></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
