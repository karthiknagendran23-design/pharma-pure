import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
    Bot,
    Activity,
    Zap,
    CheckCircle2,
    AlertTriangle,
    Play,
    Pause,
    RotateCcw,
    Layers,
    Sparkles,
    ShieldCheck
} from 'lucide-react';

export const PharmaDigitalTwin: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [conveyorSpeed, setConveyorSpeed] = useState(25);
    const [defectMode, setDefectMode] = useState<string>('AUTO');

    // Real-time Telemetry State
    const [scannedCount, setScannedCount] = useState(1420);
    const [passedCount, setPassedCount] = useState(1368);
    const [rejectedCount, setRejectedCount] = useState(52);
    const [currentStatus, setCurrentStatus] = useState<'PASS' | 'REJECT'>('PASS');
    const [activeDefectText, setActiveDefectText] = useState<string>('None (Normal Unit)');

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#070a13');
        scene.fog = new THREE.FogExp2('#070a13', 0.008);

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(25, 18, 30);
        camera.lookAt(0, 3, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
        dirLight.position.set(20, 30, 20);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0x10b981, 2, 20);
        pointLight.position.set(0, 7, 0);
        scene.add(pointLight);

        // Grid Floor
        const grid = new THREE.GridHelper(80, 40, 0x0284c7, 0x1e293b);
        scene.add(grid);

        // 1. Conveyor Belt Base
        const beltGeo = new THREE.BoxGeometry(40, 1.2, 8);
        const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.8 });
        const beltMesh = new THREE.Mesh(beltGeo, beltMat);
        beltMesh.position.set(0, 0.6, 0);
        beltMesh.receiveShadow = true;
        scene.add(beltMesh);

        // Conveyor Legs
        for (let x of [-16, -6, 6, 16]) {
            const legGeo = new THREE.CylinderGeometry(0.4, 0.4, 4);
            const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
            const legMesh = new THREE.Mesh(legGeo, legMat);
            legMesh.position.set(x, -1.4, 0);
            scene.add(legMesh);
        }

        // 2. Inspection Camera Gantry Support Frame
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });

        const postLeftGeo = new THREE.BoxGeometry(0.8, 10, 0.8);
        const postLeft = new THREE.Mesh(postLeftGeo, frameMat);
        postLeft.position.set(0, 5, -4.2);
        scene.add(postLeft);

        const postRight = new THREE.Mesh(postLeftGeo, frameMat);
        postRight.position.set(0, 5, 4.2);
        scene.add(postRight);

        const crossBeamGeo = new THREE.BoxGeometry(0.8, 0.8, 9.2);
        const crossBeam = new THREE.Mesh(crossBeamGeo, frameMat);
        crossBeam.position.set(0, 9.6, 0);
        scene.add(crossBeam);

        // 3. 3D Inspection Camera Body
        const camBodyGeo = new THREE.BoxGeometry(2.5, 2.5, 3.5);
        const camBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
        const camBody = new THREE.Mesh(camBodyGeo, camBodyMat);
        camBody.position.set(0, 7.8, 0);
        scene.add(camBody);

        // Camera Lens
        const lensGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
        const lensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 1, roughness: 0 });
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.position.set(0, 6.4, 0);
        scene.add(lens);

        // 4. 3D Laser Scanner Beam (Cone)
        const scannerGeo = new THREE.ConeGeometry(3.5, 5, 32, 1, true);
        const scannerMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide
        });
        const scannerBeam = new THREE.Mesh(scannerGeo, scannerMat);
        scannerBeam.position.set(0, 4, 0);
        scannerBeam.rotation.x = Math.PI;
        scene.add(scannerBeam);

        // 5. Pneumatic Reject Pusher Arm & Reject Bin
        const pusherArmGeo = new THREE.BoxGeometry(1.2, 1.2, 5);
        const pusherArmMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7 });
        const pusherArm = new THREE.Mesh(pusherArmGeo, pusherArmMat);
        pusherArm.position.set(8, 2, 4);
        scene.add(pusherArm);

        const binGeo = new THREE.BoxGeometry(6, 4, 6);
        const binMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, transparent: true, opacity: 0.85 });
        const binMesh = new THREE.Mesh(binGeo, binMat);
        binMesh.position.set(8, 1.5, -6);
        scene.add(binMesh);

        // 6. Moving 3D Blister Pack Item
        const blisterGeo = new THREE.BoxGeometry(4.5, 0.4, 2.8);
        const blisterMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
        const blisterItem = new THREE.Mesh(blisterGeo, blisterMat);
        blisterItem.position.set(-18, 1.4, 0);
        scene.add(blisterItem);

        // Animation Loop Variables
        let posX = -18;
        let frameId: number;
        let itemStatus: 'PASS' | 'REJECT' = 'PASS';
        let pusherOffset = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (isPlaying) {
                posX += (conveyorSpeed * 0.005);
                if (posX > 18) {
                    posX = -18;
                    // Determine defect state for new item
                    if (defectMode === 'CHIPPED_PILL') {
                        itemStatus = 'REJECT';
                        setActiveDefectText('Chipped/Broken Tablet at Pocket #4');
                    } else if (defectMode === 'MISSING_TABLET') {
                        itemStatus = 'REJECT';
                        setActiveDefectText('Missing Tablet at Pocket #7');
                    } else if (defectMode === 'EXPIRED_LABEL') {
                        itemStatus = 'REJECT';
                        setActiveDefectText('Expired Batch Date (EXP 02/2024)');
                    } else if (defectMode === 'NORMAL') {
                        itemStatus = 'PASS';
                        setActiveDefectText('None (Normal Unit)');
                    } else {
                        // AUTO rotate
                        itemStatus = Math.random() > 0.3 ? 'PASS' : 'REJECT';
                        setActiveDefectText(itemStatus === 'PASS' ? 'None (Normal Unit)' : 'Chipped Pill Detected');
                    }

                    setCurrentStatus(itemStatus);
                    setScannedCount(prev => prev + 1);
                    if (itemStatus === 'PASS') setPassedCount(prev => prev + 1);
                    else setRejectedCount(prev => prev + 1);
                }

                blisterItem.position.x = posX;

                // Laser beam reaction when item is directly under camera (posX near 0)
                if (Math.abs(posX) < 2.5) {
                    if (itemStatus === 'REJECT') {
                        scannerMat.color.setHex(0xef4444); // RED beam
                        pointLight.color.setHex(0xef4444);
                    } else {
                        scannerMat.color.setHex(0x10b981); // GREEN beam
                        pointLight.color.setHex(0x10b981);
                    }
                } else {
                    scannerMat.color.setHex(0x0284c7); // Cyan standby
                    pointLight.color.setHex(0x0284c7);
                }

                // Pneumatic Pusher Arm actuation when rejected item reaches X = 8
                if (itemStatus === 'REJECT' && Math.abs(posX - 8) < 1.5) {
                    pusherArm.position.z = Math.sin((posX - 6.5) * Math.PI / 3) * -3 + 4;
                    blisterItem.position.z = Math.sin((posX - 6.5) * Math.PI / 3) * -4;
                } else {
                    pusherArm.position.z = 4;
                }
            }

            // Gentle scene orbit rotation
            scene.rotation.y += 0.001;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(frameId);
            renderer.dispose();
        };
    }, [isPlaying, conveyorSpeed, defectMode]);

    return (
        <div className="relative w-full h-[calc(100vh-80px)] bg-slate-950 flex flex-col">

            {/* Top Left Digital Twin Telemetry HUD */}
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl border border-slate-800 shadow-2xl space-y-4 max-w-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <Bot className="text-cyan-400 animate-pulse" size={22} />
                        <div>
                            <h3 className="text-base font-extrabold text-white">3D Digital Twin Factory Line</h3>
                            <p className="text-[10px] text-slate-400">Real-time Telemetry & Edge CV Sync</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                        ● LIVE SENSORS
                    </span>
                </div>

                {/* Status Indicator */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold font-mono ${currentStatus === 'PASS'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300 animate-pulse'
                    }`}>
                    <div className="flex items-center gap-2">
                        {currentStatus === 'PASS' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                        <span>3D SCANNER: [{currentStatus}]</span>
                    </div>
                    <span>{currentStatus === 'PASS' ? '99.4%' : 'REJECTED'}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px]">Scanned Items</span>
                        <div className="text-lg font-black text-white">{scannedCount}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px]">Pass Rate Yield</span>
                        <div className="text-lg font-black text-emerald-400">
                            {((passedCount / (scannedCount || 1)) * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* Defect Description Tag */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono">
                    <span className="text-slate-400">Active Defect Tag:</span>
                    <div className="text-amber-400 font-bold mt-0.5">{activeDefectText}</div>
                </div>
            </div>

            {/* Top Right Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-3 max-w-xs">
                <h4 className="text-xs font-extrabold text-white uppercase font-mono tracking-wider">
                    Digital Twin Controls
                </h4>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause Twin' : 'Resume Twin'}
                    </button>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">Conveyor Speed (RPM)</label>
                    <input
                        type="range"
                        min="10"
                        max="60"
                        value={conveyorSpeed}
                        onChange={(e) => setConveyorSpeed(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">Defect Test Injection</label>
                    <select
                        value={defectMode}
                        onChange={(e) => setDefectMode(e.target.value)}
                        className="w-full bg-slate-950 text-xs font-semibold text-cyan-300 px-2.5 py-2 rounded-xl border border-slate-800 outline-none cursor-pointer"
                    >
                        <option value="AUTO">AUTO (Cycle All)</option>
                        <option value="NORMAL">Always Normal (PASS)</option>
                        <option value="CHIPPED_PILL">Inject Chipped Tablet</option>
                        <option value="MISSING_TABLET">Inject Missing Tablet</option>
                        <option value="EXPIRED_LABEL">Inject Expired Label</option>
                    </select>
                </div>
            </div>

            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="w-full h-full cursor-grab" />
        </div>
    );
};
