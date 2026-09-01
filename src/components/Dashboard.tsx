import React from 'react';
import { Parcel, Building, Unit } from '../types';
import {
    BarChart3,
    Building2,
    MapPin,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Layers,
    PieChart as PieIcon,
    Sparkles,
    Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
    parcels: Parcel[];
    buildings: Building[];
    units: Unit[];
}

export const Dashboard: React.FC<DashboardProps> = ({
    parcels,
    buildings,
    units
}) => {
    const totalParcels = parcels.length;
    const totalBuildings = buildings.length;
    const totalUnits = units.length;
    const approvedCount = parcels.filter(p => p.status === 'Approved').length;
    const pendingCount = parcels.filter(p => p.status !== 'Approved').length;
    const conflictCount = parcels.filter(p => p.status === 'Correction Requested' || p.parcelUid.includes('ERR')).length;

    const verticalCoveragePct = 73; // Metric as specified

    // Recharts Data
    const landUseData = [
        { name: 'Residential', value: parcels.filter(p => p.landUse === 'Residential').length },
        { name: 'Commercial', value: parcels.filter(p => p.landUse === 'Commercial').length },
        { name: 'Mixed Use', value: parcels.filter(p => p.landUse === 'Mixed Use').length },
        { name: 'Industrial', value: parcels.filter(p => p.landUse === 'Industrial').length },
        { name: 'Institutional', value: parcels.filter(p => p.landUse === 'Institutional').length }
    ];

    const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

    const heightDistributionData = [
        { range: '1-3 Floors', count: buildings.filter(b => b.floorCount <= 3).length },
        { range: '4-9 Floors', count: buildings.filter(b => b.floorCount >= 4 && b.floorCount <= 9).length },
        { range: '10+ High-Rise', count: buildings.filter(b => b.floorCount >= 10).length }
    ];

    return (
        <div className="max-w-6xl mx-auto my-8 p-6 space-y-8">
            {/* Top Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Total Land Parcels</span>
                        <MapPin size={16} className="text-cyan-400" />
                    </div>
                    <div className="text-3xl font-black text-white font-mono">{totalParcels}</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <TrendingUp size={12} /> +12% Mapped this month
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>3D Registered Buildings</span>
                        <Building2 size={16} className="text-blue-400" />
                    </div>
                    <div className="text-3xl font-black text-white font-mono">{totalBuildings}</div>
                    <div className="text-[11px] text-cyan-400 font-mono">
                        Avg Floors: {(buildings.reduce((s, b) => s + b.floorCount, 0) / (totalBuildings || 1)).toFixed(1)}
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Vertical Property Units</span>
                        <Layers size={16} className="text-amber-400" />
                    </div>
                    <div className="text-3xl font-black text-amber-400 font-mono">{totalUnits}</div>
                    <div className="text-[11px] text-slate-400 font-mono">100% VPID Encoded</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-900 p-5 rounded-3xl border border-cyan-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs text-cyan-300">
                        <span className="font-bold">Vertical Mapping Coverage</span>
                        <Sparkles size={16} className="text-cyan-400" />
                    </div>
                    <div className="text-3xl font-black text-cyan-300 font-mono">{verticalCoveragePct}%</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${verticalCoveragePct}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Spatial Intelligence Insights Panel */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                    <Zap className="text-amber-400" size={20} />
                    <h3 className="text-base font-extrabold text-white">Spatial Intelligence Insights</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-cyan-300">
                        • 12 High-Rise towers detected (&gt;10 floors).
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-amber-300">
                        • 3 Parcels contain multiple stacked structures.
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-rose-300">
                        • {conflictCount} Geometry conflict requiring surveyor correction.
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-emerald-300">
                        • {pendingCount} Properties pending revenue verification.
                    </div>
                </div>
            </div>

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Land Use Pie Chart */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <PieIcon size={16} className="text-cyan-400" /> Parcels by Land Use Distribution
                    </h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={landUseData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                                    {landUseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Building Height Distribution Bar Chart */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <BarChart3 size={16} className="text-amber-400" /> Vertical Density Breakdown
                    </h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={heightDistributionData}>
                                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                                <YAxis stroke="#94a3b8" fontSize={11} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
