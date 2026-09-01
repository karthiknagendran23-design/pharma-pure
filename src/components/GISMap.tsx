import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Parcel, Building, Unit } from '../types';
import {
    Layers,
    MapPin,
    Ruler,
    Box,
    CheckCircle2,
    AlertTriangle,
    Info,
    Plus,
    Eye,
    Compass,
    Sparkles,
    Maximize2
} from 'lucide-react';
import * as turf from '@turf/turf';

interface GISMapProps {
    parcels: Parcel[];
    buildings: Building[];
    units: Unit[];
    selectedParcelId: string | null;
    onSelectParcel: (parcelId: string) => void;
    onOpen3DViewer: (parcelId: string, buildingId?: string) => void;
    onDrawNewParcel?: (coordinates: { lat: number; lng: number }[]) => void;
}

export const GISMap: React.FC<GISMapProps> = ({
    parcels,
    buildings,
    units,
    selectedParcelId,
    onSelectParcel,
    onOpen3DViewer,
    onDrawNewParcel
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const polygonLayersGroupRef = useRef<L.LayerGroup | null>(null);

    const [showBuildingsLayer, setShowBuildingsLayer] = useState(true);
    const [showDensityHeatmap, setShowDensityHeatmap] = useState(false);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [drawnPoints, setDrawnPoints] = useState<{ lat: number; lng: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

    const activeParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];
    const activeBuildings = buildings.filter(b => b.parcelId === activeParcel?.id);

    // Initialize Map instance
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [12.9229, 80.1275], // Tambaram, Chennai
                zoom: 16,
                zoomControl: false
            });

            L.control.zoom({ position: 'topright' }).addTo(map);

            // Dark theme OpenStreetMap tiles
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            polygonLayersGroupRef.current = L.layerGroup().addTo(map);
            mapInstanceRef.current = map;
        }

        return () => {
            // Keep map persisted
        };
    }, []);

    // Update Layers & Polygons whenever parcels or selection changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        const group = polygonLayersGroupRef.current;
        if (!map || !group) return;

        group.clearLayers();

        parcels.forEach((parcel) => {
            const latLngs = parcel.coordinates.map(c => [c.lat, c.lng] as [number, number]);
            const isSelected = parcel.id === selectedParcelId;

            let color = '#06b6d4'; // default cyan
            if (parcel.status === 'Field Verified') color = '#f59e0b';
            if (parcel.status === 'Submitted') color = '#3b82f6';
            if (parcel.status === 'Correction Requested') color = '#ef4444';

            const polygon = L.polygon(latLngs, {
                color: isSelected ? '#f59e0b' : color,
                weight: isSelected ? 4 : 2,
                fillColor: color,
                fillOpacity: isSelected ? 0.45 : 0.25,
                dashArray: parcel.status === 'Correction Requested' ? '6, 6' : undefined
            });

            polygon.on('click', () => {
                onSelectParcel(parcel.id);
            });

            // Tooltip label
            polygon.bindTooltip(
                `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #38bdf8;">
           ${parcel.parcelUid}
           <div style="font-size: 9px; color: #94a3b8;">${parcel.landUse} • ${parcel.areaSqm} m²</div>
         </div>`,
                { permanent: false, direction: 'center', className: 'custom-map-tooltip' }
            );

            group.addLayer(polygon);

            // Render Building Footprints if enabled
            if (showBuildingsLayer) {
                const pBuildings = buildings.filter(b => b.parcelId === parcel.id);
                pBuildings.forEach(bldg => {
                    const bldgLatLngs = bldg.footprintCoordinates.map(c => [c.lat, c.lng] as [number, number]);
                    const bldgPoly = L.polygon(bldgLatLngs, {
                        color: '#38bdf8',
                        weight: 1.5,
                        fillColor: bldg.colorHex || '#3b82f6',
                        fillOpacity: 0.6
                    });

                    bldgPoly.bindTooltip(`<b>${bldg.buildingName}</b><br/>Floors: ${bldg.floorCount}`, {
                        direction: 'top'
                    });

                    bldgPoly.on('click', (e) => {
                        L.DomEvent.stopPropagation(e);
                        onSelectParcel(parcel.id);
                        onOpen3DViewer(parcel.id, bldg.id);
                    });

                    group.addLayer(bldgPoly);
                });
            }

            // Vertical Density Heatmap Marker if enabled
            if (showDensityHeatmap) {
                const pBuildings = buildings.filter(b => b.parcelId === parcel.id);
                const maxFloors = pBuildings.reduce((max, b) => Math.max(max, b.floorCount), 0);
                let badgeColor = '#10b981'; // low rise green
                if (maxFloors >= 4 && maxFloors <= 9) badgeColor = '#f59e0b'; // med rise amber
                if (maxFloors >= 10) badgeColor = '#ef4444'; // high rise red

                const circleMarker = L.circleMarker([parcel.center.lat, parcel.center.lng], {
                    radius: 12,
                    fillColor: badgeColor,
                    color: '#ffffff',
                    weight: 2,
                    fillOpacity: 0.85
                });

                circleMarker.bindTooltip(`Density: ${maxFloors || 1} Floors`, { permanent: true, direction: 'top' });
                group.addLayer(circleMarker);
            }
        });

        if (activeParcel && map) {
            map.panTo([activeParcel.center.lat, activeParcel.center.lng]);
        }
    }, [parcels, buildings, selectedParcelId, showBuildingsLayer, showDensityHeatmap]);

    // Click handler for drawing polygon mode
    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (!isDrawingMode) return;
        const newPt = { lat: e.latlng.lat, lng: e.latlng.lng };
        const updated = [...drawnPoints, newPt];
        setDrawnPoints(updated);

        if (updated.length >= 3) {
            // Calculate drawn area using Turf.js
            const polyCoords = updated.map(p => [p.lng, p.lat]);
            polyCoords.push([updated[0].lng, updated[0].lat]);
            const poly = turf.polygon([polyCoords]);
            const area = Math.round(turf.area(poly));
            setMeasuredDistance(area);
        }
    };

    const handleFinishDrawing = () => {
        if (drawnPoints.length >= 3 && onDrawNewParcel) {
            onDrawNewParcel(drawnPoints);
            setIsDrawingMode(false);
            setDrawnPoints([]);
        }
    };

    // Filtered parcels by search query
    const filteredParcels = parcels.filter(p =>
        p.parcelUid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative w-full h-[calc(100vh-80px)] bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Controls & Property Info Panel */}
            <div className="w-full md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl">
                {/* Search Header */}
                <div className="p-4 border-b border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Compass size={14} /> Cadastral Explorer
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                            {parcels.length} Parcels Mapped
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by ULPIN, survey #, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 text-xs text-white placeholder-slate-500 px-3 py-2 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Selected Parcel Property Info Panel */}
                {activeParcel ? (
                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                    Land Parcel Identity
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeParcel.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                                        activeParcel.status === 'Field Verified' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                                    }`}>
                                    {activeParcel.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-base font-extrabold text-white font-mono tracking-tight">{activeParcel.parcelUid}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Survey No: <span className="text-slate-200 font-semibold">{activeParcel.surveyNumber}</span> • {activeParcel.village}, {activeParcel.taluk}
                                </p>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                                    <div className="text-slate-400 text-[10px]">Parcel Area</div>
                                    <div className="text-sm font-bold text-white font-mono">{activeParcel.areaSqm.toLocaleString()} m²</div>
                                </div>
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                                    <div className="text-slate-400 text-[10px]">Land Use</div>
                                    <div className="text-xs font-semibold text-cyan-300">{activeParcel.landUse}</div>
                                </div>
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                                    <div className="text-slate-400 text-[10px]">Buildings On Parcel</div>
                                    <div className="text-sm font-bold text-amber-400 font-mono">{activeBuildings.length}</div>
                                </div>
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                                    <div className="text-slate-400 text-[10px]">Vertical Units</div>
                                    <div className="text-sm font-bold text-emerald-400 font-mono">
                                        {activeBuildings.reduce((sum, b) => sum + (b.floorCount * 8), 0)}
                                    </div>
                                </div>
                            </div>

                            {/* HERO ACTION: View in 3D Property Viewer */}
                            <button
                                onClick={() => onOpen3DViewer(activeParcel.id, activeBuildings[0]?.id)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                <Box size={16} /> VIEW IN 3D PROPERTY VIEWER
                            </button>
                        </div>

                        {/* Buildings List inside Parcel */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Registered Buildings ({activeBuildings.length})
                            </h4>
                            {activeBuildings.length === 0 ? (
                                <div className="p-3 bg-slate-950/60 rounded-xl text-xs text-slate-500 text-center">
                                    No 3D building models registered on this parcel.
                                </div>
                            ) : (
                                activeBuildings.map(bldg => (
                                    <div
                                        key={bldg.id}
                                        onClick={() => onOpen3DViewer(activeParcel.id, bldg.id)}
                                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="text-xs font-bold text-white">{bldg.buildingName}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                {bldg.buildingUid} • {bldg.floorCount} Floors
                                            </div>
                                        </div>
                                        <Eye size={14} className="text-cyan-400" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-slate-500 text-xs">
                        Select a land parcel on the map to view cadastral information.
                    </div>
                )}
            </div>

            {/* Map Viewport */}
            <div className="flex-1 relative h-full">
                <div ref={mapContainerRef} className="w-full h-full z-10" />

                {/* Map Control Bar Overlay */}
                <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
                    <button
                        onClick={() => setShowBuildingsLayer(!showBuildingsLayer)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${showBuildingsLayer ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                            }`}
                    >
                        <Layers size={14} /> 3D Footprints
                    </button>

                    <button
                        onClick={() => setShowDensityHeatmap(!showDensityHeatmap)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${showDensityHeatmap ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                            }`}
                    >
                        <Sparkles size={14} /> Density Heatmap
                    </button>

                    <button
                        onClick={() => setIsDrawingMode(!isDrawingMode)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${isDrawingMode ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
                            }`}
                    >
                        <Plus size={14} /> {isDrawingMode ? 'Drawing Mode Active...' : 'Draw Parcel'}
                    </button>

                    {isDrawingMode && drawnPoints.length >= 3 && (
                        <button
                            onClick={handleFinishDrawing}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                        >
                            Complete Polygon ({measuredDistance} m²)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
