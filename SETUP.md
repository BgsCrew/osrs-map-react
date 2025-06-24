# Setup Instructions for GitHub Packages

Follow these steps to publish your React OSRS Map library to GitHub Packages.

## Prerequisites

1. A GitHub account
2. Node.js 16+ installed
3. npm or yarn package manager

## Step 1: Create GitHub Repository

1. Create a new repository on GitHub (e.g., `your-username/react-osrs-map`)
2. Copy the contents of this `react-osrs-map` folder to your new repository

## Step 2: Update Package Configuration

Edit `package.json` and replace the following:

```json
{
  "name": "@your-username/react-osrs-map",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/react-osrs-map.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/react-osrs-map/issues"
  },
  "homepage": "https://github.com/your-username/react-osrs-map#readme"
}
```

Replace `your-username` with your actual GitHub username.

## Step 3: Update Workflow File

In `.github/workflows/publish.yml`, update the scope:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    registry-url: 'https://npm.pkg.github.com'
    scope: '@your-username'  # Replace with your username
```

## Step 4: Local Development Setup

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run linting and type checking
npm run lint
npm run typecheck
```

## Step 5: Test the Example

```bash
# Navigate to example
cd examples/basic-example

# Install dependencies
npm install

# Start development server
npm start
```

The example should open at `http://localhost:3000`

## Step 6: Publish to GitHub Packages

### Option A: Automatic Publishing (Recommended)

1. Push your code to GitHub
2. Create a new release on GitHub:
   - Go to your repository
   - Click "Releases" → "Create a new release"
   - Tag version: `v1.0.0`
   - Release title: `v1.0.0`
   - Click "Publish release"

The GitHub Action will automatically build and publish your package.

### Option B: Manual Publishing

1. Generate a Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `write:packages` permission

2. Login to npm registry:
   ```bash
   npm login --scope=@your-username --registry=https://npm.pkg.github.com
   # Use your GitHub username and the token as password
   ```

3. Publish:
   ```bash
   npm publish
   ```

## Step 7: Install Your Published Package

Once published, others can install your package:

```bash
# First, configure npm to use GitHub Packages for your scope
echo "@your-username:registry=https://npm.pkg.github.com" >> .npmrc

# Then install
npm install @your-username/react-osrs-map
```

## Usage in Other Projects

```tsx
import { OSRSMap } from '@your-username/react-osrs-map';

function App() {
  return (
    <OSRSMap
      center={[3200, 3200]}
      height="600px"
      showCoordinates={true}
    />
  );
}
```

## Troubleshooting

### Build Issues

- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run typecheck`
- Check linting: `npm run lint`

### Publishing Issues

- Ensure your GitHub token has `write:packages` permission
- Make sure the package name matches your GitHub username/organization
- Check that the repository URL in package.json is correct

### Import Issues

- Make sure the consuming project has the correct `.npmrc` configuration
- Verify the package name matches exactly
- Check that peer dependencies (React, React-DOM) are installed

## Next Steps

1. **Add Tests**: Consider adding unit tests with Jest and React Testing Library
2. **Documentation**: Add more examples and API documentation
3. **Features**: Extend functionality based on user feedback
4. **CI/CD**: Add more comprehensive GitHub Actions for testing and deployment

For support, create an issue on your GitHub repository.