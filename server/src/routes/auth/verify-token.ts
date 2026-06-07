// POST /auth/verify-token — verify a Firebase ID token server-side
// ──────────────────────────────────────────────────────────────────

// ─── External ────────────────────────────────
import { Hono } from "hono";

// ─── Internal ────────────────────────────────
import { adminAuth } from "@/lib/firebase-admin";
import { ok, fail } from "@/utils/response";

// ─────────────────────────────────────────────
export const verifyTokenRoute = new Hono().post("/verify-token", async (c) => {
  const body = await c.req.json().catch(() => null);

  if (!body?.token || typeof body.token !== "string") {
    return c.json(fail("token is required"), 400);
  }

  try {
    const decoded = await adminAuth.verifyIdToken(body.token);
    return c.json(
      ok(
        {
          uid: decoded.uid,
          email: decoded.email,
          displayName: decoded.name,
        },
        "Token verified",
      ),
    );
  } catch {
    return c.json(fail("Invalid or expired token"), 401);
  }
});
