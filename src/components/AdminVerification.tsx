import React from 'react';
import { Parcel, Building } from '../types';
import { CheckSquare, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, Box } from 'lucide-react';

interface AdminVerificationProps {
    parcels: Parcel[];
    buildings: Building[];
    onApprove: (parcelId: string) => void;
    onReject: (parcelId: string) => void;
    onRequestCorrection: (parcelId: string) => void;
    onInspect3D: (parcelId: string) => void;
}

export const AdminVerification: React.FC<AdminVerificationProps> = ({
    parcels,
    buildings,
    onApprove,
    onReject,
    onRequestCorrection,
    onInspect3D
}) => {
    return (
        <div className="max-w-6xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <CheckSquare size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-white">Revenue Admin Verification Queue</h2>
                        <p className="text-xs text-slate-400">Review, inspect 3D geometry bounds, and approve field surveyor registrations.</p>
                    </div>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                    {parcels.filter(p => p.status !== 'Approved').length} Items Pending Action
                </span>
            </div>

            {/* Verification Queue Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                        <tr>
                            <th className="p-3.5">Property / ULPIN</th>
                            <th className="p-3.5">Location</th>
                            <th className="p-3.5">Survey #</th>
                            <th className="p-3.5">Geometry Status</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                        {parcels.map((parcel) => {
                            const pBuildings = buildings.filter(b => b.parcelId === parcel.id);
                            const isConflict = parcel.status === 'Correction Requested' || parcel.parcelUid.includes('ERR');

                            return (
                                <tr key={parcel.id} className="hover:bg-slate-900/60 transition-colors">
                                    <td className="p-3.5 font-mono font-bold text-white">
                                        {parcel.parcelUid}
                                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                                            {pBuildings[0]?.buildingName || 'Single Land Plot'}
                                        </div>
                                    </td>
                                    <td className="p-3.5">
                                        {parcel.village}, {parcel.taluk}
                                    </td>
                                    <td className="p-3.5 font-mono text-cyan-300">{parcel.surveyNumber}</td>
                                    <td className="p-3.5">
                                        {isConflict ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                                                <AlertTriangle size={12} /> Conflict Detected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                                                <CheckCircle2 size={12} /> Turf Validated
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3.5">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${parcel.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                                                parcel.status === 'Field Verified' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {parcel.status}
                                        </span>
                                    </td>
                                    <td className="p-3.5 text-right space-x-1.5">
                                        <button
                                            onClick={() => onInspect3D(parcel.id)}
                                            className="px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 font-semibold hover:bg-cyan-600/30 transition-colors"
                                            title="Inspect 3D Model"
                                        >
                                            3D Inspect
                                        </button>
                                        {parcel.status !== 'Approved' && (
                                            <>
                                                <button
                                                    onClick={() => onApprove(parcel.id)}
                                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => onRequestCorrection(parcel.id)}
                                                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                                                >
                                                    Request Correction
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
