import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { RealTimeCIPMonitoring } from './components/RealTimeCIPMonitoring';
import { DigitalTwinViewer } from './components/DigitalTwinViewer';
import { AnomalyIntelligence } from './components/AnomalyIntelligence';
import { PhysicsClearancePanel } from './components/PhysicsClearancePanel';
import { EquipmentHealth } from './components/EquipmentHealth';
import { CIPHistoryComparison } from './components/CIPHistoryComparison';
import { ResourceOptimization } from './components/ResourceOptimization';
import { AlarmCenter } from './components/AlarmCenter';
import { AuditTrailView } from './components/AuditTrailView';
import { SimulationLab } from './components/SimulationLab';
import { PitchModeGuide } from './components/PitchModeGuide';
import { SettingsPanel } from './components/SettingsPanel';

import { NavigationTab, UserRole, ScenarioType, CIPTelemetryFrame, AlarmItem, AuditLogItem, EquipmentAsset, CIPHistoryItem } from './types';
import { api } from './services/api';

export function App() {
    const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
    const [currentRole, setCurrentRole] = useState<UserRole>('PROCESS_ENGINEER');
    const [activeScenario, setActiveScenario] = useState<ScenarioType>('NORMAL');
    const [telemetry, setTelemetry] = useState<CIPTelemetryFrame | null>(null);
    const [alarms, setAlarms] = useState<AlarmItem[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
    const [equipment, setEquipment] = useState<EquipmentAsset[]>([]);
    const [history, setHistory] = useState<CIPHistoryItem[]>([]);

    // Initialize data & live telemetry stream
    useEffect(() => {
        const fetchData = async () => {
            try {
                const eq = await api.getEquipmentAssets();
                setEquipment(eq);
                const al = await api.getAlarms();
                setAlarms(al);
                const au = await api.getAuditLogs();
                setAuditLogs(au);
                const hi = await api.getCIPHistory();
                setHistory(hi);
            } catch (e) {
                console.error('Data fetch error:', e);
            }
        };
        fetchData();

        const unsubscribe = api.subscribeToTelemetry((frame: CIPTelemetryFrame) => {
            setTelemetry(frame);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleAcknowledgeAlarm = async (alarmId: string, role: UserRole) => {
        await api.acknowledgeAlarm(alarmId, role);
        const al = await api.getAlarms();
        setAlarms(al);
        const au = await api.getAuditLogs();
        setAuditLogs(au);
    };

    if (!telemetry) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-mono text-cyan-400">Connecting to CleanOptima Edge Telemetry Gateway...</p>
            </div>
        );
    }

    const activeAlarmsCount = alarms.filter(a => a.status === 'ACTIVE').length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
            {/* Top Fixed Header */}
            <Header
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                activeAlarmsCount={activeAlarmsCount}
                decision={telemetry.decision}
                activeScenario={activeScenario}
            />

            {/* Body: Sidebar + Dynamic Main Content View */}
            <div className="flex flex-1 pt-14">
                {/* Left Fixed Navigation Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    activeAlarmsCount={activeAlarmsCount}
                    anomalyScore={telemetry.ml_anomaly.anomaly_score}
                />

                {/* Main Content Area */}
                <main className="flex-1 ml-64 min-h-[calc(100vh-3.5rem)] bg-slate-950 overflow-y-auto">
                    {activeTab === 'dashboard' && (
                        <ExecutiveDashboard
                            telemetry={telemetry}
                            equipment={equipment}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'live-cip' && (
                        <RealTimeCIPMonitoring telemetry={telemetry} setActiveTab={setActiveTab} />
                    )}

                    {activeTab === 'digital-twin' && (
                        <DigitalTwinViewer telemetry={telemetry} />
                    )}

                    {activeTab === 'anomaly-intel' && (
                        <AnomalyIntelligence telemetry={telemetry} />
                    )}

                    {activeTab === 'physics-clearance' && (
                        <PhysicsClearancePanel telemetry={telemetry} />
                    )}

                    {(activeTab === 'equipment-health' || activeTab === 'equipment') && (
                        <EquipmentHealth equipment={equipment} />
                    )}

                    {activeTab === 'cip-history' && (
                        <CIPHistoryComparison history={history} />
                    )}

                    {activeTab === 'resource-opt' && (
                        <ResourceOptimization />
                    )}

                    {activeTab === 'alarm-center' && (
                        <AlarmCenter
                            alarms={alarms}
                            onAcknowledge={handleAcknowledgeAlarm}
                            currentRole={currentRole}
                        />
                    )}

                    {activeTab === 'audit-trail' && (
                        <AuditTrailView auditLogs={auditLogs} />
                    )}

                    {activeTab === 'simulation-lab' && (
                        <SimulationLab
                            activeScenario={activeScenario}
                            setActiveScenario={setActiveScenario}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {(activeTab === 'pitch-guide' || activeTab === 'pitch-mode') && (
                        <PitchModeGuide
                            setActiveTab={setActiveTab}
                            setActiveScenario={setActiveScenario}
                        />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsPanel />
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
