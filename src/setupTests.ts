import '@testing-library/jest-dom';
import React from 'react';

// Mock Leaflet since it requires DOM and canvas contexts
jest.mock('leaflet', () => {
  const MockPoint = function (this: { x: number; y: number }, x: number, y: number) {
    this.x = x;
    this.y = y;
  };

  return {
    Map: jest.fn(() => ({
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
      setView: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
    })),
    TileLayer: jest.fn(() => ({
      addTo: jest.fn(),
      remove: jest.fn(),
    })),
    Icon: jest.fn(),
    DivIcon: jest.fn(),
    Point: MockPoint,
    CRS: {
      Simple: {},
    },
  };
});

interface MockMapContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

interface MockMarkerProps {
  children: React.ReactNode;
  eventHandlers?: { click?: () => void };
}

interface MockPopupProps {
  children: React.ReactNode;
}

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, style, className }: MockMapContainerProps) => {
    // Only pass valid DOM props
    const validProps: { 'data-testid': string; style?: React.CSSProperties; className?: string } = {
      'data-testid': 'map-container',
    };
    if (style) validProps.style = style;
    if (className) validProps.className = className;
    return React.createElement('div', validProps, children);
  },
  Marker: ({ children, eventHandlers }: MockMarkerProps) => {
    // Only pass valid DOM props
    const validProps: { 'data-testid': string; onClick?: () => void } = {
      'data-testid': 'marker',
      onClick: eventHandlers?.click,
    };
    return React.createElement('div', validProps, children);
  },
  Popup: ({ children }: MockPopupProps) =>
    React.createElement('div', { 'data-testid': 'popup' }, children),
  useMap: () => ({
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
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
  }),
}));

// Mock CSS imports
jest.mock('leaflet/dist/leaflet.css', () => ({}));
