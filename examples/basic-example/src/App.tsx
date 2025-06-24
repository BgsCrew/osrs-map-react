import React, { useState } from 'react';
import { OSRSMap, OSRSMarker, OSRSPosition } from '@bgscrew/react-osrs-map';
import './App.css';

const App: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<OSRSPosition | null>(null);
  const [plane, setPlane] = useState(0);
  const [center, setCenter] = useState<[number, number]>([3200, 3200]);

  // Example markers for popular OSRS locations
  const markers: OSRSMarker[] = [
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
    },
    {
      id: 'falador',
      position: { x: 2965, y: 3378, z: 0 },
      title: 'Falador Square',
      description: 'White knight city',
      color: '#FF9800'
    },
    {
      id: 'grand-exchange',
      position: { x: 3165, y: 3489, z: 0 },
      title: 'Grand Exchange',
      description: 'Trading hub',
      color: '#9C27B0'
    },
    {
      id: 'barbarian-village',
      position: { x: 3081, y: 3421, z: 0 },
      title: 'Barbarian Village',
      description: 'Barbarian stronghold',
      color: '#F44336'
    }
  ];

  const handlePositionChange = (position: OSRSPosition) => {
    // Update position display in real-time (throttled for performance)
  };

  const handleMapClick = (position: OSRSPosition) => {
    setSelectedPosition(position);
  };

  const handleMarkerClick = (marker: OSRSMarker) => {
    console.log('Marker clicked:', marker);
    setCenter([marker.position.x, marker.position.y]);
  };

  const quickLocations = [
    { name: 'Lumbridge', coords: [3222, 3218] as [number, number] },
    { name: 'Varrock', coords: [3210, 3424] as [number, number] },
    { name: 'Falador', coords: [2965, 3378] as [number, number] },
    { name: 'Grand Exchange', coords: [3165, 3489] as [number, number] },
    { name: 'Draynor', coords: [3093, 3244] as [number, number] },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>React OSRS Map Example</h1>
        <p>Interactive Old School RuneScape map built with React</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label>Plane:</label>
          <select 
            value={plane} 
            onChange={(e) => setPlane(Number(e.target.value))}
          >
            <option value={0}>Ground Level (0)</option>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        </div>

        <div className="control-group">
          <label>Quick Locations:</label>
          <select 
            onChange={(e) => {
              const location = quickLocations.find(loc => loc.name === e.target.value);
              if (location) {
                setCenter(location.coords);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Select a location</option>
            {quickLocations.map(location => (
              <option key={location.name} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="map-container">
        <OSRSMap
          center={center}
          plane={plane}
          zoom={8}
          markers={markers}
          onPositionChange={handlePositionChange}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          showCoordinates={true}
          height="600px"
          style={{
            border: '2px solid #ccc',
            borderRadius: '8px'
          }}
        />
      </div>

      {selectedPosition && (
        <div className="position-info">
          <h3>Last Clicked Position:</h3>
          <p>
            X: {selectedPosition.x}, Y: {selectedPosition.y}, Z: {selectedPosition.z}
          </p>
        </div>
      )}

      <div className="features">
        <h2>Features Demonstrated:</h2>
        <ul>
          <li>✅ Interactive OSRS coordinate system</li>
          <li>✅ Multi-plane support (Z-levels 0-3)</li>
          <li>✅ Custom markers with popups</li>
          <li>✅ Real-time coordinate display</li>
          <li>✅ Click handling for positions</li>
          <li>✅ Programmatic map centering</li>
          <li>✅ Marker click events</li>
        </ul>
      </div>

      <div className="usage">
        <h2>Usage:</h2>
        <ul>
          <li>🖱️ <strong>Click</strong> anywhere on the map to see coordinates</li>
          <li>📍 <strong>Click markers</strong> to see location details</li>
          <li>🎚️ <strong>Change plane</strong> to explore different levels</li>
          <li>📍 <strong>Use quick locations</strong> to navigate around</li>
          <li>🔍 <strong>Zoom and pan</strong> like any normal map</li>
        </ul>
      </div>
    </div>
  );
};

export default App;