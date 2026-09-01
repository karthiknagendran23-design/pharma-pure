export type UserRole = 'CITIZEN' | 'SURVEYOR' | 'ADMIN';

export type PropertyStatus = 'Draft' | 'Submitted' | 'Field Verified' | 'Approved' | 'Rejected' | 'Correction Requested';

export type LandUse = 'Residential' | 'Commercial' | 'Mixed Use' | 'Industrial' | 'Institutional' | 'Agricultural';

export type BuildingType = 'Apartment' | 'Commercial Complex' | 'Mixed Use Tower' | 'Single Family Residence' | 'IT Park';

export type UnitType = 'Apartment' | 'Office' | 'Retail Shop' | 'Penthouse' | 'Basement Parking' | 'Terrace Amenities';

export type OccupancyStatus = 'Occupied' | 'Vacant' | 'Under Construction' | 'Leased';

export type OwnershipType = 'Individual' | 'Joint' | 'Corporate' | 'Government' | 'Leasehold';

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Parcel {
    id: string;
    parcelUid: string; // ULPIN prototype e.g., TN-CHN-TRP-00018427
    state: string;
    district: string;
    taluk: string;
    village: string;
    surveyNumber: string;
    coordinates: Coordinates[]; // Polygon boundary points
    center: Coordinates;
    areaSqm: number; // Parcel area in square meters
    landUse: LandUse;
    status: PropertyStatus;
    buildingIds: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Unit {
    id: string;
    unitUid: string; // VPID e.g., TN-CHN-TRP-00018427-B01-F05-U12
    floorId: string;
    buildingId: string;
    parcelId: string;
    unitNumber: string; // e.g. "8B" or "U12"
    unitType: UnitType;
    areaSqft: number;
    occupancyStatus: OccupancyStatus;
    ownerNameMasked: string; // e.g. "R**** K*****"
    ownershipType: OwnershipType;
    sharePercentage: number;
    marketValueEstimateINR: number;
    relativeHeightOffset: number; // For 3D offset rendering
    bounds3D?: { x: number; y: number; z: number; width: number; height: number; depth: number };
}

export interface Floor {
    id: string;
    floorUid: string; // e.g., TN-CHN-TRP-00018427-B01-F05
    buildingId: string;
    parcelId: string;
    floorNumber: number; // 0 = Ground, 1 = 1st, etc.
    floorName: string; // e.g. "Floor 5" or "Ground Floor"
    heightMeters: number;
    builtUpAreaSqft: number;
    unitIds: string[];
}

export interface Building {
    id: string;
    buildingUid: string; // e.g., TN-CHN-TRP-00018427-B01
    parcelId: string;
    buildingName: string;
    buildingType: BuildingType;
    footprintCoordinates: Coordinates[]; // 2D polygon inside parcel
    heightMeters: number;
    floorCount: number;
    constructionYear: number;
    status: PropertyStatus;
    floorIds: string[];
    colorHex?: string;
}

export interface PropertyOwnershipRecord {
    id: string;
    unitId: string;
    ownerUid: string;
    maskedName: string;
    fullTitleRole: string;
    ownershipType: OwnershipType;
    sharePercentage: number;
    registrationDate: string;
    verificationStatus: 'Verified' | 'Pending' | 'Flagged';
    encumbranceStatus: 'Clear' | 'Mortgaged' | 'Disputed';
}

export interface PropertyEvent {
    id: string;
    propertyUid: string;
    eventType: 'Parcel Created' | 'Building Added' | 'Floor Added' | 'Unit Registered' | 'ID Generated' | 'Submitted Verification' | 'Field Inspected' | 'Approved';
    timestamp: string;
    performedBy: string;
    details: string;
}

export interface GeometryValidationError {
    code: string;
    severity: 'ERROR' | 'WARNING';
    message: string;
    affectedObject: 'Parcel' | 'Building' | 'Floor' | 'Unit';
    objectId: string;
    actionRequired: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userRole: UserRole;
    actorName: string;
    action: string;
    targetUid: string;
    details: string;
    ipAddress?: string;
}

export interface OfflineSyncQueueItem {
    id: string;
    type: 'PARCEL_REGISTRATION' | 'BUILDING_REGISTRATION' | 'VERIFICATION_UPDATE';
    timestamp: string;
    payload: any;
    status: 'PENDING' | 'SYNCED' | 'FAILED';
}
