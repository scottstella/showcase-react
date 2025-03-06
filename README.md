# SHOWCASE-REACT ReadMe Contents

## Execution

```
npm run start
```

## Docker

```
docker image build -t showcase-react-image:latest .
```

```
   docker run -dp 8000:5173 --name showcase-react-container showcase-react-image:latest
```

# Hearthstone Deck Tracker

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

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

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

The project uses `lint-staged` to efficiently process only staged files. Configuration in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,json,css,scss,md}": ["prettier --write"]
  }
}
```

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
