/**
 * OSRS Marker Component
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { OSRSMarker as OSRSMarkerType } from '../types';

interface OSRSMarkerProps {
  marker: OSRSMarkerType;
  latLng: L.LatLng;
}

const defaultIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/Explv/explv.github.io/master/css/images/marker-icon.png',
  shadowUrl: 'https://raw.githubusercontent.com/Explv/explv.github.io/master/css/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const createColoredIcon = (color: string) => new DivIcon({
  className: 'osrs-marker',
  html: `<div style="
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${color};
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export const OSRSMarker: React.FC<OSRSMarkerProps> = ({ marker, latLng }) => {
  const getIcon = () => {
    if (marker.color) {
      return createColoredIcon(marker.color);
    }
    return defaultIcon;
  };

  const handleClick = () => {
    marker.onClick?.(marker);
  };

  return (
    <Marker
      position={latLng}
      icon={getIcon()}
      eventHandlers={{
        click: handleClick
      }}
    >
      {(marker.title || marker.description || marker.popup) && (
        <Popup>
          <div className="osrs-marker-popup">
            {marker.title && <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{marker.title}</h4>}
            {marker.description && <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>{marker.description}</p>}
            <div style={{ fontSize: '11px', color: '#666' }}>
              Position: {marker.position.x}, {marker.position.y}, {marker.position.z}
            </div>
            {marker.popup && <div style={{ marginTop: '8px' }}>{marker.popup}</div>}
          </div>
        </Popup>
      )}
    </Marker>
  );
};