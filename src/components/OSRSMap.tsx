/**
 * Main OSRS Map React Component
 */

import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, useMap } from 'react-leaflet';
import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { OSRSMapProps, OSRSPosition, OSRSCoordinate } from '../types';
import { useOSRSMap } from '../hooks/useOSRSMap';
import { osrsToLatLng, latLngToOsrs } from '../utils/coordinates';
import { DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '../utils/constants';
import { OSRSMarker } from './OSRSMarker';

// Internal component to access the map instance
const MapController: React.FC<{
  center: OSRSCoordinate | [number, number];
  plane: number;
  onPositionChange?: (position: OSRSPosition) => void;
  onMapClick?: (position: OSRSPosition) => void;
  markers?: OSRSMapProps['markers'];
  onMarkerClick?: OSRSMapProps['onMarkerClick'];
}> = ({ center, plane, onPositionChange, onMapClick, markers = [], onMarkerClick }) => {
  const map = useMap();
  const { centerOn } = useOSRSMap({
    map,
    plane,
    onPositionChange
  });

  // Handle map clicks
  useEffect(() => {
    if (!map || !onMapClick) return;

    const handleClick = (e: { latlng: L.LatLng }) => {
      const position = latLngToOsrs(map, e.latlng, plane);
      onMapClick(position);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick, plane]);

  // Center map when center prop changes
  useEffect(() => {
    if (map && center) {
      const coords = Array.isArray(center) ? { x: center[0], y: center[1] } : center;
      centerOn(coords);
    }
  }, [map, center, centerOn]);

  // Render markers
  const renderMarkers = () => {
    if (!map || !markers?.length) return null;

    return markers.map(marker => {
      const latLng = osrsToLatLng(map, marker.position.x, marker.position.y);
      return (
        <OSRSMarker
          key={marker.id}
          marker={{
            ...marker,
            onClick: onMarkerClick || marker.onClick
          }}
          latLng={latLng}
        />
      );
    });
  };

  return <>{renderMarkers()}</>;
};

// Coordinates display overlay
const CoordinatesDisplay: React.FC<{ position: OSRSPosition | null; show: boolean }> = ({ position, show }) => {
  if (!show || !position) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      X: {position.x}, Y: {position.y}, Z: {position.z}
    </div>
  );
};

export const OSRSMap: React.FC<OSRSMapProps> = ({
  center = [3200, 3200],
  plane = 0,
  zoom = DEFAULT_ZOOM,
  markers = [],
  onPositionChange,
  onMarkerClick,
  onMapClick,
  showCoordinates = false,
  className = '',
  style = {},
  width = '100%',
  height = '400px'
}) => {
  const [currentPosition, setCurrentPosition] = useState<OSRSPosition | null>(null);

  const handlePositionChange = useCallback((position: OSRSPosition) => {
    setCurrentPosition(position);
    onPositionChange?.(position);
  }, [onPositionChange]);

  const mapStyle = {
    width,
    height,
    ...style
  };

  // Calculate initial center in LatLng for Leaflet
  const getInitialCenter = (): [number, number] => {
    // We'll use a dummy bounds for initial setup
    // The actual centering will be handled by MapController
    return [0, 0];
  };

  return (
    <div className={`osrs-map-container ${className}`} style={{ position: 'relative', ...mapStyle }}>
      <MapContainer
        center={getInitialCenter()}
        zoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        crs={CRS.Simple}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <MapController
          center={center}
          plane={plane}
          onPositionChange={handlePositionChange}
          onMapClick={onMapClick}
          markers={markers}
          onMarkerClick={onMarkerClick}
        />
      </MapContainer>
      
      <CoordinatesDisplay position={currentPosition} show={showCoordinates} />
      
      {/* Plane indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        Plane: {plane}
      </div>
    </div>
  );
};