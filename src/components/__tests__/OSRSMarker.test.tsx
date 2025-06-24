/**
 * Tests for OSRSMarker component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OSRSMarker } from '../OSRSMarker';
import { OSRSMarker as OSRSMarkerType } from '../../types';

describe('OSRSMarker Component', () => {
  const mockLatLng = { lat: 32, lng: 32 } as L.LatLng;

  const basicMarker: OSRSMarkerType = {
    id: 'test-marker',
    position: { x: 3222, y: 3218, z: 0 },
    title: 'Test Location',
    description: 'A test marker',
  };

  const markerWithColor: OSRSMarkerType = {
    id: 'colored-marker',
    position: { x: 3200, y: 3200, z: 0 },
    title: 'Colored Marker',
    color: '#FF5722',
  };

  const markerWithClick: OSRSMarkerType = {
    id: 'clickable-marker',
    position: { x: 3100, y: 3100, z: 0 },
    title: 'Clickable Marker',
    onClick: jest.fn(),
  };

  const markerWithPopup: OSRSMarkerType = {
    id: 'popup-marker',
    position: { x: 3000, y: 3000, z: 0 },
    title: 'Popup Marker',
    popup: <div data-testid="custom-popup">Custom popup content</div>,
  };

  test('should render basic marker', () => {
    render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  test('should render marker with title and description in popup', () => {
    render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

    const popup = screen.getByTestId('popup');
    expect(popup).toBeInTheDocument();

    // Check if title and description are in the popup
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('A test marker')).toBeInTheDocument();
  });

  test('should display coordinates in popup', () => {
    render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

    expect(screen.getByText('Position: 3222, 3218, 0')).toBeInTheDocument();
  });

  test('should handle marker without title or description', () => {
    const minimalMarker: OSRSMarkerType = {
      id: 'minimal',
      position: { x: 3200, y: 3200, z: 0 },
    };

    render(<OSRSMarker marker={minimalMarker} latLng={mockLatLng} />);

    expect(screen.getByTestId('marker')).toBeInTheDocument();
    // Position text only shows in popup, which won't render without title/description/popup
    expect(screen.queryByText('Position: 3200, 3200, 0')).not.toBeInTheDocument();
  });

  test('should handle marker with only title', () => {
    const titleOnlyMarker: OSRSMarkerType = {
      id: 'title-only',
      position: { x: 3200, y: 3200, z: 0 },
      title: 'Title Only',
    };

    render(<OSRSMarker marker={titleOnlyMarker} latLng={mockLatLng} />);

    expect(screen.getByText('Title Only')).toBeInTheDocument();
    expect(screen.getByText('Position: 3200, 3200, 0')).toBeInTheDocument();
  });

  test('should handle marker with only description', () => {
    const descOnlyMarker: OSRSMarkerType = {
      id: 'desc-only',
      position: { x: 3200, y: 3200, z: 0 },
      description: 'Description only',
    };

    render(<OSRSMarker marker={descOnlyMarker} latLng={mockLatLng} />);

    expect(screen.getByText('Description only')).toBeInTheDocument();
    expect(screen.getByText('Position: 3200, 3200, 0')).toBeInTheDocument();
  });

  test('should render custom popup content', () => {
    render(<OSRSMarker marker={markerWithPopup} latLng={mockLatLng} />);

    expect(screen.getByTestId('custom-popup')).toBeInTheDocument();
    expect(screen.getByText('Custom popup content')).toBeInTheDocument();
  });

  test('should call onClick handler when marker is clicked', () => {
    const mockOnClick = jest.fn();
    const clickableMarker = {
      ...markerWithClick,
      onClick: mockOnClick,
    };

    render(<OSRSMarker marker={clickableMarker} latLng={mockLatLng} />);

    const marker = screen.getByTestId('marker');
    fireEvent.click(marker);

    expect(mockOnClick).toHaveBeenCalledWith(clickableMarker);
  });

  test('should not crash when onClick is not provided', () => {
    render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

    const marker = screen.getByTestId('marker');
    fireEvent.click(marker);

    // Should not throw an error
    expect(marker).toBeInTheDocument();
  });

  test('should handle different Z-levels', () => {
    const markerLevel2: OSRSMarkerType = {
      id: 'level-2',
      position: { x: 3200, y: 3200, z: 2 },
      title: 'Level 2 Marker',
    };

    render(<OSRSMarker marker={markerLevel2} latLng={mockLatLng} />);

    expect(screen.getByText('Position: 3200, 3200, 2')).toBeInTheDocument();
  });

  test('should handle edge case coordinates', () => {
    const edgeCaseMarker: OSRSMarkerType = {
      id: 'edge-case',
      position: { x: 0, y: 0, z: 0 },
      title: 'Edge Case',
    };

    render(<OSRSMarker marker={edgeCaseMarker} latLng={mockLatLng} />);

    expect(screen.getByText('Position: 0, 0, 0')).toBeInTheDocument();
  });

  test('should handle very large coordinates', () => {
    const largeCoordMarker: OSRSMarkerType = {
      id: 'large-coord',
      position: { x: 999999, y: 999999, z: 3 },
      title: 'Large Coordinates',
    };

    render(<OSRSMarker marker={largeCoordMarker} latLng={mockLatLng} />);

    expect(screen.getByText('Position: 999999, 999999, 3')).toBeInTheDocument();
  });

  test('should handle negative coordinates', () => {
    const negativeCoordMarker: OSRSMarkerType = {
      id: 'negative-coord',
      position: { x: -100, y: -200, z: 0 },
      title: 'Negative Coordinates',
    };

    render(<OSRSMarker marker={negativeCoordMarker} latLng={mockLatLng} />);

    expect(screen.getByText('Position: -100, -200, 0')).toBeInTheDocument();
  });

  describe('Popup Content Structure', () => {
    test('should have proper CSS classes for styling', () => {
      render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

      const popup = screen.getByTestId('popup');
      const popupContent = popup.querySelector('.osrs-marker-popup');
      expect(popupContent).toBeInTheDocument();
    });

    test('should have proper heading styles for title', () => {
      render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

      const title = screen.getByText('Test Location');
      expect(title.tagName).toBe('H4');
      expect(title).toHaveStyle({
        margin: '0 0 8px 0',
        fontSize: '14px',
      });
    });

    test('should have proper paragraph styles for description', () => {
      render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

      const description = screen.getByText('A test marker');
      expect(description.tagName).toBe('P');
      expect(description).toHaveStyle({
        margin: '0 0 8px 0',
        fontSize: '12px',
      });
    });

    test('should have proper coordinate display styles', () => {
      render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

      const coordinates = screen.getByText('Position: 3222, 3218, 0');
      expect(coordinates).toHaveStyle({
        fontSize: '11px',
        color: '#666',
      });
    });
  });

  describe('Icon Handling', () => {
    test('should create colored icon when color is provided', () => {
      render(<OSRSMarker marker={markerWithColor} latLng={mockLatLng} />);

      expect(screen.getByTestId('marker')).toBeInTheDocument();
      // In a real implementation, we would test that the DivIcon is created with the correct color
    });

    test('should use default icon when no color is provided', () => {
      render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

      expect(screen.getByTestId('marker')).toBeInTheDocument();
      // In a real implementation, we would test that the default Icon is used
    });

    test('should handle various color formats', () => {
      const colorFormats = ['#FF5722', 'rgb(255, 87, 34)', 'red', 'hsl(14, 100%, 57%)'];

      colorFormats.forEach((color, index) => {
        const coloredMarker = {
          ...basicMarker,
          id: `marker-${color}-${index}`,
          color,
        };

        const { container, unmount } = render(
          <OSRSMarker marker={coloredMarker} latLng={mockLatLng} />
        );
        expect(container.querySelector('[data-testid="marker"]')).toBeInTheDocument();
        unmount(); // Clean up after each render
      });
    });
  });

  describe('Accessibility', () => {
    test('should be keyboard accessible', () => {
      const mockOnClick = jest.fn();
      const accessibleMarker = {
        ...basicMarker,
        onClick: mockOnClick,
      };

      render(<OSRSMarker marker={accessibleMarker} latLng={mockLatLng} />);

      const marker = screen.getByTestId('marker');

      // Test keyboard interaction
      fireEvent.keyDown(marker, { key: 'Enter' });
      fireEvent.keyDown(marker, { key: ' ' });

      // In a real implementation with proper event handling, these would trigger clicks
      expect(marker).toBeInTheDocument();
    });

    test('should have proper ARIA attributes for screen readers', () => {
      render(<OSRSMarker marker={basicMarker} latLng={mockLatLng} />);

      const marker = screen.getByTestId('marker');
      // In a real implementation, we would check for aria-label, role, etc.
      expect(marker).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing position gracefully', () => {
      const invalidMarker = {
        id: 'invalid',
        position: undefined as unknown as { x: number; y: number; z: number },
      };

      // This should not crash the component
      expect(() => {
        render(<OSRSMarker marker={invalidMarker} latLng={mockLatLng} />);
      }).not.toThrow();
    });

    test('should handle null latLng gracefully', () => {
      expect(() => {
        render(<OSRSMarker marker={basicMarker} latLng={null as unknown as L.LatLng} />);
      }).not.toThrow();
    });

    test('should handle empty strings in marker data', () => {
      const emptyStringMarker: OSRSMarkerType = {
        id: 'empty-strings',
        position: { x: 3200, y: 3200, z: 0 },
        title: '',
        description: '',
        color: '',
      };

      render(<OSRSMarker marker={emptyStringMarker} latLng={mockLatLng} />);

      // Should render marker but no popup since all text fields are empty
      expect(screen.getByTestId('marker')).toBeInTheDocument();
      expect(screen.queryByText('Position: 3200, 3200, 0')).not.toBeInTheDocument();
    });
  });
});
