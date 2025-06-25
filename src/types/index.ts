/**
 * TypeScript type definitions for React OSRS Map
 */

import React from 'react';

export interface OSRSPosition {
  x: number;
  y: number;
  z: number;
}

export interface OSRSCoordinate {
  x: number;
  y: number;
}

export interface OSRSMarker {
  id: string;
  position: OSRSPosition;
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  popup?: React.ReactNode;
  onClick?: (marker: OSRSMarker) => void;
}

export interface OSRSRegion {
  id: number;
  x: number;
  y: number;
}

export interface OSRSMapProps {
  center?: OSRSCoordinate | [number, number];
  plane?: number;
  zoom?: number;
  markers?: OSRSMarker[];
  onPositionChange?: (position: OSRSPosition) => void;
  onMarkerClick?: (marker: OSRSMarker) => void;
  onMapClick?: (position: OSRSPosition) => void;
  showGrid?: boolean;
  showCoordinates?: boolean;
  showRegionLabels?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
}

export interface OSRSLocation {
  name: string;
  x: number;
  y: number;
  z: number;
  category?: string;
}
