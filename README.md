# Duel Monsters Fusion Calculator
A simple web app for looking up monster fusions from the Game Boy Duel Monsters game.

The live application can be found here: https://ygofusion.com/

## Table of Contents
- [Purpose](#purpose)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Running Tests](#running-tests)
- [Planned Features](#planned-features)
- [Special Thanks](#special-thanks)

## Purpose
Look up Duel Monsters fusions faster. Before a tool like this, people would need to search on the game's wiki pages and find the cards they're using, and any fusion combos associated with them.

The main goal is to answer questions like:
"What can this monster fuse with?" or "What fusions can I make using this monster?"

## Features
- Search for a monster by name
- View all known fusion combinations involving that monster
- Display fusion results in a clean table with card images

## Tech Stack
- React
- TypeScript
- Vite
- HTML/CSS
- Node.js + Express (backend)
- PostgreSQL + Prisma
- Winston (logging)
- Vitest + Supertest (testing)

## Local Development

### Prerequisites
- Node.js 24+
- A PostgreSQL database (local install or [Supabase](https://supabase.com) free tier)

### Backend setup

1. Install dependencies:
    ```
    cd backend
    npm install
    ```

2. Create a `.env` file in `backend/`:
    ```
    DATABASE_URL=your_postgres_connection_string
    ALLOWED_ORIGINS=http://localhost:5173
    NODE_ENV=development
    API_KEY=a_shared_secret_for_trusted_clients
    ```
    `API_KEY` lets trusted clients bypass rate limiting by sending it as the `X-API-Key` header. Requests without a matching key are still served, just subject to the rate limit.

3. Generate the Prisma migrations, and seed DB data:
    ```
    npx prisma generate
    npx prisma db seed
    ```
    
4. Seed the database by running `backend/db_seed_data/card_data.sql` against your PostgreSQL database using pgAdmin or `psql`.

5. Start the dev server:
    ```
    npm run dev
    ```
    The API will be available at `http://localhost:3000`.

### Frontend setup

1. Install dependencies:
    ```
    cd frontend
    npm install
    ```

2. Create a `.env` file in `frontend/`:
    ```
    VITE_API_URL=http://localhost:3000
    VITE_API_KEY=a_shared_secret_for_trusted_clients
    ```
    `VITE_API_KEY` should match the backend's `API_KEY` so the app's requests bypass rate limiting.

    **Note:** Vite inlines `VITE_`-prefixed variables into the built JS bundle, so this key ships to every browser that loads the app; anyone can read it from the Network tab or the bundle source. It's not a security boundary; it just keeps the app's own traffic from tripping a rate limit meant for anonymous/bot traffic, and does not stop someone who deliberately extracts the key from bypassing the limit too.

3. Start the dev server:
    ```
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Running Tests

### Backend
Backend tests are integration tests that run against a real PostgreSQL database.

Before running tests, make sure you have:
1. A local PostgreSQL database with a `cards` schema
2. The seed data applied from `backend/db_seed_data/card_data.sql`
3. A `.env` file in `backend/` with a valid `DATABASE_URL`

Then run:
```
cd backend
npm test
```

### Frontend
Frontend tests are unit tests that run with jsdom — no database or server required.

```
cd frontend
npm test
```

## Planned Features
- Search by resulting fusion monster
- View loot tables for each duelist in Duel Monsters 1
- Add autocomplete for monster names
- Add support for Duel Monsters 2

## Special Thanks
Special thank you to Spriters Resource user [Phongpon](https://www.spriters-resource.com/profile/phongpon/) for uploading sprite sheets for Duel Monsters on Game Boy. 

Special thank you to [Yugipedia](https://yugipedia.com/wiki/Yu-Gi-Oh!_Duel_Monsters_(video_game)) for documenting information about Duel Monsters on Game Boy. 
