# Contributing to React OSRS Map

Thank you for your interest in contributing to React OSRS Map! This document provides guidelines for contributing to the project.

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with Google's Angular style. All commit messages must follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (optional)
The scope should be the name of the component/module affected:
- `map` - Changes to the main OSRSMap component
- `marker` - Changes to the OSRSMarker component
- `hooks` - Changes to React hooks
- `utils` - Changes to utility functions
- `types` - Changes to TypeScript type definitions
- `deps` - Dependency updates

### Subject
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Maximum 100 characters

### Examples

```bash
feat(map): add support for custom tile layers
fix(marker): resolve popup positioning issue
docs: update installation instructions
style: format code with prettier
test(hooks): add tests for useOSRSMap hook
chore(deps): update react to v18.3.0
```

## Development Workflow

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** following the coding standards
4. **Run the development commands**:
   ```bash
   npm install          # Install dependencies
   npm test             # Run tests
   npm run typecheck    # Type checking
   npm run lint         # Lint code
   npm run format       # Format code
   ```
5. **Commit your changes** using conventional commits:
   ```bash
   git add .
   git commit -m "feat(scope): add awesome feature"
   ```
6. **Push to your fork** and create a Pull Request

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run pre-commit hooks:

- **Lint-staged**: Automatically formats and lints staged files
- **Commitlint**: Validates commit messages follow conventional commits format

These hooks will run automatically when you commit, ensuring code quality and consistency.

## Release Process

Releases are automated using [semantic-release](https://semantic-release.gitbook.io/):

- **patch**: `fix:` commits trigger patch releases (0.1.0 → 0.1.1)
- **minor**: `feat:` commits trigger minor releases (0.1.0 → 0.2.0)  
- **major**: `BREAKING CHANGE:` in commit body/footer triggers major releases (0.1.0 → 1.0.0)

Release notes and version bumps are generated automatically based on conventional commits.

## Code Style

- **TypeScript**: All code must be written in TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code is automatically formatted with Prettier
- **Tests**: All new features must include tests
- **Documentation**: Update documentation for new features

## Questions?

If you have questions about contributing, please:
1. Check existing [issues](https://github.com/BgsCrew/osrs-map-react/issues)
2. Create a new issue for discussion
3. Join our community discussions

Thank you for contributing! 🎉