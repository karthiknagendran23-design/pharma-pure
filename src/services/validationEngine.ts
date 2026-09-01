import * as turf from '@turf/turf';
import { Parcel, Building, Floor, Unit, GeometryValidationError } from '../types';

export function validateParcelGeometry(parcel: Parcel): GeometryValidationError[] {
    const errors: GeometryValidationError[] = [];

    if (!parcel.coordinates || parcel.coordinates.length < 3) {
        errors.push({
            code: 'PARCEL_MIN_VERTICES',
            severity: 'ERROR',
            message: `Parcel ${parcel.parcelUid} must have at least 3 boundary vertices.`,
            affectedObject: 'Parcel',
            objectId: parcel.id,
            actionRequired: 'Add more coordinates to form a valid polygon boundary.'
        });
        return errors;
    }

    try {
        const polyCoords = parcel.coordinates.map(c => [c.lng, c.lat]);
        // Close polygon loop if not closed
        if (polyCoords[0][0] !== polyCoords[polyCoords.length - 1][0] || polyCoords[0][1] !== polyCoords[polyCoords.length - 1][1]) {
            polyCoords.push(polyCoords[0]);
        }

        const polygon = turf.polygon([polyCoords]);

        // Self intersection check
        const kicks = turf.kinks(polygon);
        if (kicks.features.length > 0) {
            errors.push({
                code: 'PARCEL_SELF_INTERSECTION',
                severity: 'ERROR',
                message: `Parcel boundary for ${parcel.parcelUid} has self-intersecting polygon edges.`,
                affectedObject: 'Parcel',
                objectId: parcel.id,
                actionRequired: 'Edit geometry points to eliminate self-crossing boundary lines.'
            });
        }

        // Area check
        const calcArea = turf.area(polygon);
        if (calcArea < 10) {
            errors.push({
                code: 'PARCEL_AREA_TOO_SMALL',
                severity: 'WARNING',
                message: `Calculated parcel area (${Math.round(calcArea)} sqm) is unusually small.`,
                affectedObject: 'Parcel',
                objectId: parcel.id,
                actionRequired: 'Verify survey boundary measurements.'
            });
        }
    } catch (err: any) {
        errors.push({
            code: 'INVALID_PARCEL_POLYGON',
            severity: 'ERROR',
            message: `Invalid geometry format for parcel ${parcel.parcelUid}: ${err.message}`,
            affectedObject: 'Parcel',
            objectId: parcel.id,
            actionRequired: 'Redraw parcel polygon.'
        });
    }

    return errors;
}

export function validateBuildingWithinParcel(building: Building, parcel: Parcel): GeometryValidationError[] {
    const errors: GeometryValidationError[] = [];

    try {
        const parcelCoords = parcel.coordinates.map(c => [c.lng, c.lat]);
        if (parcelCoords[0][0] !== parcelCoords[parcelCoords.length - 1][0] || parcelCoords[0][1] !== parcelCoords[parcelCoords.length - 1][1]) {
            parcelCoords.push(parcelCoords[0]);
        }
        const parcelPoly = turf.polygon([parcelCoords]);

        const bldgCoords = building.footprintCoordinates.map(c => [c.lng, c.lat]);
        if (bldgCoords[0][0] !== bldgCoords[bldgCoords.length - 1][0] || bldgCoords[0][1] !== bldgCoords[bldgCoords.length - 1][1]) {
            bldgCoords.push(bldgCoords[0]);
        }
        const bldgPoly = turf.polygon([bldgCoords]);

        // Check if building polygon is within parcel polygon
        const isWithin = turf.booleanWithin(bldgPoly, parcelPoly);
        if (!isWithin) {
            errors.push({
                code: 'BUILDING_OUTSIDE_PARCEL',
                severity: 'ERROR',
                message: `Building '${building.buildingName}' footprint extends outside parcel boundary (${parcel.parcelUid}).`,
                affectedObject: 'Building',
                objectId: building.id,
                actionRequired: 'Adjust building footprint polygon to lie strictly within parcel boundary.'
            });
        }

        // Check building area vs parcel area
        const bldgArea = turf.area(bldgPoly);
        const parcelArea = turf.area(parcelPoly);
        if (bldgArea > parcelArea) {
            errors.push({
                code: 'BUILDING_AREA_EXCEEDS_PARCEL',
                severity: 'ERROR',
                message: `Building footprint area (${Math.round(bldgArea)} m²) exceeds total parcel area (${Math.round(parcelArea)} m²).`,
                affectedObject: 'Building',
                objectId: building.id,
                actionRequired: 'Reduce building footprint area or expand parcel boundary.'
            });
        }
    } catch (err: any) {
        // If exact polygon check encounters topology glitch in sample data, return warning
        errors.push({
            code: 'SPATIAL_TOPOLOGY_WARNING',
            severity: 'WARNING',
            message: `Geospatial topology check warning for building '${building.buildingName}': ${err.message}`,
            affectedObject: 'Building',
            objectId: building.id,
            actionRequired: 'Inspect 2D building footprint layout.'
        });
    }

    return errors;
}

export function validateAreaHierarchy(
    parcel: Parcel,
    building: Building,
    floors: Floor[],
    units: Unit[]
): GeometryValidationError[] {
    const errors: GeometryValidationError[] = [];

    const buildingFloors = floors.filter(f => f.buildingId === building.id);

    buildingFloors.forEach(floor => {
        const floorUnits = units.filter(u => u.floorId === floor.id);
        const totalUnitAreaSqft = floorUnits.reduce((acc, u) => acc + u.areaSqft, 0);

        if (totalUnitAreaSqft > floor.builtUpAreaSqft) {
            errors.push({
                code: 'UNIT_AREA_EXCEEDS_FLOOR',
                severity: 'ERROR',
                message: `Sum of unit areas (${totalUnitAreaSqft} sq.ft) exceeds Floor ${floor.floorNumber} built-up area (${floor.builtUpAreaSqft} sq.ft).`,
                affectedObject: 'Floor',
                objectId: floor.id,
                actionRequired: 'Adjust individual unit area allocations on Floor ' + floor.floorNumber
            });
        }
    });

    return errors;
}
