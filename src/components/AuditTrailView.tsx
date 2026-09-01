import React, { useState } from 'react';
import { FileCheck, Search, Shield, User, Clock } from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditTrailViewProps {
    auditLogs: AuditLogItem[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditLogs }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredLogs = auditLogs.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                        <FileCheck className="w-4 h-4 text-cyan-400" />
                        <span>GxP Audit Trail & Regulatory Event Log</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                        Immutable Process & Interlock Event History
                    </h2>
                    <p className="text-xs text-slate-400">
                        21 CFR Part 11 compliant event structure tracking recipe starts, alert acknowledgements, and interlock state transitions.
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        placeholder="Search audit logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-64"
                    />
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center space-x-1.5">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        <span>AUDIT TRAIL LOG RECORD ID RANGE: AUD-5000 to AUD-5025</span>
                    </span>
                    <span className="text-slate-400">STATUS: PROTOTYPE DEMO LOG (NON-GxP VALIDATED)</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                                <th className="py-3 px-4">Event ID</th>
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4">User / Actor</th>
                                <th className="py-3 px-4">Action</th>
                                <th className="py-3 px-4">Equipment</th>
                                <th className="py-3 px-4">Details</th>
                                <th className="py-3 px-4">Business Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-cyan-400">{log.id}</td>
                                    <td className="py-3.5 px-4 text-slate-400">{log.timestamp}</td>
                                    <td className="py-3.5 px-4 text-slate-200 font-semibold">{log.user}</td>
                                    <td className="py-3.5 px-4">
                                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[10px]">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-purple-400 font-bold">{log.equipment_id}</td>
                                    <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs truncate">{log.details}</td>
                                    <td className="py-3.5 px-4 font-sans text-slate-400 italic text-[11px] max-w-xs truncate">{log.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
