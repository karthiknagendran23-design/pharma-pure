import { Parcel, Building, Floor, Unit, AuditLogEntry, PropertyEvent, PropertyOwnershipRecord } from '../types';

// Anchor point: Tambaram, Chennai, Tamil Nadu (12.9229° N, 80.1275° E)
const CHENNAI_CENTER = { lat: 12.9229, lng: 80.1275 };

// Helper to generate polygon offsets
function offsetPoly(center: { lat: number; lng: number }, latOffset: number, lngOffset: number, w: number, h: number) {
    const clat = center.lat + latOffset;
    const clng = center.lng + lngOffset;
    return [
        { lat: clat - h / 2, lng: clng - w / 2 },
        { lat: clat - h / 2, lng: clng + w / 2 },
        { lat: clat + h / 2, lng: clng + w / 2 },
        { lat: clat + h / 2, lng: clng - w / 2 },
    ];
}

// Flagship Parcel: TN-CHN-TRP-00018427 (Chennai Tambaram Tower - 2400 m²)
export const FLAGSHIP_PARCEL_ID = 'p-flagship-01';
export const FLAGSHIP_BUILDING_ID = 'b-flagship-01';

const flagshipCoords = offsetPoly(CHENNAI_CENTER, 0, 0, 0.0006, 0.0004);

export const INITIAL_PARCELS: Parcel[] = [
    {
        id: FLAGSHIP_PARCEL_ID,
        parcelUid: 'TN-CHN-TRP-00018427',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Tambaram East',
        surveyNumber: '184/27A',
        coordinates: flagshipCoords,
        center: CHENNAI_CENTER,
        areaSqm: 2400,
        landUse: 'Residential',
        status: 'Approved',
        buildingIds: [FLAGSHIP_BUILDING_ID],
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-08-20T14:30:00Z'
    },
    {
        id: 'p-02',
        parcelUid: 'TN-CHN-TRP-00018428',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Tambaram West',
        surveyNumber: '184/28B',
        coordinates: offsetPoly(CHENNAI_CENTER, 0.0012, 0.0010, 0.0005, 0.0004),
        center: { lat: CHENNAI_CENTER.lat + 0.0012, lng: CHENNAI_CENTER.lng + 0.0010 },
        areaSqm: 1850,
        landUse: 'Commercial',
        status: 'Approved',
        buildingIds: ['b-02'],
        createdAt: '2026-02-14T09:15:00Z',
        updatedAt: '2026-07-12T11:20:00Z'
    },
    {
        id: 'p-03',
        parcelUid: 'TN-CHN-TRP-00018429',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Selaiyur',
        surveyNumber: '92/4C',
        coordinates: offsetPoly(CHENNAI_CENTER, -0.0015, -0.0012, 0.0007, 0.0005),
        center: { lat: CHENNAI_CENTER.lat - 0.0015, lng: CHENNAI_CENTER.lng - 0.0012 },
        areaSqm: 3200,
        landUse: 'Mixed Use',
        status: 'Field Verified',
        buildingIds: ['b-03a', 'b-03b'],
        createdAt: '2026-03-01T11:00:00Z',
        updatedAt: '2026-08-01T16:45:00Z'
    },
    {
        id: 'p-04',
        parcelUid: 'TN-CHN-TRP-00018430',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Chromepet',
        surveyNumber: '401/1',
        coordinates: offsetPoly(CHENNAI_CENTER, 0.0025, -0.0008, 0.0004, 0.0003),
        center: { lat: CHENNAI_CENTER.lat + 0.0025, lng: CHENNAI_CENTER.lng - 0.0008 },
        areaSqm: 800,
        landUse: 'Residential',
        status: 'Approved',
        buildingIds: ['b-04'],
        createdAt: '2026-03-10T14:20:00Z',
        updatedAt: '2026-06-19T09:10:00Z'
    },
    {
        id: 'p-05',
        parcelUid: 'TN-CHN-TRP-00018431',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Medavakkam',
        surveyNumber: '312/9',
        coordinates: offsetPoly(CHENNAI_CENTER, -0.0022, 0.0020, 0.0008, 0.0006),
        center: { lat: CHENNAI_CENTER.lat - 0.0022, lng: CHENNAI_CENTER.lng + 0.0020 },
        areaSqm: 4500,
        landUse: 'Industrial',
        status: 'Submitted',
        buildingIds: ['b-05'],
        createdAt: '2026-04-05T08:30:00Z',
        updatedAt: '2026-08-28T12:00:00Z'
    },
    {
        id: 'p-06-conflict',
        parcelUid: 'TN-CHN-TRP-00018432-ERR',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Tambaram Sanatorium',
        surveyNumber: '55/12X',
        coordinates: offsetPoly(CHENNAI_CENTER, 0.0008, -0.0022, 0.0003, 0.0003),
        center: { lat: CHENNAI_CENTER.lat + 0.0008, lng: CHENNAI_CENTER.lng - 0.0022 },
        areaSqm: 650,
        landUse: 'Residential',
        status: 'Correction Requested',
        buildingIds: ['b-06-conflict'],
        createdAt: '2026-05-12T16:00:00Z',
        updatedAt: '2026-08-30T10:15:00Z'
    },
    {
        id: 'p-07',
        parcelUid: 'TN-CHN-TRP-00018433',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Mudichur',
        surveyNumber: '110/3',
        coordinates: offsetPoly(CHENNAI_CENTER, 0.0035, 0.0018, 0.0006, 0.0005),
        center: { lat: CHENNAI_CENTER.lat + 0.0035, lng: CHENNAI_CENTER.lng + 0.0018 },
        areaSqm: 2100,
        landUse: 'Institutional',
        status: 'Approved',
        buildingIds: ['b-07'],
        createdAt: '2026-05-20T10:00:00Z',
        updatedAt: '2026-07-25T15:30:00Z'
    },
    {
        id: 'p-08',
        parcelUid: 'TN-CHN-TRP-00018434',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Padappai',
        surveyNumber: '77/1A',
        coordinates: offsetPoly(CHENNAI_CENTER, -0.0038, 0.0005, 0.0009, 0.0007),
        center: { lat: CHENNAI_CENTER.lat - 0.0038, lng: CHENNAI_CENTER.lng + 0.0005 },
        areaSqm: 5800,
        landUse: 'Mixed Use',
        status: 'Approved',
        buildingIds: ['b-08'],
        createdAt: '2026-06-01T09:00:00Z',
        updatedAt: '2026-08-15T11:45:00Z'
    },
    {
        id: 'p-09',
        parcelUid: 'TN-CHN-TRP-00018435',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Vandalur',
        surveyNumber: '215/6',
        coordinates: offsetPoly(CHENNAI_CENTER, 0.0042, -0.0030, 0.0007, 0.0005),
        center: { lat: CHENNAI_CENTER.lat + 0.0042, lng: CHENNAI_CENTER.lng - 0.0030 },
        areaSqm: 2900,
        landUse: 'Residential',
        status: 'Field Verified',
        buildingIds: ['b-09'],
        createdAt: '2026-06-15T11:30:00Z',
        updatedAt: '2026-08-22T14:10:00Z'
    },
    {
        id: 'p-10',
        parcelUid: 'TN-CHN-TRP-00018436',
        state: 'Tamil Nadu',
        district: 'Chennai',
        taluk: 'Tambaram',
        village: 'Perungalathur',
        surveyNumber: '144/8B',
        coordinates: offsetPoly(CHENNAI_CENTER, -0.0010, 0.0032, 0.0006, 0.0004),
        center: { lat: CHENNAI_CENTER.lat - 0.0010, lng: CHENNAI_CENTER.lng + 0.0032 },
        areaSqm: 1950,
        landUse: 'Commercial',
        status: 'Approved',
        buildingIds: ['b-10'],
        createdAt: '2026-07-02T13:40:00Z',
        updatedAt: '2026-08-29T16:00:00Z'
    }
];

// Generates 15 Floors & 120 Units for Flagship Building B01
function generateFlagshipFloorsAndUnits(buildingUid: string, parcelUid: string) {
    const floors: Floor[] = [];
    const units: Unit[] = [];

    const ownerNames = [
        'R**** K*****', 'S**** M*****', 'A**** P*****', 'V**** N*****',
        'K**** T*****', 'M**** S*****', 'D**** R*****', 'P**** V*****'
    ];

    for (let f = 0; f <= 15; f++) {
        const floorId = `f-flagship-${f}`;
        const floorUid = `${buildingUid}-F${f < 10 ? '0' + f : f}`;
        const unitIdsOnFloor: string[] = [];

        // 8 units per floor
        for (let u = 1; u <= 8; u++) {
            const unitLetter = String.fromCharCode(64 + u); // A, B, C...
            const unitNumber = f === 0 ? `G0${u}` : `${f}${unitLetter}`;
            const unitId = `u-flagship-${f}-${u}`;
            const unitUid = `${floorUid}-U${unitNumber}`;
            unitIdsOnFloor.push(unitId);

            const ownerIdx = (f * 8 + u) % ownerNames.length;
            const isCorner = u === 1 || u === 4 || u === 5 || u === 8;

            units.push({
                id: unitId,
                unitUid,
                floorId,
                buildingId: FLAGSHIP_BUILDING_ID,
                parcelId: FLAGSHIP_PARCEL_ID,
                unitNumber,
                unitType: f === 0 ? (u <= 2 ? 'Retail Shop' : 'Apartment') : (f === 15 ? 'Penthouse' : 'Apartment'),
                areaSqft: isCorner ? 1450 : 1240,
                occupancyStatus: (f * 8 + u) % 7 === 0 ? 'Vacant' : 'Occupied',
                ownerNameMasked: ownerNames[ownerIdx],
                ownershipType: 'Individual',
                sharePercentage: 100,
                marketValueEstimateINR: f === 15 ? 14500000 : 8500000 + f * 200000,
                relativeHeightOffset: f * 3.5,
                bounds3D: {
                    x: ((u - 1) % 4) * 8 - 12,
                    y: f * 3.5,
                    z: Math.floor((u - 1) / 4) * 8 - 4,
                    width: 7.5,
                    height: 3.2,
                    depth: 7.5
                }
            });
        }

        floors.push({
            id: floorId,
            floorUid,
            buildingId: FLAGSHIP_BUILDING_ID,
            parcelId: FLAGSHIP_PARCEL_ID,
            floorNumber: f,
            floorName: f === 0 ? 'Ground Floor' : `Floor ${f}`,
            heightMeters: 3.5,
            builtUpAreaSqft: 10500,
            unitIds: unitIdsOnFloor
        });
    }

    return { floors, units };
}

const flagshipData = generateFlagshipFloorsAndUnits('TN-CHN-TRP-00018427-B01', 'TN-CHN-TRP-00018427');

export const INITIAL_BUILDINGS: Building[] = [
    {
        id: FLAGSHIP_BUILDING_ID,
        buildingUid: 'TN-CHN-TRP-00018427-B01',
        parcelId: FLAGSHIP_PARCEL_ID,
        buildingName: 'Bhumi Residency Tower A',
        buildingType: 'Apartment',
        footprintCoordinates: offsetPoly(CHENNAI_CENTER, 0, 0, 0.00035, 0.00025),
        heightMeters: 56.0,
        floorCount: 15,
        constructionYear: 2024,
        status: 'Approved',
        floorIds: flagshipData.floors.map(f => f.id),
        colorHex: '#3b82f6'
    },
    {
        id: 'b-02',
        buildingUid: 'TN-CHN-TRP-00018428-B01',
        parcelId: 'p-02',
        buildingName: 'Tambaram Commercial Plaza',
        buildingType: 'Commercial Complex',
        footprintCoordinates: offsetPoly({ lat: CHENNAI_CENTER.lat + 0.0012, lng: CHENNAI_CENTER.lng + 0.0010 }, 0, 0, 0.0003, 0.0002),
        heightMeters: 28.0,
        floorCount: 7,
        constructionYear: 2023,
        status: 'Approved',
        floorIds: ['f-02-0', 'f-02-1', 'f-02-2', 'f-02-3', 'f-02-4', 'f-02-5', 'f-02-6'],
        colorHex: '#10b981'
    },
    {
        id: 'b-03a',
        buildingUid: 'TN-CHN-TRP-00018429-B01',
        parcelId: 'p-03',
        buildingName: 'Selaiyur Heights Block 1',
        buildingType: 'Mixed Use Tower',
        footprintCoordinates: offsetPoly({ lat: CHENNAI_CENTER.lat - 0.0015, lng: CHENNAI_CENTER.lng - 0.0014 }, 0, 0, 0.00025, 0.0002),
        heightMeters: 36.0,
        floorCount: 9,
        constructionYear: 2025,
        status: 'Field Verified',
        floorIds: ['f-03a-0', 'f-03a-1', 'f-03a-2', 'f-03a-3', 'f-03a-4'],
        colorHex: '#f59e0b'
    },
    {
        id: 'b-03b',
        buildingUid: 'TN-CHN-TRP-00018429-B02',
        parcelId: 'p-03',
        buildingName: 'Selaiyur Heights Block 2',
        buildingType: 'Mixed Use Tower',
        footprintCoordinates: offsetPoly({ lat: CHENNAI_CENTER.lat - 0.0015, lng: CHENNAI_CENTER.lng - 0.0010 }, 0, 0, 0.00025, 0.0002),
        heightMeters: 24.0,
        floorCount: 6,
        constructionYear: 2025,
        status: 'Field Verified',
        floorIds: ['f-03b-0', 'f-03b-1', 'f-03b-2'],
        colorHex: '#8b5cf6'
    },
    {
        id: 'b-04',
        buildingUid: 'TN-CHN-TRP-00018430-B01',
        parcelId: 'p-04',
        buildingName: 'Chromepet Villa',
        buildingType: 'Single Family Residence',
        footprintCoordinates: offsetPoly({ lat: CHENNAI_CENTER.lat + 0.0025, lng: CHENNAI_CENTER.lng - 0.0008 }, 0, 0, 0.0002, 0.00015),
        heightMeters: 9.5,
        floorCount: 2,
        constructionYear: 2021,
        status: 'Approved',
        floorIds: ['f-04-0', 'f-04-1'],
        colorHex: '#ec4899'
    },
    {
        id: 'b-05',
        buildingUid: 'TN-CHN-TRP-00018431-B01',
        parcelId: 'p-05',
        buildingName: 'Medavakkam Tech Park',
        buildingType: 'IT Park',
        footprintCoordinates: offsetPoly({ lat: CHENNAI_CENTER.lat - 0.0022, lng: CHENNAI_CENTER.lng + 0.0020 }, 0, 0, 0.0005, 0.0004),
        heightMeters: 45.0,
        floorCount: 11,
        constructionYear: 2025,
        status: 'Submitted',
        floorIds: ['f-05-0', 'f-05-1'],
        colorHex: '#06b6d4'
    },
    {
        id: 'b-06-conflict',
        buildingUid: 'TN-CHN-TRP-00018432-B01-ERR',
        parcelId: 'p-06-conflict',
        buildingName: 'Sanatorium Complex (Exceeds Footprint)',
        buildingType: 'Apartment',
        footprintCoordinates: offsetPoly({ lat: CHENNAI_CENTER.lat + 0.0008, lng: CHENNAI_CENTER.lng - 0.0022 }, 0, 0, 0.00045, 0.00045), // Bigger than parcel!
        heightMeters: 18.0,
        floorCount: 5,
        constructionYear: 2026,
        status: 'Correction Requested',
        floorIds: ['f-06-0'],
        colorHex: '#ef4444'
    }
];

export const INITIAL_FLOORS: Floor[] = [
    ...flagshipData.floors,
    // Additional floor records for b-02, b-03a, b-04, etc.
    {
        id: 'f-02-0',
        floorUid: 'TN-CHN-TRP-00018428-B01-F00',
        buildingId: 'b-02',
        parcelId: 'p-02',
        floorNumber: 0,
        floorName: 'Ground Floor Commercial',
        heightMeters: 4.0,
        builtUpAreaSqft: 8000,
        unitIds: ['u-02-01', 'u-02-02']
    },
    {
        id: 'f-04-0',
        floorUid: 'TN-CHN-TRP-00018430-B01-F00',
        buildingId: 'b-04',
        parcelId: 'p-04',
        floorNumber: 0,
        floorName: 'Ground Floor Villa',
        heightMeters: 3.5,
        builtUpAreaSqft: 2200,
        unitIds: ['u-04-01']
    }
];

export const INITIAL_UNITS: Unit[] = [
    ...flagshipData.units,
    {
        id: 'u-02-01',
        unitUid: 'TN-CHN-TRP-00018428-B01-F00-U01',
        floorId: 'f-02-0',
        buildingId: 'b-02',
        parcelId: 'p-02',
        unitNumber: 'G01',
        unitType: 'Retail Shop',
        areaSqft: 3500,
        occupancyStatus: 'Leased',
        ownerNameMasked: 'H**** Bank Ltd',
        ownershipType: 'Corporate',
        sharePercentage: 100,
        marketValueEstimateINR: 35000000,
        relativeHeightOffset: 0
    },
    {
        id: 'u-04-01',
        unitUid: 'TN-CHN-TRP-00018430-B01-F00-U01',
        floorId: 'f-04-0',
        buildingId: 'b-04',
        parcelId: 'p-04',
        unitNumber: 'V01',
        unitType: 'Apartment',
        areaSqft: 2200,
        occupancyStatus: 'Occupied',
        ownerNameMasked: 'N**** S*****',
        ownershipType: 'Individual',
        sharePercentage: 100,
        marketValueEstimateINR: 12000000,
        relativeHeightOffset: 0
    }
];

export const INITIAL_PROPERTY_EVENTS: PropertyEvent[] = [
    {
        id: 'pe-01',
        propertyUid: 'TN-CHN-TRP-00018427',
        eventType: 'Parcel Created',
        timestamp: '2026-01-10T10:00:00Z',
        performedBy: 'Senior Surveyor J. Raman',
        details: 'Digital boundary surveyed with DGPS and registered into BHUMI3D Cadastre.'
    },
    {
        id: 'pe-02',
        propertyUid: 'TN-CHN-TRP-00018427-B01',
        eventType: 'Building Added',
        timestamp: '2026-02-15T14:20:00Z',
        performedBy: 'Assistant Surveyor M. Priya',
        details: 'Building footprint Extrusion & 15 floor structure initialized.'
    },
    {
        id: 'pe-03',
        propertyUid: 'TN-CHN-TRP-00018427-B01-F08-U8B',
        eventType: 'Unit Registered',
        timestamp: '2026-03-01T11:05:00Z',
        performedBy: 'Assistant Surveyor M. Priya',
        details: 'Unit 8B assigned area 1240 sq.ft and linked to parent Floor 8.'
    },
    {
        id: 'pe-04',
        propertyUid: 'TN-CHN-TRP-00018427-B01-F08-U8B',
        eventType: 'ID Generated',
        timestamp: '2026-03-01T11:06:00Z',
        performedBy: 'System Engine',
        details: 'Generated prototype ULPIN/VPID: TN-CHN-TRP-00018427-B01-F08-U8B.'
    },
    {
        id: 'pe-05',
        propertyUid: 'TN-CHN-TRP-00018427',
        eventType: 'Approved',
        timestamp: '2026-08-20T14:30:00Z',
        performedBy: 'District Revenue Admin S. Venkatesh',
        details: '3D Cadastral validation passed with 0 geometry conflicts. Property identity verified.'
    }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
    {
        id: 'log-01',
        timestamp: '2026-09-01T14:00:10Z',
        userRole: 'SURVEYOR',
        actorName: 'Surveyor J. Raman',
        action: 'CREATE_PARCEL',
        targetUid: 'TN-CHN-TRP-00018427',
        details: 'Created parcel 184/27A in Tambaram East (2,400 sq.m)',
        ipAddress: '10.14.22.81'
    },
    {
        id: 'log-02',
        timestamp: '2026-09-01T14:02:44Z',
        userRole: 'SURVEYOR',
        actorName: 'Surveyor J. Raman',
        action: 'GENERATE_VPID',
        targetUid: 'TN-CHN-TRP-00018427-B01-F08-U8B',
        details: 'Generated 3D Vertical Property Identity for Floor 8 Unit 8B',
        ipAddress: '10.14.22.81'
    },
    {
        id: 'log-03',
        timestamp: '2026-09-01T14:05:00Z',
        userRole: 'ADMIN',
        actorName: 'Admin S. Venkatesh',
        action: 'APPROVE_PROPERTY',
        targetUid: 'TN-CHN-TRP-00018427',
        details: 'Approved 3D parcel and 120 associated vertical units',
        ipAddress: '10.14.0.12'
    }
];
