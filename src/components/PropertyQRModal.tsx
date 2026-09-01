import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Unit, Parcel, Building } from '../types';
import { QrCode, ShieldCheck, Download, Share2, CheckCircle2, Building2, MapPin } from 'lucide-react';

interface PropertyQRModalProps {
    unit: Unit;
    parcel?: Parcel;
    building?: Building;
    onClose: () => void;
}

export const PropertyQRModal: React.FC<PropertyQRModalProps> = ({
    unit,
    parcel,
    building,
    onClose
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const qrData = JSON.stringify({
                vpid: unit.unitUid,
                parcel: parcel?.parcelUid || 'TN-CHN-TRP-00018427',
                unitNumber: unit.unitNumber,
                area: `${unit.areaSqft} sqft`,
                status: 'VERIFIED_DPI_RECORD',
                verifyUrl: `https://bhumi3d.gov.in/verify/${unit.unitUid}`
            });

            QRCode.toCanvas(canvasRef.current, qrData, {
                width: 180,
                margin: 2,
                color: {
                    dark: '#0f172a',
                    light: '#ffffff'
                }
            });
        }
    }, [unit, parcel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                        <QrCode className="text-cyan-400" size={22} />
                        <div>
                            <h3 className="text-base font-extrabold text-white">Digital Property Passport</h3>
                            <p className="text-[11px] text-slate-400">BHUMI3D Verifiable QR Credentials</p>
                        </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold">
                        <ShieldCheck size={12} /> Verified DPI Record
                    </span>
                </div>

                {/* Passport Card Content */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 text-center shadow-inner">
                    <div className="inline-block bg-white p-3 rounded-2xl shadow-xl border-4 border-cyan-500/30">
                        <canvas ref={canvasRef} className="rounded-lg" />
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-mono">Vertical Property Identity (VPID)</div>
                        <div className="text-sm font-black text-white font-mono break-all">{unit.unitUid}</div>
                    </div>

                    {/* Details Summary */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-left pt-3 border-t border-slate-800/80">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                            <div className="text-slate-400 text-[10px]">Land Parcel ID</div>
                            <div className="font-mono text-cyan-300 font-bold text-xs truncate">{parcel?.parcelUid || 'TN-CHN-TRP-00018427'}</div>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                            <div className="text-slate-400 text-[10px]">Unit Designation</div>
                            <div className="font-bold text-white text-xs">{unit.unitNumber} ({unit.unitType})</div>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                            <div className="text-slate-400 text-[10px]">Carpet Area</div>
                            <div className="font-mono text-amber-400 font-bold text-xs">{unit.areaSqft} sq.ft</div>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                            <div className="text-slate-400 text-[10px]">Masked Owner</div>
                            <div className="font-bold text-slate-200 text-xs">{unit.ownerNameMasked}</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                    >
                        Close Passport
                    </button>
                </div>
            </div>
        </div>
    );
};
