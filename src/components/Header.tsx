import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Clock, User, ShieldAlert, Cpu } from 'lucide-react';
import { UserRole, DecisionSupport } from '../types';

interface HeaderProps {
    currentRole: UserRole;
    setCurrentRole: (role: UserRole) => void;
    activeAlarmsCount: number;
    decision: DecisionSupport;
    activeScenario: string;
}

export const Header: React.FC<HeaderProps> = ({
    currentRole,
    setCurrentRole,
    activeAlarmsCount,
    decision,
    activeScenario
}) => {
    const [timeStr, setTimeStr] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const getInterlockBadge = () => {
        if (decision.interlock_state === 'RED') {
            return (
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>INTERLOCK: RED (BLOCKED)</span>
                </span>
            );
        }
        if (decision.interlock_state === 'YELLOW') {
            return (
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>INTERLOCK: YELLOW (INVESTIGATE)</span>
                </span>
            );
        }
        return (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>INTERLOCK: GREEN (ENABLED)</span>
            </span>
        );
    };

    return (
        <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur px-6 flex items-center justify-between select-none">
            {/* Left: Plant & Interlock Quick Status */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">PLANT: OPERATIONAL</span>
                </div>

                <div className="h-4 w-[1px] bg-slate-800"></div>

                {/* Interlock Badge */}
                {getInterlockBadge()}

                {/* Scenario Indicator if not NORMAL */}
                {activeScenario !== 'NORMAL' && (
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-mono flex items-center space-x-1">
                        <Cpu className="w-3 h-3 text-purple-400" />
                        <span>SCENARIO: {activeScenario}</span>
                    </span>
                )}
            </div>

            {/* Right: Alarms, Time, Role Selector & Prototype Disclaimer */}
            <div className="flex items-center space-x-4">
                {/* Alarms summary */}
                {activeAlarmsCount > 0 && (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{activeAlarmsCount} Active Alarms</span>
                    </div>
                )}

                {/* System Time */}
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{timeStr || '15:48:12'}</span>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] text-slate-400 font-medium">Role:</span>
                    <select
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                        className="bg-transparent text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
                    >
                        <option value="Operator" className="bg-slate-900 text-slate-200">Operator</option>
                        <option value="QA" className="bg-slate-900 text-slate-200">QA Specialist</option>
                        <option value="Engineer" className="bg-slate-900 text-slate-200">Process Engineer</option>
                        <option value="Admin" className="bg-slate-900 text-slate-200">System Admin</option>
                    </select>
                </div>

                {/* GxP Prototype Notice Tag */}
                <div className="hidden xl:block text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-medium">
                    DEMO PROTOTYPE — NON-GxP
                </div>
            </div>
        </header>
    );
};
