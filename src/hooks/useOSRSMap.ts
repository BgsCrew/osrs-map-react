/**
 * Custom hook for OSRS Map functionality
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { Map as LeafletMap, TileLayer } from 'leaflet';
import { OSRSPosition, OSRSCoordinate } from '../types';
import { latLngToOsrs, osrsToLatLng } from '../utils/coordinates';
import { TILE_SERVER_URL } from '../utils/constants';

export interface UseOSRSMapProps {
  map: LeafletMap | null;
  plane: number;
  onPositionChange?: (position: OSRSPosition) => void;
}

export function useOSRSMap({ map, plane, onPositionChange }: UseOSRSMapProps) {
  const [currentPosition, setCurrentPosition] = useState<OSRSPosition | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayer | null>(null);
  const currentTileLayerRef = useRef<TileLayer | null>(null);

  // Update tile layer when plane changes
  useEffect(() => {
    if (!map) return;

    // Remove existing tile layer
    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
      currentTileLayerRef.current = null;
    }

    // Create new tile layer for the current plane
    const newTileLayer = new TileLayer(
      TILE_SERVER_URL.replace('{plane}', plane.toString()),
      {
        minZoom: 4,
        maxZoom: 11,
        attribution: 'OSRS Map Data',
        noWrap: true,
        tms: true
      }
    );

    newTileLayer.addTo(map);
    currentTileLayerRef.current = newTileLayer;
    setTileLayer(newTileLayer);

    return () => {
      if (currentTileLayerRef.current) {
        map.removeLayer(currentTileLayerRef.current);
        currentTileLayerRef.current = null;
      }
    };
  }, [map, plane]);

  // Handle mouse move for position tracking
  const handleMouseMove = useCallback((e: { latlng: L.LatLng }) => {
    if (!map) return;
    
    const position = latLngToOsrs(map, e.latlng, plane);
    setCurrentPosition(position);
    onPositionChange?.(position);
  }, [map, plane, onPositionChange]);

  // Set up mouse move listener
  useEffect(() => {
    if (!map) return;

    map.on('mousemove', handleMouseMove);

    return () => {
      map.off('mousemove', handleMouseMove);
    };
  }, [map, handleMouseMove]);

  // Center map on OSRS coordinates
  const centerOn = useCallback((coordinate: OSRSCoordinate, zoom?: number) => {
    if (!map) return;
    
    const latLng = osrsToLatLng(map, coordinate.x, coordinate.y);
    map.setView(latLng, zoom || map.getZoom());
  }, [map]);

  return {
    currentPosition,
    centerOn,
    tileLayer
  };
}