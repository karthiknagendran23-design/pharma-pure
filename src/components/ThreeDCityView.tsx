import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Parcel, Building } from '../types';
import { Boxes, Sparkles, Filter, Info, Eye } from 'lucide-react';

interface ThreeDCityViewProps {
    parcels: Parcel[];
    buildings: Building[];
    onSelectBuilding: (parcelId: string, buildingId: string) => void;
}

export const ThreeDCityView: React.FC<ThreeDCityViewProps> = ({
    parcels,
    buildings,
    onSelectBuilding
}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [filterType, setFilterType] = useState<string>('ALL');

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#050811');
        scene.fog = new THREE.FogExp2('#050811', 0.005);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(80, 70, 100);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(100, 150, 100);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Ground Grid
        const grid = new THREE.GridHelper(200, 40, 0x0284c7, 0x1e293b);
        scene.add(grid);

        // Render City Buildings
        const cityGroup = new THREE.Group();
        scene.add(cityGroup);

        parcels.forEach((parcel, idx) => {
            const pBuildings = buildings.filter(b => b.parcelId === parcel.id);

            const gridX = ((idx % 4) - 1.5) * 40;
            const gridZ = (Math.floor(idx / 4) - 1) * 40;

            // Parcel Ground Patch
            const patchGeo = new THREE.BoxGeometry(32, 0.2, 32);
            const patchMat = new THREE.MeshStandardMaterial({
                color: parcel.status === 'Approved' ? 0x0f172a : 0x1e293b,
                metalness: 0.1,
                roughness: 0.8
            });
            const patchMesh = new THREE.Mesh(patchGeo, patchMat);
            patchMesh.position.set(gridX, 0, gridZ);
            cityGroup.add(patchMesh);

            pBuildings.forEach((bldg) => {
                if (filterType !== 'ALL' && bldg.buildingType !== filterType) return;

                const height = bldg.floorCount * 2.5;
                const bldgGeo = new THREE.BoxGeometry(16, height, 16);

                let bColor = 0x3b82f6; // default blue
                if (bldg.floorCount >= 10) bColor = 0xef4444; // high rise red
                else if (bldg.floorCount >= 5) bColor = 0xf59e0b; // med rise amber

                const bldgMat = new THREE.MeshStandardMaterial({
                    color: bColor,
                    metalness: 0.3,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.9
                });
                const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
                bldgMesh.position.set(gridX, height / 2 + 0.1, gridZ);
                bldgMesh.castShadow = true;
                bldgMesh.userData = { parcelId: parcel.id, buildingId: bldg.id };

                cityGroup.add(bldgMesh);
            });
        });

        // Orbit loop
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            cityGroup.rotation.y += 0.002;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            renderer.dispose();
        };
    }, [parcels, buildings, filterType]);

    return (
        <div className="relative w-full h-[calc(100vh-80px)] bg-slate-950 flex flex-col">
            {/* Top Header Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-2 max-w-sm">
                <div className="flex items-center gap-2">
                    <Boxes className="text-cyan-400" size={20} />
                    <h3 className="text-base font-extrabold text-white">3D City Model</h3>
                </div>
                <p className="text-xs text-slate-400">
                    Simultaneous multi-building spatial visualization showing urban building height density across parcel footprints.
                </p>

                <div className="pt-2 flex items-center gap-2">
                    <Filter size={14} className="text-slate-400" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-950 text-xs font-semibold text-cyan-400 px-3 py-1.5 rounded-xl border border-slate-800 outline-none cursor-pointer"
                    >
                        <option value="ALL">All Building Types</option>
                        <option value="Apartment">Apartments</option>
                        <option value="Commercial Complex">Commercial Complexes</option>
                        <option value="Mixed Use Tower">Mixed Use Towers</option>
                        <option value="IT Park">IT Parks</option>
                    </select>
                </div>
            </div>

            <div ref={mountRef} className="w-full h-full cursor-grab" />
        </div>
    );
};
