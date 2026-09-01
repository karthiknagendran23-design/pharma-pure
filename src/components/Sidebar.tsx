import React from 'react';
import {
    LayoutDashboard,
    Activity,
    Box,
    Cpu,
    Gauge,
    HardDrive,
    History,
    Leaf,
    Bell,
    FileCheck,
    FlaskConical,
    Presentation,
    Settings,
    ShieldAlert,
    Crown
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;
    activeAlarmsCount: number;
    anomalyScore: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    activeAlarmsCount,
    anomalyScore
}) => {
    const navItems = [
        { id: 'dashboard' as NavigationTab, label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'live-cip' as NavigationTab, label: 'Live CIP Monitoring', icon: Activity, badge: 'REALTIME' },
        { id: 'digital-twin' as NavigationTab, label: 'Digital Twin', icon: Box },
        { id: 'digital-queen' as NavigationTab, label: 'Digital Queen Twin', icon: Crown, badge: 'MASTER 3D', badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'anomaly-intel' as NavigationTab, label: 'Anomaly Intelligence', icon: Cpu, badge: anomalyScore > 50 ? `${Math.round(anomalyScore)}` : undefined, badgeColor: anomalyScore > 60 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400' },
        { id: 'physics-clearance' as NavigationTab, label: 'Physics & Interlock', icon: Gauge },
        { id: 'equipment' as NavigationTab, label: 'Equipment Health', icon: HardDrive },
        { id: 'cip-history' as NavigationTab, label: 'CIP History', icon: History },
        { id: 'resource-opt' as NavigationTab, label: 'Resource ROI', icon: Leaf },
        { id: 'alarm-center' as NavigationTab, label: 'Alarm Center', icon: Bell, count: activeAlarmsCount },
        { id: 'audit-trail' as NavigationTab, label: 'Audit Trail', icon: FileCheck },
        { id: 'simulation-lab' as NavigationTab, label: 'Simulation Lab', icon: FlaskConical, highlight: true },
        { id: 'pitch-mode' as NavigationTab, label: 'Pitch Mode (Hackathon)', icon: Presentation, special: true },
        { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none">
            <div>
                {/* Brand Header */}
                <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <ShieldAlert className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-100 text-lg tracking-tight flex items-center space-x-1.5">
                            <span>CleanOptima</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold uppercase tracking-wider">Edge</span>
                        </h1>
                        <p className="text-[11px] text-slate-400 tracking-wide font-medium">Pharma CIP Intelligence</p>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="p-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                    ? item.special
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : item.highlight
                                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/25'
                                            : 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/50'
                                    : item.special
                                        ? 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 border border-indigo-800/40'
                                        : item.highlight
                                            ? 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/30'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`w-4 h-4 ${isActive ? (item.special || item.highlight ? 'text-white' : 'text-cyan-400') : 'text-slate-400'}`} />
                                    <span className="truncate">{item.label}</span>
                                </div>

                                {item.badge && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${item.badgeColor || 'bg-cyan-500/20 text-cyan-300'}`}>
                                        {item.badge}
                                    </span>
                                )}

                                {item.count !== undefined && item.count > 0 && (
                                    <span className="text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Edge Status */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Edge Node: PLC-GW-01</span>
                    </span>
                    <span className="text-slate-400 font-mono">1.2ms</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                    Clean Smarter. Detect Earlier. Produce Safer.
                </div>
            </div>
        </aside>
    );
};
