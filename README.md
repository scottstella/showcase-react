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
