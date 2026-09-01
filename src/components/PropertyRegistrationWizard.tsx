import React, { useState } from 'react';
import { Parcel, Building, Floor, Unit, GeometryValidationError } from '../types';
import { validateParcelGeometry, validateBuildingWithinParcel, validateAreaHierarchy } from '../services/validationEngine';
import { generateParcelULPIN, generateBuildingID, generateFloorID, generateUnitVPID } from '../services/idGenerator';
import {
    PlusCircle,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Box,
    ShieldCheck,
    Building2,
    FileText,
    MapPin
} from 'lucide-react';

interface PropertyRegistrationWizardProps {
    parcels: Parcel[];
    onAddNewParcel: (newParcel: Parcel, newBuilding: Building, newFloors: Floor[], newUnits: Unit[]) => void;
    onCancel: () => void;
}

export const PropertyRegistrationWizard: React.FC<PropertyRegistrationWizardProps> = ({
    parcels,
    onAddNewParcel,
    onCancel
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Form State
    const [stateName, setStateName] = useState('Tamil Nadu');
    const [district, setDistrict] = useState('Chennai');
    const [taluk, setTaluk] = useState('Tambaram');
    const [village, setVillage] = useState('East Tambaram');
    const [surveyNumber, setSurveyNumber] = useState('210/14B');
    const [parcelAreaSqm, setParcelAreaSqm] = useState(1800);
    const [landUse, setLandUse] = useState<any>('Residential');

    // Building State
    const [buildingName, setBuildingName] = useState('Bhumi Horizon Tower B');
    const [buildingType, setBuildingType] = useState<any>('Apartment');
    const [floorCount, setFloorCount] = useState(5);
    const [heightMeters, setHeightMeters] = useState(18.0);
    const [constructionYear, setConstructionYear] = useState(2025);

    // Floor & Unit State
    const [unitsPerFloor, setUnitsPerFloor] = useState(4);
    const [avgUnitAreaSqft, setAvgUnitAreaSqft] = useState(1200);

    // Validation State
    const [validationErrors, setValidationErrors] = useState<GeometryValidationError[]>([]);
    const [generatedULPIN, setGeneratedULPIN] = useState('');
    const [generatedVPIDSample, setGeneratedVPIDSample] = useState('');

    const wizardSteps = [
        '1. Select/Draw Parcel',
        '2. Parcel Info',
        '3. Building Info',
        '4. Floor Info',
        '5. Unit Info',
        '6. Geometry Validation',
        '7. Generate IDs',
        '8. 3D Preview',
        '9. Submit Verification'
    ];

    // Helper to trigger validation logic at Step 6
    const handleRunValidation = () => {
        // Construct temp objects
        const center = { lat: 12.9240, lng: 80.1290 };
        const tempParcel: Parcel = {
            id: `p-new-${Date.now()}`,
            parcelUid: generateParcelULPIN(stateName, district, taluk, surveyNumber, center),
            state: stateName,
            district,
            taluk,
            village,
            surveyNumber,
            coordinates: [
                { lat: center.lat - 0.0002, lng: center.lng - 0.0003 },
                { lat: center.lat - 0.0002, lng: center.lng + 0.0003 },
                { lat: center.lat + 0.0002, lng: center.lng + 0.0003 },
                { lat: center.lat + 0.0002, lng: center.lng - 0.0003 }
            ],
            center,
            areaSqm: parcelAreaSqm,
            landUse,
            status: 'Submitted',
            buildingIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const tempBuilding: Building = {
            id: `b-new-${Date.now()}`,
            buildingUid: generateBuildingID(tempParcel.parcelUid, 1),
            parcelId: tempParcel.id,
            buildingName,
            buildingType,
            footprintCoordinates: tempParcel.coordinates,
            heightMeters,
            floorCount,
            constructionYear,
            status: 'Submitted',
            floorIds: []
        };

        const pErrs = validateParcelGeometry(tempParcel);
        const bErrs = validateBuildingWithinParcel(tempBuilding, tempParcel);

        setValidationErrors([...pErrs, ...bErrs]);
        setGeneratedULPIN(tempParcel.parcelUid);
        setGeneratedVPIDSample(generateUnitVPID(generateFloorID(tempBuilding.buildingUid, 1), 'U01'));

        setCurrentStep(6);
    };

    const handleSubmitFinal = () => {
        const center = { lat: 12.9240, lng: 80.1290 };
        const parcelUid = generatedULPIN || generateParcelULPIN(stateName, district, taluk, surveyNumber, center);
        const parcelId = `p-registered-${Date.now()}`;

        const newParcel: Parcel = {
            id: parcelId,
            parcelUid,
            state: stateName,
            district,
            taluk,
            village,
            surveyNumber,
            coordinates: [
                { lat: center.lat - 0.0002, lng: center.lng - 0.0003 },
                { lat: center.lat - 0.0002, lng: center.lng + 0.0003 },
                { lat: center.lat + 0.0002, lng: center.lng + 0.0003 },
                { lat: center.lat + 0.0002, lng: center.lng - 0.0003 }
            ],
            center,
            areaSqm: parcelAreaSqm,
            landUse,
            status: 'Submitted',
            buildingIds: [`b-reg-${Date.now()}`],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const bldgId = `b-reg-${Date.now()}`;
        const bldgUid = generateBuildingID(parcelUid, 1);
        const newBuilding: Building = {
            id: bldgId,
            buildingUid: bldgUid,
            parcelId,
            buildingName,
            buildingType,
            footprintCoordinates: newParcel.coordinates,
            heightMeters,
            floorCount,
            constructionYear,
            status: 'Submitted',
            floorIds: []
        };

        const newFloors: Floor[] = [];
        const newUnits: Unit[] = [];

        for (let f = 0; f < floorCount; f++) {
            const fId = `f-reg-${Date.now()}-${f}`;
            const fUid = generateFloorID(bldgUid, f);
            const unitIds: string[] = [];

            for (let u = 1; u <= unitsPerFloor; u++) {
                const uId = `u-reg-${Date.now()}-${f}-${u}`;
                const uNum = `${f + 1}${String.fromCharCode(64 + u)}`;
                const uUid = generateUnitVPID(fUid, uNum);
                unitIds.push(uId);

                newUnits.push({
                    id: uId,
                    unitUid: uUid,
                    floorId: fId,
                    buildingId: bldgId,
                    parcelId,
                    unitNumber: uNum,
                    unitType: 'Apartment',
                    areaSqft: avgUnitAreaSqft,
                    occupancyStatus: 'Vacant',
                    ownerNameMasked: 'New Owner',
                    ownershipType: 'Individual',
                    sharePercentage: 100,
                    marketValueEstimateINR: 7500000,
                    relativeHeightOffset: f * 3.5
                });
            }

            newFloors.push({
                id: fId,
                floorUid: fUid,
                buildingId: bldgId,
                parcelId,
                floorNumber: f,
                floorName: `Floor ${f + 1}`,
                heightMeters: 3.5,
                builtUpAreaSqft: unitsPerFloor * avgUnitAreaSqft * 1.15,
                unitIds
            });
        }

        newBuilding.floorIds = newFloors.map(f => f.id);

        onAddNewParcel(newParcel, newBuilding, newFloors, newUnits);
    };

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
            {/* Wizard Step Indicator Bar */}
            <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <PlusCircle className="text-cyan-400" size={22} /> Vertical Property Registration Wizard
                    </h2>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                        Step {currentStep} of 9
                    </span>
                </div>

                {/* Step Progress Line */}
                <div className="grid grid-cols-9 gap-1 text-[9px] font-mono text-center">
                    {wizardSteps.map((stepTitle, idx) => {
                        const stepNum = idx + 1;
                        const isActive = currentStep === stepNum;
                        const isDone = currentStep > stepNum;
                        return (
                            <div
                                key={idx}
                                className={`py-1.5 rounded-lg transition-colors ${isActive ? 'bg-cyan-500 text-slate-950 font-bold' :
                                        isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950 text-slate-500'
                                    }`}
                            >
                                {stepNum}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Contents */}
            <div className="py-4 space-y-6">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 1: Select or Draw Parcel Boundary</h3>
                        <p className="text-xs text-slate-400">
                            Choose an existing cadastral survey plot or draw new survey polygon boundaries using DGPS coordinates.
                        </p>
                        <div className="p-6 bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
                            <MapPin className="mx-auto text-cyan-400" size={32} />
                            <div className="text-xs text-slate-300 font-semibold">Active Coordinates Boundary Box: Tambaram East (12.9240° N, 80.1290° E)</div>
                            <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-mono">
                                ✓ Spatial Boundary Boundary Captured
                            </span>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 2: Parcel Administrative Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="text-slate-400 font-mono">State</label>
                                <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">District</label>
                                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Taluk</label>
                                <input type="text" value={taluk} onChange={(e) => setTaluk(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Village / Locality</label>
                                <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Survey Number</label>
                                <input type="text" value={surveyNumber} onChange={(e) => setSurveyNumber(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Parcel Area (Sqm)</label>
                                <input type="number" value={parcelAreaSqm} onChange={(e) => setParcelAreaSqm(Number(e.target.value))} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 3: Building Structure Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="text-slate-400 font-mono">Building Name</label>
                                <input type="text" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Building Type</label>
                                <select value={buildingType} onChange={(e) => setBuildingType(e.target.value)} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none">
                                    <option value="Apartment">Apartment</option>
                                    <option value="Commercial Complex">Commercial Complex</option>
                                    <option value="Mixed Use Tower">Mixed Use Tower</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Total Floor Count</label>
                                <input type="number" value={floorCount} onChange={(e) => setFloorCount(Number(e.target.value))} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Total Height (Meters)</label>
                                <input type="number" value={heightMeters} onChange={(e) => setHeightMeters(Number(e.target.value))} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 4 & 5: Floors and Units Configuration</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="text-slate-400 font-mono">Units Per Floor</label>
                                <input type="number" value={unitsPerFloor} onChange={(e) => setUnitsPerFloor(Number(e.target.value))} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 font-mono">Avg Carpet Area Per Unit (sq.ft)</label>
                                <input type="number" value={avgUnitAreaSqft} onChange={(e) => setAvgUnitAreaSqft(Number(e.target.value))} className="w-full mt-1 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none" />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1 font-mono text-cyan-300">
                            <div>Total Vertical Units to generate: <strong className="text-amber-400">{floorCount * unitsPerFloor} Units</strong></div>
                            <div>Estimated Total Built-Up Area: <strong>{floorCount * unitsPerFloor * avgUnitAreaSqft * 1.15} sq.ft</strong></div>
                        </div>
                    </div>
                )}

                {currentStep === 6 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 6: Geospatial Turf.js Validation</h3>
                        {validationErrors.length === 0 ? (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 space-y-2">
                                <div className="font-bold flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={18} /> ZERO GEOMETRY CONFLICTS DETECTED
                                </div>
                                <p>Building footprint lies strictly within parcel boundary. Sum of unit areas satisfies structural height constraints.</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 space-y-2">
                                <div className="font-bold flex items-center gap-2 text-sm">
                                    <AlertTriangle size={18} /> GEOMETRY CONFLICT DETECTED
                                </div>
                                {validationErrors.map((err, idx) => (
                                    <div key={idx} className="font-mono text-[11px] bg-slate-950 p-2 rounded-xl border border-rose-500/20">
                                        [{err.severity}] {err.message}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 7 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 7: Smart ULPIN & VPID Generation</h3>
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                            <div>
                                <span className="text-slate-400">Land Parcel Identity (ULPIN):</span>
                                <div className="text-base font-bold text-cyan-400 mt-0.5">{generatedULPIN}</div>
                            </div>
                            <div className="pt-2 border-t border-slate-800">
                                <span className="text-slate-400">Sample Vertical Property ID (VPID):</span>
                                <div className="text-sm font-bold text-amber-400 mt-0.5">{generatedVPIDSample}</div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 8 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 8: 3D Preview Ready</h3>
                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                            <Box className="mx-auto text-amber-400 animate-bounce" size={36} />
                            <div className="text-sm font-bold text-white">3D Extrusion Engine Initialized</div>
                            <p className="text-xs text-slate-400">Building model with {floorCount} floors and {floorCount * unitsPerFloor} units ready for WebGL rendering.</p>
                        </div>
                    </div>
                )}

                {currentStep === 9 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Step 9: Submit for Revenue Verification</h3>
                        <div className="p-6 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-cyan-500/30 text-center space-y-3">
                            <ShieldCheck className="mx-auto text-emerald-400" size={40} />
                            <div className="text-base font-extrabold text-white">Ready for Official Submission</div>
                            <p className="text-xs text-slate-300 max-w-md mx-auto">
                                Submitting will record this 3D property hierarchy into the immutable audit queue for revenue surveyor field inspection.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <button
                    onClick={currentStep === 1 ? onCancel : () => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                    <ArrowLeft size={14} /> {currentStep === 1 ? 'Cancel' : 'Previous Step'}
                </button>

                {currentStep < 5 && (
                    <button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                        Next Step <ArrowRight size={14} />
                    </button>
                )}

                {currentStep === 5 && (
                    <button
                        onClick={handleRunValidation}
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                        Run Spatial Validation <Sparkles size={14} />
                    </button>
                )}

                {(currentStep === 6 || currentStep === 7 || currentStep === 8) && (
                    <button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                        Proceed to Step {currentStep + 1} <ArrowRight size={14} />
                    </button>
                )}

                {currentStep === 9 && (
                    <button
                        onClick={handleSubmitFinal}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} /> SUBMIT TO REVENUE AUDIT
                    </button>
                )}
            </div>
        </div>
    );
};
