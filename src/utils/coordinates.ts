/**
 * OSRS Coordinate Conversion Utilities
 * Extracted and adapted from the original Explv's Map codebase
 */

import { LatLng, Map as LeafletMap, Point } from 'leaflet';
import {
  MAP_HEIGHT_MAX_ZOOM_PX,
  RS_TILE_WIDTH_PX,
  RS_TILE_HEIGHT_PX,
  RS_OFFSET_X,
  RS_OFFSET_Y,
} from './constants';
import { OSRSPosition, OSRSCoordinate, OSRSRegion } from '../types';

/**
 * Convert OSRS coordinates to Leaflet LatLng
 */
export function osrsToLatLng(map: LeafletMap, x: number, y: number): LatLng {
  const pixelX = (x - RS_OFFSET_X) * RS_TILE_WIDTH_PX + RS_TILE_WIDTH_PX / 4;
  const pixelY = MAP_HEIGHT_MAX_ZOOM_PX - (y - RS_OFFSET_Y) * RS_TILE_HEIGHT_PX;

  return map.unproject(new Point(pixelX, pixelY), map.getMaxZoom());
}

/**
 * Convert OSRS coordinates to centered Leaflet LatLng (tile center)
 */
export function osrsToCenterLatLng(map: LeafletMap, x: number, y: number): LatLng {
  return osrsToLatLng(map, x + 0.5, y + 0.5);
}

/**
 * Convert Leaflet LatLng to OSRS coordinates
 */
export function latLngToOsrs(map: LeafletMap, latLng: LatLng, z: number = 0): OSRSPosition {
  const point = map.project(latLng, map.getMaxZoom());

  let y = MAP_HEIGHT_MAX_ZOOM_PX - point.y + RS_TILE_HEIGHT_PX / 4;
  y = Math.round((y - RS_TILE_HEIGHT_PX) / RS_TILE_HEIGHT_PX) + RS_OFFSET_Y;

  const x = Math.round((point.x - RS_TILE_WIDTH_PX) / RS_TILE_WIDTH_PX) + RS_OFFSET_X;

  return { x, y, z };
}

/**
 * Calculate distance between two OSRS positions
 */
export function calculateDistance(pos1: OSRSCoordinate, pos2: OSRSCoordinate): number {
  const diffX = Math.abs(pos1.x - pos2.x);
  const diffY = Math.abs(pos1.y - pos2.y);
  return Math.sqrt(diffX * diffX + diffY * diffY);
}

/**
 * Get region from OSRS coordinates
 */
export function getRegionFromCoordinates(x: number, y: number): OSRSRegion {
  const regionId = (x >> 6) * 256 + (y >> 6);
  return {
    id: regionId,
    x: (regionId >> 8) << 6,
    y: (regionId & 0xff) << 6,
  };
}

/**
 * Get local coordinates within a region (0-63)
 */
export function getLocalCoordinates(x: number, y: number): OSRSCoordinate {
  const region = getRegionFromCoordinates(x, y);
  return {
    x: x - region.x,
    y: y - region.y,
  };
}

/**
 * Convert region ID to base coordinates
 */
export function regionToCoordinates(regionId: number): OSRSCoordinate {
  return {
    x: (regionId >> 8) << 6,
    y: (regionId & 0xff) << 6,
  };
}

/**
 * Check if coordinates are within OSRS world bounds
 */
export function isValidOSRSCoordinate(x: number, y: number): boolean {
  return x >= 1024 && x <= 4224 && y >= 1216 && y <= 12608;
}

/**
 * Clamp coordinates to valid OSRS bounds
 */
export function clampToOSRSBounds(x: number, y: number): OSRSCoordinate {
  return {
    x: Math.max(1024, Math.min(4224, x)),
    y: Math.max(1216, Math.min(12608, y)),
  };
}
