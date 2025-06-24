/**
 * Tests for OSRS constants
 */

import {
  MAP_HEIGHT_MAX_ZOOM_PX,
  MAP_WIDTH_MAX_ZOOM_PX,
  RS_TILE_WIDTH_PX,
  RS_TILE_HEIGHT_PX,
  RS_OFFSET_X,
  RS_OFFSET_Y,
  MIN_X,
  MAX_X,
  MIN_Y,
  MAX_Y,
  REGION_WIDTH,
  REGION_HEIGHT,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  TILE_SERVER_URL
} from '../constants';

describe('OSRS Constants', () => {
  describe('Map Dimensions', () => {
    test('should have correct map dimensions', () => {
      expect(MAP_HEIGHT_MAX_ZOOM_PX).toBe(364544);
      expect(MAP_WIDTH_MAX_ZOOM_PX).toBe(104448);
    });

    test('should have correct tile dimensions', () => {
      expect(RS_TILE_WIDTH_PX).toBe(32);
      expect(RS_TILE_HEIGHT_PX).toBe(32);
    });
  });

  describe('Coordinate Offsets', () => {
    test('should have correct coordinate offsets', () => {
      expect(RS_OFFSET_X).toBe(1024);
      expect(RS_OFFSET_Y).toBe(6208);
    });
  });

  describe('World Boundaries', () => {
    test('should have correct world boundaries', () => {
      expect(MIN_X).toBe(1024);
      expect(MAX_X).toBe(4224);
      expect(MIN_Y).toBe(1216);
      expect(MAX_Y).toBe(12608);
    });

    test('world should have reasonable dimensions', () => {
      const worldWidth = MAX_X - MIN_X;
      const worldHeight = MAX_Y - MIN_Y;
      
      expect(worldWidth).toBeGreaterThan(0);
      expect(worldHeight).toBeGreaterThan(0);
      expect(worldWidth).toBe(3200); // 50 regions * 64 tiles
      expect(worldHeight).toBe(11392); // ~178 regions * 64 tiles
    });
  });

  describe('Region Dimensions', () => {
    test('should have correct region dimensions', () => {
      expect(REGION_WIDTH).toBe(64);
      expect(REGION_HEIGHT).toBe(64);
    });
  });

  describe('Zoom Levels', () => {
    test('should have valid zoom levels', () => {
      expect(MIN_ZOOM).toBe(4);
      expect(MAX_ZOOM).toBe(11);
      expect(DEFAULT_ZOOM).toBe(8);
      
      expect(DEFAULT_ZOOM).toBeGreaterThanOrEqual(MIN_ZOOM);
      expect(DEFAULT_ZOOM).toBeLessThanOrEqual(MAX_ZOOM);
    });
  });

  describe('Tile Server URL', () => {
    test('should have correct tile server URL pattern', () => {
      expect(TILE_SERVER_URL).toBe('https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/{plane}/{z}/{x}/{y}.png');
      expect(TILE_SERVER_URL).toContain('{plane}');
      expect(TILE_SERVER_URL).toContain('{z}');
      expect(TILE_SERVER_URL).toContain('{x}');
      expect(TILE_SERVER_URL).toContain('{y}');
    });
  });
});