import React, { useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Filter, Check } from 'lucide-react';
import { AlarmItem, UserRole } from '../types';

interface AlarmCenterProps {
    alarms: AlarmItem[];
    onAcknowledge: (alarmId: string, userRole: UserRole) => void;
    currentRole: UserRole;
}

export const AlarmCenter: React.FC<AlarmCenterProps> = ({ alarms, onAcknowledge, currentRole }) => {
    const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    const filteredAlarms = alarms.filter(a => {
        if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
        if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
        return true;
    });

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span>Centralized Alarm Monitoring</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Process Alarm Management & Operator Acknowledgment
                    </h2>
                    <p className="text-xs text-slate-400">
                        Real-time alert dispatching for clearance deviations, flow stagnation, and conductivity out-of-spec events.
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-400 font-medium">Severity:</span>
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="ALL" className="bg-slate-900">ALL SEVERITIES</option>
                            <option value="CRITICAL" className="bg-slate-900 text-red-400">CRITICAL</option>
                            <option value="HIGH" className="bg-slate-900 text-amber-400">HIGH</option>
                            <option value="MEDIUM" className="bg-slate-900 text-cyan-400">MEDIUM</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                        <span className="text-slate-400 font-medium">Status:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="ALL" className="bg-slate-900">ALL STATUS</option>
                            <option value="ACTIVE" className="bg-slate-900 text-red-400">ACTIVE</option>
                            <option value="ACKNOWLEDGED" className="bg-slate-900 text-amber-400">ACKNOWLEDGED</option>
                            <option value="RESOLVED" className="bg-slate-900 text-emerald-400">RESOLVED</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Alarms Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                                <th className="py-3 px-4">Alarm ID</th>
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4">Equipment</th>
                                <th className="py-3 px-4">Alarm Title & Description</th>
                                <th className="py-3 px-4">Severity</th>
                                <th className="py-3 px-4">Sensor</th>
                                <th className="py-3 px-4">Score</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                            {filteredAlarms.map((alm) => (
                                <tr key={alm.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-amber-400">{alm.id}</td>
                                    <td className="py-3.5 px-4 text-slate-400">{alm.timestamp}</td>
                                    <td className="py-3.5 px-4 font-semibold text-slate-200">{alm.equipment_id}</td>
                                    <td className="py-3.5 px-4 font-sans max-w-xs">
                                        <span className="font-bold text-slate-200 block">{alm.title}</span>
                                        <span className="text-[11px] text-slate-400 truncate block">{alm.description}</span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${alm.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            }`}>
                                            {alm.severity}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-cyan-400 font-bold">{alm.sensor}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-200">{alm.anomaly_score}</td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${alm.status === 'ACTIVE'
                                                ? 'bg-red-500/20 text-red-400 animate-pulse'
                                                : alm.status === 'ACKNOWLEDGED'
                                                    ? 'bg-amber-500/20 text-amber-400'
                                                    : 'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {alm.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        {alm.status === 'ACTIVE' ? (
                                            <button
                                                onClick={() => onAcknowledge(alm.id, currentRole)}
                                                className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-sans font-semibold text-[11px] flex items-center space-x-1 transition-all"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Acknowledge</span>
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">
                                                {alm.acknowledged_by || 'Acked'}
                                            </span>
                                        )}
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
