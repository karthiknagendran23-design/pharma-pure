import React, { useState } from 'react';
import { Presentation, ChevronRight, ChevronLeft, Play, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';
import { NavigationTab, ScenarioType } from '../types';
import { api } from '../services/api';

interface PitchModeGuideProps {
    setActiveTab: (tab: NavigationTab) => void;
    setActiveScenario: (s: ScenarioType) => void;
}

export const PitchModeGuide: React.FC<PitchModeGuideProps> = ({
    setActiveTab,
    setActiveScenario
}) => {
    const [currentStep, setCurrentStep] = useState<number>(1);

    const steps = [
        {
            step: 1,
            title: "STEP 1: Normal CIP Cycle Initiated",
            status: "CIP PROFILE NORMAL",
            badge: "NORMAL",
            badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            description: "Reactor-04 begins standard CIP-RECIPE-07 post API-FORMULATION-A campaign changeover. All 6 sensors follow validated historical baselines.",
            actionText: "Observe Normal Baseline Telemetry",
            scenarioToApply: 'NORMAL' as ScenarioType,
            targetTab: 'live-cip' as NavigationTab
        },
        {
            step: 2,
            title: "STEP 2: Inject Process Abnormality",
            status: "SPRAY NOZZLE OBSTRUCTION SIMULATED",
            badge: "SIMULATING FAULT",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            description: "A partially blocked spray nozzle causes circulation flow rate to drop from 152 L/min down to 110 L/min.",
            actionText: "Trigger Spray Obstruction Scenario",
            scenarioToApply: 'SPRAY_BLOCKAGE' as ScenarioType,
            targetTab: 'simulation-lab' as NavigationTab
        },
        {
            step: 3,
            title: "STEP 3: 1D CNN AI Detects Deviation",
            status: "EARLY ANOMALY DETECTED (SCORE: 78.5)",
            badge: "AI WARNING",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            description: "The 1D CNN Autoencoder flags reconstruction error across sliding window features long before the CIP cycle completes.",
            actionText: "Open Anomaly Intelligence & XAI Panel",
            scenarioToApply: 'SPRAY_BLOCKAGE' as ScenarioType,
            targetTab: 'anomaly-intel' as NavigationTab
        },
        {
            step: 4,
            title: "STEP 4: Physics Model Identifies Clearance Lag",
            status: "CLEARANCE RATE DEVIATION",
            badge: "PHYSICS LAG",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            description: "Residue clearance decay rate (k) lags behind the physics-informed exponential model C(t) = C₀ e⁻ᵏᵗ by 31%.",
            actionText: "Examine Physics Exponential Curve",
            scenarioToApply: 'SPRAY_BLOCKAGE' as ScenarioType,
            targetTab: 'physics-clearance' as NavigationTab
        },
        {
            step: 5,
            title: "STEP 5: Explainable AI Diagnoses Root Cause",
            status: "POSSIBLE SPRAY COVERAGE DEGRADATION (87% CONFIDENCE)",
            badge: "XAI REASONING",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
            description: "AI reasoning panel synthesizes flow reduction + TOC clearance lag + elevated backpressure to pinpoint spray nozzle coverage degradation.",
            actionText: "View XAI Diagnostic Breakdown",
            scenarioToApply: 'SPRAY_BLOCKAGE' as ScenarioType,
            targetTab: 'anomaly-intel' as NavigationTab
        },
        {
            step: 6,
            title: "STEP 6: Decision Support Changes State",
            status: "INVESTIGATION REQUIRED",
            badge: "DECISION SUPPORT",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            description: "System recommends immediate operator inspection of spray ball pressure and outlet manifold flow.",
            actionText: "Check Decision Engine State",
            scenarioToApply: 'SPRAY_BLOCKAGE' as ScenarioType,
            targetTab: 'live-cip' as NavigationTab
        },
        {
            step: 7,
            title: "STEP 7: Simulated Hardware Interlock Engaged",
            status: "NEXT BATCH BLOCKED (RED INTERLOCK)",
            badge: "INTERLOCK RED",
            badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
            description: "Simulated PLC equipment interlock changes state to RED, preventing the next production batch from starting on unvalidated equipment.",
            actionText: "Inspect Hardware Interlock",
            scenarioToApply: 'SPRAY_BLOCKAGE' as ScenarioType,
            targetTab: 'physics-clearance' as NavigationTab
        },
        {
            step: 8,
            title: "STEP 8: Operator Resolves Equipment Issue",
            status: "SPRAY BALL STRAINER CLEARED",
            badge: "RESOLVING FAULT",
            badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
            description: "Operator acknowledges alarm in Alarm Center and clears spray nozzle strainers.",
            actionText: "Reset Simulation to Normal",
            scenarioToApply: 'NORMAL' as ScenarioType,
            targetTab: 'alarm-center' as NavigationTab
        },
        {
            step: 9,
            title: "STEP 9: CIP Returns to Nominal Baseline",
            status: "CIP PROFILE RECOVERED",
            badge: "RECOVERED",
            badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            description: "Flow rate recovers to 152 L/min and TOC clearance accelerates back onto physics model trajectory.",
            actionText: "Verify Flow Recovery on Live Dashboard",
            scenarioToApply: 'NORMAL' as ScenarioType,
            targetTab: 'live-cip' as NavigationTab
        },
        {
            step: 10,
            title: "STEP 10: Verification Criteria Reached & QA Release",
            status: "READY FOR QA VERIFICATION",
            badge: "QA READY",
            badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            description: "TOC drops below 50 ppb target threshold. System changes decision state to READY FOR QA VERIFICATION.",
            actionText: "View Resource ROI Impact",
            scenarioToApply: 'NORMAL' as ScenarioType,
            targetTab: 'resource-opt' as NavigationTab
        }
    ];

    const currentObj = steps[currentStep - 1];

    const executeStep = () => {
        setActiveScenario(currentObj.scenarioToApply);
        api.setScenario(currentObj.scenarioToApply);
        setActiveTab(currentObj.targetTab);
    };

    return (
        <div className="p-6 space-y-6 select-none">
            {/* Pitch Header Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/60 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-widest">
                        <Presentation className="w-4 h-4 text-purple-400" />
                        <span>Hackathon & Investor Presentation Mode</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                        <span>CleanOptima Edge Guided Story Walkthrough</span>
                        <Sparkles className="w-5 h-5 text-amber-400" />
                    </h2>
                    <p className="text-xs text-purple-200/80 max-w-2xl">
                        Demonstrate the complete value proposition in 2–3 minutes: Traditional fixed-time CIP vs Real-time sensor intelligence + physics + AI.
                    </p>
                </div>

                <div className="bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50 text-xs font-mono text-purple-300">
                    Step <strong className="text-white">{currentStep}</strong> of {steps.length}
                </div>
            </div>

            {/* Main Interactive Step Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <span className="text-xs font-mono text-slate-400 uppercase">Current Presentation Milestone</span>
                        <h3 className="text-xl font-bold text-slate-100 mt-1">{currentObj.title}</h3>
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-mono font-bold border ${currentObj.badgeColor}`}>
                        {currentObj.status}
                    </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans">
                    {currentObj.description}
                </p>

                {/* Step Navigation & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={currentStep === 1}
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous Step</span>
                        </button>

                        <button
                            disabled={currentStep === steps.length}
                            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-all"
                        >
                            <span>Next Step</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={executeStep}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        <span>Execute & {currentObj.actionText}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 10-Step Timeline Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                {steps.map((st) => (
                    <button
                        key={st.step}
                        onClick={() => setCurrentStep(st.step)}
                        className={`p-2.5 rounded-lg border text-center font-mono text-xs transition-all ${currentStep === st.step
                                ? 'bg-purple-900/60 border-purple-500 text-white font-bold ring-1 ring-purple-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <span className="block text-[10px] opacity-60">Step 0{st.step}</span>
                        <span className="truncate block font-semibold mt-0.5">{st.badge}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
