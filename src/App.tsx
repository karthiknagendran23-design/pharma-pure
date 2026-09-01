import React, { useState } from 'react';
import { UserRole, Parcel, Building, Floor, Unit, AuditLogEntry, PropertyEvent } from './types';
import {
    INITIAL_PARCELS,
    INITIAL_BUILDINGS,
    INITIAL_FLOORS,
    INITIAL_UNITS,
    INITIAL_AUDIT_LOGS,
    FLAGSHIP_PARCEL_ID,
    FLAGSHIP_BUILDING_ID
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { GISMap } from './components/GISMap';
import { Property3DViewer } from './components/Property3DViewer';
import { ThreeDCityView } from './components/ThreeDCityView';
import { PharmaDigitalTwin } from './components/PharmaDigitalTwin';
import { PropertyRegistrationWizard } from './components/PropertyRegistrationWizard';
import { IDGeneratorModal } from './components/IDGeneratorModal';
import { PropertyQRModal } from './components/PropertyQRModal';
import { AdminVerification } from './components/AdminVerification';
import { AuditLogView } from './components/AuditLogView';
import { AIAssistant } from './components/AIAssistant';
import { DemoModeGuide } from './components/DemoModeGuide';
import { exportPropertyPDFReport } from './services/pdfExporter';

export const App: React.FC = () => {
    // Main Navigation & Role State
    const [currentTab, setCurrentTab] = useState<string>('landing');
    const [userRole, setUserRole] = useState<UserRole>('SURVEYOR');

    // Datasets State
    const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);
    const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
    const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
    const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

    // Selection State
    const [selectedParcelId, setSelectedParcelId] = useState<string | null>(FLAGSHIP_PARCEL_ID);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(FLAGSHIP_BUILDING_ID);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>('u-flagship-8-2'); // Unit 8B

    // Modals & Tour State
    const [activeUnitForModal, setActiveUnitForModal] = useState<Unit | null>(null);
    const [showIDModal, setShowIDModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showDemoGuide, setShowDemoGuide] = useState(false);

    // Offline Simulation State
    const [isOffline, setIsOffline] = useState(false);
    const [offlineQueueCount, setOfflineQueueCount] = useState(0);

    // Derived Selection Objects
    const selectedParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];
    const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];
    const selectedUnit = units.find(u => u.id === selectedUnitId) || null;

    // Launch Hero Demo Mode
    const handleLaunchDemo = () => {
        setSelectedParcelId(FLAGSHIP_PARCEL_ID);
        setSelectedBuildingId(FLAGSHIP_BUILDING_ID);
        setSelectedUnitId('u-flagship-8-2'); // Unit 8B
        setCurrentTab('map2d');
        setShowDemoGuide(true);
    };

    // Demo step handler
    const handleDemoStepChange = (stepNum: number) => {
        if (stepNum === 1 || stepNum === 2) {
            setCurrentTab('map2d');
        } else if (stepNum >= 3 && stepNum <= 5) {
            setCurrentTab('3dview');
        } else if (stepNum === 6) {
            setCurrentTab('3dview');
            const unit = units.find(u => u.id === 'u-flagship-8-2') || units[0];
            setActiveUnitForModal(unit);
            setShowIDModal(true);
        } else if (stepNum === 7 || stepNum === 8) {
            setCurrentTab('3dview');
            setShowIDModal(false);
            const unit = units.find(u => u.id === 'u-flagship-8-2') || units[0];
            setActiveUnitForModal(unit);
            setShowQRModal(true);
        } else if (stepNum === 9) {
            setShowQRModal(false);
            setCurrentTab('verification');
        }
    };

    // Add new registered parcel from wizard
    const handleAddNewParcel = (
        newParcel: Parcel,
        newBuilding: Building,
        newFloors: Floor[],
        newUnits: Unit[]
    ) => {
        setParcels(prev => [newParcel, ...prev]);
        setBuildings(prev => [newBuilding, ...prev]);
        setFloors(prev => [...newFloors, ...prev]);
        setUnits(prev => [...newUnits, ...prev]);

        // Log Audit Entry
        const newLog: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userRole,
            actorName: 'Surveyor Field Registration',
            action: 'CREATE_PROPERTY_3D',
            targetUid: newParcel.parcelUid,
            details: `Created 3D property hierarchy with ${newBuilding.floorCount} floors and ${newUnits.length} vertical units.`,
            ipAddress: '10.14.33.102'
        };
        setAuditLogs(prev => [newLog, ...prev]);

        setSelectedParcelId(newParcel.id);
        setSelectedBuildingId(newBuilding.id);
        setCurrentTab('3dview');
    };

    // Admin Verification actions
    const handleApproveParcel = (parcelId: string) => {
        setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, status: 'Approved' } : p));
        const target = parcels.find(p => p.id === parcelId);
        const newLog: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userRole: 'ADMIN',
            actorName: 'District Revenue Officer',
            action: 'APPROVE_PROPERTY',
            targetUid: target?.parcelUid || parcelId,
            details: 'Approved 3D Cadastral Property registration and VPID identities.',
            ipAddress: '10.14.0.12'
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const handleRequestCorrectionParcel = (parcelId: string) => {
        setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, status: 'Correction Requested' } : p));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Top Header */}
            <Navbar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userRole={userRole}
                setUserRole={setUserRole}
                onLaunchDemo={handleLaunchDemo}
                isOffline={isOffline}
                setIsOffline={setIsOffline}
                offlineQueueCount={offlineQueueCount}
            />

            {/* Main View Router */}
            <main className="flex-1">
                {currentTab === 'landing' && (
                    <LandingPage
                        onExploreMap={() => setCurrentTab('map2d')}
                        onLaunchDemo={handleLaunchDemo}
                        onRegister={() => setCurrentTab('register')}
                    />
                )}

                {currentTab === 'dashboard' && (
                    <Dashboard
                        parcels={parcels}
                        buildings={buildings}
                        units={units}
                    />
                )}

                {currentTab === 'map2d' && (
                    <GISMap
                        parcels={parcels}
                        buildings={buildings}
                        units={units}
                        selectedParcelId={selectedParcelId}
                        onSelectParcel={(pId) => setSelectedParcelId(pId)}
                        onOpen3DViewer={(pId, bId) => {
                            setSelectedParcelId(pId);
                            if (bId) setSelectedBuildingId(bId);
                            setCurrentTab('3dview');
                        }}
                    />
                )}

                {currentTab === '3dview' && (
                    <Property3DViewer
                        parcel={selectedParcel}
                        building={selectedBuilding}
                        floors={floors}
                        units={units}
                        selectedUnitId={selectedUnitId}
                        onSelectUnit={(uId) => setSelectedUnitId(uId)}
                        onGenerateID={(u) => {
                            setActiveUnitForModal(u);
                            setShowIDModal(true);
                        }}
                        onOpenQR={(u) => {
                            setActiveUnitForModal(u);
                            setShowQRModal(true);
                        }}
                        onExportPDF={(u) => {
                            exportPropertyPDFReport(u, selectedParcel, selectedBuilding);
                        }}
                    />
                )}

                {currentTab === 'city3d' && (
                    <ThreeDCityView
                        parcels={parcels}
                        buildings={buildings}
                        onSelectBuilding={(pId, bId) => {
                            setSelectedParcelId(pId);
                            setSelectedBuildingId(bId);
                            setCurrentTab('3dview');
                        }}
                    />
                )}

                {currentTab === 'pharma3d' && (
                    <PharmaDigitalTwin />
                )}

                {currentTab === 'register' && (
                    <PropertyRegistrationWizard
                        parcels={parcels}
                        onAddNewParcel={handleAddNewParcel}
                        onCancel={() => setCurrentTab('map2d')}
                    />
                )}

                {currentTab === 'verification' && (
                    <AdminVerification
                        parcels={parcels}
                        buildings={buildings}
                        onApprove={handleApproveParcel}
                        onReject={() => { }}
                        onRequestCorrection={handleRequestCorrectionParcel}
                        onInspect3D={(pId) => {
                            setSelectedParcelId(pId);
                            setCurrentTab('3dview');
                        }}
                    />
                )}

                {currentTab === 'audit' && (
                    <AuditLogView logs={auditLogs} />
                )}

                {currentTab === 'assistant' && (
                    <AIAssistant
                        parcels={parcels}
                        buildings={buildings}
                        units={units}
                    />
                )}
            </main>

            {/* ID Generator Modal */}
            {showIDModal && activeUnitForModal && (
                <IDGeneratorModal
                    unit={activeUnitForModal}
                    onClose={() => setShowIDModal(false)}
                    onOpenQR={(u) => {
                        setActiveUnitForModal(u);
                        setShowQRModal(true);
                    }}
                    onOpen3D={() => setCurrentTab('3dview')}
                />
            )}

            {/* QR Digital Property Passport Modal */}
            {showQRModal && activeUnitForModal && (
                <PropertyQRModal
                    unit={activeUnitForModal}
                    parcel={selectedParcel}
                    building={selectedBuilding}
                    onClose={() => setShowQRModal(false)}
                />
            )}

            {/* Hero Demo Mode Guide Storyteller Overlay */}
            {showDemoGuide && (
                <DemoModeGuide
                    onStepChange={handleDemoStepChange}
                    onClose={() => setShowDemoGuide(false)}
                />
            )}
        </div>
    );
};
