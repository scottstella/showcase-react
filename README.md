# SHOWCASE-REACT

A React application for tracking Hearthstone decks and cards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
- [Docker](#docker)
- [Environment Setup](#environment-setup)
- [Supabase Launch Agent](#supabase-launch-agent)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [E2E Tests](#e2e-tests)
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

# Run unit tests
npm test
npm run test:coverage

# Run E2E tests
npm run test:e2e
npm run test:e2e:ui

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

Both commands start the development server with hot module replacement (HMR).
The only difference is that `npm start` makes the server accessible from other
devices on your network, while `npm run dev` is for local development only.

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

### Quick Start

```bash
# Build and run the development container
docker build -t showcase-react-image:latest .
docker run -dp 8000:3000 --name showcase-react-container showcase-react-image:latest

# Access your application at: http://localhost:8000
```

### Development with Docker

```bash
# Build the development image
docker build -t showcase-react-image:latest .

# Run the container (maps host port 8000 to container port 3000)
docker run -dp 8000:3000 --name showcase-react-container showcase-react-image:latest

# Access the application
# Local: http://localhost:8000
# Network: http://your-ip:8000
```

### Container Management

#### Start/Stop Containers

```bash
# Start a stopped container
docker start showcase-react-container

# Stop a running container
docker stop showcase-react-container

# Restart a container
docker restart showcase-react-container
```

#### View Container Status

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs showcase-react-container

# Follow logs in real-time
docker logs -f showcase-react-container
```

#### Remove Containers

```bash
# Stop and remove a container
docker stop showcase-react-container && docker rm showcase-react-container

# Force remove a running container
docker rm -f showcase-react-container
```

### Image Management

```bash
# List all images
docker images

# Remove an image
docker rmi showcase-react-image:latest

# Remove all unused images
docker image prune -a
```

### Port Configuration

The application runs on different ports depending on the environment:

| Environment | Container Port | Host Port | Access URL            |
| ----------- | -------------- | --------- | --------------------- |
| Development | 3000           | 8000      | http://localhost:8000 |
| Production  | 80             | 8000      | http://localhost:8000 |

### Environment Variables

To use environment variables in Docker:

1. **Create a `.env` file** (for Docker):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Run with environment file**:

```bash
docker run -dp 8000:3000 --env-file .env --name showcase-react-container showcase-react-image:latest
```

### Troubleshooting

#### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   lsof -i :8000

   # Use a different port
   docker run -dp 3000:3000 --name showcase-react-container showcase-react-image:latest
   ```

2. **Container Won't Start**

   ```bash
   # Check container logs
   docker logs showcase-react-container

   # Check if container exists
   docker ps -a | grep showcase-react-container
   ```

3. **Application Not Accessible**

   ```bash
   # Verify container is running
   docker ps

   # Check port mapping
   docker port showcase-react-container

   # Test connectivity
   curl -I http://localhost:8000
   ```

4. **Build Errors**

   ```bash
   # Clean build (no cache)
   docker build --no-cache -t showcase-react-image:latest .

   # Check for dependency issues
   docker build -t showcase-react-image:latest . 2>&1 | grep -i error
   ```

#### Dependency Issues

If you encounter npm dependency conflicts during build:

```bash
# The Dockerfile already uses --legacy-peer-deps
# If you need to update dependencies locally:
npm install --legacy-peer-deps
```

#### Browser Opening Errors

The Vite configuration is set to prevent automatic browser opening in Docker:

- `open: false` - Prevents `xdg-open ENOENT` errors
- `host: true` - Allows external access

#### Performance Tips

1. **Use Docker volumes for development**:

   ```bash
   docker run -dp 8000:3000 -v $(pwd):/showcase-react --name showcase-react-container showcase-react-image:latest
   ```

2. **Multi-stage builds for production**:
   ```dockerfile
   # Add to Dockerfile for production builds
   FROM node:18-alpine as production
   WORKDIR /app
   COPY --from=build /showcase-react/build ./build
   EXPOSE 80
   CMD ["npm", "run", "serve"]
   ```

### Production Deployment

For production deployment, consider:

1. **Multi-stage builds** to reduce image size
2. **Environment-specific configurations**
3. **Health checks** for container monitoring
4. **Resource limits** for container constraints

```bash
# Example production build
docker build --target production -t showcase-react-prod:latest .
docker run -dp 80:80 --name showcase-react-prod showcase-react-prod:latest
```

### Docker Compose (Optional)

For more complex setups, create a `docker-compose.yml`:

```yaml
version: "3.8"
services:
  showcase-react:
    build: .
    ports:
      - "8000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/showcase-react
      - /showcase-react/node_modules
    restart: unless-stopped
```

Then use:

```bash
docker-compose up -d
docker-compose down
```

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

You can find these values in your Supabase project settings under Project
Settings > API.

## Supabase Launch Agent

This project uses a macOS launch agent to keep the Supabase connection alive by
periodically pinging the API. This prevents the connection from going idle and
ensures consistent performance.

### Overview

The launch agent runs a script (`supabase-ping.sh`) that sends periodic HTTP
requests to your Supabase instance. This is particularly useful for:

- Preventing connection timeouts
- Keeping the database connection warm
- Ensuring consistent API response times
- Avoiding cold starts when the application is accessed

### Files

**Launch Agent Configuration:**

- Location: `~/Library/LaunchAgents/com.sstella.supabase-ping.plist`
- Purpose: macOS system service configuration

**Script:**

- Location: `/Users/sstella/supabase-ping.sh`
- Purpose: Executes the actual ping requests

**Logs:**

- Location: `/Users/sstella/ping.log`
- Purpose: Records ping attempts and results

### Configuration

The script is configured with the following settings:

```bash
SUPABASE_URL="https://hasmzeqltdnshibkgbuj.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
PING_INTERVAL_MINUTES=60  # Currently set to 1 hour
```

### Managing the Launch Agent

#### Check Status

```bash
# Check if the agent is running
launchctl list | grep supabase-ping

# View the logs
tail -f ~/ping.log
```

#### Start/Stop the Agent

```bash
# Stop the agent
launchctl unload ~/Library/LaunchAgents/com.sstella.supabase-ping.plist

# Start the agent
launchctl load ~/Library/LaunchAgents/com.sstella.supabase-ping.plist
```

#### Change Ping Frequency

To change how often the script pings Supabase:

1. Edit the script:

   ```bash
   nano ~/supabase-ping.sh
   ```

2. Modify the `PING_INTERVAL_MINUTES` variable:

   ```bash
   PING_INTERVAL_MINUTES=30  # 30 minutes
   PING_INTERVAL_MINUTES=15  # 15 minutes
   PING_INTERVAL_MINUTES=5   # 5 minutes
   ```

3. Restart the agent:
   ```bash
   launchctl unload ~/Library/LaunchAgents/com.sstella.supabase-ping.plist
   launchctl load ~/Library/LaunchAgents/com.sstella.supabase-ping.plist
   ```

### How It Works

1. **System Integration**: The launch agent is registered with macOS's `launchd`
   system
2. **Automatic Startup**: Runs automatically when you log in
3. **Keep Alive**: Continuously runs and restarts if it stops
4. **API Ping**: Sends a simple GET request to `hero_class` table
5. **Logging**: Records success/failure with timestamps

### Troubleshooting

#### Agent Not Running

```bash
# Check if the agent is loaded
launchctl list | grep supabase-ping

# If not found, reload it
launchctl load ~/Library/LaunchAgents/com.sstella.supabase-ping.plist
```

#### Check Logs for Errors

```bash
# View recent logs
tail -20 ~/ping.log

# Monitor logs in real-time
tail -f ~/ping.log
```

#### Common Issues

1. **Permission Denied**: Ensure the script is executable:

   ```bash
   chmod +x ~/supabase-ping.sh
   ```

2. **Invalid API Key**: Check that the `SUPABASE_ANON_KEY` in the script matches
   your environment

3. **Network Issues**: Verify your internet connection and Supabase URL

### Security Notes

- The script contains your Supabase API key in plain text
- The log file may contain sensitive information
- Consider using environment variables for the API key in production
- The launch agent runs with your user permissions

### Alternative Approaches

If you prefer not to use a launch agent, consider:

1. **Application-level pinging**: Implement ping logic in your React app
2. **Cron jobs**: Use `crontab` for scheduling
3. **External monitoring**: Use services like UptimeRobot or Pingdom
4. **Supabase Edge Functions**: Create a scheduled function in Supabase

## Testing

This project includes both unit tests (using Vitest) and end-to-end tests (using
Playwright).

### Unit Tests

```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug
```

### Test Commands

#### Unit Tests

- `npm test`: Run unit tests in watch mode
- `npm run test:coverage`: Run unit tests with coverage report
- `npm test -- --run`: Run unit tests once (non-interactive)

#### E2E Tests

- `npm run test:e2e`: Run all E2E tests in headless mode
- `npm run test:e2e:ui`: Open Playwright UI for interactive testing
- `npm run test:e2e:headed`: Run tests with browser visible
- `npm run test:e2e:debug`: Run tests in debug mode with step-by-step execution

### Test Structure

#### Unit Tests

- Located in `src/**/*.test.tsx` files
- Use Vitest and React Testing Library
- Test individual components and functions
- Mock external dependencies

#### E2E Tests

- Located in `tests/` directory
- Use Playwright for browser automation
- Test complete user workflows
- Mock Supabase API calls at the network level

### E2E Test Features

The E2E tests include:

1. **Navigation Testing**: Verify users can navigate to different pages
2. **Form Validation**: Test client-side validation rules
3. **Authentication Scenarios**: Test both logged-in and logged-out states
4. **CRUD Operations**: Test create, read, update, delete functionality
5. **Error Handling**: Verify proper error messages and user feedback
6. **Loading States**: Test loading indicators and async operations

### Example E2E Test

```typescript
// tests/tribes.spec.ts
test("should successfully add a tribe when user is logged in", async ({
  page,
}) => {
  // Mock authentication
  await page.setExtraHTTPHeaders({
    authorization: "Bearer fake-token",
  });

  await page.goto("/manageMetaData");
  await page.click("text=Tribes");

  // Fill and submit form
  await page.fill('input[placeholder="Name"]', "Mech");
  await page.click('input[type="submit"]');

  // Verify success
  await expect(page.locator(".Toastify__toast--info")).toBeVisible();
  await expect(page.locator("text=Mech")).toBeInTheDocument();
});
```

### Running Tests in CI/CD

For continuous integration, the tests are configured to:

- Run unit tests with coverage reporting
- Run E2E tests in headless mode across multiple browsers
- Fail builds if tests don't pass
- Generate HTML reports for test results

### Test Configuration

- **Unit Tests**: Configured in `vitest.config.ts`
- **E2E Tests**: Configured in `playwright.config.ts`
- **Coverage**: Set to exclude test files and setup files
- **Browsers**: E2E tests run on Chrome, Firefox, and Safari

## Path Aliases

The project uses path aliases to make imports cleaner and more maintainable. The
following aliases are available:

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

This project uses Husky Git hooks to ensure code quality. The hooks are
configured in the `.husky` directory:

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

The project uses `lint-staged` to efficiently process only staged files.
Configuration is in `package.json`:

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

This project includes VS Code settings for consistent code formatting and
linting. To take advantage of these features:

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

These settings will be automatically applied when you open the project in VS
Code.

## API Collections

This project includes a set of Bruno API collections for interacting with the
Supabase backend. The collections are located in the `api_collection` directory
and include endpoints for managing:

- Sets (card sets)
- Hero Classes
- Tribes

### Authentication Setup

The API collections use Supabase's Row Level Security (RLS) and require proper
authentication. To use these collections:

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

Note: The JWT token expires periodically. If your requests start returning 401
unauthorized errors, you'll need to:

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
