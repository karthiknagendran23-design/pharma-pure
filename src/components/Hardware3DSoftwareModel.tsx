import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Box, RefreshCw, Sparkles, Layers, Maximize2, Zap } from 'lucide-react';
import { CIPTelemetryFrame } from '../types';

interface Hardware3DSoftwareModelProps {
    telemetry: CIPTelemetryFrame;
    selectedComponent: string | null;
    onSelectComponent: (comp: string) => void;
}

export const Hardware3DSoftwareModel: React.FC<Hardware3DSoftwareModelProps> = ({
    telemetry,
    selectedComponent,
    onSelectComponent,
}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [wireframe, setWireframe] = useState<boolean>(false);
    const [xrayMode, setXrayMode] = useState<boolean>(true);
    const [particlesActive, setParticlesActive] = useState<boolean>(true);

    // Status indicators based on scenario
    const isSprayAbnormal = telemetry.active_scenario === 'SPRAY_BLOCKAGE' || (telemetry.ml_anomaly.anomaly_score > 60 && telemetry.sensors.flow < 130);
    const isPumpAbnormal = telemetry.active_scenario === 'FLOW_STAGNATION' || telemetry.sensors.flow < 60;
    const isOutletAbnormal = telemetry.active_scenario === 'SLOW_CLEARANCE' || telemetry.sensors.toc > 250;
    const isDeadLegAbnormal = telemetry.active_scenario === 'MULTI_ANOMALY';

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth || 700;
        const height = container.clientHeight || 500;

        // 1. Scene & Camera Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x070b14);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 4, 18);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;

        // Clear previous children if any
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);

        // 2. Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
        dirLight1.position.set(10, 20, 15);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
        dirLight2.position.set(-10, -10, -10);
        scene.add(dirLight2);

        const pointLight = new THREE.PointLight(isSprayAbnormal ? 0xef4444 : 0x06b6d4, 2, 20);
        pointLight.position.set(0, 3, 0);
        scene.add(pointLight);

        // 3. Materials System
        const vesselMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.85,
            roughness: 0.2,
            transparent: true,
            opacity: xrayMode ? 0.35 : 0.85,
            wireframe: wireframe,
        });

        const steelMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.9,
            roughness: 0.15,
            wireframe: wireframe,
        });

        const sprayMat = new THREE.MeshStandardMaterial({
            color: isSprayAbnormal ? 0xef4444 : 0x38bdf8,
            emissive: isSprayAbnormal ? 0x991b1b : 0x0284c7,
            metalness: 0.5,
            wireframe: wireframe,
        });

        const pumpMat = new THREE.MeshStandardMaterial({
            color: isPumpAbnormal ? 0xef4444 : 0x10b981,
            emissive: isPumpAbnormal ? 0x7f1d1d : 0x047857,
            metalness: 0.7,
            wireframe: wireframe,
        });

        const deadLegMat = new THREE.MeshStandardMaterial({
            color: isDeadLegAbnormal ? 0xef4444 : 0x64748b,
            emissive: isDeadLegAbnormal ? 0x991b1b : 0x000000,
            metalness: 0.6,
            wireframe: wireframe,
        });

        const pipeMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.7,
            wireframe: wireframe,
        });

        const liquidMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.45,
            roughness: 0.1,
        });

        // 4. Group Structure
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        // --- A. Vessel Outer Shell ---
        const vesselGroup = new THREE.Group();
        (vesselGroup as any).userData = { name: 'VESSEL' };

        const cylinderGeo = new THREE.CylinderGeometry(3, 3, 7, 32, 1, true);
        const vesselMesh = new THREE.Mesh(cylinderGeo, vesselMat);
        vesselGroup.add(vesselMesh);

        // Top hemispherical dome
        const topDomeGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const topDome = new THREE.Mesh(topDomeGeo, vesselMat);
        topDome.position.y = 3.5;
        vesselGroup.add(topDome);

        // Bottom discharge cone
        const bottomConeGeo = new THREE.ConeGeometry(3, 2, 32, 1, true);
        const bottomCone = new THREE.Mesh(bottomConeGeo, vesselMat);
        bottomCone.rotation.x = Math.PI;
        bottomCone.position.y = -4.5;
        vesselGroup.add(bottomCone);

        // Internal Fluid Level
        const liquidGeo = new THREE.CylinderGeometry(2.9, 2.9, 3.5, 32);
        const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
        liquidMesh.position.y = -1.5;
        vesselGroup.add(liquidMesh);

        // Supporting Legs
        for (let i = 0; i < 4; i++) {
            const legGeo = new THREE.CylinderGeometry(0.2, 0.25, 4, 16);
            const leg = new THREE.Mesh(legGeo, steelMat);
            const angle = (i * Math.PI) / 2;
            leg.position.set(Math.cos(angle) * 2.8, -6, Math.sin(angle) * 2.8);
            vesselGroup.add(leg);
        }
        modelGroup.add(vesselGroup);

        // --- B. Internal Agitator Impeller ---
        const shaftGroup = new THREE.Group();
        const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 8, 16);
        const shaftMesh = new THREE.Mesh(shaftGeo, steelMat);
        shaftMesh.position.y = 0.5;
        shaftGroup.add(shaftMesh);

        // Impeller Blades
        for (let i = 0; i < 4; i++) {
            const bladeGeo = new THREE.BoxGeometry(1.6, 0.1, 0.4);
            const blade = new THREE.Mesh(bladeGeo, steelMat);
            blade.rotation.y = (i * Math.PI) / 2;
            blade.rotation.z = 0.2;
            blade.position.y = -1.5;
            shaftGroup.add(blade);
        }
        modelGroup.add(shaftGroup);

        // --- C. Spray Ball Assembly ---
        const sprayGroup = new THREE.Group();
        (sprayGroup as any).userData = { name: 'SPRAY_BALL' };

        const sprayPipeGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16);
        const sprayPipe = new THREE.Mesh(sprayPipeGeo, steelMat);
        sprayPipe.position.y = 4.8;
        sprayGroup.add(sprayPipe);

        const spraySphereGeo = new THREE.SphereGeometry(0.6, 24, 24);
        const spraySphere = new THREE.Mesh(spraySphereGeo, sprayMat);
        spraySphere.position.y = 3.3;
        sprayGroup.add(spraySphere);
        modelGroup.add(sprayGroup);

        // Spray Mist Particles
        const particleCount = 180;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities: { x: number; y: number; z: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = 0;
            particlePositions[i * 3 + 1] = 3.3;
            particlePositions[i * 3 + 2] = 0;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 0.05 + Math.random() * 0.04;

            particleVelocities.push({
                x: Math.sin(phi) * Math.cos(theta) * speed,
                y: -Math.abs(Math.cos(phi)) * speed,
                z: Math.sin(phi) * Math.sin(theta) * speed,
            });
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: isSprayAbnormal ? 0xef4444 : 0x38bdf8,
            size: 0.25,
            transparent: true,
            opacity: 0.8,
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        if (particlesActive) modelGroup.add(particleSystem);

        // --- D. Inlet Manifold & Recirculation Pump ---
        const pumpGroup = new THREE.Group();
        (pumpGroup as any).userData = { name: 'PUMP' };

        const pumpBoxGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        const pumpMesh = new THREE.Mesh(pumpBoxGeo, pumpMat);
        pumpMesh.position.set(-6, -3.5, 0);
        pumpGroup.add(pumpMesh);

        const motorGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
        const motorMesh = new THREE.Mesh(motorGeo, steelMat);
        motorMesh.rotation.z = Math.PI / 2;
        motorMesh.position.set(-7.5, -3.5, 0);
        pumpGroup.add(motorMesh);
        modelGroup.add(pumpGroup);

        // Inlet Pipe connecting pump to top spray ball
        const inletCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-6, -2.5, 0),
            new THREE.Vector3(-6, 6, 0),
            new THREE.Vector3(0, 6, 0),
        ]);
        const inletPipeGeo = new THREE.TubeGeometry(inletCurve, 32, 0.35, 12, false);
        const inletPipe = new THREE.Mesh(inletPipeGeo, pipeMat);
        modelGroup.add(inletPipe);

        // --- E. Outlet Manifold & Sensors ---
        const outletGroup = new THREE.Group();
        (outletGroup as any).userData = { name: 'OUTLET' };

        const outletCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -5.5, 0),
            new THREE.Vector3(0, -7.5, 0),
            new THREE.Vector3(5, -7.5, 0),
        ]);
        const outletPipeGeo = new THREE.TubeGeometry(outletCurve, 24, 0.4, 12, false);
        const outletPipe = new THREE.Mesh(outletPipeGeo, pipeMat);
        outletGroup.add(outletPipe);

        // Sensor Housing Block
        const sensorHousingGeo = new THREE.BoxGeometry(1.6, 1.0, 1.0);
        const sensorHousingMat = new THREE.MeshStandardMaterial({
            color: isOutletAbnormal ? 0xf59e0b : 0x0284c7,
            metalness: 0.8,
        });
        const sensorHousing = new THREE.Mesh(sensorHousingGeo, sensorHousingMat);
        sensorHousing.position.set(2.8, -7.5, 0);
        outletGroup.add(sensorHousing);
        modelGroup.add(outletGroup);

        // --- F. Dead-Leg Branch ---
        const deadLegGroup = new THREE.Group();
        (deadLegGroup as any).userData = { name: 'DEAD_LEG' };

        const deadLegCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.0, 0, 0),
            new THREE.Vector3(5.5, 0, 0),
            new THREE.Vector3(5.5, -2.5, 0),
        ]);
        const deadLegPipeGeo = new THREE.TubeGeometry(deadLegCurve, 16, 0.3, 12, false);
        const deadLegPipe = new THREE.Mesh(deadLegPipeGeo, deadLegMat);
        deadLegGroup.add(deadLegPipe);

        // Dead-leg Cap
        const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
        const capMesh = new THREE.Mesh(capGeo, deadLegMat);
        capMesh.position.set(5.5, -2.7, 0);
        deadLegGroup.add(capMesh);
        modelGroup.add(deadLegGroup);

        // 5. Mouse Orbit / Drag Interaction
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            modelGroup.rotation.y += deltaX * 0.008;
            modelGroup.rotation.x += deltaY * 0.008;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        // Raycasting for clicking component selection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onClick = (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(modelGroup.children, true);

            if (intersects.length > 0) {
                let parent: THREE.Object3D | null = intersects[0].object;
                while (parent && !(parent as any).userData?.name) {
                    parent = parent.parent;
                }
                if (parent && (parent as any).userData?.name) {
                    onSelectComponent((parent as any).userData.name);
                }
            }
        };

        const domElement = renderer.domElement;
        domElement.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        domElement.addEventListener('click', onClick);

        // 6. Animation Loop
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Rotate agitator shaft
            shaftGroup.rotation.y += 0.04;

            // Animate Spray Mist Particles
            if (particlesActive && particleSystem) {
                const positions = particleGeo.attributes.position.array as Float32Array;
                for (let i = 0; i < particleCount; i++) {
                    positions[i * 3] += particleVelocities[i].x;
                    positions[i * 3 + 1] += particleVelocities[i].y;
                    positions[i * 3 + 2] += particleVelocities[i].z;

                    // Reset particle if it leaves vessel radius or height
                    if (
                        positions[i * 3 + 1] < -3.5 ||
                        Math.abs(positions[i * 3]) > 2.8 ||
                        Math.abs(positions[i * 3 + 2]) > 2.8
                    ) {
                        positions[i * 3] = 0;
                        positions[i * 3 + 1] = 3.3;
                        positions[i * 3 + 2] = 0;
                    }
                }
                particleGeo.attributes.position.needsUpdate = true;
            }

            // Slow passive auto rotation if not dragging
            if (!isDragging) {
                modelGroup.rotation.y += 0.002;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Clean up
        return () => {
            cancelAnimationFrame(animationFrameId);
            domElement.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            domElement.removeEventListener('click', onClick);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [wireframe, xrayMode, particlesActive, isSprayAbnormal, isPumpAbnormal, isOutletAbnormal, isDeadLegAbnormal]);

    return (
        <div className="relative w-full h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            {/* 3D WebGL Canvas Mounting Container */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Overlay Software Model Controls Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/90 backdrop-blur p-2 rounded-lg border border-slate-800 text-xs shadow-lg">
                <button
                    onClick={() => setWireframe(!wireframe)}
                    className={`px-2.5 py-1 rounded font-semibold flex items-center space-x-1.5 transition-all ${wireframe ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Wireframe CAD</span>
                </button>

                <button
                    onClick={() => setXrayMode(!xrayMode)}
                    className={`px-2.5 py-1 rounded font-semibold flex items-center space-x-1.5 transition-all ${xrayMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    <Eye className="w-3.5 h-3.5" />
                    <span>X-Ray Vessel Shell</span>
                </button>

                <button
                    onClick={() => setParticlesActive(!particlesActive)}
                    className={`px-2.5 py-1 rounded font-semibold flex items-center space-x-1.5 transition-all ${particlesActive ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spray Particles</span>
                </button>
            </div>

            {/* Bottom Floating Hint */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-md border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D SOFTWARE MODEL: Drag mouse to orbit 360° • Click any hardware component to inspect</span>
            </div>

            {/* Selected Component Quick Tag */}
            {selectedComponent && (
                <div className="absolute top-4 right-4 z-10 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 shadow-lg">
                    <Box className="w-4 h-4 text-cyan-400" />
                    <span>SELECTED: {selectedComponent}</span>
                </div>
            )}
        </div>
    );
};
