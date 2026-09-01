import React from 'react';
import {
    Building2,
    Layers,
    MapPin,
    Sparkles,
    ShieldCheck,
    TrendingUp,
    Users,
    CheckCircle2,
    ArrowRight,
    QrCode,
    Box,
    Compass
} from 'lucide-react';

interface LandingPageProps {
    onExploreMap: () => void;
    onLaunchDemo: () => void;
    onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
    onExploreMap,
    onLaunchDemo,
    onRegister
}) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 px-6 border-b border-slate-800/60">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                            <Sparkles size={14} /> Digital Public Infrastructure (DPI) Platform
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                            Mapping Property in <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 font-mono">
                                Three Dimensions
                            </span>
                        </h1>

                        <p className="text-slate-300 text-lg leading-relaxed font-light">
                            One Land Parcel. Every Floor. Every Property. One Digital Identity. BHUMI3D extends conventional 2D cadastral boundary mapping into a 3D vertical property identity system for high-rise urban landscapes.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button
                                onClick={onLaunchDemo}
                                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/25 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Sparkles size={16} /> Launch Hero 3D Demo
                            </button>

                            <button
                                onClick={onExploreMap}
                                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-cyan-500/50 transition-all flex items-center gap-2"
                            >
                                <Compass size={16} className="text-cyan-400" /> Explore 2D GIS Map
                            </button>

                            <button
                                onClick={onRegister}
                                className="px-6 py-3.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-semibold text-sm border border-cyan-500/30 transition-all flex items-center gap-2"
                            >
                                Register Vertical Unit <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Quick Metrics */}
                        <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
                            <div>
                                <div className="text-2xl font-black text-white font-mono">2D ➔ 3D</div>
                                <div className="text-xs text-slate-400 mt-0.5">Cadastral Transformation</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-cyan-400 font-mono">100%</div>
                                <div className="text-xs text-slate-400 mt-0.5">ULPIN VPID Encoding</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-amber-400 font-mono">73%</div>
                                <div className="text-xs text-slate-400 mt-0.5">Vertical Mapping Coverage</div>
                            </div>
                        </div>
                    </div>

                    {/* Graphic / 3D Card Preview */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 border border-slate-800 shadow-2xl shadow-cyan-500/10">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-mono text-slate-400 ml-2">BHUMI3D Cadastral Viewer</span>
                                </div>
                                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded">3D ACTIVE</span>
                            </div>

                            {/* Stacked Floor Visual Illustration */}
                            <div className="py-8 px-4 flex flex-col items-center justify-center space-y-2">
                                <div className="w-full bg-cyan-900/40 border border-cyan-400/60 rounded-lg p-2.5 flex items-center justify-between shadow-lg shadow-cyan-500/20 transform hover:scale-102 transition-transform">
                                    <div className="flex items-center gap-2">
                                        <Box size={16} className="text-cyan-400" />
                                        <span className="text-xs font-bold text-cyan-200">FLOOR 15 — UNIT 15A</span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-cyan-500/30 text-cyan-200 px-2 py-0.5 rounded">VPID: TN-CHN-TRP-00018427-B01-F15-U15A</span>
                                </div>
                                <div className="w-[94%] bg-slate-800/80 border border-slate-700 rounded-lg p-2 flex items-center justify-between text-xs text-slate-300">
                                    <span>FLOOR 14 (8 Units)</span>
                                    <span className="font-mono text-[10px] text-slate-400">10,500 sq.ft</span>
                                </div>
                                <div className="w-[88%] bg-slate-800/60 border border-slate-700/80 rounded-lg p-2 flex items-center justify-between text-xs text-slate-400">
                                    <span>FLOOR 10 - 13 (Multi-tenant)</span>
                                    <span className="font-mono text-[10px]">42,000 sq.ft</span>
                                </div>
                                <div className="w-[82%] bg-slate-800/40 border border-slate-800 rounded-lg p-2 flex items-center justify-between text-xs text-slate-500">
                                    <span>GROUND FLOOR (Retail)</span>
                                    <span className="font-mono text-[10px]">8,000 sq.ft</span>
                                </div>
                                <div className="w-full border-t-2 border-dashed border-amber-500/50 pt-2 text-center">
                                    <span className="text-[11px] font-mono text-amber-400 font-semibold">2D LAND PARCEL FOOTPRINT (2,400 m²)</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1.5"><QrCode size={14} className="text-cyan-400" /> Scan QR Digital Passport</span>
                                <span className="text-emerald-400 font-medium">Turf.js Validated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Traditional 2D vs BHUMI3D Comparison */}
            <section className="py-16 px-6 bg-slate-900/50 border-b border-slate-800">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Why 2D Parcel Mapping Fails Modern High-Rise Cities
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Single flat footprints cannot represent multi-storey ownership, stacked commercial units, or vertical property density.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Traditional 2D */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/20 relative">
                            <div className="inline-block px-3 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-bold uppercase mb-4">
                                Traditional 2D Mapping
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-400 font-bold">✕</span> Single flat polygon for an entire multi-storey tower.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-400 font-bold">✕</span> 120 separate apartment owners share identical 2D parcel boundaries.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-400 font-bold">✕</span> Cannot distinguish floor level, vertical height, or unit position.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-400 font-bold">✕</span> Frequent property tax disputes and unmapped vertical assets.
                                </li>
                            </ul>
                        </div>

                        {/* BHUMI3D */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 relative shadow-xl shadow-cyan-500/5">
                            <div className="inline-block px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase mb-4">
                                BHUMI3D Vertical Identity System
                            </div>
                            <ul className="space-y-3 text-sm text-slate-100">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                    <span><strong>Hierarchical Structure:</strong> Land Parcel ➔ Building ➔ Floor ➔ Unit.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                    <span><strong>Unique VPID:</strong> Every floor and unit receives a dedicated digital property ID.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                    <span><strong>Exploded 3D Visuals:</strong> Interactive Three.js WebGL floor isolation & exploded views.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                    <span><strong>Turf.js Validation:</strong> Automatic checks for overlaps and footprint boundaries.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4 Impact Areas */}
            <section className="py-16 px-6 border-b border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
                        Transformative Impact Across Ecosystems
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Governance</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Enables clear digital property passports, reduces land disputes, and simplifies revenue record administration.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Urban Planning</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Supports vertical density heatmaps, Floor Space Index (FSI) analysis, and infrastructure capacity modeling.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Citizens</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Provides transparent property ownership verification, QR digital property cards, and 3D unit visual proof.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Revenue Potential</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Improves municipal property-tax mapping, asset valuation, and bank mortgage encumbrance checks.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Innovation Statement Banner */}
            <section className="py-12 px-6 bg-gradient-to-r from-slate-900 via-slate-900 to-gov-900">
                <div className="max-w-4xl mx-auto bg-slate-950/80 p-8 rounded-3xl border border-cyan-500/30 text-center shadow-2xl space-y-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Judicial & Architectural Statement</span>
                    <blockquote className="text-lg sm:text-xl font-serif italic text-slate-200 leading-relaxed">
                        “Traditional cadastral systems primarily answer WHERE a parcel exists. BHUMI3D extends that concept to answer WHERE a property exists in three dimensions — connecting land, building, floor and unit into a unified digital identity.”
                    </blockquote>
                </div>
            </section>
        </div>
    );
};
