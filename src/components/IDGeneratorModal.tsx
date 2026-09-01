import React, { useEffect, useState } from 'react';
import { Unit } from '../types';
import { Sparkles, CheckCircle2, Copy, QrCode, Box, ShieldCheck, ArrowRight } from 'lucide-react';

interface IDGeneratorModalProps {
    unit: Unit;
    onClose: () => void;
    onOpenQR: (unit: Unit) => void;
    onOpen3D: () => void;
}

export const IDGeneratorModal: React.FC<IDGeneratorModalProps> = ({
    unit,
    onClose,
    onOpenQR,
    onOpen3D
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [copied, setCopied] = useState(false);

    const steps = [
        'Collecting Spatial & Cadastral Data...',
        'Validating 3D Parcel Geometry & Footprint Bounds...',
        'Generating 64-Bit Spatial Geohash Hash...',
        'Linking Administrative Hierarchy (State, District, Taluk, Village)...',
        'Creating Land Parcel Identity (ULPIN)...',
        'Encoding Vertical Property Identity (VPID)...',
        '✓ ULPIN-Compatible Prototype Property ID Generated!'
    ];

    useEffect(() => {
        if (currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleCopy = () => {
        navigator.clipboard.writeText(unit.unitUid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isComplete = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-amber-400" size={20} />
                        <h3 className="text-lg font-extrabold text-white">Smart Property ID Generator</h3>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded uppercase">
                        Prototype Engine
                    </span>
                </div>

                {/* Animation Steps Stream */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                    {steps.slice(0, currentStep + 1).map((stepText, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-2 transition-all ${idx === currentStep && !isComplete ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-300'
                                }`}
                        >
                            {idx < currentStep || isComplete ? (
                                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            ) : (
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                            )}
                            <span>{stepText}</span>
                        </div>
                    ))}
                </div>

                {/* Generated Result Card */}
                {isComplete && (
                    <div className="bg-gradient-to-b from-slate-950 to-slate-900 p-5 rounded-2xl border border-cyan-500/40 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase bg-cyan-500/20 px-2 py-0.5 rounded">
                                Generated Vertical Property ID (VPID)
                            </span>
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                <ShieldCheck size={14} /> Active Passport
                            </span>
                        </div>

                        <div className="text-lg font-black text-white font-mono break-all tracking-tight bg-slate-950 p-3 rounded-xl border border-slate-800">
                            {unit.unitUid}
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                            <button
                                onClick={handleCopy}
                                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <Copy size={14} /> {copied ? 'Copied!' : 'Copy ID'}
                            </button>

                            <button
                                onClick={() => { onClose(); onOpenQR(unit); }}
                                className="py-2.5 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-semibold text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <QrCode size={14} /> Generate QR
                            </button>

                            <button
                                onClick={() => { onClose(); onOpen3D(); }}
                                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <Box size={14} /> View 3D
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
