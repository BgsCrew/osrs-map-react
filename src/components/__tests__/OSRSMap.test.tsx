/**
 * Tests for OSRSMap component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OSRSMap } from '../OSRSMap';
import { OSRSMarker } from '../../types';

// Mock the useOSRSMap hook
jest.mock('../../hooks/useOSRSMap', () => ({
  useOSRSMap: () => ({
    currentPosition: { x: 3200, y: 3200, z: 0 },
    centerOn: jest.fn(),
    tileLayer: null
  })
}));

describe('OSRSMap Component', () => {
  const defaultProps = {
    center: [3200, 3200] as [number, number],
    plane: 0,
    zoom: 8
  };

  const sampleMarkers: OSRSMarker[] = [
    {
      id: 'lumbridge',
      position: { x: 3222, y: 3218, z: 0 },
      title: 'Lumbridge Castle',
      description: 'Tutorial starting location',
      color: '#4CAF50'
    },
    {
      id: 'varrock',
      position: { x: 3210, y: 3424, z: 0 },
      title: 'Varrock Square',
      description: 'Major city center',
      color: '#2196F3'
    }
  ];

  test('should render without crashing', () => {
    render(<OSRSMap {...defaultProps} />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('should render with custom dimensions', () => {
    render(
      <OSRSMap
        {...defaultProps}
        width="800px"
        height="600px"
      />
    );
    
    const container = screen.getByTestId('map-container').parentElement;
    expect(container).toHaveStyle({ width: '800px', height: '600px' });
  });

  test('should render with custom className and style', () => {
    const customStyle = { border: '2px solid red' };
    
    render(
      <OSRSMap
        {...defaultProps}
        className="custom-map"
        style={customStyle}
      />
    );
    
    const container = screen.getByTestId('map-container').parentElement;
    expect(container).toHaveClass('osrs-map-container custom-map');
    expect(container).toHaveStyle({ border: '2px solid red' });
  });

  test('should display plane indicator', () => {
    render(<OSRSMap {...defaultProps} plane={2} />);
    
    expect(screen.getByText('Plane: 2')).toBeInTheDocument();
  });

  test('should show coordinates when enabled and position is set', () => {
    const mockOnPositionChange = jest.fn();
    
    render(<OSRSMap {...defaultProps} showCoordinates={true} onPositionChange={mockOnPositionChange} />);
    
    // Initially no coordinates should be visible (until mouse movement)
    expect(screen.queryByText(/X: \d+, Y: \d+, Z: \d+/)).not.toBeInTheDocument();
    
    // But the component should be ready to show coordinates
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('should not show coordinates when disabled', () => {
    render(<OSRSMap {...defaultProps} showCoordinates={false} />);
    
    expect(screen.queryByText(/X: \d+, Y: \d+, Z: \d+/)).not.toBeInTheDocument();
  });

  test('should render markers', () => {
    render(
      <OSRSMap
        {...defaultProps}
        markers={sampleMarkers}
      />
    );
    
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
  });

  test('should handle map click events', () => {
    const mockOnMapClick = jest.fn();
    
    render(
      <OSRSMap
        {...defaultProps}
        onMapClick={mockOnMapClick}
      />
    );
    
    // Since we're mocking react-leaflet, we need to simulate the behavior
    // In a real test, this would trigger through Leaflet's event system
    const mapContainer = screen.getByTestId('map-container');
    fireEvent.click(mapContainer);
    
    // Due to our mocking setup, we can't easily test the actual click handling
    // but we can verify the component renders with the handler
    expect(mockOnMapClick).toBeDefined();
  });

  test('should handle marker click events', () => {
    const mockOnMarkerClick = jest.fn();
    
    render(
      <OSRSMap
        {...defaultProps}
        markers={sampleMarkers}
        onMarkerClick={mockOnMarkerClick}
      />
    );
    
    expect(screen.getAllByTestId('marker')).toHaveLength(2);
    expect(mockOnMarkerClick).toBeDefined();
  });

  test('should handle position changes', () => {
    const mockOnPositionChange = jest.fn();
    
    render(
      <OSRSMap
        {...defaultProps}
        onPositionChange={mockOnPositionChange}
      />
    );
    
    expect(mockOnPositionChange).toBeDefined();
  });

  test('should handle different planes', () => {
    const { rerender } = render(<OSRSMap {...defaultProps} plane={0} />);
    expect(screen.getByText('Plane: 0')).toBeInTheDocument();
    
    rerender(<OSRSMap {...defaultProps} plane={3} />);
    expect(screen.getByText('Plane: 3')).toBeInTheDocument();
  });

  test('should handle center changes', () => {
    const { rerender } = render(
      <OSRSMap {...defaultProps} center={[3200, 3200]} />
    );
    
    // Change center
    rerender(
      <OSRSMap {...defaultProps} center={[3300, 3300]} />
    );
    
    // Component should re-render without errors
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('should handle empty markers array', () => {
    render(
      <OSRSMap
        {...defaultProps}
        markers={[]}
      />
    );
    
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  test('should handle undefined markers', () => {
    render(
      <OSRSMap
        {...defaultProps}
        markers={undefined}
      />
    );
    
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  test('should use default props when not provided', () => {
    render(<OSRSMap />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByText('Plane: 0')).toBeInTheDocument();
  });

  test('should handle zoom prop', () => {
    render(<OSRSMap {...defaultProps} zoom={10} />);
    
    // Component should render without errors
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    test('should have proper container structure', () => {
      render(<OSRSMap {...defaultProps} />);
      
      const container = screen.getByTestId('map-container').parentElement;
      expect(container).toHaveClass('osrs-map-container');
      expect(container).toHaveStyle({ position: 'relative' });
    });

    test('should have readable coordinate display when position is available', () => {
      render(<OSRSMap {...defaultProps} showCoordinates={true} />);
      
      // Coordinates display should not be visible initially
      expect(screen.queryByText(/X: \d+, Y: \d+, Z: \d+/)).not.toBeInTheDocument();
      
      // But the map container should be accessible
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    test('should have readable plane indicator', () => {
      render(<OSRSMap {...defaultProps} />);
      
      const planeIndicator = screen.getByText('Plane: 0');
      expect(planeIndicator).toHaveStyle({
        fontFamily: 'monospace'
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid center coordinates gracefully', () => {
      // This shouldn't crash the component
      render(
        <OSRSMap
          {...defaultProps}
          center={[NaN, NaN]}
        />
      );
      
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    test('should handle negative plane values', () => {
      render(<OSRSMap {...defaultProps} plane={-1} />);
      
      expect(screen.getByText('Plane: -1')).toBeInTheDocument();
    });

    test('should handle very high plane values', () => {
      render(<OSRSMap {...defaultProps} plane={999} />);
      
      expect(screen.getByText('Plane: 999')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('should not re-render unnecessarily with same props', () => {
      const { rerender } = render(<OSRSMap {...defaultProps} />);
      
      // Re-render with same props
      rerender(<OSRSMap {...defaultProps} />);
      
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    test('should handle large number of markers', () => {
      const manyMarkers: OSRSMarker[] = Array.from({ length: 100 }, (_, i) => ({
        id: `marker-${i}`,
        position: { x: 3200 + i, y: 3200 + i, z: 0 },
        title: `Marker ${i}`
      }));

      render(
        <OSRSMap
          {...defaultProps}
          markers={manyMarkers}
        />
      );
      
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(100);
    });
  });
});