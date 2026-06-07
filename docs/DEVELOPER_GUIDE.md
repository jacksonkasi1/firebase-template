# Developer Guide

Everything you need to add features, add routes, and maintain conventions.

---

## Scripts

### Frontend (`web/firebase-template/`)
```bash
bun run dev          # Start Vite dev server (http://localhost:5173)
bun run build        # Production build → dist/
bun run typecheck    # TypeScript type check
bun run lint         # oxlint
bun run lint:fix     # oxlint --fix
bun run format       # prettier --write
```

### Server (`server/`)
```bash
bun run dev          # HonoJS with --hot reload (http://localhost:3000)
bun run start        # Production start
bun run type-check   # TypeScript check
bun run lint         # oxlint src/
bun run lint:fix     # oxlint --fix
bun run format       # prettier --write
```

---

## Import Aliases

Both projects use `@/` → `src/`.

```typescript
// ✅ Correct — use alias
import { useAuth } from "@/hooks/useAuth";
import { ok } from "@/utils/response";

// ❌ Wrong — no relative dot-dot imports
import { useAuth } from "../../hooks/useAuth";
```

---

## Import Organization (3 Groups)

Always organize imports in this order, separated by blank lines:

```typescript
// 1. External / npm packages
import { useState } from "react";
import { Hono } from "hono";

// 2. Internal @/ aliased imports
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

// 3. Relative imports (same directory)
import type { Props } from "./types";
```

---

## Adding a New Server API Route

### Step 1 — Create the route file

One file = one API. Create `src/routes/{module}/{verb}-{resource}.ts`:

```typescript
// src/routes/notes/create-note.ts
import { Hono } from "hono";
import { adminDb } from "@/lib/firebase-admin";
import { ok, fail } from "@/utils/response";
import type { Variables } from "@/types";

export const createNoteRoute = new Hono<{ Variables: Variables }>().post(
  "/",
  async (c) => {
    const { uid } = c.get("user");
    // ... implementation
    return c.json(ok(note, "Note created"), 201);
  }
);
```

### Step 2 — Register in `src/routes/index.ts`

```typescript
import { createNoteRoute } from "@/routes/notes/create-note";

// Add auth middleware for the new path
routes.use("/notes", authMiddleware);

// Mount the route
routes.route("/notes", createNoteRoute);
```

That's it. The route is live.

---

## Adding a New Frontend Page

### Step 1 — Create the component

```typescript
// src/pages/NotesPage.tsx
import { useAuthStore } from "@/store/auth.store";

export function NotesPage() {
  return <div>Notes</div>;
}
```

### Step 2 — Add API module (if needed)

```typescript
// src/api/notes.api.ts
import apiClient from "@/api/index";

export const getNotes = () => apiClient.get("/notes");
```

### Step 3 — Add route in `App.tsx`

```tsx
import { NotesPage } from "@/pages/NotesPage";

// Inside the protected <Route element={<AppLayout />}>:
<Route path="/notes" element={<NotesPage />} />
```

### Step 4 — Add nav link in `AppLayout.tsx`

```typescript
const navLinks = [
  { to: "/dashboard", label: "Tasks"  },
  { to: "/notes",     label: "Notes"  },  // ← add here
  { to: "/profile",   label: "Profile" },
];
```

---

## IBM Carbon Design Rules (Enforced)

| Rule | Value |
|---|---|
| Border radius | `rounded-none` (0px) everywhere |
| Primary color | `text-primary` / `bg-primary` = IBM Blue `#0f62fe` |
| Font | IBM Plex Sans only |
| Body letter-spacing | `tracking-[0.16px]` |
| Display headings | `font-light` (weight 300) |
| Input style | `bg-muted`, bottom border only, IBM Blue focus underline |
| Cards | `border border-border`, no shadow |
| Buttons | Square, IBM Blue primary, charcoal secondary |

**Never:**
- Add `rounded-md`, `rounded-lg` etc.
- Add `shadow-*` classes
- Use colors outside the IBM token set

---

## Adding shadcn/ui Components

```bash
# In web/firebase-template/
bunx --bun shadcn@latest add <component-name>
```

After installing, patch the component to match IBM Carbon:
- Replace `rounded-md` → `rounded-none`
- Replace `rounded-lg` → `rounded-none`
- Update colors to use `--color-primary` tokens

---

## Firestore Data Model

```
/users/{uid}
  displayName: string
  email: string
  createdAt: string (ISO)

/todos/{id}
  title:     string
  completed: boolean
  userId:    string   ← must match authenticated user's uid
  createdAt: string   ← ISO timestamp
  updatedAt: string   ← ISO timestamp
```
