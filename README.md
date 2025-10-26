# IP Map Navigator
A React + TypeScript web app with an Express.js backend that allows users to log in, view their IP geolocation, search for other IPs, and keep a history of searches with map visualization.
---
## Features

### Authentication
- Login screen with email and password.
- Validates credentials against seeded users in the database.
- Redirects users to Home screen upon successful login.
- Persistent login state with session management.

### Home Screen
- Displays the logged-in user’s IP & geolocation.
- Allows entering a new IP address to fetch its geolocation.
- Shows error messages for invalid IP addresses.
- Displays a searchable history of previous IP lookups.
- Map visualization using Leaflet with pins for IP locations.
- Delete multiple history entries via checkboxes.

### Backend
- Express.js REST API with TypeScript.
- Endpoints:
  - `POST /api/login` → Login endpoint.
  - `GET /api/health` → Health check `{ status: "ok" }`.
  - Optional: Other endpoints for IP history management.
- CORS enabled and JSON body parsing out-of-the-box.

---

## What's Included

- React + Vite frontend
- Express.js backend (REST API)
- Unified TypeScript setup
- Monorepo-style structure
- CORS, JSON body parsing, and routing out of the box
- ESLint + Prettier preconfigured
- Hot reload with Vite and tsx

---

## Getting Started

#### 1. [Create a new repo from this template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Run the scripts in development mode:

The PORTS are:

- 9000 for the client
- 8000 for the server

To run both the frontend and backend concurrently in development mode:

```bash
npm run dev
```

Alternatively, you can run them independently:

- Frontend (React + Vite):
  ```bash
  npm run dev-client
  ```
- Backend (Express + tsx):
  ```bash
  npm run dev-server
  ```

---

### Database Seed

- `{ email: "test@example.com", password: "password123" }` 
---

### Health Check

Express server includes:

- `GET /api/health` → `{ status: "ok" }`

These are defined in [`app.ts`](./src/server/app.ts).

---

### Linting & Formatting

ESLint and Prettier are configured for code quality and formatting consistency.

To run linting:

```bash
npm run lint
```

To run formatting:

```bash
npm run format
```

---

## Production Workflow

Once you're ready to deploy or build the project for production:

#### 1. Build both client and server:

```bash
npm run build
```

#### 2. Start the production server:

After building, start the server with:

```bash
npm start
```
