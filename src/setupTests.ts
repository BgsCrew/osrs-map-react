import '@testing-library/jest-dom';
import React from 'react';

// Mock Leaflet since it requires DOM and canvas contexts
jest.mock('leaflet', () => {
  const MockPoint = function(this: any, x: number, y: number) {
    this.x = x;
    this.y = y;
  };

  return {
    Map: jest.fn(() => ({
      project: jest.fn((latLng) => ({ x: latLng.lng * 100, y: latLng.lat * 100 })),
      unproject: jest.fn((point, zoom) => ({ lat: point.y / 100, lng: point.x / 100 })),
      getMaxZoom: jest.fn(() => 11),
      getZoom: jest.fn(() => 8),
      setView: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      addLayer: jest.fn(),
      removeLayer: jest.fn()
    })),
    TileLayer: jest.fn(() => ({
      addTo: jest.fn(),
      remove: jest.fn()
    })),
    Icon: jest.fn(),
    DivIcon: jest.fn(),
    Point: MockPoint,
    CRS: {
      Simple: {}
    }
  };
});

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, center, zoom, style, className, ...props }: any) => {
    // Only pass valid DOM props
    const validProps: any = { 'data-testid': 'map-container' };
    if (style) validProps.style = style;
    if (className) validProps.className = className;
    return React.createElement('div', validProps, children);
  },
  Marker: ({ children, position, eventHandlers, ...props }: any) => {
    // Only pass valid DOM props
    const validProps: any = { 
      'data-testid': 'marker',
      onClick: eventHandlers?.click
    };
    return React.createElement('div', validProps, children);
  },
  Popup: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'popup' }, children),
  useMap: () => ({
    project: jest.fn((latLng) => ({ x: latLng.lng * 100, y: latLng.lat * 100 })),
    unproject: jest.fn((point, zoom) => ({ lat: point.y / 100, lng: point.x / 100 })),
    getMaxZoom: jest.fn(() => 11),
    getZoom: jest.fn(() => 8),
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn()
  })
}));

// Mock CSS imports
jest.mock('leaflet/dist/leaflet.css', () => ({}));