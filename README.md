# chat-app

A real-time chat application built with React and PocketBase — featuring live messaging, user authentication, and a clean mobile-first UI.

## Overview

This project started as a hands-on exploration of PocketBase as a backend-as-a-service, combining it with a modern React frontend to build a fully functional real-time chat experience. Everything from auth persistence to live message sync is handled end-to-end.

## Features

- **Real-time messaging** — messages appear instantly across all connected clients via PocketBase's SSE-based subscription system
- **Authentication** — email/password registration and login with persistent sessions via localStorage
- **Auto profile creation** — a PocketBase hook automatically creates a user profile record on every new registration
- **Role-aware chat bubbles** — messages from the current user are visually distinguished from others
- **Smart timestamps** — message times display as "just now", "Yesterday", day names, or full dates depending on age
- **Type-safe** — fully typed with auto-generated PocketBase types via `pocketbase-typegen`

## Tech Stack

**Frontend**
- React + TypeScript
- TanStack Router — file-based routing with typed loaders
- TanStack Query — server state management
- Tailwind CSS + shadcn/ui
- Zod + TanStack Form — form validation

**Backend**
- PocketBase — embedded database, auth, realtime, and file storage in a single binary
- PocketBase Hooks (JS) — server-side automation for profile creation

## Project Structure

```
chat-app/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/
│       ├── routes/
│       └── lib/
└── backend/
    ├── pb_hooks/      # Server-side JS hooks
    ├── pb_migrations/ # Schema migrations
    └── pocketbase.exe
```

## Getting Started

### Prerequisites

- Node.js 18+
- PocketBase binary (included in `/backend`)

### Running the backend

```bash
cd backend
./pocketbase serve
```

PocketBase admin dashboard will be available at `http://127.0.0.1:8090/_/`

### Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the frontend directory:

```env
VITE_PB_URL=http://127.0.0.1:8090
```

## How it works

### Auth flow

PocketBase's JS SDK automatically persists the auth token to localStorage. On every app load, the token is verified against the server via `authRefresh` — if it's expired or invalid, the user is logged out.

### Real-time sync

The chat subscribes to PocketBase's realtime events on mount. To avoid missing messages during the gap between the initial fetch and when the subscription becomes active, the subscription is opened first, then the initial messages are fetched. Deduplication by record ID prevents double-rendering.

### Profile hook

A server-side hook (`pb_hooks/create_profile.pb.js`) fires on every user creation and automatically creates a linked profile record — keeping the `users` collection locked down while exposing only public-safe fields (name, avatar) via the `profiles` collection.

## License

MIT
