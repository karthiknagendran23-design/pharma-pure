import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Play, CheckCircle2, Box, Layers, QrCode } from 'lucide-react';

interface DemoModeGuideProps {
    onStepChange: (step: number) => void;
    onClose: () => void;
}

export const DemoModeGuide: React.FC<DemoModeGuideProps> = ({
    onStepChange,
    onClose
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const demoSteps = [
        {
            step: 1,
            title: 'STEP 1: Select Land Parcel',
            description: 'Navigating to Chennai → Tambaram (Parcel TN-CHN-TRP-00018427, 2,400 m²).',
            tab: 'map2d'
        },
        {
            step: 2,
            title: 'STEP 2: Inspect Building B01',
            description: 'Building B01: Bhumi Residency Tower A (15 Floors, 120 Units).',
            tab: 'map2d'
        },
        {
            step: 3,
            title: 'STEP 3: Launch 3D Property View',
            description: 'Rendering WebGL extruded 3D building model from parcel footprint.',
            tab: '3dview'
        },
        {
            step: 4,
            title: 'STEP 4: Explode Building Floors',
            description: 'Triggering 3D Exploded View — watch floors separate vertically!',
            tab: '3dview'
        },
        {
            step: 5,
            title: 'STEP 5: Select 3D Unit (Unit 8B)',
            description: 'Clicking Unit 8B on Floor 8 (1,240 sq.ft carpet area).',
            tab: '3dview'
        },
        {
            step: 6,
            title: 'STEP 6: Generate Vertical Property ID',
            description: 'Running ULPIN/VPID Generator: TN-CHN-TRP-00018427-B01-F08-U8B.',
            tab: '3dview'
        },
        {
            step: 7,
            title: 'STEP 7: Generate QR Passport',
            description: 'Generating verifiable QR Digital Property Passport credential.',
            tab: '3dview'
        },
        {
            step: 8,
            title: 'STEP 8: View Digital Passport',
            description: 'Displaying complete property card metadata with Turf.js validation badge.',
            tab: '3dview'
        },
        {
            step: 9,
            title: 'STEP 9: Revenue Verification Workflow',
            description: 'Viewing revenue admin audit log and approval queue.',
            tab: 'verification'
        }
    ];

    const currentStepData = demoSteps.find(s => s.step === currentStep) || demoSteps[0];

    const handleNext = () => {
        if (currentStep < 9) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            onStepChange(nextStep);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-amber-500/50 rounded-3xl p-5 shadow-2xl shadow-amber-500/10 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-400 animate-spin" size={18} style={{ animationDuration: '4s' }} />
                    <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">
                        Guided Hero Demo ({currentStep}/9)
                    </span>
                </div>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white">{currentStepData.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStepData.description}</p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                    {demoSteps.map(s => (
                        <div
                            key={s.step}
                            className={`h-1.5 rounded-full transition-all ${s.step === currentStep ? 'w-6 bg-amber-400' :
                                    s.step < currentStep ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-800'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                    {currentStep === 9 ? 'Finish Demo' : 'Next Step'} <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};
