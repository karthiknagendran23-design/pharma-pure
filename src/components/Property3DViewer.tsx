import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Parcel, Building, Floor, Unit } from '../types';
import {
    Box,
    Layers,
    Eye,
    Maximize2,
    Sparkles,
    QrCode,
    FileText,
    CheckCircle2,
    RotateCcw,
    Sliders,
    ChevronRight,
    ShieldCheck,
    Zap
} from 'lucide-react';

interface Property3DViewerProps {
    parcel: Parcel;
    building: Building;
    floors: Floor[];
    units: Unit[];
    selectedUnitId: string | null;
    onSelectUnit: (unitId: string | null) => void;
    onGenerateID: (unit: Unit) => void;
    onOpenQR: (unit: Unit) => void;
    onExportPDF: (unit: Unit) => void;
}

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
    parcel,
    building,
    floors,
    units,
    selectedUnitId,
    onSelectUnit,
    onGenerateID,
    onOpenQR,
    onExportPDF
}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const meshesGroupRef = useRef<THREE.Group | null>(null);

    const [isExploded, setIsExploded] = useState(false);
    const [explodedGap, setExplodedGap] = useState(1.5); // vertical multiplier
    const [selectedFloorNum, setSelectedFloorNum] = useState<number | 'ALL'>('ALL');
    const [buildingOpacity, setBuildingOpacity] = useState(0.85);
    const [wireframeMode, setWireframeMode] = useState(false);
    const [isOrbiting, setIsOrbiting] = useState(false);

    const activeUnit = units.find(u => u.id === selectedUnitId) || null;
    const buildingFloors = floors.filter(f => f.buildingId === building.id);

    // Initialize Three.js WebGL Scene
    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#070a12');
        scene.fog = new THREE.FogExp2('#070a12', 0.008);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(45, 45, 65);
        camera.lookAt(0, 15, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(50, 80, 50);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.5);
        scene.add(hemiLight);

        // Ground Grid & Parcel Footprint
        const grid = new THREE.GridHelper(120, 30, 0x0284c7, 0x1e293b);
        grid.position.y = -0.01;
        scene.add(grid);

        // Group for building meshes
        const group = new THREE.Group();
        scene.add(group);
        meshesGroupRef.current = group;

        // Basic Orbit Control emulation via Mouse Drag
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !cameraRef.current) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            const camera = cameraRef.current;
            const radius = camera.position.distanceTo(new THREE.Vector3(0, 15, 0));
            let theta = Math.atan2(camera.position.x, camera.position.z);
            let phi = Math.acos(camera.position.y / radius);

            theta -= deltaX * 0.008;
            phi -= deltaY * 0.008;
            phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi));

            camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
            camera.position.y = radius * Math.cos(phi);
            camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
            camera.lookAt(0, 15, 0);

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const domElem = renderer.domElement;
        domElem.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Animation Loop
        let animFrameId: number;
        const animate = () => {
            animFrameId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animFrameId);
            domElem.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    // Re-build 3D Meshes when building, floors, units, exploded state or floor filter change
    useEffect(() => {
        const group = meshesGroupRef.current;
        if (!group) return;

        // Clear existing meshes
        while (group.children.length > 0) {
            const obj = group.children[0];
            group.remove(obj);
        }

        const floorHeight = 2.4; // 3D height per floor slab
        const floorYOffset = isExploded ? explodedGap : 1.0;

        buildingFloors.forEach((floor) => {
            const fNum = floor.floorNumber;
            if (selectedFloorNum !== 'ALL' && selectedFloorNum !== fNum) return;

            const floorY = fNum * floorHeight * floorYOffset;

            // Floor Base Slab Mesh
            const slabGeometry = new THREE.BoxGeometry(26, 0.4, 18);
            const slabMaterial = new THREE.MeshStandardMaterial({
                color: fNum === 0 ? 0x0284c7 : 0x1e293b,
                metalness: 0.2,
                roughness: 0.5,
                transparent: true,
                opacity: buildingOpacity,
                wireframe: wireframeMode
            });
            const slabMesh = new THREE.Mesh(slabGeometry, slabMaterial);
            slabMesh.position.set(0, floorY, 0);
            slabMesh.receiveShadow = true;
            slabMesh.castShadow = true;
            group.add(slabMesh);

            // Floor Units Box Meshes
            const floorUnits = units.filter(u => u.floorId === floor.id);

            floorUnits.forEach((unit, uIdx) => {
                const uWidth = 5.8;
                const uDepth = 7.5;
                const uHeight = 1.8;

                const col = uIdx % 4;
                const row = Math.floor(uIdx / 4);

                const posX = (col - 1.5) * 6.2;
                const posZ = (row - 0.5) * 8.0;

                const isSelected = unit.id === selectedUnitId;

                const unitGeo = new THREE.BoxGeometry(uWidth, uHeight, uDepth);
                const unitMat = new THREE.MeshStandardMaterial({
                    color: isSelected ? 0x00f3ff : (fNum === 15 ? 0xf59e0b : 0x3b82f6),
                    emissive: isSelected ? 0x00f3ff : 0x000000,
                    emissiveIntensity: isSelected ? 0.6 : 0,
                    transparent: true,
                    opacity: isSelected ? 1.0 : (buildingOpacity * 0.9),
                    wireframe: wireframeMode
                });

                const unitMesh = new THREE.Mesh(unitGeo, unitMat);
                unitMesh.position.set(posX, floorY + uHeight / 2 + 0.2, posZ);
                unitMesh.castShadow = true;
                unitMesh.receiveShadow = true;
                unitMesh.userData = { unitId: unit.id, unitUid: unit.unitUid, floorNumber: fNum };

                group.add(unitMesh);

                // Highlight Edges if selected
                if (isSelected) {
                    const edges = new THREE.EdgesGeometry(unitGeo);
                    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
                    const wireframe = new THREE.LineSegments(edges, lineMat);
                    wireframe.position.copy(unitMesh.position);
                    group.add(wireframe);
                }
            });
        });
    }, [building, floors, units, isExploded, explodedGap, selectedFloorNum, selectedUnitId, buildingOpacity, wireframeMode]);

    // Handle 3D Unit Picking Raycaster Click
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!mountRef.current || !cameraRef.current || !meshesGroupRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

        const intersects = raycaster.intersectObjects(meshesGroupRef.current.children, true);
        if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hit.userData && hit.userData.unitId) {
                onSelectUnit(hit.userData.unitId);
            }
        }
    };

    const handleResetCamera = () => {
        if (cameraRef.current) {
            cameraRef.current.position.set(45, 45, 65);
            cameraRef.current.lookAt(0, 15, 0);
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-80px)] bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
            {/* 3D WebGL Canvas */}
            <div
                ref={mountRef}
                onClick={handleCanvasClick}
                className="w-full lg:flex-1 h-full cursor-grab active:cursor-grabbing z-10"
            />

            {/* Floating 3D Control Bar Overlay (Left Top) */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
                {/* HERO WOW FEATURE #2: EXPLODED 3D VIEW TOGGLE */}
                <button
                    onClick={() => setIsExploded(!isExploded)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all ${isExploded
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-orange-500/20 scale-105'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                        }`}
                >
                    <Layers size={16} /> {isExploded ? 'EXPLODED VIEW ACTIVE' : 'EXPLODE BUILDING FLOORS'}
                </button>

                {isExploded && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">Gap:</span>
                        <input
                            type="range"
                            min="1.1"
                            max="3.0"
                            step="0.1"
                            value={explodedGap}
                            onChange={(e) => setExplodedGap(parseFloat(e.target.value))}
                            className="w-20 accent-amber-500 cursor-pointer"
                        />
                    </div>
                )}

                <button
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${wireframeMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'
                        }`}
                >
                    <Sliders size={14} /> {wireframeMode ? 'X-Ray Active' : 'Wireframe'}
                </button>

                <button
                    onClick={handleResetCamera}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                    title="Reset Camera View"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Vertical Floor Selector Slider Overlay (Left Center) */}
            <div className="absolute top-24 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-2 max-h-[60vh] overflow-y-auto w-44">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Vertical Floor Filter
                </span>
                <button
                    onClick={() => setSelectedFloorNum('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold text-left transition-colors ${selectedFloorNum === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                        }`}
                >
                    Show All Floors ({building.floorCount})
                </button>
                {buildingFloors.slice().reverse().map((fl) => (
                    <button
                        key={fl.id}
                        onClick={() => setSelectedFloorNum(fl.floorNumber)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono text-left flex items-center justify-between transition-colors ${selectedFloorNum === fl.floorNumber ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <span>F{fl.floorNumber < 10 ? '0' + fl.floorNumber : fl.floorNumber}</span>
                        <span className="text-[10px] opacity-75">{fl.unitIds.length} Units</span>
                    </button>
                ))}
            </div>

            {/* Right Sidebar: 2D ↔ 3D Synchronization & Property Passport Panel */}
            <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-20 shadow-2xl overflow-y-auto">
                {/* Hierarchical Trace Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Zap size={14} /> 2D ↔ 3D Cadastral Trace
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                            SYNC ACTIVE
                        </span>
                    </div>

                    {/* Trace Hierarchy Chain */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs font-mono">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span>Unit: {activeUnit ? activeUnit.unitNumber : 'Select 3D Box'}</span>
                        </div>
                        <div className="pl-4 border-l border-slate-800 text-amber-400 flex items-center gap-1">
                            <ChevronRight size={12} />
                            <span>Floor: {activeUnit ? `F${activeUnit.unitUid.split('-F')[1]?.slice(0, 2) || '08'}` : 'F08'}</span>
                        </div>
                        <div className="pl-8 border-l border-slate-800 text-blue-400 flex items-center gap-1">
                            <ChevronRight size={12} />
                            <span>Building: {building.buildingName}</span>
                        </div>
                        <div className="pl-12 border-l border-slate-800 text-slate-300 flex items-center gap-1">
                            <ChevronRight size={12} />
                            <span>Parcel: {parcel.parcelUid}</span>
                        </div>
                    </div>
                </div>

                {/* Selected Unit Details & ULPIN / VPID Passport Actions */}
                {activeUnit ? (
                    <div className="p-5 space-y-5">
                        {/* VPID Header Card */}
                        <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 shadow-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">
                                    Vertical Property Identity (VPID)
                                </span>
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                    <ShieldCheck size={14} /> Turf Verified
                                </span>
                            </div>

                            <div className="text-base font-black text-white font-mono break-all tracking-tight">
                                {activeUnit.unitUid}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Unit Type</div>
                                    <div className="text-xs font-bold text-white">{activeUnit.unitType}</div>
                                </div>
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Carpet Area</div>
                                    <div className="text-xs font-bold text-amber-400 font-mono">{activeUnit.areaSqft} sq.ft</div>
                                </div>
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Occupancy</div>
                                    <div className="text-xs font-bold text-emerald-400">{activeUnit.occupancyStatus}</div>
                                </div>
                                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Masked Owner</div>
                                    <div className="text-xs font-bold text-slate-200">{activeUnit.ownerNameMasked}</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="space-y-2">
                            <button
                                onClick={() => onGenerateID(activeUnit)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> RE-GENERATE SMART PROPERTY ID
                            </button>

                            <button
                                onClick={() => onOpenQR(activeUnit)}
                                className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <QrCode size={16} /> OPEN QR DIGITAL PROPERTY PASSPORT
                            </button>

                            <button
                                onClick={() => onExportPDF(activeUnit)}
                                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
                            >
                                <FileText size={16} /> EXPORT CADASTRAL REPORT (PDF)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-950 text-cyan-400 flex items-center justify-center mx-auto border border-slate-800">
                            <Box size={32} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Click Any 3D Unit Block</h4>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                                Select a 3D unit inside the building model to inspect floor height, carpet area, masked ownership, and generate unique VPID codes.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
