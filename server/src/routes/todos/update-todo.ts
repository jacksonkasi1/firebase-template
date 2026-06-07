// PATCH /todos/:id — update a todo (title and/or completed)
// ──────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { Hono } from "hono";

// ─── Internal ────────────────────────────────
import { adminDb } from "@/lib/firebase-admin";
import { ok, fail } from "@/utils/response";
import { updateTodoSchema } from "@/utils/validators";
import type { Variables, Todo } from "@/types";

// ─────────────────────────────────────────────
export const updateTodoRoute = new Hono<{ Variables: Variables }>().patch(
  "/:id",
  async (c) => {
    const { uid } = c.get("user");
    const id      = c.req.param("id");

    // Parse & validate body
    const body   = await c.req.json().catch(() => null);
    const parsed = updateTodoSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        fail("Validation error", parsed.error.issues[0]?.message),
        400
      );
    }

    try {
      const docRef  = adminDb.collection("todos").doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return c.json(fail("Todo not found"), 404);
      }

      const existing = docSnap.data() as Omit<Todo, "id">;

      // Ownership check
      if (existing.userId !== uid) {
        return c.json(fail("Forbidden"), 403);
      }

      const updates = {
        ...parsed.data,
        updatedAt: new Date().toISOString(),
      };

      await docRef.update(updates);

      const todo: Todo = {
        id,
        ...existing,
        ...updates,
      };

      return c.json(ok(todo, "Todo updated successfully"));
    } catch (err) {
      return c.json(
        fail("Failed to update todo", err instanceof Error ? err.message : undefined),
        500
      );
    }
  }
);
