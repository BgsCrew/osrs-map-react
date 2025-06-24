/**
 * OSRS Map Constants
 * Extracted from the original Explv's Map codebase
 */

// Map dimensions at maximum zoom level (pixels)
export const MAP_HEIGHT_MAX_ZOOM_PX = 364544;
export const MAP_WIDTH_MAX_ZOOM_PX = 104448;

// Tile dimensions in pixels at max zoom
export const RS_TILE_WIDTH_PX = 32;
export const RS_TILE_HEIGHT_PX = 32;

// Coordinate offsets to convert between coordinate systems
export const RS_OFFSET_X = 1024;
export const RS_OFFSET_Y = 6208;

// World boundaries in OSRS coordinates
export const MIN_X = 1024;
export const MAX_X = 4224;
export const MIN_Y = 1216;
export const MAX_Y = 12608;

// Region dimensions (64x64 tiles per region)
export const REGION_WIDTH = 64;
export const REGION_HEIGHT = 64;

// Map configuration
export const DEFAULT_ZOOM = 8;
export const MIN_ZOOM = 4;
export const MAX_ZOOM = 11;

// Tile server URL pattern - plane will be inserted for {z}
export const TILE_SERVER_URL = 'https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/{plane}/{z}/{x}/{y}.png';