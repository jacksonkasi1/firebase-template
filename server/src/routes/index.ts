// routes/index.ts — mount all route groups
// ─────────────────────────────────────────
// Each module is imported and mounted at its path prefix.

// ─── External ────────────────────────────────
import { Hono } from "hono";

// ─── Route modules ───────────────────────────
import { verifyTokenRoute } from "@/routes/auth/verify-token";
import { getTodosRoute } from "@/routes/todos/get-todos";
import { createTodoRoute } from "@/routes/todos/create-todo";
import { updateTodoRoute } from "@/routes/todos/update-todo";
import { deleteTodoRoute } from "@/routes/todos/delete-todo";

// ─── Middleware ───────────────────────────────
import { authMiddleware } from "@/middleware/auth.middleware";

// ─── Internal ────────────────────────────────
import type { Variables } from "@/types";

// ─────────────────────────────────────────────
const routes = new Hono<{ Variables: Variables }>();

// Public routes
routes.route("/auth", verifyTokenRoute);

// Protected routes (require valid Firebase ID token)
routes.use("/todos/*", authMiddleware);
routes.use("/todos", authMiddleware);

routes.route("/todos", getTodosRoute);
routes.route("/todos", createTodoRoute);
routes.route("/todos", updateTodoRoute);
routes.route("/todos", deleteTodoRoute);

export default routes;
