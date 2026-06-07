// GET /todos — fetch all todos for the authenticated user
// ─────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { Hono } from "hono";

// ─── Internal ────────────────────────────────
import { adminDb } from "@/lib/firebase-admin";
import { ok, fail } from "@/utils/response";
import type { Variables, Todo } from "@/types";

// ─────────────────────────────────────────────
export const getTodosRoute = new Hono<{ Variables: Variables }>().get(
  "/",
  async (c) => {
    const { uid } = c.get("user");

    try {
      const snapshot = await adminDb
        .collection("todos")
        .where("userId", "==", uid)
        .orderBy("createdAt", "desc")
        .get();

      const todos: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Todo, "id">),
      }));

      return c.json(ok(todos, "Todos fetched successfully"));
    } catch (err) {
      return c.json(
        fail("Failed to fetch todos", err instanceof Error ? err.message : undefined),
        500
      );
    }
  }
);
