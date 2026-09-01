import React from 'react';
import { UserRole } from '../types';
import {
    Building2,
    Map,
    Boxes,
    PlusCircle,
    CheckSquare,
    BarChart3,
    ShieldCheck,
    Sparkles,
    Home,
    Wifi,
    WifiOff,
    Play,
    Bot
} from 'lucide-react';

interface NavbarProps {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    onLaunchDemo: () => void;
    isOffline: boolean;
    setIsOffline: (offline: boolean) => void;
    offlineQueueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
    currentTab,
    setCurrentTab,
    userRole,
    setUserRole,
    onLaunchDemo,
    isOffline,
    setIsOffline,
    offlineQueueCount
}) => {
    return (
        <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
            {/* Top Government DPI Bar */}
            <div className="bg-gradient-to-r from-gov-900 via-slate-900 to-gov-900 px-4 py-1 flex items-center justify-between text-xs border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Digital Public Infrastructure (DPI) Portal
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">Ministry of Housing & Urban Land Records</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30 font-mono uppercase tracking-wider">
                        ULPIN-Compatible Prototype Engine
                    </span>
                    <button
                        onClick={() => setIsOffline(!isOffline)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${isOffline
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                        title="Toggle simulated offline survey mode"
                    >
                        {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
                        {isOffline ? `Offline Mode (${offlineQueueCount} queued)` : 'Online'}
                    </button>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="px-4 py-2.5 flex items-center justify-between gap-4">
                {/* Brand */}
                <div
                    onClick={() => setCurrentTab('landing')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">
                                BHUMI<span className="text-cyan-400">3D</span>
                            </h1>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded uppercase">v2.4</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">Vertical Property Cadastre System</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
                    <button
                        onClick={() => setCurrentTab('landing')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'landing'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <Home size={14} /> Landing
                    </button>
                    <button
                        onClick={() => setCurrentTab('dashboard')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'dashboard'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <BarChart3 size={14} /> Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentTab('map2d')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'map2d'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <Map size={14} /> 2D GIS Map
                    </button>
                    <button
                        onClick={() => setCurrentTab('city3d')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'city3d'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <Boxes size={14} /> 3D City
                    </button>
                    <button
                        onClick={() => setCurrentTab('pharma3d')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'pharma3d'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-bold'
                            : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50'
                            }`}
                    >
                        <Sparkles size={14} /> 3D Digital Twin
                    </button>
                    {userRole !== 'CITIZEN' && (
                        <button
                            onClick={() => setCurrentTab('register')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'register'
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <PlusCircle size={14} /> Register Property
                        </button>
                    )}
                    {userRole === 'ADMIN' && (
                        <button
                            onClick={() => setCurrentTab('verification')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'verification'
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <CheckSquare size={14} /> Verification
                        </button>
                    )}
                    <button
                        onClick={() => setCurrentTab('audit')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'audit'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <ShieldCheck size={14} /> Audit Log
                    </button>
                    <button
                        onClick={() => setCurrentTab('assistant')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentTab === 'assistant'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <Bot size={14} /> AI Assistant
                    </button>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Quick Hero Demo Launch */}
                    <button
                        onClick={onLaunchDemo}
                        className="relative group overflow-hidden flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                    >
                        <Sparkles size={14} className="animate-spin text-slate-950" style={{ animationDuration: '4s' }} />
                        <span>DEMO MODE</span>
                        <Play size={12} className="fill-slate-950" />
                    </button>

                    {/* Role Switcher Dropdown */}
                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 font-medium">Role:</span>
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value as UserRole)}
                            className="bg-transparent text-xs font-bold text-cyan-400 outline-none cursor-pointer"
                        >
                            <option value="CITIZEN" className="bg-slate-900 text-white">Citizen (Public)</option>
                            <option value="SURVEYOR" className="bg-slate-900 text-white">Cadastral Surveyor</option>
                            <option value="ADMIN" className="bg-slate-900 text-white">Revenue Admin</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
};
