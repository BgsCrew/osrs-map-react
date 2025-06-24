# Test Coverage Report

This document outlines the comprehensive test suite for the React OSRS Map library.

## Test Structure

### Unit Tests
- ✅ **Constants Tests** (`src/utils/__tests__/constants.test.ts`)
  - Map dimensions validation
  - Coordinate offsets verification  
  - World boundaries checks
  - Zoom level validation
  - Tile server URL pattern

- ✅ **Coordinate Utilities Tests** (`src/utils/__tests__/coordinates.test.ts`)
  - OSRS to LatLng conversion
  - LatLng to OSRS conversion
  - Distance calculations
  - Region coordinate handling
  - Local coordinate calculations
  - Boundary validation and clamping

### Component Tests
- ✅ **OSRSMap Tests** (`src/components/__tests__/OSRSMap.test.tsx`)
  - Component rendering
  - Props handling
  - Event callbacks
  - Coordinate display
  - Plane switching
  - Marker integration
  - Error handling
  - Performance with large datasets

- ✅ **OSRSMarker Tests** (`src/components/__tests__/OSRSMarker.test.tsx`)
  - Marker rendering
  - Popup content
  - Click handling
  - Color customization
  - Custom popup components
  - Coordinate display
  - Icon handling
  - Accessibility features

### Hook Tests
- ✅ **useOSRSMap Tests** (`src/hooks/__tests__/useOSRSMap.test.ts`)
  - Tile layer management
  - Mouse event handling
  - Position tracking
  - Map centering
  - Cleanup on unmount
  - Plane changes
  - Error handling

### Integration Tests
- ✅ **Full Workflow Tests** (`src/__tests__/integration.test.tsx`)
  - Complete map functionality
  - Marker interactions
  - Coordinate system integration
  - Real-world scenarios:
    - Bot development workflow
    - Quest guide usage
    - Dungeon exploration
  - Performance testing
  - Error recovery

## Coverage Goals

| Category | Target | Status |
|----------|--------|--------|
| Statements | 90%+ | ✅ |
| Branches | 85%+ | ✅ |
| Functions | 95%+ | ✅ |
| Lines | 90%+ | ✅ |

## Test Scenarios Covered

### Coordinate System
- [x] Valid OSRS coordinate conversions
- [x] Edge case coordinates (min/max bounds)
- [x] Invalid coordinate handling
- [x] Region calculations
- [x] Local coordinate mapping
- [x] Distance calculations
- [x] Boundary clamping

### Map Functionality
- [x] Basic map rendering
- [x] Zoom control
- [x] Plane switching (Z-levels 0-3)
- [x] Center coordinate changes
- [x] Custom styling and dimensions
- [x] Event handling (click, mouse move)
- [x] Real-time coordinate display

### Marker System
- [x] Basic marker placement
- [x] Custom colors and icons
- [x] Popup content rendering
- [x] Click event handling
- [x] Large numbers of markers
- [x] Invalid marker data handling
- [x] Custom popup components
- [x] Accessibility features

### Real-World Usage
- [x] Bot development scenarios
- [x] Quest guide applications
- [x] Dungeon exploration
- [x] Performance with 50+ markers
- [x] Rapid prop changes
- [x] Error recovery

### Error Handling
- [x] Invalid coordinates
- [x] Missing props
- [x] Null/undefined values
- [x] Network failures (tile loading)
- [x] Memory leaks prevention
- [x] Component unmounting

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test coordinates.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="coordinate"
```

## Test Configuration

The test suite uses:
- **Jest** for test running and assertions
- **React Testing Library** for component testing
- **@testing-library/jest-dom** for DOM assertions
- **jsdom** environment for browser simulation
- **ts-jest** for TypeScript support

## Continuous Integration

Tests run automatically on:
- Pull requests to main/master
- Pushes to main/master branch
- Release creation

The CI pipeline includes:
1. Dependency installation
2. Linting (`npm run lint`)
3. Type checking (`npm run typecheck`)
4. Test execution with coverage
5. Build verification
6. Coverage reporting to Codecov

## Coverage Exclusions

The following are excluded from coverage requirements:
- Type definition files (`.d.ts`)
- Entry point file (`index.ts`)
- Test setup files
- Example applications

## Manual Testing

In addition to automated tests, manual testing should cover:
- [ ] Visual marker appearance on different browsers
- [ ] Touch interactions on mobile devices
- [ ] Performance with 100+ markers
- [ ] Tile loading on slow connections
- [ ] Accessibility with screen readers
- [ ] Keyboard navigation

## Future Test Improvements

- [ ] Visual regression testing with screenshot comparison
- [ ] Performance benchmarking automation
- [ ] Cross-browser testing with Playwright
- [ ] Mobile device testing automation
- [ ] Accessibility testing automation
- [ ] Load testing for high marker counts