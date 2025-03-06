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

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update the environment variables in `.env.local` with your Supabase credentials:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

You can find these values in your Supabase project settings under Project Settings > API.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
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
