// Auth middleware — verifies Firebase ID token
// ─────────────────────────────────────────────
// Applied to all protected routes.
// Attaches decoded user to Hono context as c.get("user").

// ─── External ────────────────────────────────
import type { MiddlewareHandler } from "hono";

// ─── Internal ────────────────────────────────
import { adminAuth } from "@/lib/firebase-admin";
import { fail } from "@/utils/response";
import type { Variables } from "@/types";

// ─────────────────────────────────────────────
export const authMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return c.json(fail("Unauthorized", "Missing Bearer token"), 401);
  }

  const idToken = authorization.slice(7);

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    c.set("user", {
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
    });
    await next();
  } catch {
    return c.json(fail("Unauthorized", "Invalid or expired token"), 401);
  }
};
