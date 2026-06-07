// DELETE /todos/:id — delete a todo owned by the authenticated user
// ──────────────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { Hono } from "hono";

// ─── Internal ────────────────────────────────
import { adminDb } from "@/lib/firebase-admin";
import { ok, fail } from "@/utils/response";
import type { Variables, Todo } from "@/types";

// ─────────────────────────────────────────────
export const deleteTodoRoute = new Hono<{ Variables: Variables }>().delete(
  "/:id",
  async (c) => {
    const { uid } = c.get("user");
    const id = c.req.param("id");

    try {
      const docRef = adminDb.collection("todos").doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return c.json(fail("Todo not found"), 404);
      }

      const existing = docSnap.data() as Omit<Todo, "id">;

      // Ownership check
      if (existing.userId !== uid) {
        return c.json(fail("Forbidden"), 403);
      }

      await docRef.delete();

      return c.json(ok(null, "Todo deleted successfully"));
    } catch (err) {
      return c.json(
        fail(
          "Failed to delete todo",
          err instanceof Error ? err.message : undefined,
        ),
        500,
      );
    }
  },
);
