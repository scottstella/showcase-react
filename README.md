# SHOWCASE-REACT

A React application for tracking Hearthstone decks and cards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
- [Docker](#docker)
- [Environment Setup](#environment-setup)
- [Testing](#testing)
- [Path Aliases](#path-aliases)
- [Git Hooks](#git-hooks)
- [VS Code Configuration](#vs-code-configuration)
- [API Collections](#api-collections)

## Getting Started

### Available Scripts

```bash
# Start development server (accessible from other devices on your network)
npm run start

# Start development server (local access only)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Common Use Cases

1. **Local Development**:

   ```bash
   npm install        # Install dependencies
   npm run dev       # Start development server
   ```

2. **Testing Changes**:

   ```bash
   npm test         # Run tests
   npm run test:coverage  # Run tests with coverage report
   ```

3. **Production Build**:
   ```bash
   npm run build    # Create production build
   npm run preview  # Preview production build locally
   ```

## Development

```bash
# Install dependencies
npm install

# Start development server (accessible from other devices on your network)
npm run start

# Or start development server (local access only)
npm run dev
```

Both commands start the development server with hot module replacement (HMR). The only difference is that `npm start` makes the server accessible from other devices on your network, while `npm run dev` is for local development only.

### Development Features

- Hot Module Replacement (HMR)
- TypeScript compilation
- ESLint integration
- Prettier formatting
- Source maps for debugging

## Docker

### Prerequisites

- Docker installed on your system
- Node.js 18 or higher (for local development)

### Development with Docker

```bash
# Build the development image
docker image build -t showcase-react-image:latest .

# Run the container
docker run -dp 8000:5173 --name showcase-react-container showcase-react-image:latest
```

### Production with Docker

```bash
# Build the production image
docker image build -t showcase-react-prod:latest --target production .

# Run the production container
docker run -dp 8000:80 --name showcase-react-prod showcase-react-prod:latest
```

### Docker Commands Reference

```bash
# Build images
docker image build -t showcase-react-image:latest .           # Development
docker image build -t showcase-react-prod:latest --target production .  # Production

# Run containers
docker run -dp 8000:5173 --name showcase-react-container showcase-react-image:latest  # Development
docker run -dp 8000:80 --name showcase-react-prod showcase-react-prod:latest         # Production

# Stop containers
docker stop showcase-react-container
docker stop showcase-react-prod

# Remove containers
docker rm showcase-react-container
docker rm showcase-react-prod

# View logs
docker logs showcase-react-container
docker logs showcase-react-prod
```

### Troubleshooting

1. **Port Conflicts**:

   - Change the port mapping in the docker run command (e.g., `-dp 3000:5173`)
   - Check if any other services are using the port

2. **Container Issues**:

   - Check container logs: `docker logs showcase-react-container`
   - Restart container: `docker restart showcase-react-container`
   - Rebuild image: `docker image build -t showcase-react-image:latest .`

3. **Development vs Production**:
   - Development includes source maps and hot reloading
   - Production is optimized for performance and smaller bundle size

## Environment Setup

1. Create a `.env.local` file in the project root:

```bash
# Copy the example file (if it exists)
cp .env.example .env.local

# Or create a new .env.local file
touch .env.local
```

2. Add the following environment variables to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under Project Settings > API.

> **Note**: The `.env.local` file is used for local environment variables and should not be committed to version control. It is automatically ignored by Git.

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Commands

- `npm test`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm test -- --run`: Run tests once (non-interactive)

## Path Aliases

The project uses path aliases to make imports cleaner and more maintainable. The following aliases are available:

```typescript
// Instead of
import { CardService } from "../../../services/CardService";

// You can use
import { CardService } from "@services/CardService";
```

Available aliases:

- `@/*` - Import from the src directory
- `@components/*` - Import components
- `@services/*` - Import services
- `@utils/*` - Import utilities
- `@types/*` - Import types
- `@assets/*` - Import assets

## Git Hooks

This project uses Husky Git hooks to ensure code quality. The hooks are configured in the `.husky` directory:

### Pre-commit Hook

Located in `.husky/pre-commit`:

- Runs automatically before each commit
- Uses `lint-staged` to process staged files:
  - For TypeScript/TSX files:
    - Runs ESLint with auto-fix
    - Formats with Prettier
  - For other files (JS, JSON, CSS, etc.):
    - Formats with Prettier
- Prevents commit if there are any linting errors
- Can be bypassed with `git commit --no-verify`

### Pre-push Hook

Located in `.husky/pre-push`:

- Runs automatically before each push to remote
- Executes all tests with `npm test`
- Prevents push if any tests fail
- Can be bypassed with `git push --no-verify`

### Bypassing Hooks

For work-in-progress commits or when you need to bypass the checks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "your message"

# Skip pre-push hook
git push --no-verify
```

### Lint-staged Configuration

The project uses `lint-staged` to efficiently process only staged files. Configuration is in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,json,css,scss,md}": ["prettier --write"]
  }
}
```

This configuration:

- Runs ESLint and Prettier on staged TypeScript/TSX files
- Runs Prettier on other supported file types
- Only processes files that are staged for commit (not all files)

## VS Code Configuration

This project includes VS Code settings for consistent code formatting and linting. To take advantage of these features:

1. Install the following VS Code extensions:

   - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. The project includes `.vscode/settings.json` which configures:

   - Format on save
   - Prettier as the default formatter
   - Automatic ESLint fixes on save
   - Language-specific formatting rules

3. Available formatting commands:

   ```bash
   # Format all files in the src directory
   npm run format
   ```

4. The project uses the following formatting rules:
   - 2 spaces for indentation
   - 100 characters line length
   - Double quotes for strings
   - Semicolons at the end of statements
   - Trailing commas in objects and arrays
   - Consistent bracket spacing

These settings will be automatically applied when you open the project in VS Code.

## API Collections

This project includes a set of Bruno API collections for interacting with the Supabase backend. The collections are located in the `api_collection` directory and include endpoints for managing:

- Sets (card sets)
- Hero Classes
- Tribes

### Authentication Setup

The API collections use Supabase's Row Level Security (RLS) and require proper authentication. To use these collections:

1. Configure your environment file (`api_collection/environments/supabase.bru`):

   ```
   vars {
     url: your-project-id.supabase.co
     apikey: your-supabase-anon-key
     access_token: your-jwt-token
   }
   ```

2. To get your JWT token:
   - Log into the application
   - Open your browser's Developer Console (F12 or Command+Option+I)
   - Run this command:
     ```javascript
     const token = JSON.parse(localStorage.getItem("supabase.auth.token"))
       ?.currentSession?.access_token;
     console.log(token);
     ```
   - Copy the output and update the `access_token` in your environment file

Note: The JWT token expires periodically. If your requests start returning 401 unauthorized errors, you'll need to:

1. Log in to the application again
2. Get a new token using the console command above
3. Update the `access_token` in your environment file

### Available Requests

#### Sets

- `Get Sets.bru` - Retrieve all sets
- `Add Set.bru` - Create a new set
- `Delete Set.bru` - Remove a set by ID

#### Hero Classes

- `Get Hero Classes.bru` - Retrieve all hero classes
- `Add Hero Class.bru` - Create a new hero class
- `Delete Hero Class.bru` - Remove a hero class by ID

#### Tribes

- `Get Tribes.bru` - Retrieve all tribes
- `Add Tribe.bru` - Create a new tribe
- `Delete Tribe.bru` - Remove a tribe by ID

### Using the Collections

1. Open the collection in Bruno
2. Select the "supabase" environment from the dropdown
3. For delete operations, update the ID in the URL parameter (e.g., `?id=eq.1`)
4. For add operations, update the JSON body with your data
5. Send the request

All requests require authentication and will include:

- The `apikey` header for basic access
- The `Authorization` header with your JWT token for authenticated operations
