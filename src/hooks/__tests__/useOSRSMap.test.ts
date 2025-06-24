/**
 * Tests for useOSRSMap hook
 */

import { renderHook, act } from '@testing-library/react';
import { useOSRSMap } from '../useOSRSMap';
import * as coordinateUtils from '../../utils/coordinates';

// Mock Leaflet TileLayer
const mockTileLayer = {
  addTo: jest.fn(),
  remove: jest.fn(),
};

const MockPoint = function (this: { x: number; y: number }, x: number, y: number) {
  this.x = x;
  this.y = y;
};

jest.mock('leaflet', () => ({
  TileLayer: jest.fn(() => mockTileLayer),
  Point: MockPoint,
  Map: jest.fn(),
  CRS: { Simple: {} },
}));

// Mock coordinate utilities to avoid Point constructor issues
jest.spyOn(coordinateUtils, 'osrsToLatLng').mockImplementation(
  (map, x, y) =>
    ({
      lat: y / 100,
      lng: x / 100,
      equals: jest.fn(),
      distanceTo: jest.fn(),
      wrap: jest.fn(),
      toBounds: jest.fn(),
      clone: jest.fn(),
    }) as unknown as import('leaflet').LatLng
);

describe('useOSRSMap Hook', () => {
  const mockMap = {
    removeLayer: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with null current position', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: null,
        plane: 0,
      })
    );

    expect(result.current.currentPosition).toBeNull();
  });

  test('should create tile layer when map and plane are provided', () => {
    const { TileLayer } = jest.requireMock('leaflet');

    renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    expect(TileLayer).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/0/{z}/{x}/{y}.png',
      {
        minZoom: 4,
        maxZoom: 11,
        attribution: 'OSRS Map Data',
        noWrap: true,
        tms: true,
      }
    );
    expect(mockTileLayer.addTo).toHaveBeenCalledWith(mockMap);
  });

  test('should update tile layer when plane changes', () => {
    const { TileLayer } = jest.requireMock('leaflet');
    const { rerender } = renderHook(
      ({ plane }) =>
        useOSRSMap({
          map: mockMap as unknown as import('leaflet').Map,
          plane,
        }),
      { initialProps: { plane: 0 } }
    );

    // Change plane
    rerender({ plane: 1 });

    expect(TileLayer).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/1/{z}/{x}/{y}.png',
      expect.any(Object)
    );
  });

  test('should remove old tile layer when plane changes', () => {
    const { rerender } = renderHook(
      ({ plane }) =>
        useOSRSMap({
          map: mockMap as unknown as import('leaflet').Map,
          plane,
        }),
      { initialProps: { plane: 0 } }
    );

    // Change plane to trigger cleanup
    rerender({ plane: 1 });

    expect(mockMap.removeLayer).toHaveBeenCalled();
  });

  test('should set up mouse move listener', () => {
    renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    expect(mockMap.on).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  test('should clean up mouse move listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    unmount();

    expect(mockMap.off).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  test('should call onPositionChange when mouse moves', () => {
    const mockOnPositionChange = jest.fn();

    renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
        onPositionChange: mockOnPositionChange,
      })
    );

    // Get the mousemove handler
    const mouseMoveHandler = mockMap.on.mock.calls.find((call) => call[0] === 'mousemove')?.[1];

    expect(mouseMoveHandler).toBeDefined();

    // Simulate mouse move event
    act(() => {
      mouseMoveHandler({
        latlng: { lat: 32, lng: 32 },
      });
    });

    expect(mockOnPositionChange).toHaveBeenCalled();
  });

  test('should not crash when onPositionChange is not provided', () => {
    renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    // Get the mousemove handler
    const mouseMoveHandler = mockMap.on.mock.calls.find((call) => call[0] === 'mousemove')?.[1];

    // Should not crash when called without onPositionChange
    expect(() => {
      act(() => {
        mouseMoveHandler({
          latlng: { lat: 32, lng: 32 },
        });
      });
    }).not.toThrow();
  });

  test('should provide centerOn function', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    expect(result.current.centerOn).toBeInstanceOf(Function);
  });

  test('centerOn should call map.setView', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    act(() => {
      result.current.centerOn({ x: 3200, y: 3200 });
    });

    expect(mockMap.setView).toHaveBeenCalled();
  });

  test('centerOn should handle zoom parameter', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    act(() => {
      result.current.centerOn({ x: 3200, y: 3200 }, 10);
    });

    expect(mockMap.setView).toHaveBeenCalledWith(expect.any(Object), 10);
  });

  test('centerOn should use current zoom when zoom not provided', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    act(() => {
      result.current.centerOn({ x: 3200, y: 3200 });
    });

    expect(mockMap.getZoom).toHaveBeenCalled();
    expect(mockMap.setView).toHaveBeenCalledWith(
      expect.any(Object),
      8 // Mock zoom level
    );
  });

  test('should handle null map gracefully', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: null,
        plane: 0,
      })
    );

    // Should not crash
    expect(result.current.currentPosition).toBeNull();
    expect(result.current.centerOn).toBeInstanceOf(Function);
    expect(result.current.tileLayer).toBeNull();

    // centerOn should not crash with null map
    act(() => {
      result.current.centerOn({ x: 3200, y: 3200 });
    });
  });

  test('should handle plane changes with null map', () => {
    const { rerender } = renderHook(
      ({ plane }) =>
        useOSRSMap({
          map: null,
          plane,
        }),
      { initialProps: { plane: 0 } }
    );

    // Should not crash when changing plane with null map
    expect(() => {
      rerender({ plane: 1 });
    }).not.toThrow();
  });

  test('should handle different plane values', () => {
    const { TileLayer } = jest.requireMock('leaflet');

    for (let plane = 0; plane <= 3; plane++) {
      renderHook(() =>
        useOSRSMap({
          map: mockMap as unknown as import('leaflet').Map,
          plane,
        })
      );

      expect(TileLayer).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/${plane}/{z}/{x}/{y}.png`,
        expect.any(Object)
      );
    }
  });

  test('should update current position when mouse moves', () => {
    const { result } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    // Get the mousemove handler
    const mouseMoveHandler = mockMap.on.mock.calls.find((call) => call[0] === 'mousemove')?.[1];

    // Simulate mouse move
    act(() => {
      mouseMoveHandler({
        latlng: { lat: 32, lng: 32 },
      });
    });

    expect(result.current.currentPosition).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
      z: 0,
    });
  });

  test('should use correct plane in position conversion', () => {
    const mockOnPositionChange = jest.fn();

    renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 2,
        onPositionChange: mockOnPositionChange,
      })
    );

    // Get the mousemove handler
    const mouseMoveHandler = mockMap.on.mock.calls.find((call) => call[0] === 'mousemove')?.[1];

    // Simulate mouse move
    act(() => {
      mouseMoveHandler({
        latlng: { lat: 32, lng: 32 },
      });
    });

    expect(mockOnPositionChange).toHaveBeenCalledWith(expect.objectContaining({ z: 2 }));
  });

  test('should clean up tile layer on unmount', () => {
    const { unmount } = renderHook(() =>
      useOSRSMap({
        map: mockMap as unknown as import('leaflet').Map,
        plane: 0,
      })
    );

    unmount();

    expect(mockMap.removeLayer).toHaveBeenCalledWith(mockTileLayer);
  });
});
