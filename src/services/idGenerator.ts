/**
 * ULPIN & Vertical Property ID (VPID) Configurable Generator Engine
 * 
 * Note: Clearly labeled as "ULPIN-Compatible Prototype Property ID"
 */

export interface IDGeneratorConfig {
    stateCode: string;
    districtCode: string;
    talukCode: string;
    parcelSequence: string;
    buildingCode?: string;
    floorCode?: string;
    unitCode?: string;
}

export function generateSpatialHash(lat: number, lng: number): string {
    // Simulates geohash / spatial encoding string from coordinates
    const latStr = Math.abs(lat).toFixed(4).replace('.', '');
    const lngStr = Math.abs(lng).toFixed(4).replace('.', '');
    const raw = `${latStr}${lngStr}`;
    let hash = '';
    for (let i = 0; i < raw.length; i += 2) {
        const val = parseInt(raw.slice(i, i + 2) || '0', 10);
        hash += String.fromCharCode(65 + (val % 26));
    }
    return hash.slice(0, 6);
}

export function generateParcelULPIN(
    state: string = 'Tamil Nadu',
    district: string = 'Chennai',
    taluk: string = 'Tambaram',
    surveyNumber: string = '184/27',
    center?: { lat: number; lng: number }
): string {
    const stateCode = getStateShortCode(state);
    const distCode = district.slice(0, 3).toUpperCase();
    const talukCode = taluk.slice(0, 3).toUpperCase();

    // Clean survey number
    const surveyClean = surveyNumber.replace(/[^a-zA-Z0-9]/g, '').padStart(6, '0');

    const spatialHash = center ? generateSpatialHash(center.lat, center.lng) : '8427';

    return `${stateCode}-${distCode}-${talukCode}-${surveyClean}${spatialHash.slice(0, 2)}`;
}

export function generateBuildingID(parcelUid: string, buildingIndex: number = 1): string {
    const bIndex = buildingIndex < 10 ? `0${buildingIndex}` : `${buildingIndex}`;
    return `${parcelUid}-B${bIndex}`;
}

export function generateFloorID(buildingUid: string, floorNumber: number): string {
    const fIndex = floorNumber < 10 ? `0${floorNumber}` : `${floorNumber}`;
    return `${buildingUid}-F${fIndex}`;
}

export function generateUnitVPID(floorUid: string, unitNumber: string): string {
    // Format unit number clean e.g., U12 or U8B
    const cleanUnit = unitNumber.startsWith('U') ? unitNumber : `U${unitNumber}`;
    return `${floorUid}-${cleanUnit}`;
}

function getStateShortCode(stateName: string): string {
    const stateMap: Record<string, string> = {
        'Tamil Nadu': 'TN',
        'Karnataka': 'KA',
        'Maharashtra': 'MH',
        'Delhi': 'DL',
        'Telangana': 'TG',
        'Kerala': 'KL',
        'Gujarat': 'GJ'
    };
    return stateMap[stateName] || stateName.slice(0, 2).toUpperCase();
}
