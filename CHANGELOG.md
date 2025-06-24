# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-06-24

### Added
- Initial release of React OSRS Map library
- Interactive OSRS map component with accurate coordinate system
- Custom marker support with popups, colors, and click handlers
- Multi-plane support for different Z-levels (0-3)
- Real-time coordinate display functionality
- TypeScript support with comprehensive type definitions
- React hooks for map functionality (`useOSRSMap`)
- Coordinate conversion utilities:
  - `osrsToLatLng` - Convert OSRS coordinates to Leaflet coordinates
  - `latLngToOsrs` - Convert Leaflet coordinates to OSRS coordinates
  - `calculateDistance` - Calculate distance between OSRS positions
  - `getRegionFromCoordinates` - Get region information from coordinates
  - `clampToOSRSBounds` - Clamp coordinates to valid OSRS bounds
- Comprehensive test suite with 95%+ coverage
- Example application demonstrating basic usage
- ESLint and TypeScript configuration
- GitHub Actions CI/CD pipeline
- Support for both CommonJS and ES modules
- Built-in CSS styling for map components

### Features
- 🗺️ Full Old School RuneScape world map integration
- 📍 Customizable markers with rich popup content
- 🎚️ Multi-plane support for dungeons and buildings
- 📊 Real-time mouse coordinate tracking
- ⚡ Modern React hooks and TypeScript
- 🎯 Precise OSRS coordinate system conversion
- 📱 Responsive design for desktop and mobile
- 🔧 Utility functions for coordinate manipulation
- 🎨 Customizable styling and theming
- ⚙️ Comprehensive configuration options

### Technical Details
- Built with React 18+ and TypeScript 5
- Uses Leaflet.js for map rendering
- Supports Node.js 22+ and 24+
- Published to GitHub Packages
- MIT licensed