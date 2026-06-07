// POST /todos — create a new todo for the authenticated user
// ───────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { Hono } from "hono";

// ─── Internal ────────────────────────────────
import { adminDb } from "@/lib/firebase-admin";
import { ok, fail } from "@/utils/response";
import { createTodoSchema } from "@/utils/validators";
import type { Variables, Todo } from "@/types";

// ─────────────────────────────────────────────
export const createTodoRoute = new Hono<{ Variables: Variables }>().post(
  "/",
  async (c) => {
    const { uid } = c.get("user");

    // Parse & validate body
    const body = await c.req.json().catch(() => null);
    const parsed = createTodoSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        fail("Validation error", parsed.error.issues[0]?.message),
        400,
      );
    }

    try {
      const now = new Date().toISOString();
      const docData = {
        title: parsed.data.title,
        completed: false,
        userId: uid,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await adminDb.collection("todos").add(docData);
      const todo: Todo = { id: docRef.id, ...docData };

      return c.json(ok(todo, "Todo created successfully"), 201);
    } catch (err) {
      return c.json(
        fail(
          "Failed to create todo",
          err instanceof Error ? err.message : undefined,
        ),
        500,
      );
    }
  },
);
