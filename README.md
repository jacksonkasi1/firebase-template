# Firebase Template

A production-ready full-stack Firebase starter — IBM Carbon Design System · Vite + React · Bun + HonoJS · shadcn/ui

---

## What's Included

| Feature | Status |
|---|---|
| Firebase Authentication (email/password) | ✅ |
| Register, Login, Forgot Password | ✅ |
| Protected routes with auth guards | ✅ |
| User Profile page | ✅ |
| Todo CRUD (Firestore via HonoJS server) | ✅ |
| IBM Carbon Design System (TailwindCSS v4) | ✅ |
| shadcn/ui components (IBM-styled) | ✅ |
| HonoJS REST API (one file per route) | ✅ |
| Firebase Admin SDK (server-side) | ✅ |
| Firestore security rules | ✅ |
| Zod validation (client + server) | ✅ |
| Zustand auth state | ✅ |
| Axios with auth interceptors | ✅ |
| oxlint + Prettier | ✅ |
| TypeScript strict mode | ✅ |
| Import aliases (@/) | ✅ |
| Developer docs | ✅ |
| LLM rules file | ✅ |

---

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/firebase-template.git
cd firebase-template

# Setup credentials (see docs/SETUP.md)
cp web/.env.example web/.env
cp server/.env.example server/.env
# → Fill in Firebase credentials

# Install
cd web && bun install
cd ../server && bun install

# Run
# Terminal 1 — Frontend
cd web && bun run dev

# Terminal 2 — Server
cd server && bun run dev
```

Visit **http://localhost:5173**

---

## Firestore Database Setup

This project uses Cloud Firestore. Follow these simple steps to configure it:

1. **Enable Firestore**: In your Firebase Console, click **Firestore Database** in the left sidebar and click **Create Database**.
2. **Deploy Indexes & Rules**: Run these commands from the `server` directory to deploy the required composite indexes and security rules:
   ```bash
   bunx firebase login
   bunx firebase deploy --only firestore
   ```

---

## Project Structure

```
firebase-template/
├── web/                     ← Vite + React + shadcn/ui + IBM Carbon
├── server/                  ← Bun + HonoJS + Firebase Admin SDK
├── docs/
│   ├── SETUP.md             ← Getting Firebase credentials
│   ├── ARCHITECTURE.md      ← System design
│   ├── API.md               ← All endpoints documented
│   ├── FIREBASE_RULES.md    ← Security rules explained
│   └── DEVELOPER_GUIDE.md   ← Adding routes, components, conventions
└── llm-rules.txt            ← Rules for AI assistants working on this repo
```

---

## Stack

**Frontend**
- Vite + React 19 + TypeScript
- TailwindCSS v4 (IBM Carbon `@theme` tokens)
- shadcn/ui (0px corners, IBM Carbon-styled)
- React Router v7 · Zustand · React Hook Form · Zod · Axios

**Backend**
- Bun runtime
- HonoJS (lightweight, Web-standard)
- Firebase Admin SDK
- Zod validation

**Design System**
- IBM Carbon Design System
- IBM Plex Sans typography
- IBM Blue (#0f62fe) as single accent
- Flat 0px geometry throughout

---

## Documentation

- [Setup Guide](./docs/SETUP.md) — Firebase credentials, running locally
- [Production Deployment Guide](./docs/PRODUCTION.md) — Production checklist, rules, indexes, custom domains
- [Architecture](./docs/ARCHITECTURE.md) — System design and layer overview
- [API Reference](./docs/API.md) — All server endpoints
- [Firebase Rules](./docs/FIREBASE_RULES.md) — Security rules and deployment
- [Developer Guide](./docs/DEVELOPER_GUIDE.md) — Adding features, conventions

---

## License

MIT
