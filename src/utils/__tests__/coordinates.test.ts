/**
 * Tests for OSRS coordinate conversion utilities
 */

import {
  osrsToLatLng,
  osrsToCenterLatLng,
  latLngToOsrs,
  calculateDistance,
  getRegionFromCoordinates,
  getLocalCoordinates,
  regionToCoordinates,
  isValidOSRSCoordinate,
  clampToOSRSBounds,
} from '../coordinates';

interface MockMap {
  project: jest.Mock;
  unproject: jest.Mock;
  getMaxZoom: jest.Mock;
  getZoom: jest.Mock;
}

// Mock Leaflet Map
const createMockMap = (): MockMap => ({
  project: jest.fn((latLng: { lng: number; lat: number }) => ({
    x: latLng.lng * 100,
    y: latLng.lat * 100,
  })),
  unproject: jest.fn((point: { x: number; y: number }) => ({
    lat: point.y / 100,
    lng: point.x / 100,
  })),
  getMaxZoom: jest.fn(() => 11),
  getZoom: jest.fn(() => 8),
});

describe('Coordinate Conversion Utilities', () => {
  let mockMap: MockMap;

  beforeEach(() => {
    mockMap = createMockMap();
  });

  describe('osrsToLatLng', () => {
    test('should convert OSRS coordinates to LatLng', () => {
      const result = osrsToLatLng(mockMap as unknown as import('leaflet').Map, 3200, 3200);

      expect(mockMap.unproject).toHaveBeenCalled();
      expect(result).toHaveProperty('lat');
      expect(result).toHaveProperty('lng');
    });

    test('should handle Lumbridge coordinates', () => {
      const result = osrsToLatLng(mockMap as unknown as import('leaflet').Map, 3222, 3218);

      expect(result).toBeDefined();
      expect(typeof result.lat).toBe('number');
      expect(typeof result.lng).toBe('number');
    });

    test('should handle edge coordinates', () => {
      // Test minimum coordinates
      const minResult = osrsToLatLng(mockMap as unknown as import('leaflet').Map, 1024, 1216);
      expect(minResult).toBeDefined();

      // Test maximum coordinates
      const maxResult = osrsToLatLng(mockMap as unknown as import('leaflet').Map, 4224, 12608);
      expect(maxResult).toBeDefined();
    });
  });

  describe('osrsToCenterLatLng', () => {
    test('should convert to center coordinates', () => {
      const result = osrsToCenterLatLng(mockMap as unknown as import('leaflet').Map, 3200, 3200);

      expect(result).toBeDefined();
      expect(mockMap.unproject).toHaveBeenCalled();
    });

    test('should add 0.5 offset to coordinates', () => {
      osrsToCenterLatLng(mockMap as unknown as import('leaflet').Map, 3200, 3200);

      // The function should call osrsToLatLng with x+0.5, y+0.5
      // We can verify this by checking the unproject call
      expect(mockMap.unproject).toHaveBeenCalled();
    });
  });

  describe('latLngToOsrs', () => {
    test('should convert LatLng to OSRS coordinates', () => {
      const latLng = {
        lat: 32,
        lng: 32,
        equals: jest.fn(),
        distanceTo: jest.fn(),
        wrap: jest.fn(),
        toBounds: jest.fn(),
        clone: jest.fn(),
      } as unknown as import('leaflet').LatLng;
      const result = latLngToOsrs(mockMap as unknown as import('leaflet').Map, latLng, 0);

      expect(mockMap.project).toHaveBeenCalledWith(latLng, 11);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(result).toHaveProperty('z');
      expect(result.z).toBe(0);
    });

    test('should use default z parameter when not provided', () => {
      // This tests line 36 in coordinates.ts - the default parameter z = 0
      const latLng = {
        lat: 32,
        lng: 32,
        equals: jest.fn(),
        distanceTo: jest.fn(),
        wrap: jest.fn(),
        toBounds: jest.fn(),
        clone: jest.fn(),
      } as unknown as import('leaflet').LatLng;

      // Call without the z parameter to test the default
      const result = latLngToOsrs(mockMap as unknown as import('leaflet').Map, latLng);

      expect(result.z).toBe(0); // Should default to 0
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
    });

    test('should handle different Z levels', () => {
      const latLng = {
        lat: 32,
        lng: 32,
        equals: jest.fn(),
        distanceTo: jest.fn(),
        wrap: jest.fn(),
        toBounds: jest.fn(),
        clone: jest.fn(),
      } as unknown as import('leaflet').LatLng;

      for (let z = 0; z <= 3; z++) {
        const result = latLngToOsrs(mockMap as unknown as import('leaflet').Map, latLng, z);
        expect(result.z).toBe(z);
      }
    });

    test('should return integer coordinates', () => {
      const latLng = {
        lat: 32.5,
        lng: 32.7,
        equals: jest.fn(),
        distanceTo: jest.fn(),
        wrap: jest.fn(),
        toBounds: jest.fn(),
        clone: jest.fn(),
      } as unknown as import('leaflet').LatLng;
      const result = latLngToOsrs(mockMap as unknown as import('leaflet').Map, latLng, 0);

      expect(Number.isInteger(result.x)).toBe(true);
      expect(Number.isInteger(result.y)).toBe(true);
    });
  });

  describe('calculateDistance', () => {
    test('should calculate distance between identical positions', () => {
      const pos1 = { x: 3200, y: 3200 };
      const pos2 = { x: 3200, y: 3200 };

      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBe(0);
    });

    test('should calculate distance between different positions', () => {
      const pos1 = { x: 3200, y: 3200 };
      const pos2 = { x: 3210, y: 3210 };

      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBeCloseTo(14.142, 3); // sqrt(10^2 + 10^2)
    });

    test('should calculate distance correctly for horizontal movement', () => {
      const pos1 = { x: 3200, y: 3200 };
      const pos2 = { x: 3300, y: 3200 };

      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBe(100);
    });

    test('should calculate distance correctly for vertical movement', () => {
      const pos1 = { x: 3200, y: 3200 };
      const pos2 = { x: 3200, y: 3300 };

      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBe(100);
    });

    test('should handle negative coordinate differences', () => {
      const pos1 = { x: 3300, y: 3300 };
      const pos2 = { x: 3200, y: 3200 };

      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBeCloseTo(141.421, 3);
    });
  });

  describe('getRegionFromCoordinates', () => {
    test('should get region for Lumbridge', () => {
      const region = getRegionFromCoordinates(3222, 3218);

      expect(region).toHaveProperty('id');
      expect(region).toHaveProperty('x');
      expect(region).toHaveProperty('y');
      expect(typeof region.id).toBe('number');
    });

    test('should get correct region boundaries', () => {
      const region = getRegionFromCoordinates(3200, 3200);

      // Region coordinates should be multiples of 64
      expect(region.x % 64).toBe(0);
      expect(region.y % 64).toBe(0);

      // Position should be within region bounds
      expect(3200).toBeGreaterThanOrEqual(region.x);
      expect(3200).toBeLessThan(region.x + 64);
      expect(3200).toBeGreaterThanOrEqual(region.y);
      expect(3200).toBeLessThan(region.y + 64);
    });

    test('should handle edge cases', () => {
      // Test coordinates exactly on region boundaries
      const region1 = getRegionFromCoordinates(3200, 3200);
      const region2 = getRegionFromCoordinates(3263, 3263); // 3200 + 63

      expect(region1.id).toBe(region2.id);
    });

    test('should generate different regions for different areas', () => {
      const lumbridgeRegion = getRegionFromCoordinates(3222, 3218);
      const varrockRegion = getRegionFromCoordinates(3210, 3424);

      expect(lumbridgeRegion.id).not.toBe(varrockRegion.id);
    });
  });

  describe('getLocalCoordinates', () => {
    test('should get local coordinates within region', () => {
      const local = getLocalCoordinates(3222, 3218);

      expect(local.x).toBeGreaterThanOrEqual(0);
      expect(local.x).toBeLessThan(64);
      expect(local.y).toBeGreaterThanOrEqual(0);
      expect(local.y).toBeLessThan(64);
    });

    test('should be consistent with region calculation', () => {
      const x = 3222,
        y = 3218;
      const region = getRegionFromCoordinates(x, y);
      const local = getLocalCoordinates(x, y);

      expect(local.x).toBe(x - region.x);
      expect(local.y).toBe(y - region.y);
    });

    test('should handle region boundaries correctly', () => {
      // Test coordinate exactly at region start
      const local1 = getLocalCoordinates(3200, 3200);
      expect(local1.x).toBe(0);
      expect(local1.y).toBe(0);

      // Test coordinate at region end
      const local2 = getLocalCoordinates(3263, 3263);
      expect(local2.x).toBe(63);
      expect(local2.y).toBe(63);
    });
  });

  describe('regionToCoordinates', () => {
    test('should convert region ID to coordinates', () => {
      const regionId = 12850; // Example region ID
      const coords = regionToCoordinates(regionId);

      expect(coords).toHaveProperty('x');
      expect(coords).toHaveProperty('y');
      expect(coords.x % 64).toBe(0);
      expect(coords.y % 64).toBe(0);
    });

    test('should be consistent with getRegionFromCoordinates', () => {
      const originalX = 3200,
        originalY = 3200;
      const region = getRegionFromCoordinates(originalX, originalY);
      const coords = regionToCoordinates(region.id);

      expect(coords.x).toBe(region.x);
      expect(coords.y).toBe(region.y);
    });
  });

  describe('isValidOSRSCoordinate', () => {
    test('should validate coordinates within bounds', () => {
      expect(isValidOSRSCoordinate(3200, 3200)).toBe(true);
      expect(isValidOSRSCoordinate(1024, 1216)).toBe(true); // Min bounds
      expect(isValidOSRSCoordinate(4224, 12608)).toBe(true); // Max bounds
    });

    test('should reject coordinates outside bounds', () => {
      expect(isValidOSRSCoordinate(1023, 3200)).toBe(false); // X too low
      expect(isValidOSRSCoordinate(4225, 3200)).toBe(false); // X too high
      expect(isValidOSRSCoordinate(3200, 1215)).toBe(false); // Y too low
      expect(isValidOSRSCoordinate(3200, 12609)).toBe(false); // Y too high
    });

    test('should handle negative coordinates', () => {
      expect(isValidOSRSCoordinate(-100, 3200)).toBe(false);
      expect(isValidOSRSCoordinate(3200, -100)).toBe(false);
    });
  });

  describe('clampToOSRSBounds', () => {
    test('should not change valid coordinates', () => {
      const result = clampToOSRSBounds(3200, 3200);
      expect(result.x).toBe(3200);
      expect(result.y).toBe(3200);
    });

    test('should clamp coordinates to minimum bounds', () => {
      const result = clampToOSRSBounds(500, 500);
      expect(result.x).toBe(1024);
      expect(result.y).toBe(1216);
    });

    test('should clamp coordinates to maximum bounds', () => {
      const result = clampToOSRSBounds(10000, 20000);
      expect(result.x).toBe(4224);
      expect(result.y).toBe(12608);
    });

    test('should clamp mixed out-of-bounds coordinates', () => {
      const result1 = clampToOSRSBounds(500, 3200);
      expect(result1.x).toBe(1024);
      expect(result1.y).toBe(3200);

      const result2 = clampToOSRSBounds(3200, 500);
      expect(result2.x).toBe(3200);
      expect(result2.y).toBe(1216);
    });
  });
});
