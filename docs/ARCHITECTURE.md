# Architecture

## Overview

```
firebase-template/
├── web/firebase-template/   ← Vite + React frontend
├── server/                  ← Bun + HonoJS backend
└── docs/                    ← Documentation
```

Two completely independent applications sharing the same Firebase project.

---

## Frontend (`web/firebase-template/`)

**Stack:** Vite + React 19 + TypeScript + TailwindCSS v4 + shadcn/ui

### Why This Stack?
- **Vite**: Fastest HMR for development
- **React 19**: Latest concurrent features
- **TailwindCSS v4**: CSS-first `@theme` tokens — IBM Carbon design tokens map directly
- **shadcn/ui**: Component primitives you own — customized to IBM Carbon 0px corners

### Layer Architecture

```
src/
├── api/          ← Axios client + one file per API module
├── components/
│   ├── ui/       ← shadcn/ui primitives (IBM Carbon-styled)
│   ├── auth/     ← Auth form components
│   ├── todos/    ← Todo components
│   └── layout/   ← App and Auth shell layouts
├── pages/        ← Page-level components (thin wrappers)
├── hooks/        ← useAuth, useTodos — business logic
├── store/        ← Zustand (auth state)
├── types/        ← TypeScript interfaces
└── utils/        ← Zod validators, helpers
```

### Authentication Flow

```
User submits form
  ↓
Firebase Client SDK (signIn / createUser)
  ↓
ID Token returned
  ↓
Stored in Zustand (in-memory) + localStorage (persist)
  ↓
Axios interceptor attaches: Authorization: Bearer <token>
  ↓
Server verifies token with Admin SDK
```

### State Management — Why Zustand?
Single slice of auth state. No boilerplate. Persists token across page refreshes via `zustand/middleware/persist`.

---

## Backend (`server/`)

**Stack:** Bun + HonoJS + Firebase Admin SDK + Zod

### Why This Stack?
- **Bun**: Native TS execution, fast I/O, no build step needed
- **HonoJS**: Tiny (14kb), Web-standard Request/Response, works on any runtime
- **Firebase Admin SDK**: Server-side Firestore access and token verification

### Route Organization

Each API lives in its own file. No multi-API files.

```
src/
├── index.ts           ← Entry point, global middleware
├── routes/
│   ├── index.ts       ← Mount all routes
│   ├── auth/
│   │   └── verify-token.ts    ← POST /auth/verify-token
│   └── todos/
│       ├── get-todos.ts       ← GET /todos
│       ├── create-todo.ts     ← POST /todos
│       ├── update-todo.ts     ← PATCH /todos/:id
│       └── delete-todo.ts     ← DELETE /todos/:id
├── middleware/
│   └── auth.middleware.ts     ← Firebase token verification
├── lib/
│   └── firebase-admin.ts      ← Admin SDK init
├── types/
│   └── index.ts               ← Shared interfaces
└── utils/
    ├── response.ts             ← ok() / fail() helpers
    └── validators.ts           ← Zod schemas
```

### Request Lifecycle

```
Request arrives
  ↓
CORS middleware (hono/cors)
  ↓
Logger middleware (hono/logger)
  ↓
Auth middleware (verify Bearer token)
  ↓
Route handler (validate body → Firestore → respond)
  ↓
Standardized JSON response { success, message, data }
```

---

## Firebase Services Used

| Service | Usage |
|---|---|
| Firebase Authentication | User sign-up, sign-in, password reset |
| Cloud Firestore | Todo CRUD storage |
| Firebase Hosting (optional) | Deploy the frontend |

## Security Model

- All Firestore operations are user-scoped
- Server routes verify ID tokens before any DB access
- Firestore rules provide defense-in-depth (also enforced at DB level)
- Private keys never leave the server `.env` file
