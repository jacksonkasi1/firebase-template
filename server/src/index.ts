// src/index.ts — HonoJS server entry point
// ─────────────────────────────────────────
// Bun runtime. Run with: bun run src/index.ts

// ─── External ────────────────────────────────
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

// ─── Internal ────────────────────────────────
import routes from "@/routes/index";
import { ok, fail } from "@/utils/response";

// ─────────────────────────────────────────────
const app = new Hono();

// ─── Global Middleware ────────────────────────
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("*", logger());
app.use("*", prettyJSON());

// ─── Health check ─────────────────────────────
app.get("/", (c) =>
  c.json(
    ok({ status: "running", version: "1.0.0" }, "Firebase Template Server"),
  ),
);

app.get("/health", (c) =>
  c.json(ok({ status: "healthy", timestamp: new Date().toISOString() })),
);

// ─── API Routes ───────────────────────────────
app.route("/", routes);

// ─── 404 handler ──────────────────────────────
app.notFound((c) =>
  c.json(fail("Route not found", `${c.req.method} ${c.req.url}`), 404),
);

// ─── Error handler ────────────────────────────
app.onError((err, c) => {
  console.error("[Server Error]", err);
  return c.json(fail("Internal server error", err.message), 500);
});

// ─── Start ────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "8080", 10);

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`🔥 Firebase Template Server running on http://localhost:${PORT}`);
