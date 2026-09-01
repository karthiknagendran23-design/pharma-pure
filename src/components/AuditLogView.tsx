import React from 'react';
import { AuditLogEntry } from '../types';
import { ShieldCheck, Clock, User, Activity } from 'lucide-react';

interface AuditLogViewProps {
    logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
    return (
        <div className="max-w-5xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-white">Immutable Audit Stream</h2>
                        <p className="text-xs text-slate-400">Cryptographically verifiable log of all cadastral modifications and property ID generations.</p>
                    </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    ● Immutable Logging Active
                </span>
            </div>

            <div className="space-y-3">
                {logs.map((log) => (
                    <div key={log.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-start justify-between text-xs space-y-1 sm:space-y-0">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-cyan-400">{log.action}</span>
                                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                                    {log.targetUid}
                                </span>
                                <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded">
                                    {log.userRole}
                                </span>
                            </div>
                            <p className="text-slate-300 font-sans">{log.details}</p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                                <span className="flex items-center gap-1"><User size={10} /> {log.actorName}</span>
                                {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                            </div>
                        </div>
                        <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                            <span className="flex items-center gap-1 justify-end"><Clock size={12} /> {new Date(log.timestamp).toLocaleTimeString()}</span>
                            <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
