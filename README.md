# React OSRS Map

A React component library for displaying interactive Old School RuneScape maps with coordinate precision and marker support.

## Features

- 🗺️ **Interactive OSRS Map**: Full Old School RuneScape world map with accurate coordinate system
- 📍 **Custom Markers**: Add markers with popups, colors, and click handlers
- 🎚️ **Multi-plane Support**: Switch between different Z-levels (ground, level 1-3)
- 📊 **Real-time Coordinates**: Display current mouse position in OSRS coordinates
- ⚡ **React Hooks**: Built with modern React patterns and TypeScript
- 🎯 **Precise Coordinates**: Accurate conversion between OSRS and map coordinates
- 📱 **Responsive**: Works on desktop and mobile devices

## Installation

```bash
npm install @bgscrew/react-osrs-map
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { OSRSMap, OSRSMarker } from '@bgscrew/react-osrs-map';

function MyApp() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const markers = [
    {
      id: 'lumbridge',
      position: { x: 3222, y: 3218, z: 0 },
      title: 'Lumbridge Castle',
      description: 'Tutorial starting location',
      color: '#4CAF50'
    }
  ];

  return (
    <OSRSMap
      center={[3200, 3200]}
      plane={0}
      zoom={8}
      markers={markers}
      onMapClick={setSelectedPosition}
      showCoordinates={true}
      height="600px"
    />
  );
}
```

## API Reference

### OSRSMap Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[number, number]` | `[3200, 3200]` | Initial map center in OSRS coordinates [x, y] |
| `plane` | `number` | `0` | Z-level (0-3) for different floors/dungeons |
| `zoom` | `number` | `8` | Initial zoom level (4-11) |
| `markers` | `OSRSMarker[]` | `[]` | Array of markers to display |
| `onPositionChange` | `(position: OSRSPosition) => void` | - | Called when mouse moves over map |
| `onMapClick` | `(position: OSRSPosition) => void` | - | Called when map is clicked |
| `onMarkerClick` | `(marker: OSRSMarker) => void` | - | Called when marker is clicked |
| `showCoordinates` | `boolean` | `false` | Show coordinate overlay |
| `height` | `string \| number` | `'400px'` | Map height |
| `width` | `string \| number` | `'100%'` | Map width |

### OSRSMarker Interface

```tsx
interface OSRSMarker {
  id: string;
  position: { x: number; y: number; z: number };
  title?: string;
  description?: string;
  color?: string;
  popup?: React.ReactNode;
  onClick?: (marker: OSRSMarker) => void;
}
```

### Coordinate Utilities

```tsx
import { 
  osrsToLatLng, 
  latLngToOsrs, 
  calculateDistance,
  getRegionFromCoordinates 
} from '@bgscrew/react-osrs-map';

// Convert OSRS coordinates to Leaflet coordinates
const latLng = osrsToLatLng(map, 3200, 3200);

// Convert Leaflet coordinates to OSRS coordinates
const osrsPos = latLngToOsrs(map, latLng, 0);

// Calculate distance between two positions
const distance = calculateDistance({ x: 3200, y: 3200 }, { x: 3210, y: 3210 });

// Get region information
const region = getRegionFromCoordinates(3200, 3200);
```

## Examples

Check out the `/examples` folder for complete usage examples:

- **Basic Example**: Simple map with markers and controls
- **Advanced Example**: Custom markers, region display, and location search

## Development

```bash
# Clone and install dependencies
npm install

# Build the library
npm run build

# Run linting
npm run lint

# Type checking
npm run typecheck

# Run example
cd examples/basic-example
npm install
npm start
```

## Coordinate System

This library uses the standard OSRS coordinate system:

- **X-axis**: West to East (1024 to 4224)
- **Y-axis**: South to North (1216 to 12608)  
- **Z-axis**: Ground level to highest floor (0 to 3)

Popular locations:
- Lumbridge: `[3222, 3218, 0]`
- Varrock: `[3210, 3424, 0]`
- Falador: `[2965, 3378, 0]`
- Grand Exchange: `[3165, 3489, 0]`

## Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages and automated releases.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes and ensure tests pass
4. Commit your changes using conventional commits:
   ```bash
   git commit -m "feat(map): add amazing feature"
   ```
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes:** `map`, `marker`, `hooks`, `utils`, `types`, `deps`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## License

MIT © [BgsCrew](https://github.com/BgsCrew)

## Credits

- Map tiles from [Explv's OSRS Map Tiles](https://github.com/Explv/osrs_map_tiles)
- Original coordinate system from [Explv's Map](https://github.com/Explv/explv.github.io)
- Built with [React Leaflet](https://react-leaflet.js.org/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/BgsCrew/osrs-map-react/issues) on GitHub.